import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Sparkles,
  Plus,
  Bell,
  Search,
  CheckCircle,
  Database,
  ExternalLink,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { ActivityEvent } from '../../types';

interface TopBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMobileSidebar: () => void;
  onOpenCreateBrief: () => void;
  activities: ActivityEvent[];
  onClearActivities?: () => void;
  globalSearchQuery: string;
  onGlobalSearchChange: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  onOpenMobileSidebar,
  onOpenCreateBrief,
  activities,
  onClearActivities,
  globalSearchQuery,
  onGlobalSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const getBreadcrumb = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Overview & Activity';
      case 'discover':
        return 'Discover Creators & AI Roster';
      case 'briefs':
        return 'Brand Briefs Management';
      case 'ai-builder':
        return 'AI Brief Builder & Prompt Synthesizer';
      case 'portfolio':
        return 'AI Portfolio Gallery & Asset Showcase';
      case 'shortlist':
        return 'Campaign Talent Shortlist';
      case 'engagements':
        return 'Engagements Pipeline & Milestones';
      case 'verification':
        return 'Demo Verification Signals & Badges';
      case 'settings':
        return 'Workspace Profile & Demo Data Controls';
      case 'evaluation':
        return 'Hackathon Evaluation Criteria (100 Pts)';
      default:
        return 'Marketplace';
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearchQuery.trim()) {
      if (currentTab !== 'discover' && currentTab !== 'briefs' && currentTab !== 'portfolio') {
        onTabChange('discover');
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200">
      {/* Left zone: Mobile toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden focus:outline-hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="font-semibold text-slate-900 whitespace-nowrap">
            CreatorConnect AI
          </span>
          <span className="text-slate-400" aria-hidden="true">
            /
          </span>
          <span className="text-slate-600 font-medium truncate max-w-[160px] sm:max-w-xs md:max-w-md">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Right zone: Actions + Notifications + Search */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Universal Search Input */}
        <div className="relative hidden md:block w-44 lg:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search talent & work..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* AI Brief Builder Quick Action */}
        <button
          onClick={() => onTabChange('ai-builder')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>AI Brief Builder</span>
        </button>

        {/* Create Brief Action */}
        <button
          onClick={onOpenCreateBrief}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Brief</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden"
            aria-label="Activity notifications"
          >
            <Bell className="w-4 h-4" />
            {activities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-900">
                  Recent Activity ({activities.length})
                </span>
                {activities.length > 0 && onClearActivities && (
                  <button
                    onClick={() => {
                      onClearActivities();
                    }}
                    className="text-[11px] text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    Clear Log
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {activities.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No recent activity logged yet.
                  </div>
                ) : (
                  activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                      onClick={() => {
                        if (act.linkTab) onTabChange(act.linkTab as NavTab);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800">
                          {act.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                          {act.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {act.detail}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
