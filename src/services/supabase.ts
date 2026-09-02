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

// Database Cloud Synchronization Helper Engine
export const supabaseService = {
  // Sync Documents
  fetchDocuments: async () => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('documents').select('*');
    if (error) {
      console.warn('Supabase fetch error for documents:', error.message);
      return null;
    }
    return data;
  },

  syncDocument: async (doc: any) => {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from('documents').upsert([doc]);
    if (error) console.error('Supabase document upsert error:', error.message);
  },

  deleteDocument: async (id: string) => {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) console.error('Supabase document delete error:', error.message);
  },

  // Sync Certificates
  fetchCertificates: async () => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('certificates').select('*');
    if (error) return null;
    return data;
  },

  syncCertificate: async (cert: any) => {
    if (!isSupabaseConfigured()) return;
    await supabase.from('certificates').upsert([cert]);
  },

  deleteCertificate: async (id: string) => {
    if (!isSupabaseConfigured()) return;
    await supabase.from('certificates').delete().eq('id', id);
  },

  // Sync Projects
  fetchProjects: async () => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('projects').select('*');
    if (error) return null;
    return data;
  },

  syncProject: async (proj: any) => {
    if (!isSupabaseConfigured()) return;
    await supabase.from('projects').upsert([proj]);
  },

  // Sync Education
  fetchEducation: async () => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('education').select('*');
    if (error) return null;
    return data;
  },

  syncEducation: async (edu: any) => {
    if (!isSupabaseConfigured()) return;
    await supabase.from('education').upsert([edu]);
  },

  // Sync Applied Hackathons
  syncHackathon: async (hack: any) => {
    if (!isSupabaseConfigured()) return;
    await supabase.from('applied_hackathons').upsert([hack]);
  },

  // Sync Applied Scholarships
  syncScholarship: async (schol: any) => {
    if (!isSupabaseConfigured()) return;
    await supabase.from('applied_scholarships').upsert([schol]);
  },
};
