# SAGARINFO 🚀

> **"Everything about me. One place."**  
> *Personal Digital Hub + Document Vault + Project Hub + Certificate Manager + Developer Portfolio*

---

## 1. Project Overview

**SAGARINFO** is a private, production-grade personal information management operating system built specifically for **Sagar**. It serves as a unified digital vault to store, categorize, search, preview, and manage personal identity documents, academic transcripts, hackathon achievements, cloud certificates, full-stack projects, presentations, skills, and resume versions.

Key Highlights:
- **Dual Private Vault & Public Portfolio**: Private vault protects sensitive identity/financial files while exposing a sleek developer portfolio (`/public`).
- **Command Palette & Deep Search (`Ctrl + K`)**: Universal search engine indexed across documents, projects, skills, certificates, links, presentations, and education.
- **In-Browser File Previewer**: Instant inline preview modal for PDFs, images, and text documents.
- **Drag & Drop Upload**: Smooth document intake with automatic category detection, size formatting, and security tagging.
- **SaaS Dark & Light Theme**: Custom design tokens with obsidian glassmorphism, micro-interactions, and responsive mobile navigation.

---

## 2. Tech Stack

- **Frontend Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism CSS variables
- **Icons**: Lucide React (`lucide-react`)
- **Backend / Database**: Supabase (PostgreSQL) with RLS + LocalStorage fallback engine
- **Authentication**: Passcode protection / Supabase Auth
- **Storage**: Supabase Storage / Blob Storage URL previewer

---

## 3. Directory Structure

```
sagarinfo/
├── src/
│   ├── components/
│   │   ├── layout/ (Sidebar.tsx, Navbar.tsx)
│   │   ├── common/ (CommandPalette.tsx, Toast.tsx, FilePreviewModal.tsx, FileUploadModal.tsx, EditProfileModal.tsx)
│   ├── context/
│   │   ├── ThemeContext.tsx (Dark/Light mode)
│   │   ├── AuthContext.tsx (Vault security session)
│   │   └── DataContext.tsx (Central CRUD state & modals)
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── CertificatesPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── PresentationsPage.tsx
│   │   ├── AchievementsPage.tsx
│   │   ├── EducationPage.tsx
│   │   ├── SkillsPage.tsx
│   │   ├── ResumePage.tsx
│   │   ├── LinksPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── PublicPortfolioPage.tsx
│   │   └── LoginPage.tsx
│   ├── services/
│   │   ├── mockData.ts (Initial Sagar demo records)
│   │   ├── storageService.ts (LocalStorage & Export JSON)
│   │   └── supabase.ts (Supabase JS Client)
│   ├── types/
│   │   └── sagarinfo.ts (TypeScript interfaces)
│   ├── index.css (Tailwind CSS v4 & glassmorphism design system)
│   ├── App.tsx
│   └── main.tsx
├── supabase_schema.sql
├── package.json
└── README.md
```

---

## 4. Installation & Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps
1. **Clone or Navigate to project root**:
   ```bash
   cd c:\Users\SAGAR\sagarinfo
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
4. **Open Browser**:
   Navigate to `http://localhost:5173`.

---

## 5. Environment Variables Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*Note: If `.env` is omitted, SAGARINFO automatically uses the instant LocalStorage engine populated with demo records for Sagar.*

---

## 6. Supabase Database Setup & Schema

1. Log in to [Supabase Console](https://supabase.com/dashboard).
2. Create a new project named **sagarinfo-db**.
3. Go to **SQL Editor** and paste the content from [`supabase_schema.sql`](file:///c:/Users/SAGAR/sagarinfo/supabase_schema.sql).
4. Click **Run** to execute the script and instantiate all 10 tables with Row Level Security (RLS).

---

## 7. Storage Bucket Setup

1. In Supabase Console, navigate to **Storage** -> **Create New Bucket**.
2. Name the bucket `sagarinfo-documents`.
3. Set bucket to **Private** (or Public for certificates image bucket).
4. Configure RLS policy allowing authenticated users full upload/read permissions.

---

## 8. Authentication Setup

1. In Supabase Console, go to **Authentication** -> **Providers**.
2. Enable **Email / Password** provider.
3. Add Sagar's email ID `sagar@example.com` under **Users**.

---

## 9. Building for Production

To compile production-optimized JavaScript and CSS bundles:

```bash
npm run build
```

The output files will be generated in the `dist/` directory.

---

## 10. Deployment Instructions

### Vercel / Netlify Deployment
1. Connect your GitHub repository `sagar-dev/sagarinfo` to Vercel.
2. Set build command to `npm run build` and output directory to `dist`.
3. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy!
