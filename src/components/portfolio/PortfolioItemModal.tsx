import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Layers,
  FileCode,
  Tag,
  Maximize2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { PortfolioItem } from '../../types';
import { Modal } from '../common/Modal';

interface PortfolioItemModalProps {
  item: PortfolioItem | null;
  allItems?: PortfolioItem[];
  onClose: () => void;
  onSelectNext?: () => void;
  onSelectPrev?: () => void;
  onStartEngagementWithCreator?: (creatorId: string) => void;
  onViewCreator?: (creatorId: string) => void;
}

export const PortfolioItemModal: React.FC<PortfolioItemModalProps> = ({
  item,
  allItems = [],
  onClose,
  onSelectNext,
  onSelectPrev,
  onStartEngagementWithCreator,
  onViewCreator,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image status when item changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [item?.id]);

  // Keyboard controls for lightbox navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'ArrowRight' && onSelectNext) {
        onSelectNext();
      } else if (e.key === 'ArrowLeft' && onSelectPrev) {
        onSelectPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onSelectNext, onSelectPrev]);

  if (!item) return null;

  const currentIndex = allItems.findIndex((p) => p.id === item.id);
  const hasMultiple = allItems.length > 1;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(item.promptSnippet);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = item.promptSnippet;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={Boolean(item)}
      onClose={onClose}
      title={item.title}
      subtitle={`Created by ${item.creatorName} · ${item.category}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Navigation & Counter Bar */}
        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium py-1 px-2 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Gallery</span>
          </button>

          {hasMultiple && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-mono text-[11px]">
                {currentIndex + 1} of {allItems.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={onSelectPrev}
                  title="Previous piece (Left arrow)"
                  className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={onSelectNext}
                  title="Next piece (Right arrow)"
                  className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Visual Showcase Canvas with Image Preview or Fallback */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
          {item.previewImageUrl && !imageError ? (
            <div className="relative w-full min-h-[260px] max-h-[460px] flex items-center justify-center bg-slate-950">
              {/* Shimmer loading placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center text-slate-600">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span>Loading high-res generative render...</span>
                  </div>
                </div>
              )}

              <img
                src={item.previewImageUrl}
                alt={item.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full max-h-[460px] object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-between p-5 pointer-events-none">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md rounded-md text-white border border-white/20">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-mono bg-black/60 backdrop-blur-md rounded-md border border-white/20 text-white/90">
                    {item.aspectRatio}
                  </span>
                </div>

                <div className="text-white">
                  <h3 className="text-lg font-bold drop-shadow-md">{item.title}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{item.clientOrContext}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Gradient Visualizer Fallback when image is not used or fails */
            <div
              className={`w-full rounded-2xl bg-gradient-to-br ${item.thumbnailGradient} p-8 text-white min-h-[220px] flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white/70">
                    {item.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold mt-1 text-white">
                    {item.title}
                  </h2>
                </div>
                <span className="px-2.5 py-1 text-xs font-mono bg-black/40 backdrop-blur-xs rounded-lg border border-white/10 text-white/90">
                  {item.aspectRatio}
                </span>
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/15">
                <div className="text-xs text-white/80">
                  <span className="text-white/60">Client / Context:</span> {item.clientOrContext}
                </div>
                {item.durationOrSize && (
                  <div className="text-xs font-mono text-white/90">
                    {item.durationOrSize}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick next/prev overlay arrows on hover */}
          {hasMultiple && (
            <>
              <button
                onClick={onSelectPrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={onSelectNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Project Description & Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Project Overview
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed mt-1.5">
                {item.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Generative Production Pipeline
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed mt-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                {item.workflowDescription}
              </p>
            </div>

            {/* Prompt Snippet Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Prompt Blueprint / Conditioning Recipe</span>
                </h4>
                <button
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Recipe</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 select-all">
                {item.promptSnippet}
              </div>
            </div>
          </div>

          {/* Right Spec Sidebar */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  AI Tool Stack
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.toolsUsed.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 text-xs bg-white border border-slate-200 text-slate-700 rounded-md font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Deliverable Format
                </span>
                <p className="text-xs font-mono text-slate-800 mt-1">
                  {item.format}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Licensing Clearance
                </span>
                <p className="text-xs font-medium text-indigo-700 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{item.commercialLicenseType}</span>
                </p>
              </div>

              {onViewCreator && (
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Creator Profile
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onViewCreator(item.creatorId);
                    }}
                    className="mt-1.5 text-xs font-medium text-slate-800 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <span>View {item.creatorName}&apos;s Roster</span>
                    <ExternalLink className="w-3 h-3 text-indigo-500" />
                  </button>
                </div>
              )}
            </div>

            {onStartEngagementWithCreator && (
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    onClose();
                    onStartEngagementWithCreator(item.creatorId);
                  }}
                  className="w-full py-2.5 px-3 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Commission Similar Work</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
