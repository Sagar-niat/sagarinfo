import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-project.supabase.co' &&
      !import.meta.env.VITE_SUPABASE_URL.includes('your-supabase-project')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper to get current authenticated user ID & session
const getCurrentUserSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch {
    return null;
  }
};

// Helper to upload files to Supabase Storage bucket
export const uploadFileToSupabase = async (
  fileDataUrlOrBlob: string | Blob,
  fileName: string,
  bucketName: string = 'documents'
): Promise<string | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const session = await getCurrentUserSession();
    if (!session?.user) return null;

    let blob: Blob;
    if (typeof fileDataUrlOrBlob === 'string') {
      if (!fileDataUrlOrBlob.startsWith('data:')) {
        return fileDataUrlOrBlob; // Already a web URL
      }
      const arr = fileDataUrlOrBlob.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      blob = new Blob([u8arr], { type: mime });
    } else {
      blob = fileDataUrlOrBlob;
    }

    const cleanFileName = `${session.user.id}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Try uploading to Supabase Storage bucket 'vault' or 'documents'
    const { data, error } = await supabase.storage
      .from('vault')
      .upload(cleanFileName, blob, { upsert: true, contentType: blob.type });

    if (!error && data?.path) {
      const { data: publicUrlData } = supabase.storage.from('vault').getPublicUrl(cleanFileName);
      return publicUrlData.publicUrl;
    }

    const { data: data2, error: error2 } = await supabase.storage
      .from('documents')
      .upload(cleanFileName, blob, { upsert: true, contentType: blob.type });

    if (!error2 && data2?.path) {
      const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(cleanFileName);
      return publicUrlData.publicUrl;
    }

    console.warn('Supabase storage upload notice:', error?.message || error2?.message);
    return null;
  } catch (err) {
    console.warn('File upload exception:', err);
    return null;
  }
};

// Database Cloud Synchronization Helper Engine
export const supabaseService = {
  // --- PROFILES ---
  fetchProfile: async () => {
    if (!isSupabaseConfigured()) return null;
    const session = await getCurrentUserSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch profile error:', error.message);
      return null;
    }
    return data;
  },

  syncProfile: async (profile: any): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };
    const session = await getCurrentUserSession();
    if (!session?.user) return { success: false, error: 'User not authenticated in Supabase' };

    const payload = {
      id: session.user.id,
      full_name: profile.fullName || profile.full_name || session.user.user_metadata?.full_name || 'Sagar',
      email: session.user.email || profile.email || '',
      tagline: profile.tagline || 'Everything about me. One place.',
      bio: profile.bio || '',
      phone: profile.phone || '',
      location: profile.location || '',
      education: profile.education || '',
      current_status: profile.currentStatus || '',
      career_goal: profile.careerGoal || '',
      interests: profile.interests || [],
      avatar_url: profile.avatarUrl || profile.avatar_url || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      twitter: profile.twitter || '',
      website: profile.website || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert([payload]);
    if (error) {
      console.error('Supabase profile sync error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  // --- DOCUMENTS ---
  fetchDocuments: async () => {
    if (!isSupabaseConfigured()) return null;
    const session = await getCurrentUserSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch documents error:', error.message);
      return null;
    }

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      category: d.category || 'other',
      fileName: d.file_name,
      fileSize: d.file_size,
      fileSizeBytes: Number(d.file_size_bytes || 0),
      fileType: d.file_type,
      fileUrl: d.file_url,
      previewUrl: d.preview_url,
      uploadDate: d.upload_date || new Date().toISOString().split('T')[0],
      description: d.description || '',
      tags: d.tags || [],
      isFavorite: Boolean(d.is_favorite),
      isPrivate: Boolean(d.is_private),
    }));
  },

  syncDocument: async (doc: any): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };
    const session = await getCurrentUserSession();
    if (!session?.user) return { success: false, error: 'User not authenticated in Supabase' };

    // Ensure profile row exists to satisfy Foreign Key constraint
    await supabaseService.syncProfile({});

    let fileUrl = doc.fileUrl || doc.file_url || '';
    if (fileUrl && fileUrl.startsWith('data:')) {
      const uploadedUrl = await uploadFileToSupabase(fileUrl, doc.fileName || 'document.pdf', 'documents');
      if (uploadedUrl) {
        fileUrl = uploadedUrl;
      } else {
        fileUrl = '';
      }
    }

    const payload = {
      id: doc.id,
      user_id: session.user.id,
      title: doc.title,
      category: doc.category || 'other',
      file_name: doc.fileName || doc.file_name || 'file',
      file_size: doc.fileSize || doc.file_size || '1 MB',
      file_size_bytes: Number(doc.fileSizeBytes || doc.file_size_bytes || 1024),
      file_type: doc.fileType || doc.file_type || 'application/pdf',
      file_url: fileUrl,
      preview_url: fileUrl,
      upload_date: doc.uploadDate || new Date().toISOString().split('T')[0],
      description: doc.description || '',
      tags: doc.tags || [],
      is_favorite: Boolean(doc.isFavorite),
      is_private: Boolean(doc.isPrivate),
    };

    const { error } = await supabase.from('documents').upsert([payload]);
    if (error) {
      console.error('Supabase document sync error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  deleteDocument: async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false };
    const session = await getCurrentUserSession();
    if (!session?.user) return { success: false };

    const { error } = await supabase.from('documents').delete().eq('id', id).eq('user_id', session.user.id);
    if (error) {
      console.error('Supabase document delete error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  // --- CERTIFICATES ---
  fetchCertificates: async () => {
    if (!isSupabaseConfigured()) return null;
    const session = await getCurrentUserSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) return null;
    return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      issuingOrganization: c.issuing_organization,
      issueDate: c.issue_date,
      credentialId: c.credential_id,
      credentialUrl: c.credential_url,
      verificationUrl: c.verification_url,
      fileUrl: c.file_url,
      imageUrl: c.image_url,
      skills: c.skills || [],
      description: c.description,
      tags: c.tags || [],
      isFavorite: Boolean(c.is_favorite),
    }));
  },

  syncCertificate: async (cert: any): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false };
    const session = await getCurrentUserSession();
    if (!session?.user) return { success: false };

    await supabaseService.syncProfile({});

    let fileUrl = cert.fileUrl || cert.file_url || '';
    if (fileUrl && fileUrl.startsWith('data:')) {
      const uploadedUrl = await uploadFileToSupabase(fileUrl, cert.title || 'certificate.pdf', 'certificates');
      if (uploadedUrl) {
        fileUrl = uploadedUrl;
      } else {
        fileUrl = '';
      }
    }

    let imageUrl = cert.imageUrl || cert.image_url || '';
    if (imageUrl && imageUrl.startsWith('data:')) {
      const uploadedImgUrl = await uploadFileToSupabase(imageUrl, (cert.title || 'cert') + '_img.png', 'certificates');
      if (uploadedImgUrl) {
        imageUrl = uploadedImgUrl;
      } else {
        imageUrl = '';
      }
    }

    const payload = {
      id: cert.id,
      user_id: session.user.id,
      title: cert.title,
      issuing_organization: cert.issuingOrganization || cert.issuing_organization || '',
      issue_date: cert.issueDate || cert.issue_date || null,
      credential_id: cert.credentialId || cert.credential_id || '',
      credential_url: cert.credentialUrl || cert.credential_url || '',
      verification_url: cert.verificationUrl || cert.verification_url || '',
      file_url: fileUrl,
      image_url: imageUrl,
      skills: cert.skills || [],
      description: cert.description || '',
      tags: cert.tags || [],
      is_favorite: Boolean(cert.isFavorite),
    };

    const { error } = await supabase.from('certificates').upsert([payload]);
    if (error) {
      console.error('Supabase certificate sync error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  deleteCertificate: async (id: string) => {
    if (!isSupabaseConfigured()) return;
    const session = await getCurrentUserSession();
    if (!session?.user) return;
    await supabase.from('certificates').delete().eq('id', id).eq('user_id', session.user.id);
  },

  // --- PROJECTS ---
  fetchProjects: async () => {
    if (!isSupabaseConfigured()) return null;
    const session = await getCurrentUserSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) return null;
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      shortDescription: p.short_description,
      detailedDescription: p.detailed_description,
      category: p.category,
      technologies: p.technologies || [],
      githubUrl: p.github_url,
      liveUrl: p.live_url,
      demoVideoUrl: p.demo_video_url,
      presentationUrl: p.presentation_url,
      documentationUrl: p.documentation_url,
      screenshots: p.screenshots || [],
      status: p.status || 'Completed',
      startDate: p.start_date,
      endDate: p.end_date,
      teamMembers: p.team_members || [],
      hackathonName: p.hackathon_name,
      achievement: p.achievement,
      problemStatement: p.problem_statement,
      solution: p.solution,
      features: p.features || [],
      architectureOverview: p.architecture_overview,
      isFavorite: Boolean(p.is_favorite),
      isPublic: Boolean(p.is_public),
    }));
  },

  syncProject: async (proj: any): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false };
    const session = await getCurrentUserSession();
    if (!session?.user) return { success: false };

    await supabaseService.syncProfile({});

    const payload = {
      id: proj.id,
      user_id: session.user.id,
      name: proj.name,
      short_description: proj.shortDescription || proj.short_description || '',
      detailed_description: proj.detailedDescription || proj.detailed_description || '',
      category: proj.category || 'Web Application',
      technologies: proj.technologies || [],
      github_url: proj.githubUrl || proj.github_url || '',
      live_url: proj.liveUrl || proj.live_url || '',
      demo_video_url: proj.demoVideoUrl || proj.demo_video_url || '',
      presentation_url: proj.presentationUrl || proj.presentation_url || '',
      documentation_url: proj.documentationUrl || proj.documentation_url || '',
      screenshots: proj.screenshots || [],
      status: proj.status || 'Completed',
      start_date: proj.startDate || proj.start_date || null,
      end_date: proj.endDate || proj.end_date || null,
      team_members: proj.teamMembers || proj.team_members || [],
      hackathon_name: proj.hackathonName || proj.hackathon_name || '',
      achievement: proj.achievement || '',
      problem_statement: proj.problemStatement || proj.problem_statement || '',
      solution: proj.solution || '',
      features: proj.features || [],
      architecture_overview: proj.architectureOverview || proj.architecture_overview || '',
      is_favorite: Boolean(proj.isFavorite),
      is_public: Boolean(proj.isPublic),
    };

    const { error } = await supabase.from('projects').upsert([payload]);
    if (error) {
      console.error('Supabase project sync error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  deleteProject: async (id: string) => {
    if (!isSupabaseConfigured()) return;
    const session = await getCurrentUserSession();
    if (!session?.user) return;
    await supabase.from('projects').delete().eq('id', id).eq('user_id', session.user.id);
  },

  // --- EDUCATION ---
  fetchEducation: async () => {
    if (!isSupabaseConfigured()) return null;
    const session = await getCurrentUserSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) return null;
    return data.map((e: any) => ({
      id: e.id,
      degree: e.degree,
      level: e.level,
      institution: e.institution,
      boardOrUniversity: e.board_or_university,
      startYear: e.start_year,
      endYear: e.end_year,
      score: e.score,
      status: e.status || 'Completed',
      fieldOfStudy: e.field_of_study,
      location: e.location,
      highlights: e.highlights || [],
      certificateUrl: e.certificate_url,
    }));
  },

  syncEducation: async (edu: any): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false };
    const session = await getCurrentUserSession();
    if (!session?.user) return { success: false };

    await supabaseService.syncProfile({});

    const payload = {
      id: edu.id,
      user_id: session.user.id,
      degree: edu.degree,
      level: edu.level || 'B.Tech',
      institution: edu.institution,
      board_or_university: edu.boardOrUniversity || edu.board_or_university || '',
      start_year: edu.startYear || edu.start_year || '',
      end_year: edu.endYear || edu.end_year || '',
      score: edu.score || '',
      status: edu.status || 'Completed',
      field_of_study: edu.fieldOfStudy || edu.field_of_study || '',
      location: edu.location || '',
      highlights: edu.highlights || [],
      certificate_url: edu.certificateUrl || edu.certificate_url || '',
    };

    const { error } = await supabase.from('education').upsert([payload]);
    if (error) {
      console.error('Supabase education sync error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  // --- APPLIED HACKATHONS ---
  fetchAppliedHackathons: async () => {
    if (!isSupabaseConfigured()) return null;
    const session = await getCurrentUserSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('applied_hackathons')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) return null;
    return data.map((h: any) => ({
      id: h.id,
      name: h.name,
      organizer: h.organizer,
      applicationDate: h.application_date,
      projectSubmitted: h.project_submitted,
      status: h.status || 'Under Review',
      prizePool: h.prize_pool,
      submissionUrl: h.submission_url,
      proofUrl: h.proof_url,
      notes: h.notes,
      isFavorite: Boolean(h.is_favorite),
    }));
  },

  syncHackathon: async (hack: any): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false };
    const session = await getCurrentUserSession();
    if (!session?.user) return { success: false };

    await supabaseService.syncProfile({});

    const payload = {
      id: hack.id,
      user_id: session.user.id,
      name: hack.name,
      organizer: hack.organizer,
      application_date: hack.applicationDate || hack.application_date || null,
      project_submitted: hack.projectSubmitted || hack.project_submitted || '',
      status: hack.status || 'Under Review',
      prize_pool: hack.prizePool || hack.prize_pool || '',
      submission_url: hack.submissionUrl || hack.submission_url || '',
      proof_url: hack.proofUrl || hack.proof_url || '',
      notes: hack.notes || '',
      is_favorite: Boolean(hack.isFavorite),
    };

    const { error } = await supabase.from('applied_hackathons').upsert([payload]);
    if (error) {
      console.error('Supabase hackathon sync error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  deleteHackathon: async (id: string) => {
    if (!isSupabaseConfigured()) return;
    const session = await getCurrentUserSession();
    if (!session?.user) return;
    await supabase.from('applied_hackathons').delete().eq('id', id).eq('user_id', session.user.id);
  },

  // --- APPLIED SCHOLARSHIPS ---
  fetchAppliedScholarships: async () => {
    if (!isSupabaseConfigured()) return null;
    const session = await getCurrentUserSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('applied_scholarships')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) return null;
    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      provider: s.provider,
      applicationDate: s.application_date,
      amount: s.amount,
      status: s.status || 'Under Review',
      eligibility: s.eligibility,
      submittedDocument: s.submitted_document,
      proofUrl: s.proof_url,
      notes: s.notes,
      isFavorite: Boolean(s.is_favorite),
    }));
  },

  syncScholarship: async (schol: any): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false };
    const session = await getCurrentUserSession();
    if (!session?.user) return { success: false };

    await supabaseService.syncProfile({});

    const payload = {
      id: schol.id,
      user_id: session.user.id,
      name: schol.name,
      provider: schol.provider,
      application_date: schol.applicationDate || schol.application_date || null,
      amount: schol.amount || '',
      status: schol.status || 'Under Review',
      eligibility: schol.eligibility || '',
      submitted_document: schol.submittedDocument || schol.submitted_document || '',
      proof_url: schol.proofUrl || schol.proof_url || '',
      notes: schol.notes || '',
      is_favorite: Boolean(schol.isFavorite),
    };

    const { error } = await supabase.from('applied_scholarships').upsert([payload]);
    if (error) {
      console.error('Supabase scholarship sync error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  deleteScholarship: async (id: string) => {
    if (!isSupabaseConfigured()) return;
    const session = await getCurrentUserSession();
    if (!session?.user) return;
    await supabase.from('applied_scholarships').delete().eq('id', id).eq('user_id', session.user.id);
  },
};
