import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Sparkles,
  Grid,
  Bookmark,
  Briefcase,
  ShieldCheck,
  Settings,
  Award,
  X,
  ExternalLink,
} from 'lucide-react';
import { NavTab } from '../../types';

export type { NavTab };

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  shortlistCount: number;
  engagementCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  theme?: 'slate' | 'navy';
  companyName?: string;
  contactName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  shortlistCount,
  engagementCount,
  isOpenMobile,
  onCloseMobile,
  theme = 'navy',
  companyName = 'Apex Brand Studio',
  contactName = 'Sarah Jenkins',
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number; highlight?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'discover', label: 'Discover Creators', icon: <Users className="w-4 h-4" /> },
    { id: 'briefs', label: 'Brand Briefs', icon: <FileText className="w-4 h-4" /> },
    {
      id: 'ai-builder',
      label: 'AI Brief Builder',
      icon: <Sparkles className="w-4 h-4 text-violet-400" />,
      highlight: true,
    },
    { id: 'portfolio', label: 'AI Portfolio Feed', icon: <Grid className="w-4 h-4" /> },
    {
      id: 'shortlist',
      label: 'Shortlisted Talent',
      icon: <Bookmark className="w-4 h-4" />,
      badge: shortlistCount,
    },
    {
      id: 'engagements',
      label: 'Engagements Pipeline',
      icon: <Briefcase className="w-4 h-4" />,
      badge: engagementCount,
    },
    { id: 'verification', label: 'Verification Signals', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Workspace', icon: <Settings className="w-4 h-4" /> },
    { id: 'evaluation', label: 'Evaluation Rubric (100 pts)', icon: <Award className="w-4 h-4 text-amber-400" /> },
  ];

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 ${
          theme === 'slate' ? 'bg-[#0f172a]' : 'bg-[#0a0f1d]'
        } border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80">
          <button
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-hidden"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-inner">
              CC
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight text-white block">
                CreatorConnect <span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                AI Creator Marketplace
              </span>
            </div>
          </button>

          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-white rounded-md lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenge Flag */}
        <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>ByteXL / Kampus.VC</span>
            <span className="text-indigo-400 font-mono">100 Pts</span>
          </div>
          <p className="mt-1 font-medium text-slate-200 truncate">
            Creator Marketplace Challenge
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-mono tabular-nums rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Account Strip */}
        <div className={`p-3 border-t border-slate-800/80 ${theme === 'slate' ? 'bg-[#0b1120]' : 'bg-[#080c18]'}`}>
          <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-indigo-700 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {contactName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AB'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{contactName}</p>
                <p className="text-[10px] text-slate-400 truncate">{companyName}</p>
              </div>
            </div>
            <button
              onClick={() => handleSelect('settings')}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
