import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Check,
  Bookmark,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Globe,
  Info,
} from 'lucide-react';
import { Creator } from '../../types';

interface CreatorCardProps {
  creator: Creator;
  isShortlisted: boolean;
  onToggleShortlist: (creatorId: string) => void;
  onViewProfile: (creator: Creator) => void;
  onStartEngagement: (creator: Creator) => void;
  onContactCreator?: (creator: Creator) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  isShortlisted,
  onToggleShortlist,
  onViewProfile,
  onStartEngagement,
  onContactCreator,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top identity row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar with Lazy Loading & Fallback */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-xs border border-slate-200 bg-slate-100 flex items-center justify-center">
              {creator.avatarUrl && !imageError ? (
                <>
                  {!imageLoaded && (
                    <div
                      className={`absolute inset-0 ${creator.avatarBg} flex items-center justify-center font-bold text-xs`}
                    >
                      {creator.avatarInitials}
                    </div>
                  )}
                  <img
                    src={creator.avatarUrl}
                    alt={`${creator.name}'s profile`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    className={`w-full h-full object-cover transition-opacity duration-200 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </>
              ) : (
                <div
                  className={`w-full h-full ${creator.avatarBg} flex items-center justify-center font-bold text-sm shadow-inner`}
                >
                  {creator.avatarInitials}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4
                  onClick={() => onViewProfile(creator)}
                  className="text-sm font-semibold text-slate-900 truncate hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  {creator.name}
                </h4>
                {creator.verifications?.workflowAudited && (
                  <span
                    title="Sample Pipeline Audit Passed (Workflow consistency audited)"
                    className="text-indigo-600 cursor-help"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="truncate">{creator.handle}</span>
                {creator.primaryPlatform && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500 truncate">{creator.primaryPlatform}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleShortlist(creator.id)}
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              isShortlisted
                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
            aria-label={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
          >
            <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-indigo-600' : ''}`} />
          </button>
        </div>

        {/* Clear Sample Profile Disclaimer Pill */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80">
            <Info className="w-2.5 h-2.5 text-slate-400" />
            <span>Sample Talent Profile</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Demo Metrics</span>
        </div>

        {/* Tagline & Specialization */}
        <p className="text-xs font-medium text-slate-700 mt-2.5 line-clamp-2 leading-relaxed">
          {creator.tagline}
        </p>

        {/* Zero-Pill Unboxed Metadata Row */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-2.5">
          <span className="font-semibold text-slate-800">{creator.specialization}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {creator.location}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1 font-mono tabular-nums text-slate-700">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {creator.rating.toFixed(2)} ({creator.reviewsCount})
          </span>
        </div>

        {/* AI Tools List */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1 font-medium">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>AI Tool Stack</span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-1 font-mono">
            {creator.tools.slice(0, 4).join(' · ')}
            {creator.tools.length > 4 && ` · +${creator.tools.length - 4}`}
          </p>
        </div>

        {/* Mini Portfolio Preview Strip with Preview Images */}
        {creator.portfolio.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span className="font-medium">Portfolio Deliverables</span>
              <span className="font-mono text-slate-400">{creator.portfolio.length} pieces</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {creator.portfolio.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onViewProfile(creator)}
                  className="h-16 rounded-lg bg-slate-900 overflow-hidden relative cursor-pointer group/item border border-slate-200/80 shadow-2xs"
                >
                  {item.previewImageUrl ? (
                    <img
                      src={item.previewImageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${item.thumbnailGradient}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-1.5 flex flex-col justify-end text-white">
                    <span className="text-[9px] text-white/70 font-mono truncate">
                      {item.category.split(' ')[0]}
                    </span>
                    <p className="text-[10px] font-semibold truncate leading-tight">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar with Rate & Actions */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
            Project Rate
          </span>
          <span className="text-xs font-semibold text-slate-900 font-mono">
            {creator.rateRange.split(' - ')[0]}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewProfile(creator)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Profile
          </button>
          {onContactCreator && (
            <button
              onClick={() => onContactCreator(creator)}
              className="px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Contact
            </button>
          )}
          <button
            onClick={() => onStartEngagement(creator)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs whitespace-nowrap flex items-center gap-1"
          >
            <span>Engage</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
