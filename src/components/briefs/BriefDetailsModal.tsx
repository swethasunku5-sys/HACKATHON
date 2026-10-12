import React from 'react';
import {
  FileText,
  Calendar,
  DollarSign,
  Layers,
  Sparkles,
  Edit3,
  Copy,
  Trash2,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { BrandBrief } from '../../types';
import { Modal } from '../common/Modal';

interface BriefDetailsModalProps {
  brief: BrandBrief | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (brief: BrandBrief) => void;
  onDuplicate: (brief: BrandBrief) => void;
  onDelete: (briefId: string) => void;
  onStartEngagement: (brief: BrandBrief) => void;
}

export const BriefDetailsModal: React.FC<BriefDetailsModalProps> = ({
  brief,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onStartEngagement,
}) => {
  if (!brief) return null;

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={brief.title}
      subtitle={`${brief.brand} · ${brief.contentType}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top Status & Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 text-xs font-semibold uppercase font-mono rounded-md border ${
                statusColors[brief.status]
              }`}
            >
              {brief.status.replace('_', ' ')}
            </span>
            {brief.generatedByAI && (
              <span className="inline-flex items-center gap-1 text-xs text-violet-700 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Synthesized ({brief.aiMode === 'gemini_api' ? 'Gemini 3.8' : 'Demo Engine'})</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(brief);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDuplicate(brief);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartEngagement(brief);
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Engage Talent</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(brief.id);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors ml-1"
              title="Delete Brief"
              aria-label="Delete Brief"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Campaign Objective
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed mt-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                {brief.campaignObjective}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Creative Style & Aesthetic Direction
              </h4>
              <p className="text-xs text-slate-800 font-medium mt-1">
                {brief.creativeStyle}
              </p>
            </div>

            {brief.suggestedWorkflow && (
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Suggested Generative Pipeline
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-1 bg-violet-50/50 p-3 rounded-xl border border-violet-100">
                  {brief.suggestedWorkflow}
                </p>
              </div>
            )}

            {/* Deliverables Checklist */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Deliverables & Deliverable Formats ({brief.deliverables.length})
              </h4>
              <div className="space-y-1.5">
                {brief.deliverables.map((del, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {brief.additionalInstructions && (
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Additional Instructions & Constraints
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {brief.additionalInstructions}
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar Specs */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Target Audience
              </span>
              <p className="text-xs text-slate-700 mt-1">
                {brief.targetAudience}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Platform & Aspect Ratio
              </span>
              <p className="text-xs text-slate-800 font-medium mt-1">
                {brief.platform}
              </p>
              <p className="text-xs font-mono text-slate-600 mt-0.5">
                {brief.aspectRatio} · {brief.durationOrDimensions}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Budget & Timeline
              </span>
              <p className="text-xs font-bold text-slate-900 font-mono mt-1">
                {brief.budgetRange}
              </p>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Target: {brief.deadline}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Recommended AI Tools
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {brief.preferredTools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 text-[11px] bg-white border border-slate-200 text-slate-700 rounded-md font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Licensing Requirements
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {brief.licensingRequirements}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
