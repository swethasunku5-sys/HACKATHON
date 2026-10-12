import React from 'react';
import { Bookmark, Users, ArrowRight, Trash2, Briefcase, Star, MapPin } from 'lucide-react';
import { Creator } from '../types';
import { NavTab } from '../components/layout/Sidebar';

interface ShortlistPageProps {
  creators: Creator[];
  shortlistIds: string[];
  onRemoveFromShortlist: (creatorId: string) => void;
  onViewProfile: (creator: Creator) => void;
  onStartEngagement: (creator: Creator) => void;
  onContactCreator?: (creator: Creator) => void;
  onNavigate: (tab: NavTab) => void;
}

export const ShortlistPage: React.FC<ShortlistPageProps> = ({
  creators,
  shortlistIds,
  onRemoveFromShortlist,
  onViewProfile,
  onStartEngagement,
  onContactCreator,
  onNavigate,
}) => {
  const shortlistedCreators = creators.filter((c) => shortlistIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Campaign Talent Shortlist
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Curated creators saved for upcoming production sprints and creative briefs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-600">
            <strong>{shortlistedCreators.length}</strong> creators shortlisted
          </span>
          <button
            onClick={() => onNavigate('discover')}
            className="px-3.5 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Discover More</span>
          </button>
        </div>
      </div>

      {shortlistedCreators.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            Your shortlist is currently empty
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our verified AI roster and bookmark creators that match your aesthetic and technical requirements.
          </p>
          <button
            onClick={() => onNavigate('discover')}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
          >
            Browse AI Creators
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shortlistedCreators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                      {creator.avatarUrl ? (
                        <img
                          src={creator.avatarUrl}
                          alt={creator.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          className={`w-full h-full ${creator.avatarBg} flex items-center justify-center font-bold text-sm`}
                        >
                          {creator.avatarInitials}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4
                        onClick={() => onViewProfile(creator)}
                        className="text-sm font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer"
                      >
                        {creator.name}
                      </h4>
                      <p className="text-xs text-slate-500">{creator.handle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromShortlist(creator.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove from shortlist"
                    aria-label="Remove from shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs font-medium text-slate-700 mt-3 line-clamp-2 leading-relaxed">
                  {creator.tagline}
                </p>

                {/* Zero-Pill Unboxed Metadata Row */}
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-2.5">
                  <span className="font-medium text-slate-800">{creator.specialization}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-slate-700">
                    ★ {creator.rating.toFixed(2)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-emerald-700">{creator.availability}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Model Stack</span>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    {creator.tools.slice(0, 4).join(' · ')}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold font-mono text-slate-900">
                  {creator.rateRange.split(' - ')[0]}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewProfile(creator)}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Profile
                  </button>
                  {onContactCreator && (
                    <button
                      onClick={() => onContactCreator(creator)}
                      className="px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                    >
                      Contact
                    </button>
                  )}
                  <button
                    onClick={() => onStartEngagement(creator)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1"
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
