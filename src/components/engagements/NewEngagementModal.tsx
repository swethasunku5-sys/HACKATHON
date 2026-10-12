import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, DollarSign, UserCheck, Layers } from 'lucide-react';
import { Creator, BrandBrief, Engagement } from '../../types';
import { Modal } from '../common/Modal';

interface NewEngagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  creators: Creator[];
  briefs: BrandBrief[];
  preselectedCreatorId?: string;
  preselectedBriefId?: string;
  onCreateEngagement: (data: {
    briefId: string;
    briefTitle: string;
    brand: string;
    creatorId: string;
    creatorName: string;
    creatorSpecialization: string;
    budget: string;
    deadline: string;
    notes?: string;
  }) => void;
}

export const NewEngagementModal: React.FC<NewEngagementModalProps> = ({
  isOpen,
  onClose,
  creators,
  briefs,
  preselectedCreatorId,
  preselectedBriefId,
  onCreateEngagement,
}) => {
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [selectedBriefId, setSelectedBriefId] = useState('');
  const [budget, setBudget] = useState('$2,500');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('Kickoff engagement for generative assets.');
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedCreatorId) {
      setSelectedCreatorId(preselectedCreatorId);
    } else if (creators.length > 0 && !selectedCreatorId) {
      setSelectedCreatorId(creators[0].id);
    }

    if (preselectedBriefId) {
      setSelectedBriefId(preselectedBriefId);
    } else if (briefs.length > 0 && !selectedBriefId) {
      setSelectedBriefId(briefs[0].id);
    }

    // Default deadline 3 weeks
    setDeadline(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  }, [isOpen, preselectedCreatorId, preselectedBriefId, creators, briefs]);

  // Adjust budget estimate when brief changes
  useEffect(() => {
    if (selectedBriefId) {
      const b = briefs.find((item) => item.id === selectedBriefId);
      if (b) {
        setBudget(b.budgetRange.split(' - ')[0] || '$2,000');
        if (b.deadline) setDeadline(b.deadline);
      }
    }
  }, [selectedBriefId, briefs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || !selectedBriefId) {
      setError('Please select both a creator and a campaign brief.');
      return;
    }

    const creator = creators.find((c) => c.id === selectedCreatorId);
    const brief = briefs.find((b) => b.id === selectedBriefId);

    if (!creator || !brief) {
      setError('Invalid creator or brief selection.');
      return;
    }

    onCreateEngagement({
      briefId: brief.id,
      briefTitle: brief.title,
      brand: brief.brand,
      creatorId: creator.id,
      creatorName: creator.name,
      creatorSpecialization: creator.specialization,
      budget: budget.trim() || '$2,000',
      deadline: deadline || brief.deadline,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Talent Engagement"
      subtitle="Connect a shortlisted creator with a creative brief to track production milestones"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Creator Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Assigned AI Creator <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedCreatorId}
            onChange={(e) => setSelectedCreatorId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
          >
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.specialization} ({c.rateRange})
              </option>
            ))}
          </select>
        </div>

        {/* Brief Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Linked Campaign Brief <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedBriefId}
            onChange={(e) => setSelectedBriefId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
          >
            {briefs.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.brand} · {b.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Budget & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Agreed Budget / Milestone Total
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. $2,500"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Delivery Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Production & Kickoff Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special brand guidelines, aspect ratios, revision limits..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
          >
            Initialize Engagement
          </button>
        </div>
      </form>
    </Modal>
  );
};
