import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  Calendar,
  DollarSign,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { BrandBrief } from '../types';
import { generateAIBrief, GenerationResult } from '../services/aiBriefGenerator';

interface AIBriefBuilderPageProps {
  onSaveBrief: (brief: BrandBrief) => void;
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
  defaultBrandName?: string;
  onCustomizeInForm?: (brief: BrandBrief) => void;
}

const PRESET_IDEAS = [
  {
    title: 'Cyberpunk Sneaker TikTok',
    idea: 'Futuristic aerodynamic running sneaker with liquid chrome materials and pulsing neon solar accents for urban Gen-Z athletes on TikTok and Reels.',
    type: 'Short-Form Video',
  },
  {
    title: 'Haute Horology Macro Reel',
    idea: 'Extreme macro time-lapse of Swiss watch tourbillon titanium escapement gears morphing into astronomical constellations with anamorphic rim lighting.',
    type: 'Cinematic Video',
  },
  {
    title: 'Organic Peptide Skincare',
    idea: 'High-end botanical serum dropper bottle resting on wet alpine moss with sunlight refractions and zero distortion on transparent glass.',
    type: 'Photorealistic Stills',
  },
  {
    title: 'B2B Enterprise Cloud 3D Loop',
    idea: 'Clean isometric 3D architectural loop of glowing optical fiber nodes representing high-throughput AI inference data centers.',
    type: '3D Animation',
  },
];

