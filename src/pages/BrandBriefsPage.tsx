import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Sparkles,
  Search,
  Calendar,
  DollarSign,
  Copy,
  Edit3,
  Trash2,
  ExternalLink,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { BrandBrief, BriefStatus } from '../types';
import { NavTab } from '../components/layout/Sidebar';

interface BrandBriefsPageProps {
  briefs: BrandBrief[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateBrief: () => void;
  onOpenAIBuilder: () => void;
  onViewBrief: (brief: BrandBrief) => void;
  onEditBrief: (brief: BrandBrief) => void;
  onDuplicateBrief: (brief: BrandBrief) => void;
  onDeleteBrief: (briefId: string) => void;
  onStartEngagement: (brief: BrandBrief) => void;
  onUpdateBriefStatus?: (briefId: string, status: BriefStatus) => void;
}

export const BrandBriefsPage: React.FC<BrandBriefsPageProps> = ({
  briefs,
  searchQuery,
  onSearchChange,
  onOpenCreateBrief,
  onOpenAIBuilder,
  onViewBrief,
  onEditBrief,
  onDuplicateBrief,
  onDeleteBrief,
  onStartEngagement,
  onUpdateBriefStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | BriefStatus>('all');

  const filteredBriefs = useMemo(() => {
    return briefs.filter((brief) => {
      if (statusFilter !== 'all' && brief.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = brief.title.toLowerCase().includes(q);
        const matchesBrand = brief.brand.toLowerCase().includes(q);
        const matchesStyle = brief.creativeStyle.toLowerCase().includes(q);
        const matchesObjective = brief.campaignObjective.toLowerCase().includes(q);
        const matchesTools = brief.preferredTools.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBrand && !matchesStyle && !matchesObjective && !matchesTools) {
          return false;
        }
      }
      return true;
    });
  }, [briefs, statusFilter, searchQuery]);

  const countByStatus = {
    all: briefs.length,
    draft: briefs.filter((b) => b.status === 'draft').length,
    open: briefs.filter((b) => b.status === 'open').length,
    in_progress: briefs.filter((b) => b.status === 'in_progress').length,
    completed: briefs.filter((b) => b.status === 'completed').length,
  };

  const statusBadgeStyle = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Brand Creative Briefs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage campaign requirements, deliverables, generative constraints, and open briefs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIBuilder}
            className="px-3.5 py-2 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>AI Brief Builder</span>
          </button>

          <button
            onClick={onOpenCreateBrief}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Brief</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        {/* Status Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {(['all', 'draft', 'open', 'in_progress', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap capitalize ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.replace('_', ' ')} ({countByStatus[st]})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search briefs..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white"
          />
        </div>
      </div>

      {/* Briefs Cards Grid */}
      {filteredBriefs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            No creative briefs found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search query or selecting a different status filter.'
              : 'Start by creating your first campaign brief or synthesizing one from a rough idea using the AI Builder.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenCreateBrief}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Create Brief
            </button>
            <button
              onClick={onOpenAIBuilder}
              className="px-4 py-2 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg"
            >
              Use AI Brief Builder
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBriefs.map((brief) => (
            <div
              key={brief.id}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                {/* Header with status badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                      {brief.brand}
                    </span>
                    <h3
                      onClick={() => onViewBrief(brief)}
                      className="text-sm font-bold text-slate-900 mt-0.5 truncate hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {brief.title}
                    </h3>
                  </div>

                  {onUpdateBriefStatus ? (
                    <select
                      value={brief.status}
                      onChange={(e) => onUpdateBriefStatus(brief.id, e.target.value as BriefStatus)}
                      className={`px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded border shrink-0 cursor-pointer focus:outline-hidden ${
                        statusBadgeStyle[brief.status]
                      }`}
                      title="Update Brief Status"
                      aria-label="Update Brief Status"
                    >
                      <option value="draft">DRAFT</option>
                      <option value="open">OPEN</option>
                      <option value="in_progress">IN PROGRESS</option>
                      <option value="completed">COMPLETED</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded border shrink-0 ${
                        statusBadgeStyle[brief.status]
                      }`}
                    >
                      {brief.status.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Campaign Objective excerpt */}
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {brief.campaignObjective}
                </p>

                {/* Unboxed Metadata Row */}
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span className="font-medium text-slate-800">{brief.contentType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{brief.aspectRatio.split(' ')[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-700 font-semibold">{brief.budgetRange}</span>
                </div>

                {/* Deliverables snippet */}
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Deliverables ({brief.deliverables.length})
                  </span>
                  <p className="text-xs text-slate-700 truncate mt-0.5">
                    {brief.deliverables[0]}
                  </p>
                </div>

                {/* AI Stack */}
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 font-mono truncate">
                  <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{brief.preferredTools.join(' · ')}</span>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <button
                    onClick={() => onDuplicateBrief(brief)}
                    className="p-1.5 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                    title="Duplicate brief"
                    aria-label="Duplicate brief"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEditBrief(brief)}
                    className="p-1.5 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                    title="Edit brief"
                    aria-label="Edit brief"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteBrief(brief.id)}
                    className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Delete brief"
                    aria-label="Delete brief"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewBrief(brief)}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onStartEngagement(brief)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs whitespace-nowrap flex items-center gap-1"
                  >
                    <span>Engage</span>
                    <Briefcase className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
