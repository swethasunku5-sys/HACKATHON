import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  Layers,
} from 'lucide-react';
import { BrandBrief, BriefStatus } from '../../types';
import { Modal } from '../common/Modal';

interface BriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brief: BrandBrief) => void;
  initialBrief?: BrandBrief | null;
  defaultBrandName?: string;
}

export const BriefModal: React.FC<BriefModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBrief,
  defaultBrandName = 'Apex Brand Studio',
}) => {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState(defaultBrandName);
  const [campaignObjective, setCampaignObjective] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentType, setContentType] = useState('Short-Form Video');
  const [creativeStyle, setCreativeStyle] = useState('');
  const [platform, setPlatform] = useState('TikTok & Instagram Reels');
  const [aspectRatio, setAspectRatio] = useState('9:16 (Vertical)');
  const [durationOrDimensions, setDurationOrDimensions] = useState('15-30 seconds');
  const [preferredToolsInput, setPreferredToolsInput] = useState('');
  const [budgetRange, setBudgetRange] = useState('$1,500 - $3,000');
  const [deadline, setDeadline] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    '1x Primary Master Video Cut (4K ProRes 9:16)',
    '2x Alternate 3-second opening hook variations',
    'Full prompt recipes and ComfyUI/seed parameter documentation',
  ]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [licensingRequirements, setLicensingRequirements] = useState(
    'Perpetual worldwide commercial digital buyout including paid advertising and social media distribution rights.'
  );
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialBrief) {
      setTitle(initialBrief.title);
      setBrand(initialBrief.brand);
      setCampaignObjective(initialBrief.campaignObjective);
      setTargetAudience(initialBrief.targetAudience);
      setContentType(initialBrief.contentType);
      setCreativeStyle(initialBrief.creativeStyle);
      setPlatform(initialBrief.platform);
      setAspectRatio(initialBrief.aspectRatio);
      setDurationOrDimensions(initialBrief.durationOrDimensions);
      setPreferredToolsInput(initialBrief.preferredTools.join(', '));
      setBudgetRange(initialBrief.budgetRange);
      setDeadline(initialBrief.deadline);
      setDeliverables(initialBrief.deliverables.length > 0 ? initialBrief.deliverables : ['1x Master Final Asset']);
      setLicensingRequirements(initialBrief.licensingRequirements);
      setAdditionalInstructions(initialBrief.additionalInstructions || '');
    } else {
      // Defaults for brand new brief
      setTitle('');
      setBrand(defaultBrandName);
      setCampaignObjective('');
      setTargetAudience('');
      setContentType('Short-Form Video');
      setCreativeStyle('Modern High-Contrast Commercial Aesthetic with Cinematic Lighting');
      setPlatform('TikTok & Instagram Reels');
      setAspectRatio('9:16 (Vertical)');
      setDurationOrDimensions('15-30 seconds');
      setPreferredToolsInput('Runway Gen-3 Alpha, Kling AI, Midjourney v6.1');
      setBudgetRange('$1,800 - $3,500');
      // 3 weeks out
      setDeadline(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setDeliverables([
        '1x Primary Master Video Cut (4K ProRes 9:16)',
        '2x Alternate 3-second opening hook variations',
        'Prompt manifest and ComfyUI workflow seeds',
      ]);
      setLicensingRequirements(
        'Perpetual worldwide commercial digital buyout including paid advertising and social media distribution rights.'
      );
      setAdditionalInstructions('');
    }
    setErrors({});
  }, [initialBrief, isOpen, defaultBrandName]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!brand.trim()) errs.brand = 'Brand name is required';
    if (!campaignObjective.trim()) errs.campaignObjective = 'Campaign objective is required';
    if (!targetAudience.trim()) errs.targetAudience = 'Target audience is required';
    if (!creativeStyle.trim()) errs.creativeStyle = 'Creative style is required';
    if (!budgetRange.trim()) errs.budgetRange = 'Budget range is required';
    if (!deadline.trim()) errs.deadline = 'Deadline date is required';
    if (deliverables.length === 0) errs.deliverables = 'At least one deliverable is required';
    if (!licensingRequirements.trim()) errs.licensingRequirements = 'Licensing terms are required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = (status: BriefStatus) => {
    if (!validate()) return;

    const tools = preferredToolsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const briefToSave: BrandBrief = {
      id: initialBrief ? initialBrief.id : `brief-${Date.now()}`,
      title: title.trim(),
      brand: brand.trim(),
      campaignObjective: campaignObjective.trim(),
      targetAudience: targetAudience.trim(),
      contentType,
      creativeStyle: creativeStyle.trim(),
      platform,
      aspectRatio,
      durationOrDimensions: durationOrDimensions.trim(),
      preferredTools: tools.length > 0 ? tools : ['Midjourney v6.1', 'Runway Gen-3'],
      budgetRange: budgetRange.trim(),
      deadline,
      deliverables,
      licensingRequirements: licensingRequirements.trim(),
      additionalInstructions: additionalInstructions.trim(),
      suggestedWorkflow: initialBrief?.suggestedWorkflow,
      successCriteria: initialBrief?.successCriteria,
      status,
      createdAt: initialBrief ? initialBrief.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generatedByAI: initialBrief?.generatedByAI || false,
      aiMode: initialBrief?.aiMode,
    };

    onSave(briefToSave);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialBrief ? 'Edit Creative Brief' : 'Create Creative Brief'}
      subtitle="Publish campaign specifications for generative AI creators"
      maxWidth="3xl"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('open');
        }}
        className="space-y-5"
      >
        {/* Row 1: Title & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Brief Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kinetic Chrome: Sneaker Launch Video"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white ${
                errors.title ? 'border-rose-300 ring-1 ring-rose-500' : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-0.5">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Brand / Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Apex Brand Studio"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white ${
                errors.brand ? 'border-rose-300 ring-1 ring-rose-500' : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {errors.brand && <p className="text-[11px] text-rose-500 mt-0.5">{errors.brand}</p>}
          </div>
        </div>

        {/* Row 2: Campaign Objective */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Campaign Objective & Core Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={campaignObjective}
            onChange={(e) => setCampaignObjective(e.target.value)}
            placeholder="Describe the campaign purpose, key visual hook, desired conversion outcome, and what makes this creative unique..."
            className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white ${
              errors.campaignObjective ? 'border-rose-300 ring-1 ring-rose-500' : 'border-slate-300 focus:border-indigo-500'
            }`}
          />
          {errors.campaignObjective && (
            <p className="text-[11px] text-rose-500 mt-0.5">{errors.campaignObjective}</p>
          )}
        </div>

        {/* Row 3: Audience & Creative Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Audience <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Ages 18-28 urban streetwear enthusiasts"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white ${
                errors.targetAudience ? 'border-rose-300 ring-1 ring-rose-500' : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {errors.targetAudience && (
              <p className="text-[11px] text-rose-500 mt-0.5">{errors.targetAudience}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Creative Style & Aesthetic Direction <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={creativeStyle}
              onChange={(e) => setCreativeStyle(e.target.value)}
              placeholder="e.g. Cyberpunk Surrealism with Hyper-Tactile Chrome"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white ${
                errors.creativeStyle ? 'border-rose-300 ring-1 ring-rose-500' : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {errors.creativeStyle && (
              <p className="text-[11px] text-rose-500 mt-0.5">{errors.creativeStyle}</p>
            )}
          </div>
        </div>

        {/* Row 4: Content Type, Platform, Aspect Ratio, Duration */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            >
              <option value="Short-Form Video">Short-Form Video</option>
              <option value="Cinematic Video">Cinematic Video</option>
              <option value="Photorealistic Stills">Photorealistic Stills</option>
              <option value="3D Animation">3D Animation</option>
              <option value="Audio & Voiceover">Audio & Voiceover</option>
              <option value="Generative AR Asset">Generative AR Asset</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            >
              <option value="TikTok & Instagram Reels">TikTok & Reels</option>
              <option value="YouTube Shorts / Full">YouTube</option>
              <option value="E-Commerce Website">E-Commerce Web</option>
              <option value="Digital Out-of-Home">Digital Out-of-Home</option>
              <option value="Multi-Channel Social">Multi-Channel Social</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            >
              <option value="9:16 (Vertical)">9:16 (Vertical)</option>
              <option value="16:9 (Landscape)">16:9 (Landscape)</option>
              <option value="1:1 (Square)">1:1 (Square)</option>
              <option value="4:5 (Portrait)">4:5 (Portrait)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Duration / Dims
            </label>
            <input
              type="text"
              value={durationOrDimensions}
              onChange={(e) => setDurationOrDimensions(e.target.value)}
              placeholder="e.g. 15-30s or 4K"
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>

        {/* Row 5: Budget, Deadline, Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Budget Range <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              placeholder="e.g. $1,500 - $3,000"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white ${
                errors.budgetRange ? 'border-rose-300 ring-1 ring-rose-500' : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {errors.budgetRange && <p className="text-[11px] text-rose-500 mt-0.5">{errors.budgetRange}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deadline Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:bg-white ${
                errors.deadline ? 'border-rose-300 ring-1 ring-rose-500' : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {errors.deadline && <p className="text-[11px] text-rose-500 mt-0.5">{errors.deadline}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred AI Tools (Comma separated)
            </label>
            <input
              type="text"
              value={preferredToolsInput}
              onChange={(e) => setPreferredToolsInput(e.target.value)}
              placeholder="Runway Gen-3, Kling AI, Midjourney v6"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>

        {/* Row 6: Deliverables */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deliverables Checklist <span className="text-rose-500">*</span>
          </label>
          <div className="space-y-1.5 mb-2">
            {deliverables.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDeliverable(idx)}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                  aria-label="Remove deliverable"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              placeholder="Add specific deliverable format (e.g. 1x 15s Hero Cut in 4K ProRes)..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDeliverable();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddDeliverable}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300"
            >
              Add Item
            </button>
          </div>
          {errors.deliverables && (
            <p className="text-[11px] text-rose-500 mt-0.5">{errors.deliverables}</p>
          )}
        </div>

        {/* Row 7: Licensing & Additional Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Licensing & Commercial Rights <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={licensingRequirements}
              onChange={(e) => setLicensingRequirements(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Production Instructions
            </label>
            <textarea
              rows={2}
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Color palette notes, negative prompt constraints, milestone cadence..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              Publish Brief (Open)
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
