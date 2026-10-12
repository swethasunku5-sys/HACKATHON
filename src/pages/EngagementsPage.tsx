import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  ArrowRight,
  Filter,
  Check,
  ChevronDown,
  Layers,
  Trash2,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { Engagement, EngagementStage } from '../types';

interface EngagementsPageProps {
  engagements: Engagement[];
  onUpdateStage: (id: string, stage: EngagementStage) => void;
  onToggleDeliverable: (engagementId: string, deliverableId: string) => void;
  onOpenNewEngagement: () => void;
  onDeleteEngagement?: (id: string) => void;
  onUpdateEngagementNotes?: (id: string, notes: string) => void;
}

const STAGES: { id: EngagementStage; label: string; desc: string }[] = [
  { id: 'discovery', label: 'Discovery', desc: 'Initial creator fit & scope alignment' },
  { id: 'briefing', label: 'Briefing', desc: 'Brief handover & creative direction' },
  { id: 'proposal', label: 'Proposal', desc: 'Commercial agreement & test keyframes' },
  { id: 'in_production', label: 'In Production', desc: 'Generative synthesis & iterations' },
  { id: 'review', label: 'Review & Revisions', desc: 'Color grading & brand sign-off' },
  { id: 'delivered', label: 'Delivered', desc: '4K masters & seed manifest transferred' },
];

export const EngagementsPage: React.FC<EngagementsPageProps> = ({
  engagements,
  onUpdateStage,
  onToggleDeliverable,
  onOpenNewEngagement,
  onDeleteEngagement,
  onUpdateEngagementNotes,
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<'all' | EngagementStage>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [editedNotesValue, setEditedNotesValue] = useState<string>('');

  const filteredEngagements = engagements.filter((eng) => {
    if (selectedStageFilter !== 'all' && eng.stage !== selectedStageFilter) {
      return false;
    }
    return true;
  });

  const getStageIndex = (stage: EngagementStage) => {
    return STAGES.findIndex((s) => s.id === stage);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Talent Engagements Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track contracts, generative production stages, milestone sign-offs, and final asset deliveries
          </p>
        </div>

        <button
          onClick={onOpenNewEngagement}
          className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Engagement</span>
        </button>
      </div>

      {/* Stage Progression Filter Ribbon */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[650px]">
          <button
            onClick={() => setSelectedStageFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedStageFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Stages ({engagements.length})
          </button>

          {STAGES.map((st) => {
            const count = engagements.filter((e) => e.stage === st.id).length;
            const isSelected = selectedStageFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStageFilter(st.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-mono rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Engagements List */}
      {filteredEngagements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            No engagements in this stage
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Start a new engagement by assigning a creative brief to a shortlisted creator.
          </p>
          <button
            onClick={onOpenNewEngagement}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
          >
            Create New Engagement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEngagements.map((eng) => {
            const currentIdx = getStageIndex(eng.stage);
            const completedCount = eng.deliverables.filter((d) => d.completed).length;

            return (
              <div
                key={eng.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 uppercase">
                        {eng.brand}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span className="text-xs font-medium text-indigo-600">
                        {eng.creatorSpecialization}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {eng.briefTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Creator Partner: <strong className="text-slate-900">{eng.creatorName}</strong>
                    </p>
                  </div>

                  {/* Stage Dropdown Selector & Delete button */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Stage:</span>
                    <select
                      value={eng.stage}
                      onChange={(e) => onUpdateStage(eng.id, e.target.value as EngagementStage)}
                      className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    {onDeleteEngagement && (
                      <button
                        onClick={() => onDeleteEngagement(eng.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1"
                        title="Delete Engagement"
                        aria-label="Delete Engagement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Pipeline Stepper */}
                <div className="hidden md:grid grid-cols-6 gap-2 pt-1">
                  {STAGES.map((st, i) => {
                    const isDone = i < currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                      <div
                        key={st.id}
                        onClick={() => onUpdateStage(eng.id, st.id)}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                            : isDone
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                        title={st.desc}
                      >
                        <span className="text-[10px] font-mono block">
                          Step 0{i + 1}
                        </span>
                        <span className="text-xs font-semibold block truncate">
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Deliverables checklist & commercial strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Deliverables check items */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">
                        Production Deliverables & Milestones
                      </span>
                      <span className="font-mono">
                        {completedCount} / {eng.deliverables.length} Completed
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {eng.deliverables.map((task) => (
                        <label
                          key={task.id}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer text-xs transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleDeliverable(eng.id, task.id)}
                            className="w-3.5 h-3.5 text-indigo-600 rounded"
                          />
                          <span
                            className={
                              task.completed
                                ? 'text-slate-400 line-through'
                                : 'text-slate-800 font-medium'
                            }
                          >
                            {task.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Commercial summary & notes */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Milestone Budget & Target
                      </span>
                      <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                        {eng.budget}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Deadline: {eng.deadline}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Production Notes
                        </span>
                        {onUpdateEngagementNotes && editingNotesId !== eng.id && (
                          <button
                            onClick={() => {
                              setEditingNotesId(eng.id);
                              setEditedNotesValue(eng.notes);
                            }}
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>

                      {editingNotesId === eng.id ? (
                        <div className="space-y-1.5 mt-1">
                          <textarea
                            rows={3}
                            value={editedNotesValue}
                            onChange={(e) => setEditedNotesValue(e.target.value)}
                            className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-200 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                if (onUpdateEngagementNotes) {
                                  onUpdateEngagementNotes(eng.id, editedNotesValue);
                                }
                                setEditingNotesId(null);
                              }}
                              className="px-2.5 py-1 text-[11px] text-white bg-indigo-600 hover:bg-indigo-700 rounded font-medium flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 mt-1 leading-relaxed">
                          {eng.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