export const AIBriefBuilderPage: React.FC<AIBriefBuilderPageProps> = ({
  onSaveBrief,
  onSuccessToast,
  onErrorToast,
  defaultBrandName = 'Apex Brand Studio',
  onCustomizeInForm,
}) => {
  const [roughIdea, setRoughIdea] = useState('');
  const [brandName, setBrandName] = useState(defaultBrandName);
  const [targetAudienceHint, setTargetAudienceHint] = useState('');
  const [contentTypeHint, setContentTypeHint] = useState('Short-Form Video');

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roughIdea.trim()) {
      onErrorToast('Please enter a rough campaign idea to synthesize.');
      return;
    }

    setIsGenerating(true);
    try {
      const genResult = await generateAIBrief({
        roughIdea,
        brandName: brandName.trim() || 'Apex Brand Studio',
        targetAudienceHint,
        contentTypeHint,
      });

      setResult(genResult);
      if (genResult.mode === 'gemini_api') {
        onSuccessToast('Synthesized structured brief using Gemini 3.8 Flash!');
      } else {
        onSuccessToast('Synthesized structured brief using local template engine.');
      }
    } catch (err: any) {
      onErrorToast(`Generation failed: ${err.message || 'Error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPreset = (preset: { idea: string; type: string }) => {
    setRoughIdea(preset.idea);
    setContentTypeHint(preset.type);
  };

  const handleCopyText = async () => {
    if (!result?.brief) return;

    const b = result.brief;
    const textToCopy = `
CAMPAIGN BRIEF: ${b.title || 'Untitled'}
Brand: ${b.brand}
Objective: ${b.campaignObjective}
Target Audience: ${b.targetAudience}
Content Type: ${b.contentType}
Style: ${b.creativeStyle}
Platform: ${b.platform} (${b.aspectRatio})
Duration/Dimensions: ${b.durationOrDimensions}
Recommended AI Tools: ${b.preferredTools?.join(', ')}
Budget Range: ${b.budgetRange}
Deadline: ${b.deadline}
Deliverables:
${b.deliverables?.map((d) => `- ${d}`).join('\n')}
Suggested Workflow:
${b.suggestedWorkflow}
Licensing Requirements:
${b.licensingRequirements}
`.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onSuccessToast('Copied full brief specifications to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      onSuccessToast('Copied full brief specifications to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseAndSaveBrief = (status: 'draft' | 'open') => {
    if (!result?.brief) return;

    const fullBrief: BrandBrief = {
      id: `brief-${Date.now()}`,
      title: result.brief.title || 'Synthesized Campaign Brief',
      brand: result.brief.brand || brandName || 'Apex Brand Studio',
      campaignObjective: result.brief.campaignObjective || '',
      targetAudience: result.brief.targetAudience || 'Target commercial audience',
      contentType: result.brief.contentType || 'Short-Form Video',
      creativeStyle: result.brief.creativeStyle || 'Modern Commercial Aesthetic',
      platform: result.brief.platform || 'Social & Web',
      aspectRatio: result.brief.aspectRatio || '9:16 (Vertical)',
      durationOrDimensions: result.brief.durationOrDimensions || '15-30 seconds',
      preferredTools: result.brief.preferredTools || ['Runway Gen-3 Alpha', 'Midjourney v6.1'],
      budgetRange: result.brief.budgetRange || '$1,500 - $3,000',
      deadline: result.brief.deadline || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliverables: result.brief.deliverables || ['1x Master Video Asset'],
      licensingRequirements: result.brief.licensingRequirements || 'Full digital commercial buyout',
      additionalInstructions: result.brief.additionalInstructions || '',
      suggestedWorkflow: result.brief.suggestedWorkflow,
      successCriteria: result.brief.successCriteria,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generatedByAI: true,
      aiMode: result.mode,
    };

    onSaveBrief(fullBrief);
    onSuccessToast(
      `Saved brief "${fullBrief.title}" as ${status.toUpperCase()}! You can view it in the Brand Briefs tab.`
    );
  };

  const handleCustomizeInForm = () => {
    if (!result?.brief) return;

    const fullBrief: BrandBrief = {
      id: `brief-${Date.now()}`,
      title: result.brief.title || 'Synthesized Campaign Brief',
      brand: result.brief.brand || brandName || 'Apex Brand Studio',
      campaignObjective: result.brief.campaignObjective || '',
      targetAudience: result.brief.targetAudience || 'Target commercial audience',
      contentType: result.brief.contentType || 'Short-Form Video',
      creativeStyle: result.brief.creativeStyle || 'Modern Commercial Aesthetic',
      platform: result.brief.platform || 'Social & Web',
      aspectRatio: result.brief.aspectRatio || '9:16 (Vertical)',
      durationOrDimensions: result.brief.durationOrDimensions || '15-30 seconds',
      preferredTools: result.brief.preferredTools || ['Runway Gen-3 Alpha', 'Midjourney v6.1'],
      budgetRange: result.brief.budgetRange || '$1,500 - $3,000',
      deadline: result.brief.deadline || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliverables: result.brief.deliverables || ['1x Master Video Asset'],
      licensingRequirements: result.brief.licensingRequirements || 'Full digital commercial buyout',
      additionalInstructions: result.brief.additionalInstructions || '',
      suggestedWorkflow: result.brief.suggestedWorkflow,
      successCriteria: result.brief.successCriteria,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generatedByAI: true,
      aiMode: result.mode,
    };

    if (onCustomizeInForm) {
      onCustomizeInForm(fullBrief);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-linear-to-r from-violet-900 via-indigo-950 to-slate-900 rounded-2xl text-white border border-violet-800/40 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Brief Builder & Prompt Synthesizer</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Transform Rough Ideas into Production-Grade Briefs
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Enter a rough concept or campaign vision. CreatorConnect AI translates your requirements into technical model recommendations, reproducible pipeline constraints, aspect ratios, and commercial deliverable specs.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
        {/* Preset chips */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Quick Inspirations & Campaign Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_IDEAS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors font-medium text-left"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">
              Rough Campaign Vision or Idea <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={roughIdea}
              onChange={(e) => setRoughIdea(e.target.value)}
              placeholder="e.g. We need a 15-second hyper-tactile TikTok teaser for our new zero-sugar sparkling botanical energy drink with hyper-detailed condensation drops and upbeat cyber-funk rhythm..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand / Client Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Apex Brand Studio"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience Hint
              </label>
              <input
                type="text"
                value={targetAudienceHint}
                onChange={(e) => setTargetAudienceHint(e.target.value)}
                placeholder="e.g. Gen-Z fitness enthusiasts"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Content Type
              </label>
              <select
                value={contentTypeHint}
                onChange={(e) => setContentTypeHint(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
              >
                <option value="Short-Form Video">Short-Form Video (9:16)</option>
                <option value="Cinematic Video">Cinematic Video (16:9)</option>
                <option value="Photorealistic Stills">Photorealistic Stills (1:1 / 4:5)</option>
                <option value="3D Animation">3D Animation (Loop)</option>
                <option value="Audio & Voiceover">Audio & Voiceover</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Works seamlessly with or without external API keys.
            </span>

            <button
              type="submit"
              disabled={isGenerating || !roughIdea.trim()}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Brief...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Brief with AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Result Container */}
      {result && result.brief && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
          {/* Disclosure Badge Header (Truthful disclosure per prompt rule) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <span
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md border ${
                  result.mode === 'gemini_api'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-violet-50 text-violet-700 border-violet-200'
                }`}
              >
                {result.sourceLabel}
              </span>
              <span className="text-xs text-slate-600">{result.notes}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              {onCustomizeInForm && (
                <button
                  type="button"
                  onClick={handleCustomizeInForm}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Customize in Form</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleUseAndSaveBrief('draft')}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleUseAndSaveBrief('open')}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Publish (Open)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Structured Brief Preview */}
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-mono text-indigo-600 uppercase">
                {result.brief.brand}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-1">
                {result.brief.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Campaign Objective
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed mt-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    {result.brief.campaignObjective}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Aesthetic Direction & Style
                  </h4>
                  <p className="text-xs text-slate-800 font-medium mt-1">
                    {result.brief.creativeStyle}
                  </p>
                </div>

                {result.brief.suggestedWorkflow && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Suggested Generative Pipeline
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1 bg-violet-50/50 p-3 rounded-xl border border-violet-100">
                      {result.brief.suggestedWorkflow}
                    </p>
                  </div>
                )}

                {/* Deliverables */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                    Deliverables Checklist ({result.brief.deliverables?.length || 0})
                  </h4>
                  <div className="space-y-1.5">
                    {result.brief.deliverables?.map((del, i) => (
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
              </div>

              {/* Sidebar specs */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Target Persona
                  </span>
                  <p className="text-xs text-slate-700 mt-1">
                    {result.brief.targetAudience}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Platform & Aspect Ratio
                  </span>
                  <p className="text-xs text-slate-800 font-medium mt-1">
                    {result.brief.platform}
                  </p>
                  <p className="text-xs font-mono text-slate-600 mt-0.5">
                    {result.brief.aspectRatio} · {result.brief.durationOrDimensions}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Commercial & Timeline
                  </span>
                  <p className="text-xs font-bold text-slate-900 font-mono mt-1">
                    {result.brief.budgetRange}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">
                    Deadline: {result.brief.deadline}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Recommended Model Stack
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {result.brief.preferredTools?.map((tool) => (
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
                    Licensing Terms
                  </span>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {result.brief.licensingRequirements}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
