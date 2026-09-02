import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/common/CommandPalette';
import { Toast } from './components/common/Toast';
import { FilePreviewModal } from './components/common/FilePreviewModal';
import { FileUploadModal } from './components/common/FileUploadModal';
import { EditProfileModal } from './components/common/EditProfileModal';

import { Dashboard } from './pages/Dashboard';
import { DocumentsPage } from './pages/DocumentsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AppliedHackathonsPage } from './pages/AppliedHackathonsPage';
import { AppliedScholarshipsPage } from './pages/AppliedScholarshipsPage';
import { PresentationsPage } from './pages/PresentationsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { EducationPage } from './pages/EducationPage';
import { SkillsPage } from './pages/SkillsPage';
import { ResumePage } from './pages/ResumePage';
import { LinksPage } from './pages/LinksPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { LoginPage } from './pages/LoginPage';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isPublicView } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  if (!isAuthenticated && !isPublicView) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (isPublicView) {
      return <PublicPortfolioPage />;
    }

    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard
            setCurrentTab={setCurrentTab}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenEditProfileModal={() => setIsEditProfileModalOpen(true)}
          />
        );
      case 'profile':
        return <ProfilePage onOpenEditModal={() => setIsEditProfileModalOpen(true)} />;
      case 'documents':
      case 'favorites':
        return <DocumentsPage onOpenUploadModal={() => setIsUploadModalOpen(true)} />;
      case 'certificates':
        return <CertificatesPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'applied-hackathons':
        return <AppliedHackathonsPage />;
      case 'applied-scholarships':
        return <AppliedScholarshipsPage />;
      case 'presentations':
        return <PresentationsPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'education':
        return <EducationPage />;
      case 'skills':
        return <SkillsPage />;
      case 'resume':
        return <ResumePage />;
      case 'links':
        return <LinksPage />;
      case 'activity':
      case 'settings':
        return <SettingsPage />;
      case 'public':
        return <PublicPortfolioPage />;
      default:
        return (
          <Dashboard
            setCurrentTab={setCurrentTab}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenEditProfileModal={() => setIsEditProfileModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <CommandPalette currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <FilePreviewModal />
      <FileUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainLayout />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
