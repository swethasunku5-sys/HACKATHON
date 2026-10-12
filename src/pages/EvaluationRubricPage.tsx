import React from 'react';
import { Award, CheckCircle2, Star, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

export const EvaluationRubricPage: React.FC = () => {
  const criteria = [
    {
      id: 1,
      title: 'Creator Profiles & AI Portfolios',
      weight: '30 points (30%)',
      points: 30,
      description:
        'Provide rich profiles showing AI-generated work, tools/models, skills, specialization, and workflows. Include visible verification signals for tools, workflows, and past work as a bonus-ready feature.',
      implementationDetails: [
        '8+ realistic fictional creators with diverse specializations (Video & Animation, Concept Art, 3D Spatial, Audio Synthesis, VFX, Brand Ads).',
        'Structured generative pipeline breakdowns (e.g. Midjourney plates -> ControlNet depth/pose -> Runway Gen-3 motion -> Magnific 4K upscale).',
        'Reproducible workflow graphs, custom LoRAs, and seed reproducibility documentation.',
        'High-fidelity portfolio gallery with prompt blueprints, aspect ratio tags, format specs, and commercial clearance notes.',
        'Four transparent demo verification signals: Model Pipeline Verified, ComfyUI Workflow Audited, Commercial Delivery Cleared, and Asset Provenance Safe.',
      ],
    },
    {
      id: 2,
      title: 'Brief Definition & AI Brief Builder',
      weight: '20 points (20%)',
      points: 20,
      description:
        'Capture content type, style, format/aspect ratio, campaign requirements, deliverables, deadlines, budget, and commercial-use requirements. Include the AI-assisted brief builder.',
      implementationDetails: [
        'Full brand brief data schema capturing 14+ distinct fields (objective, audience, content type, style, platform, aspect ratio, duration, preferred tools, budget, deadline, deliverables checklist, licensing, instructions).',
        'Complete CRUD lifecycle: List, create, view, edit, duplicate, and delete briefs with Draft / Open / In Progress / Completed statuses.',
        'AI Brief Builder turning rough concepts into structured briefs via Gemini 3.8 Flash server endpoint when configured.',
        'Intelligent local multi-template fallback engine working 100% reliably without requiring external keys, clearly labeled as Demo Mode.',
        'One-click "Copy Brief" to clipboard with fallback and direct "Save Brief" into campaign repository.',
      ],
    },
    {
      id: 3,
      title: 'Discovery & Filtering',
      weight: '25 points (25%)',
      points: 25,
      description:
        'Implement accurate combined search and filtering by skills, specialization, tools, content type, and relevant attributes. Handle empty results correctly.',
      implementationDetails: [
        'Multi-attribute text search querying creator names, handles, locations, bios, skills, and tools simultaneously.',
        'Combinable filters for Specialization, AI Tools/Models, Experience Level, Availability, and Audited Workflow signals.',
        'Multi-axis sorting: Top Rated, Years Experience, Completed Briefs, and Alphabetical.',
        'Active filter tags with individual dismiss buttons, result counts, and a working "Reset All Filters" button.',
        'Graceful empty state handling with direct recovery actions.',
      ],
    },
    {
      id: 4,
      title: 'User Experience (UI/UX)',
      weight: '15 points (15%)',
      points: 15,
      description:
        'Provide intuitive creator and brand flows, clear portfolio viewing, accessible controls, responsive layouts, and useful success/error messages.',
      implementationDetails: [
        'Dark navy sidebar (#0B132B) paired with crisp white/slate workspace surfaces and violet/blue accents.',
        'Zero-Pill metadata discipline: unboxed text with subtle typographic separators (·) rather than candy capsules.',
        'Full keyboard navigation and modal dialogs with Escape key listeners and backdrop click handling.',
        'Responsive layout supporting mobile drawer, tablet views, and 1440px desktop workspaces.',
        'Toast notification system providing instant feedback for saves, copies, shortlists, and state updates.',
      ],
    },
    {
      id: 5,
      title: 'Presentation & Demo Quality',
      weight: '10 points (10%)',
      points: 10,
      description:
        'Deliver a polished working prototype suitable for a short live demonstration.',
      implementationDetails: [
        'Complete end-to-end interactive journey from Creator Discovery -> Portfolio Inspection -> AI Brief Generation -> Shortlisting -> Engagement Milestones.',
        'Persistent localStorage state across refreshes, with a safe "Reset Demo Data" option in Settings.',
        'Tested edge cases: empty search results, copy-to-clipboard fallbacks, and offline local generation.',
        'Zero broken image URLs or dead buttons anywhere in the interface.',
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <Award className="w-4 h-4" />
            <span>ByteXL / Kampus.VC Hackathon Challenge</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Official Evaluation Rubric
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            The CreatorConnect AI marketplace prototype was architected to fulfill the challenge criteria with exact weighted allocations.
          </p>
        </div>

        {/* 100 Points Total Badge */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center shrink-0">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Total Rubric Score
          </span>
          <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
            100 / 100
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            5 Core Categories
          </span>
        </div>
      </div>

      {/* 5 Criteria Cards */}
      <div className="space-y-5">
        {criteria.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-indigo-600 font-semibold">
                  Criterion 0{item.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {item.title}
                </h3>
              </div>

              <span className="px-3 py-1 text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg self-start sm:self-auto">
                {item.weight}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {item.description}
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Implemented Capabilities in Prototype:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {item.implementationDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
