import React, { useState, useEffect, useCallback } from 'react';
import { NavTab, Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { Creator, BrandBrief, Engagement, UserSettings, ActivityEvent, EngagementStage, BriefStatus } from './types';
import { StorageService } from './services/storage';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverCreatorsPage } from './pages/DiscoverCreatorsPage';
import { BrandBriefsPage } from './pages/BrandBriefsPage';
import { AIBriefBuilderPage } from './pages/AIBriefBuilderPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ShortlistPage } from './pages/ShortlistPage';
import { EngagementsPage } from './pages/EngagementsPage';
import { VerificationPage } from './pages/VerificationPage';
import { SettingsPage } from './pages/SettingsPage';
import { EvaluationRubricPage } from './pages/EvaluationRubricPage';

// Modals & Assistant
import { BriefModal } from './components/briefs/BriefModal';
import { BriefDetailsModal } from './components/briefs/BriefDetailsModal';
import { CreatorProfileModal } from './components/creators/CreatorProfileModal';
import { ContactCreatorModal } from './components/creators/ContactCreatorModal';
import { NewEngagementModal } from './components/engagements/NewEngagementModal';
import { LucyAssistant } from './components/assistant/LucyAssistant';

export default function App() {
  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeSpecializationFilter, setActiveSpecializationFilter] = useState<string | undefined>();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Core application data (stored in localStorage)
  const [creators, setCreators] = useState<Creator[]>([]);
  const [briefs, setBriefs] = useState<BrandBrief[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  // Modal states
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [editingBrief, setEditingBrief] = useState<BrandBrief | null>(null);
  const [viewingBrief, setViewingBrief] = useState<BrandBrief | null>(null);
  const [viewingCreator, setViewingCreator] = useState<Creator | null>(null);
  const [contactingCreator, setContactingCreator] = useState<Creator | null>(null);
  const [isNewEngagementOpen, setIsNewEngagementOpen] = useState(false);
  const [engagementPreselectedCreatorId, setEngagementPreselectedCreatorId] = useState<string | undefined>();
  const [engagementPreselectedBriefId, setEngagementPreselectedBriefId] = useState<string | undefined>();

  // Confirm dialogs
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [briefToDeleteId, setBriefToDeleteId] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    StorageService.initialize();
    reloadAllData();
  }, []);

  const reloadAllData = () => {
    setCreators(StorageService.getCreators());
    setBriefs(StorageService.getBriefs());
    setEngagements(StorageService.getEngagements());
    setShortlistIds(StorageService.getShortlist());
    setSettings(StorageService.getSettings());
    setActivities(StorageService.getActivities());
  };

  // Toast helper
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Shortlist management
  const handleToggleShortlist = (creatorId: string) => {
    const isNowShortlisted = StorageService.toggleShortlist(creatorId);
    setShortlistIds(StorageService.getShortlist());
    setActivities(StorageService.getActivities());

    const creator = creators.find((c) => c.id === creatorId);
    const creatorName = creator ? creator.name : 'Creator';

    if (isNowShortlisted) {
      addToast('success', 'Added to Shortlist', `${creatorName} was saved to your talent shortlist.`);
    } else {
      addToast('info', 'Removed from Shortlist', `${creatorName} was removed from your talent shortlist.`);
    }
  };

  // Brief actions
  const handleSaveBrief = (brief: BrandBrief) => {
    StorageService.saveBrief(brief);
    setBriefs(StorageService.getBriefs());
    setActivities(StorageService.getActivities());
    addToast('success', 'Brief Saved', `"${brief.title}" (${brief.status.toUpperCase()}) saved successfully.`);
  };

  const handleDuplicateBrief = (brief: BrandBrief) => {
    const copy = StorageService.duplicateBrief(brief.id);
    if (copy) {
      setBriefs(StorageService.getBriefs());
      setActivities(StorageService.getActivities());
      addToast('success', 'Brief Duplicated', `Created draft copy: "${copy.title}".`);
    }
  };

  const handleDeleteBrief = (id: string) => {
    setBriefToDeleteId(id);
  };

  const confirmDeleteBrief = () => {
    if (briefToDeleteId) {
      StorageService.deleteBrief(briefToDeleteId);
      setBriefs(StorageService.getBriefs());
      addToast('info', 'Brief Deleted', 'The creative brief was deleted.');
      setBriefToDeleteId(null);
    }
  };

  // Engagement actions
  const handleCreateEngagement = (data: {
    briefId: string;
    briefTitle: string;
    brand: string;
    creatorId: string;
    creatorName: string;
    creatorSpecialization: string;
    budget: string;
    deadline: string;
    notes?: string;
  }) => {
    const newEng = StorageService.createEngagement(data);
    setEngagements(StorageService.getEngagements());
    setBriefs(StorageService.getBriefs());
    setActivities(StorageService.getActivities());
    addToast(
      'success',
      'Engagement Started',
      `Launched engagement with ${data.creatorName} for "${data.briefTitle}".`
    );
  };

  const handleUpdateEngagementStage = (id: string, stage: EngagementStage) => {
    StorageService.updateEngagementStage(id, stage);
    setEngagements(StorageService.getEngagements());
    setActivities(StorageService.getActivities());
    addToast(
      'success',
      'Stage Advanced',
      `Engagement advanced to ${stage.replace('_', ' ').toUpperCase()}.`
    );
  };

  const handleToggleDeliverable = (engagementId: string, deliverableId: string) => {
    StorageService.toggleDeliverable(engagementId, deliverableId);
    setEngagements(StorageService.getEngagements());
  };

  const handleUpdateEngagementNotes = (id: string, notes: string) => {
    StorageService.updateEngagementNotes(id, notes);
    setEngagements(StorageService.getEngagements());
    addToast('success', 'Notes Saved', 'Updated engagement work notes.');
  };

  const handleDeleteEngagement = (id: string) => {
    StorageService.deleteEngagement(id);
    setEngagements(StorageService.getEngagements());
    addToast('info', 'Engagement Removed', 'Engagement record was deleted.');
  };

  const handleUpdateBriefStatus = (briefId: string, status: BriefStatus) => {
    StorageService.updateBriefStatus(briefId, status);
    setBriefs(StorageService.getBriefs());
    setActivities(StorageService.getActivities());
    addToast('success', 'Status Updated', `Brief marked as ${status.replace('_', ' ').toUpperCase()}.`);
  };

  const handleClearActivities = () => {
    StorageService.clearActivities();
    setActivities([]);
    addToast('info', 'Activity Log Cleared', 'All activity entries were cleared.');
  };

  // Direct contact / engagement starters
  const handleStartEngagementWithCreator = (creator: Creator, briefId?: string) => {
    setEngagementPreselectedCreatorId(creator.id);
    setEngagementPreselectedBriefId(briefId || (briefs.length > 0 ? briefs[0].id : undefined));
    setIsNewEngagementOpen(true);
  };

  const handleStartEngagementWithBrief = (brief: BrandBrief) => {
    setEngagementPreselectedBriefId(brief.id);
    setEngagementPreselectedCreatorId(creators.length > 0 ? creators[0].id : undefined);
    setIsNewEngagementOpen(true);
  };

  // Settings & Reset
  const handleSaveSettings = (newSettings: UserSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleConfirmResetDemoData = () => {
    StorageService.resetToDefaults();
    reloadAllData();
    addToast(
      'success',
      'Dataset Reset',
      'Restored all original 8+ creators, initial creative briefs, and engagements.'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        shortlistCount={shortlistIds.length}
        engagementCount={engagements.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        theme={settings.theme}
        companyName={settings.companyName}
        contactName={settings.contactName}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopBar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateBrief={() => {
            setEditingBrief(null);
            setIsBriefModalOpen(true);
          }}
          activities={activities}
          onClearActivities={handleClearActivities}
          globalSearchQuery={globalSearchQuery}
          onGlobalSearchChange={setGlobalSearchQuery}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              creators={creators}
              briefs={briefs}
              engagements={engagements}
              shortlistIds={shortlistIds}
              activities={activities}
              onNavigate={setCurrentTab}
              onOpenCreateBrief={() => {
                setEditingBrief(null);
                setIsBriefModalOpen(true);
              }}
              onToggleShortlist={handleToggleShortlist}
              onViewCreatorProfile={(c) => setViewingCreator(c)}
              onStartEngagement={(c) => handleStartEngagementWithCreator(c)}
              onContactCreator={(c) => setContactingCreator(c)}
            />
          )}

          {currentTab === 'discover' && (
            <DiscoverCreatorsPage
              creators={creators}
              shortlistIds={shortlistIds}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
              onToggleShortlist={handleToggleShortlist}
              onViewProfile={(c) => setViewingCreator(c)}
              onStartEngagement={(c) => handleStartEngagementWithCreator(c)}
              onContactCreator={(c) => setContactingCreator(c)}
              externalSpecializationFilter={activeSpecializationFilter}
            />
          )}

          {currentTab === 'briefs' && (
            <BrandBriefsPage
              briefs={briefs}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
              onOpenCreateBrief={() => {
                setEditingBrief(null);
                setIsBriefModalOpen(true);
              }}
              onOpenAIBuilder={() => setCurrentTab('ai-builder')}
              onViewBrief={(b) => setViewingBrief(b)}
              onEditBrief={(b) => {
                setEditingBrief(b);
                setIsBriefModalOpen(true);
              }}
              onDuplicateBrief={handleDuplicateBrief}
              onDeleteBrief={handleDeleteBrief}
              onStartEngagement={(b) => handleStartEngagementWithBrief(b)}
              onUpdateBriefStatus={handleUpdateBriefStatus}
            />
          )}

          {currentTab === 'ai-builder' && (
            <AIBriefBuilderPage
              onSaveBrief={(b) => {
                handleSaveBrief(b);
                setCurrentTab('briefs');
              }}
              onSuccessToast={(msg) => addToast('success', 'AI Generator', msg)}
              onErrorToast={(msg) => addToast('error', 'Error', msg)}
              defaultBrandName={settings.companyName}
              onCustomizeInForm={(b) => {
                setEditingBrief(b);
                setIsBriefModalOpen(true);
              }}
            />
          )}

          {currentTab === 'portfolio' && (
            <PortfolioPage
              creators={creators}
              onStartEngagementWithCreator={(creatorId) => {
                const c = creators.find((cr) => cr.id === creatorId);
                if (c) handleStartEngagementWithCreator(c);
              }}
              onViewCreator={(creatorId) => {
                const c = creators.find((cr) => cr.id === creatorId);
                if (c) setViewingCreator(c);
              }}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
            />
          )}

          {currentTab === 'shortlist' && (
            <ShortlistPage
              creators={creators}
              shortlistIds={shortlistIds}
              onRemoveFromShortlist={(creatorId) => handleToggleShortlist(creatorId)}
              onViewProfile={(c) => setViewingCreator(c)}
              onStartEngagement={(c) => handleStartEngagementWithCreator(c)}
              onContactCreator={(c) => setContactingCreator(c)}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'engagements' && (
            <EngagementsPage
              engagements={engagements}
              onUpdateStage={handleUpdateEngagementStage}
              onToggleDeliverable={handleToggleDeliverable}
              onOpenNewEngagement={() => {
                setEngagementPreselectedCreatorId(undefined);
                setEngagementPreselectedBriefId(undefined);
                setIsNewEngagementOpen(true);
              }}
              onDeleteEngagement={handleDeleteEngagement}
              onUpdateEngagementNotes={handleUpdateEngagementNotes}
            />
          )}

          {currentTab === 'verification' && (
            <VerificationPage
              creators={creators}
              onViewCreatorProfile={(c) => setViewingCreator(c)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onRequestResetDemoData={() => setIsResetConfirmOpen(true)}
              onSuccessToast={(msg) => addToast('success', 'Settings', msg)}
            />
          )}

          {currentTab === 'evaluation' && <EvaluationRubricPage />}
        </main>
      </div>

      {/* Reusable Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Brief Create / Edit Modal */}
      <BriefModal
        isOpen={isBriefModalOpen}
        onClose={() => {
          setIsBriefModalOpen(false);
          setEditingBrief(null);
        }}
        onSave={handleSaveBrief}
        initialBrief={editingBrief}
        defaultBrandName={settings.companyName}
      />

      {/* Brief Details Viewer Modal */}
      <BriefDetailsModal
        brief={viewingBrief}
        isOpen={Boolean(viewingBrief)}
        onClose={() => setViewingBrief(null)}
        onEdit={(b) => {
          setEditingBrief(b);
          setIsBriefModalOpen(true);
        }}
        onDuplicate={handleDuplicateBrief}
        onDelete={handleDeleteBrief}
        onStartEngagement={(b) => handleStartEngagementWithBrief(b)}
      />

      {/* Creator Profile Modal */}
      <CreatorProfileModal
        creator={viewingCreator}
        isOpen={Boolean(viewingCreator)}
        onClose={() => setViewingCreator(null)}
        isShortlisted={viewingCreator ? shortlistIds.includes(viewingCreator.id) : false}
        onToggleShortlist={handleToggleShortlist}
        onStartEngagement={(c) => handleStartEngagementWithCreator(c)}
        onContactCreator={(c) => setContactingCreator(c)}
      />

      {/* Contact Creator Inquiry Modal */}
      <ContactCreatorModal
        creator={contactingCreator}
        isOpen={Boolean(contactingCreator)}
        onClose={() => setContactingCreator(null)}
        briefs={briefs}
        onStartEngagement={(c, briefId) => handleStartEngagementWithCreator(c, briefId)}
        onSuccessToast={(msg) => addToast('success', 'Inquiry Logged', msg)}
      />

      {/* New Engagement Modal */}
      <NewEngagementModal
        isOpen={isNewEngagementOpen}
        onClose={() => setIsNewEngagementOpen(false)}
        creators={creators}
        briefs={briefs}
        preselectedCreatorId={engagementPreselectedCreatorId}
        preselectedBriefId={engagementPreselectedBriefId}
        onCreateEngagement={handleCreateEngagement}
      />

      {/* Confirm Reset Demo Data Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmResetDemoData}
        title="Reset Demo Dataset?"
        message="Are you sure you want to reset all marketplace data? This will restore the default 8+ creators, initial sample briefs, and active engagements, overwriting any local modifications."
        confirmLabel="Yes, Reset Everything"
        cancelLabel="Keep Current Data"
        danger={true}
      />

      {/* Confirm Delete Brief Dialog */}
      <ConfirmDialog
        isOpen={Boolean(briefToDeleteId)}
        onClose={() => setBriefToDeleteId(null)}
        onConfirm={confirmDeleteBrief}
        title="Delete Creative Brief?"
        message="Are you sure you want to delete this brief? Any ongoing engagements linked to this brief will remain active."
        confirmLabel="Delete Brief"
        danger={true}
      />

      {/* Floating Lucy Assistant */}
      <LucyAssistant
        currentTab={currentTab}
        creators={creators}
        shortlistIds={shortlistIds}
        onNavigate={(tab) => {
          setCurrentTab(tab);
        }}
        onOpenCreateBrief={() => {
          setEditingBrief(null);
          setIsBriefModalOpen(true);
        }}
        onOpenAIBriefBuilder={() => {
          setCurrentTab('ai-builder');
        }}
        onOpenNewEngagement={(creatorId) => {
          setEngagementPreselectedCreatorId(creatorId);
          setEngagementPreselectedBriefId(undefined);
          setIsNewEngagementOpen(true);
        }}
        onViewCreator={(c) => setViewingCreator(c)}
        onToggleShortlist={handleToggleShortlist}
        onContactCreator={(c) => setContactingCreator(c)}
        onFilterCreatorsSpecialization={(spec) => {
          setActiveSpecializationFilter(spec);
          setCurrentTab('discover');
        }}
      />
    </div>
  );
}
