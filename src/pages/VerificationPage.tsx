import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Layers,
  FileCheck,
  Award,
  AlertTriangle,
  ExternalLink,
  Users,
} from 'lucide-react';
import { Creator } from '../types';

interface VerificationPageProps {
  creators: Creator[];
  onViewCreatorProfile: (creator: Creator) => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  creators,
  onViewCreatorProfile,
}) => {
  const verifiedSignals = [
    {
      title: 'Generative Model Pipeline Verified',
      category: 'Model & Tool Mastery',
      description:
        'Confirms the creator has demonstrated advanced technical proficiency in specific foundation models (e.g. Runway Gen-3 Alpha, Midjourney v6.1, Flux.1 Pro, Kling AI). Includes prompt consistency matrices and camera conditioning mastery.',
      badgeLabel: 'Pipeline Verified',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'ComfyUI / Node Workflow Audited',
      category: 'Workflow Reproducibility',
      description:
        'Validates that the creator produces reproducible JSON workflow graphs with locked seeds, custom ControlNet conditioning (depth/lineart), and custom LoRA weight schedules. Eliminates random non-reproducible outputs.',
      badgeLabel: 'Workflow Audited',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Commercial Delivery Track Record',
      category: 'Milestone Fulfillment',
      description:
        'Certifies that the creator has completed commercial deliverables for brand clients on schedule, meeting resolution standards (4K ProRes / uncompressed lossless stills) and color grading guidelines.',
      badgeLabel: 'Delivery Cleared',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Asset Provenance & Originality Check',
      category: 'Commercial Copyright Safety',
      description:
        'Confirms that prompt recipes and conditioning seeds do not contain direct trademark infringements or unauthorized celebrity likenesses. All audio stems and visual plates are cleared for commercial usage.',
      badgeLabel: 'Provenance Safe',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Quality Assurance & Workflow Audit Architecture</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          CreatorConnect AI Verification Framework
        </h1>
        <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
          In generative content production, traditional resumes are obsolete. We audit creators on pipeline reproducibility, seed consistency, custom LoRA weight control, and commercial broadcast quality standards.
        </p>

        {/* Explicit Demo Disclaimer as required by prompt */}
        <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300 font-semibold">Demo Environment Disclosure:</strong> These badges represent structured workflow validations, prompt reproducibility tests, and simulation milestones within our prototype marketplace. They do not claim government-issued legal identification or certified third-party corporate background checks.
          </p>
        </div>
      </div>

      {/* 4 Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {verifiedSignals.map((sig, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  {sig.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {sig.title}
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 text-[11px] font-mono font-semibold uppercase rounded-md border shrink-0 ${sig.badgeColor}`}
              >
                {sig.badgeLabel}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {sig.description}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Standardized verification protocol</span>
            </div>
          </div>
        ))}
      </div>

      {/* Verified Creator Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Audited Creator Registry ({creators.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent inspection of verification signals for all active platform creators
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">Creator</th>
                <th className="py-2.5 px-3">Specialization</th>
                <th className="py-2.5 px-3">Pipeline Verified</th>
                <th className="py-2.5 px-3">Workflow Audited</th>
                <th className="py-2.5 px-3">Delivery Cleared</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {creators.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg ${c.avatarBg} flex items-center justify-center font-bold text-xs`}
                      >
                        {c.avatarInitials}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block truncate">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {c.handle}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {c.specialization}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold font-mono text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passed</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold font-mono text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Audited</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-slate-900 tabular-nums font-semibold">
                      {c.completedBriefsCount} Briefs
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onViewCreatorProfile(c)}
                      className="px-2.5 py-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
