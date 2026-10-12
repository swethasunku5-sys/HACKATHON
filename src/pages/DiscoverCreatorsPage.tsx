import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Star,
  ShieldCheck,
  Check,
  SlidersHorizontal,
  X,
  Layers,
  ChevronDown,
  LayoutGrid,
  List,
  Bookmark,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Creator, CreatorSpecialization, ExperienceLevel, AvailabilityStatus } from '../types';
import { CreatorCard } from '../components/creators/CreatorCard';

interface DiscoverCreatorsPageProps {
  creators: Creator[];
  shortlistIds: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleShortlist: (creatorId: string) => void;
  onViewProfile: (creator: Creator) => void;
  onStartEngagement: (creator: Creator) => void;
  onContactCreator?: (creator: Creator) => void;
  externalSpecializationFilter?: string;
}

export const DiscoverCreatorsPage: React.FC<DiscoverCreatorsPageProps> = ({
  creators,
  shortlistIds,
  searchQuery,
  onSearchChange,
  onToggleShortlist,
  onViewProfile,
  onStartEngagement,
  onContactCreator,
  externalSpecializationFilter,
}) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>(externalSpecializationFilter || 'all');
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [onlyAuditedWorkflow, setOnlyAuditedWorkflow] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'completed' | 'name_asc'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Sync external filter when changed by Lucy or quick solution
  React.useEffect(() => {
    if (externalSpecializationFilter) {
      setSelectedSpecialization(externalSpecializationFilter);
    }
  }, [externalSpecializationFilter]);

  // Available unique tools
  const allTools = useMemo(() => {
    const set = new Set<string>();
    creators.forEach((c) => c.tools.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [creators]);

  // Available unique skills
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    creators.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [creators]);

  // Available unique content types
  const allContentTypes = useMemo(() => {
    const set = new Set<string>();
    creators.forEach((c) => c.contentTypes.forEach((ct) => set.add(ct)));
    return Array.from(set).sort();
  }, [creators]);

  // Combined filtering logic
  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = creator.name.toLowerCase().includes(q);
        const matchesHandle = creator.handle.toLowerCase().includes(q);
        const matchesBio = creator.bio.toLowerCase().includes(q);
        const matchesLocation = creator.location.toLowerCase().includes(q);
        const matchesSkills = creator.skills.some((s) => s.toLowerCase().includes(q));
        const matchesTools = creator.tools.some((t) => t.toLowerCase().includes(q));
        const matchesSpec = creator.specialization.toLowerCase().includes(q);
        const matchesTypes = creator.contentTypes.some((ct) => ct.toLowerCase().includes(q));

        if (!matchesName && !matchesHandle && !matchesBio && !matchesLocation && !matchesSkills && !matchesTools && !matchesSpec && !matchesTypes) {
          return false;
        }
      }

      // Specialization
      if (selectedSpecialization !== 'all' && creator.specialization !== selectedSpecialization) {
        return false;
      }

      // Tool
      if (selectedTool !== 'all' && !creator.tools.includes(selectedTool)) {
        return false;
      }

      // Skill
      if (selectedSkill !== 'all' && !creator.skills.includes(selectedSkill)) {
        return false;
      }

      // Content Type
      if (selectedContentType !== 'all' && !creator.contentTypes.includes(selectedContentType)) {
        return false;
      }

      // Experience
      if (selectedExperience !== 'all' && creator.experienceLevel !== selectedExperience) {
        return false;
      }

      // Availability
      if (selectedAvailability !== 'all' && creator.availability !== selectedAvailability) {
        return false;
      }

      // Verification signal
      if (onlyAuditedWorkflow && !creator.verifications.workflowAudited) {
        return false;
      }

      return true;
    });
  }, [
    creators,
    searchQuery,
    selectedSpecialization,
    selectedTool,
    selectedSkill,
    selectedContentType,
    selectedExperience,
    selectedAvailability,
    onlyAuditedWorkflow,
  ]);

  // Sorting logic
  const sortedCreators = useMemo(() => {
    const list = [...filteredCreators];
    switch (sortBy) {
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'experience':
        return list.sort((a, b) => b.yearsExperience - a.yearsExperience);
      case 'completed':
        return list.sort((a, b) => b.completedBriefsCount - a.completedBriefsCount);
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [filteredCreators, sortBy]);

  const displayedCreators = sortedCreators.slice(0, visibleCount);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedSpecialization !== 'all' ||
    selectedTool !== 'all' ||
    selectedSkill !== 'all' ||
    selectedContentType !== 'all' ||
    selectedExperience !== 'all' ||
    selectedAvailability !== 'all' ||
    onlyAuditedWorkflow;

  const handleResetFilters = () => {
    onSearchChange('');
    setSelectedSpecialization('all');
    setSelectedTool('all');
    setSelectedSkill('all');
    setSelectedContentType('all');
    setSelectedExperience('all');
    setSelectedAvailability('all');
    setOnlyAuditedWorkflow(false);
    setSortBy('rating');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Discover AI Content Creators
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Filter by generative model pipelines, audited workflows, content types, and technical skills
          </p>
        </div>

        {/* Live Filter Counter, View Mode & Clear */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 font-mono">
            Showing <strong className="text-slate-900 font-bold">{sortedCreators.length}</strong> of {creators.length} creators
          </span>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
        {/* Row 1: Search + Sort controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by creator name, model (Runway, Kling, Midjourney, Flux), skill, content type..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:bg-white font-medium"
            >
              <option value="rating">Top Rated (Rating)</option>
              <option value="experience">Years Experience</option>
              <option value="completed">Completed Projects</option>
              <option value="name_asc">Name (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Deep Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Specialization */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Specialization
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Disciplines</option>
              <option value="Video & Animation">Video & Animation</option>
              <option value="Concept Art & Stills">Concept Art & Stills</option>
              <option value="3D & Motion">3D & Motion</option>
              <option value="Brand Identity & Ads">Brand Identity & Ads</option>
              <option value="Audio & Music">Audio & Music</option>
              <option value="VFX & Compositing">VFX & Compositing</option>
            </select>
          </div>

          {/* AI Tool */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              AI Model / Stack
            </label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Models</option>
              {allTools.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Technical Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Skills</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Content Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Content Type
            </label>
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Deliverable Types</option>
              {allContentTypes.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              <option value="all">Any Experience</option>
              <option value="Senior (4+ yrs)">Senior (4+ yrs)</option>
              <option value="Specialist (2-4 yrs)">Specialist (2-4 yrs)</option>
              <option value="Rising Star (1-2 yrs)">Rising Star (1-2 yrs)</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Availabilities</option>
              <option value="Available Now">Available Now</option>
              <option value="Available in 1-2 Weeks">In 1-2 Weeks</option>
              <option value="Booked until next month">Booked Next Month</option>
            </select>
          </div>
        </div>

        {/* Row 3: Verification Badge Toggle & Active Filter Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors self-start sm:self-auto">
            <input
              type="checkbox"
              checked={onlyAuditedWorkflow}
              onChange={(e) => setOnlyAuditedWorkflow(e.target.checked)}
              className="w-3.5 h-3.5 text-indigo-600 rounded"
            />
            <span className="text-[11px] font-semibold text-slate-700 truncate">
              Audited Pipeline Only (Reproducibility Cleared)
            </span>
          </label>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Active:</span>
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] hover:bg-slate-200 flex items-center gap-1"
                >
                  <span>"{searchQuery}"</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedSpecialization !== 'all' && (
                <button
                  onClick={() => setSelectedSpecialization('all')}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] hover:bg-slate-200 flex items-center gap-1"
                >
                  <span>Spec: {selectedSpecialization}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedTool !== 'all' && (
                <button
                  onClick={() => setSelectedTool('all')}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] hover:bg-slate-200 flex items-center gap-1"
                >
                  <span>Tool: {selectedTool}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedSkill !== 'all' && (
                <button
                  onClick={() => setSelectedSkill('all')}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] hover:bg-slate-200 flex items-center gap-1"
                >
                  <span>Skill: {selectedSkill}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedContentType !== 'all' && (
                <button
                  onClick={() => setSelectedContentType('all')}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] hover:bg-slate-200 flex items-center gap-1"
                >
                  <span>Type: {selectedContentType}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedExperience !== 'all' && (
                <button
                  onClick={() => setSelectedExperience('all')}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] hover:bg-slate-200 flex items-center gap-1"
                >
                  <span>Exp: {selectedExperience}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedAvailability !== 'all' && (
                <button
                  onClick={() => setSelectedAvailability('all')}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] hover:bg-slate-200 flex items-center gap-1"
                >
                  <span>Avail: {selectedAvailability}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {onlyAuditedWorkflow && (
                <button
                  onClick={() => setOnlyAuditedWorkflow(false)}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] hover:bg-indigo-100 flex items-center gap-1"
                >
                  <span>Audited Only</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results View or Empty State */}
      {displayedCreators.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            No AI creators matched your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try broadening your search term, clearing selected tools or model constraints, or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              isShortlisted={shortlistIds.includes(creator.id)}
              onToggleShortlist={onToggleShortlist}
              onViewProfile={onViewProfile}
              onStartEngagement={onStartEngagement}
              onContactCreator={onContactCreator}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Primary AI Stack</th>
                  <th className="py-3 px-4">Rating / Reviews</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedCreators.map((creator) => {
                  const isShortlisted = shortlistIds.includes(creator.id);
                  return (
                    <tr key={creator.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl ${creator.avatarBg} flex items-center justify-center font-bold text-xs shrink-0`}
                          >
                            {creator.avatarInitials}
                          </div>
                          <div className="min-w-0">
                            <span
                              onClick={() => onViewProfile(creator)}
                              className="font-semibold text-slate-900 block truncate hover:text-indigo-600 cursor-pointer"
                            >
                              {creator.name}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {creator.handle} · {creator.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {creator.specialization}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                        {creator.tools.slice(0, 3).join(' · ')}
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        ★ {creator.rating.toFixed(2)} ({creator.reviewsCount})
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-emerald-700 font-medium">
                          {creator.availability}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {creator.rateRange.split(' - ')[0]}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onToggleShortlist(creator.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isShortlisted
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                            title={isShortlisted ? 'Remove Shortlist' : 'Add Shortlist'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-indigo-600' : ''}`} />
                          </button>
                          <button
                            onClick={() => onViewProfile(creator)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => onStartEngagement(creator)}
                            className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                          >
                            Engage
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination / Load More */}
      {sortedCreators.length > visibleCount && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors"
          >
            Load More Creators ({sortedCreators.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
