import React, { useState, useMemo } from 'react';
import {
  Grid,
  Filter,
  Search,
  Sparkles,
  Maximize2,
  FileCode,
  ShieldCheck,
  Tag,
  Layers,
  ArrowRight,
  ExternalLink,
  Eye,
  Film,
  Camera,
  Music,
  Box,
} from 'lucide-react';
import { Creator, PortfolioItem } from '../types';
import { PortfolioItemModal } from '../components/portfolio/PortfolioItemModal';

interface PortfolioPageProps {
  creators: Creator[];
  onStartEngagementWithCreator: (creatorId: string) => void;
  onViewCreator?: (creatorId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  creators,
  onStartEngagementWithCreator,
  onViewCreator,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  // Aggregate all portfolio items from all creators
  const allPortfolioItems = useMemo(() => {
    const list: PortfolioItem[] = [];
    creators.forEach((c) => {
      c.portfolio.forEach((p) => {
        list.push(p);
      });
    });
    return list;
  }, [creators]);

  // Extract all tools
  const allTools = useMemo(() => {
    const set = new Set<string>();
    allPortfolioItems.forEach((p) => p.toolsUsed.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [allPortfolioItems]);

  const filteredItems = useMemo(() => {
    return allPortfolioItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedTool !== 'all' && !item.toolsUsed.includes(selectedTool)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCreator = item.creatorName.toLowerCase().includes(q);
        const matchesPrompt = item.promptSnippet.toLowerCase().includes(q);
        const matchesTool = item.toolsUsed.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCreator && !matchesPrompt && !matchesTool) {
          return false;
        }
      }
      return true;
    });
  }, [allPortfolioItems, selectedCategory, selectedTool, searchQuery]);

  // Lightbox carousel navigation
  const handleSelectNext = () => {
    if (!activeItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((p) => p.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActiveItem(filteredItems[nextIndex]);
  };

  const handleSelectPrev = () => {
    if (!activeItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((p) => p.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveItem(filteredItems[prevIndex]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Video & Motion':
        return <Film className="w-3.5 h-3.5 text-violet-400" />;
      case 'Graphic & Stills':
        return <Camera className="w-3.5 h-3.5 text-emerald-400" />;
      case '3D & Animation':
        return <Box className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Audio & Sound':
        return <Music className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              AI Portfolio & Asset Showcase
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Interactive Lightbox
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inspect commercial generative videos, product packshots, 3D spatial loops, and audio anthems with complete prompt recipes
          </p>
        </div>

        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          Showing <strong className="text-slate-900 font-bold">{filteredItems.length}</strong> works
        </span>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Category Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto scrollbar-none">
          {['all', 'Video & Motion', 'Graphic & Stills', '3D & Animation', 'Audio & Sound'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Disciplines' : cat}
            </button>
          ))}
        </div>

        {/* Tools Dropdown + Search */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
          >
            <option value="all">All AI Tools</option>
            {allTools.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="relative w-48 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search works & tools..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <p className="text-xs text-slate-500">
            No portfolio pieces matched your selected discipline or tool filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTool('all');
              onSearchChange('');
            }}
            className="px-3.5 py-1.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer group focus-within:ring-2 focus-within:ring-indigo-500"
            >
              {/* Rich Visual Canvas with Image or Gradient Preview */}
              <div className="relative h-52 bg-slate-950 overflow-hidden">
                {item.previewImageUrl ? (
                  <>
                    <img
                      src={item.previewImageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback gracefully to background gradient
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-between text-white pointer-events-none">
                      <div className="flex items-start justify-between">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md rounded border border-white/20">
                          {getCategoryIcon(item.category)}
                          <span>{item.category}</span>
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-black/60 backdrop-blur-md rounded border border-white/20 text-white/90">
                          {item.aspectRatio}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:translate-x-0.5 transition-transform line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-white/80 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${item.thumbnailGradient} p-4 text-white flex flex-col justify-between relative`}
                  >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                    <div className="relative z-10 flex items-start justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-white/80 flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-black/40 backdrop-blur-xs rounded border border-white/10">
                        {item.aspectRatio}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-base font-bold text-white group-hover:translate-x-0.5 transition-transform">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Open Lightbox</span>
                  </span>
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 truncate">
                    {item.creatorName}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {item.format.split(' ')[0]}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono truncate">
                  <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{item.toolsUsed.join(' · ')}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-indigo-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Commercial Cleared</span>
                  </span>

                  <span className="text-slate-400 group-hover:text-indigo-600 text-[11px] font-medium flex items-center gap-0.5">
                    <span>Inspect Specs</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <PortfolioItemModal
        item={activeItem}
        allItems={filteredItems}
        onClose={() => setActiveItem(null)}
        onSelectNext={handleSelectNext}
        onSelectPrev={handleSelectPrev}
        onStartEngagementWithCreator={(creatorId) => {
          setActiveItem(null);
          onStartEngagementWithCreator(creatorId);
        }}
        onViewCreator={onViewCreator}
      />
    </div>
  );
};
