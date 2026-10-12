import React from 'react';
import {
  Users,
  FileText,
  Bookmark,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Star,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Creator, BrandBrief, Engagement, ActivityEvent } from '../types';
import { NavTab } from '../components/layout/Sidebar';
import { CreatorCard } from '../components/creators/CreatorCard';

interface DashboardPageProps {
  creators: Creator[];
  briefs: BrandBrief[];
  engagements: Engagement[];
  shortlistIds: string[];
  activities: ActivityEvent[];
  onNavigate: (tab: NavTab) => void;
  onOpenCreateBrief: () => void;
  onToggleShortlist: (creatorId: string) => void;
  onViewCreatorProfile: (creator: Creator) => void;
  onStartEngagement: (creator: Creator) => void;
  onContactCreator?: (creator: Creator) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  creators,
  briefs,
  engagements,
  shortlistIds,
  activities,
  onNavigate,
  onOpenCreateBrief,
  onToggleShortlist,
  onViewCreatorProfile,
  onStartEngagement,
  onContactCreator,
}) => {
  const activeBriefsCount = briefs.filter((b) => b.status === 'open' || b.status === 'in_progress').length;
  const inProductionEngagementsCount = engagements.filter((e) => e.stage === 'in_production').length;

  const statCards = [
    {
      label: 'Verified AI Creators',
      value: creators.length,
      detail: '8+ specialized pipelines',
      icon: <Users className="w-4 h-4 text-indigo-600" />,
      tab: 'discover' as NavTab,
    },
    {
      label: 'Active Brand Briefs',
      value: activeBriefsCount,
      detail: `${briefs.length} total briefs logged`,
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      tab: 'briefs' as NavTab,
    },
    {
      label: 'Shortlisted Talent',
      value: shortlistIds.length,
      detail: 'Ready for engagement',
      icon: <Bookmark className="w-4 h-4 text-violet-600" />,
      tab: 'shortlist' as NavTab,
    },
    {
      label: 'Ongoing Engagements',
      value: engagements.length,
      detail: `${inProductionEngagementsCount} currently in production`,
      icon: <Briefcase className="w-4 h-4 text-blue-600" />,
      tab: 'engagements' as NavTab,
    },
  ];

  const featuredCreators = creators.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-linear-to-r from-slate-900 via-[#111827] to-[#1e1b4b] text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 mb-2">
            <span>ByteXL / Kampus.VC Marketplace Prototype</span>
            <span aria-hidden="true">·</span>
            <span>AI Native Hub</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Connect with World-Class AI Content Creators
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Discover verified generative directors, inspect reproducible prompt pipelines, publish structured creative briefs with AI assistance, and manage commercial deliveries end-to-end.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigate('ai-builder')}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Synthesize Brief with AI</span>
            </button>

            <button
              onClick={() => onNavigate('discover')}
              className="px-4 py-2 text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 transition-colors flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Browse AI Roster</span>
            </button>

            <button
              onClick={onOpenCreateBrief}
              className="px-4 py-2 text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 transition-colors flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manual Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid (Using tabular-nums per design guidelines) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            onClick={() => onNavigate(card.tab)}
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {card.label}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                {card.icon}
              </div>
            </div>

            <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 font-mono tabular-nums tracking-tight">
              {card.value}
            </p>

            <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>{card.detail}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        ))}
      </div>

      {/* Featured AI Creators Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Featured Generative Creators
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited model pipelines with demonstrated commercial brand delivery
            </p>
          </div>

          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All ({creators.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              isShortlisted={shortlistIds.includes(creator.id)}
              onToggleShortlist={onToggleShortlist}
              onViewProfile={onViewCreatorProfile}
              onStartEngagement={onStartEngagement}
              onContactCreator={onContactCreator}
            />
          ))}
        </div>
      </div>

      {/* Split Section: Active Engagements & Workspace Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Engagements Snapshot */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Ongoing Engagements ({engagements.length})</span>
            </h3>
            <button
              onClick={() => onNavigate('engagements')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Full Pipeline &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {engagements.slice(0, 3).map((eng) => (
              <div
                key={eng.id}
                onClick={() => onNavigate('engagements')}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">
                      {eng.briefTitle}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assigned to {eng.creatorName} · {eng.brand}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                    {eng.stage.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/60 font-mono">
                  <span>Budget: {eng.budget}</span>
                  <span>Target: {eng.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Workspace Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Recent Marketplace Activity</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Real-time log</span>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                onClick={() => {
                  if (act.linkTab) onNavigate(act.linkTab as NavTab);
                }}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {act.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    {act.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
