import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Briefcase } from 'lucide-react';
import { Creator, BrandBrief } from '../../types';
import { Modal } from '../common/Modal';

interface ContactCreatorModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  briefs: BrandBrief[];
  onStartEngagement: (creator: Creator, briefId?: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const ContactCreatorModal: React.FC<ContactCreatorModalProps> = ({
  creator,
  isOpen,
  onClose,
  briefs,
  onStartEngagement,
  onSuccessToast,
}) => {
  const [selectedBriefId, setSelectedBriefId] = useState('');
  const [message, setMessage] = useState(
    'Hi, we reviewed your AI portfolio and would love to collaborate on our upcoming campaign. Are you available for a brief alignment call?'
  );
  const [proposedBudget, setProposedBudget] = useState('$2,000');
  const [timeline, setTimeline] = useState('2-3 weeks');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!creator) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessToast(
        `Inquiry logged for ${creator.name}! You can now advance this in the Engagements pipeline.`
      );
      if (selectedBriefId) {
        onStartEngagement(creator, selectedBriefId);
      }
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contact & Engage ${creator.name}`}
      subtitle={`Inquire about ${creator.specialization} projects (${creator.availability})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Creator Snapshot Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div
            className={`w-10 h-10 rounded-lg ${creator.avatarBg} flex items-center justify-center font-bold text-sm shrink-0`}
          >
            {creator.avatarInitials}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-slate-900 truncate">
              {creator.name}
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">
              {creator.rateRange} · {creator.availability}
            </p>
          </div>
        </div>

        {/* Link Brief if available */}
        {briefs.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link Existing Campaign Brief (Optional)
            </label>
            <select
              value={selectedBriefId}
              onChange={(e) => setSelectedBriefId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            >
              <option value="">-- No brief linked (General Inquiry) --</option>
              {briefs.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.budgetRange})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Budget & Timeline */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Budget
            </label>
            <input
              type="text"
              value={proposedBudget}
              onChange={(e) => setProposedBudget(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Delivery
            </label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Message & Inquiry Details
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Demo notice: Inquiries are logged to your internal engagements tracker for milestone management.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Sending...' : 'Send Inquiry & Track'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
