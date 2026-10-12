import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Bookmark,
  MapPin,
  Clock,
  Layers,
  FileText,
  DollarSign,
  Globe,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { Creator, PortfolioItem } from '../../types';
import { Modal } from '../common/Modal';
import { PortfolioItemModal } from '../portfolio/PortfolioItemModal';

interface CreatorProfileModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (creatorId: string) => void;
  onStartEngagement: (creator: Creator) => void;
  onContactCreator?: (creator: Creator) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  isOpen,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onStartEngagement,
  onContactCreator,
}) => {
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  if (!creator) return null;

  const handleSelectNextPortfolio = () => {
    if (!selectedPortfolioItem || creator.portfolio.length === 0) return;
    const curIdx = creator.portfolio.findIndex((p) => p.id === selectedPortfolioItem.id);
    const nextIdx = (curIdx + 1) % creator.portfolio.length;
    setSelectedPortfolioItem(creator.portfolio[nextIdx]);
  };

  const handleSelectPrevPortfolio = () => {
    if (!selectedPortfolioItem || creator.portfolio.length === 0) return;
    const curIdx = creator.portfolio.findIndex((p) => p.id === selectedPortfolioItem.id);
    const prevIdx = (curIdx - 1 + creator.portfolio.length) % creator.portfolio.length;
    setSelectedPortfolioItem(creator.portfolio[prevIdx]);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={creator.name}
        subtitle={`${creator.handle} · ${creator.specialization}`}
        maxWidth="3xl"
      >
        <div className="space-y-6">
          {/* Cover Banner + Profile Identity Header */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
            {/* Cover photo or stylized gradient */}
            <div className="relative h-32 sm:h-40 bg-slate-900 overflow-hidden">
              {creator.coverUrl && !coverError ? (
                <img
                  src={creator.coverUrl}
                  alt={`${creator.name}'s workspace`}
                  loading="lazy"
                  onError={() => setCoverError(true)}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className={`w-full h-full ${creator.avatarBg} opacity-50`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 text-[10px] font-mono font-medium bg-black/60 backdrop-blur-md rounded-md text-white border border-white/20">
                  {creator.primaryPlatform || 'Web & Social'}
                </span>
              </div>
            </div>

            {/* Profile Bar */}
            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
                <div className="flex items-end gap-3.5">
                  {/* Avatar with Lazy Loading & Fallback */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white shrink-0 relative flex items-center justify-center">
                    {creator.avatarUrl && !avatarError ? (
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        loading="lazy"
                        onError={() => setAvatarError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${creator.avatarBg} flex items-center justify-center font-bold text-xl`}
                      >
                        {creator.avatarInitials}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{creator.name}</h3>
                      {creator.verifications?.workflowAudited && (
                        <span
                          title="Sample Pipeline Audit Passed (Workflow consistency audited)"
                          className="text-indigo-600"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{creator.handle}</p>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => onToggleShortlist(creator.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 shadow-2xs ${
                      isShortlisted
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-indigo-600' : ''}`} />
                    <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                  </button>

                  {onContactCreator && (
                    <button
                      onClick={() => {
                        onClose();
                        onContactCreator(creator);
                      }}
                      className="px-3.5 py-2 text-xs font-medium rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs whitespace-nowrap"
                    >
                      Contact
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      onStartEngagement(creator);
                    }}
                    className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Start Engagement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sample Profile Disclaimer */}
              <div className="mb-3 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Simulated Talent Profile · Metrics and verifications are sample demonstrations</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{creator.availability}</span>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {creator.tagline}
              </p>

              {/* Metadata Row */}
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                <span className="font-semibold text-slate-800">{creator.specialization}</span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {creator.location}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 font-mono text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {creator.rating.toFixed(2)} ({creator.reviewsCount} reviews)
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-700">
                  {creator.completedBriefsCount} briefs completed
                </span>
              </div>
            </div>
          </div>

          {/* Biography & Commercial Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Biography & Creative Approach
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-1.5">
                  {creator.bio}
                </p>
              </div>

              {/* Audited Generative Pipeline Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Audited Generative Pipeline</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Audit Certified
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-lg border border-slate-200">
                  {creator.workflowDetails.pipelineSummary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">
                      Reproducibility Protocol:
                    </span>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {creator.workflowDetails.reproducibilityNotes}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">
                      Proprietary LoRAs / Nodes:
                    </span>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {creator.workflowDetails.customNodesOrLoras}
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolio Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Generative Deliverables ({creator.portfolio.length})
                  </h4>
                  <span className="text-[11px] text-slate-500">Click to open lightbox</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {creator.portfolio.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPortfolioItem(item)}
                      className="rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all overflow-hidden cursor-pointer group"
                    >
                      <div className="h-28 bg-slate-950 relative overflow-hidden">
                        {item.previewImageUrl ? (
                          <img
                            src={item.previewImageUrl}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${item.thumbnailGradient}`} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-2.5 flex flex-col justify-end text-white">
                          <span className="text-[9px] font-mono text-white/70">
                            {item.category} · {item.aspectRatio}
                          </span>
                          <h5 className="text-xs font-bold truncate leading-tight">
                            {item.title}
                          </h5>
                        </div>
                      </div>

                      <div className="p-3">
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{item.toolsUsed.slice(0, 2).join(' · ')}</span>
                          <span className="text-indigo-600 font-sans font-medium flex items-center gap-0.5">
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar Specs */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Commercial Rate & Availability
                </span>
                <div>
                  <span className="text-xs text-slate-500 block">Typical Project Rate:</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {creator.rateRange}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Experience Level:</span>
                  <span className="text-xs font-medium text-slate-800">
                    {creator.experienceLevel} ({creator.yearsExperience} years in AI/CGI)
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Languages:</span>
                  <span className="text-xs text-slate-800">
                    {creator.languages.join(', ')}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Commercial Rights & Licensing
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {creator.licensingTerms}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  AI Tool Mastery
                </span>
                <div className="flex flex-wrap gap-1">
                  {creator.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 text-xs bg-white border border-slate-200 text-slate-700 rounded-md font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Embedded Lightbox for Creator's Portfolio */}
      <PortfolioItemModal
        item={selectedPortfolioItem}
        allItems={creator.portfolio}
        onClose={() => setSelectedPortfolioItem(null)}
        onSelectNext={handleSelectNextPortfolio}
        onSelectPrev={handleSelectPrevPortfolio}
        onStartEngagementWithCreator={(creatorId) => {
          setSelectedPortfolioItem(null);
          onClose();
          onStartEngagement(creator);
        }}
      />
    </>
  );
};
