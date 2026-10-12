export type NavTab =
  | 'dashboard'
  | 'discover'
  | 'briefs'
  | 'ai-builder'
  | 'portfolio'
  | 'shortlist'
  | 'engagements'
  | 'verification'
  | 'settings'
  | 'evaluation';

export type CreatorSpecialization =
  | 'Video & Animation'
  | 'Concept Art & Stills'
  | '3D & Motion'
  | 'Brand Identity & Ads'
  | 'Audio & Music'
  | 'VFX & Compositing';

export type ExperienceLevel = 'Senior (4+ yrs)' | 'Specialist (2-4 yrs)' | 'Rising Star (1-2 yrs)';
export type AvailabilityStatus = 'Available Now' | 'Available in 1-2 Weeks' | 'Booked until next month';

export interface VerificationSignals {
  modelPipelineVerified: boolean;
  workflowAudited: boolean;
  commercialDeliveryVerified: boolean;
  provenanceCleared: boolean;
  notes: string;
}

export interface PortfolioItem {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  category: 'Video & Motion' | 'Graphic & Stills' | '3D & Animation' | 'Audio & Sound';
  description: string;
  thumbnailGradient: string;
  accentColor: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  toolsUsed: string[];
  workflowDescription: string;
  format: string;
  commercialLicenseType: 'Full Commercial Buyout' | 'Digital Advertising Rights' | 'Exclusive Brand License';
  promptSnippet: string;
  clientOrContext: string;
  durationOrSize?: string;
  featured?: boolean;
  previewImageUrl?: string;
  mediaType?: 'image' | 'video_still' | 'audio_visualizer';
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  tagline: string;
  avatarInitials: string;
  avatarBg: string;
  avatarUrl?: string;
  coverUrl?: string;
  isSampleProfile?: boolean;
  primaryPlatform?: string;
  location: string;
  bio: string;
  skills: string[];
  specialization: CreatorSpecialization;
  tools: string[];
  contentTypes: string[];
  experienceLevel: ExperienceLevel;
  yearsExperience: number;
  availability: AvailabilityStatus;
  rateRange: string;
  completedBriefsCount: number;
  rating: number;
  reviewsCount: number;
  languages: string[];
  workflowDetails: {
    pipelineSummary: string;
    reproducibilityNotes: string;
    customNodesOrLoras: string;
  };
  licensingTerms: string;
  verifications: VerificationSignals;
  portfolio: PortfolioItem[];
}

export type BriefStatus = 'draft' | 'open' | 'in_progress' | 'completed';

export interface BrandBrief {
  id: string;
  title: string;
  brand: string;
  campaignObjective: string;
  targetAudience: string;
  contentType: string;
  creativeStyle: string;
  platform: string;
  aspectRatio: string;
  durationOrDimensions: string;
  preferredTools: string[];
  budgetRange: string;
  deadline: string;
  deliverables: string[];
  licensingRequirements: string;
  additionalInstructions: string;
  suggestedWorkflow?: string;
  successCriteria?: string[];
  status: BriefStatus;
  createdAt: string;
  updatedAt: string;
  generatedByAI?: boolean;
  aiMode?: 'gemini_api' | 'demo_local';
}

export type EngagementStage =
  | 'discovery'
  | 'briefing'
  | 'proposal'
  | 'in_production'
  | 'review'
  | 'delivered';

export interface DeliverableTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Engagement {
  id: string;
  briefId: string;
  briefTitle: string;
  brand: string;
  creatorId: string;
  creatorName: string;
  creatorSpecialization: string;
  stage: EngagementStage;
  budget: string;
  deadline: string;
  createdAt: string;
  lastUpdated: string;
  deliverables: DeliverableTask[];
  notes: string;
}

export interface UserSettings {
  companyName: string;
  contactName: string;
  email: string;
  role: string;
  industry: string;
  defaultBudgetCurrency: string;
  emailNotifications: boolean;
  newProposalAlerts: boolean;
  theme: 'slate' | 'navy';
}

export interface ActivityEvent {
  id: string;
  type: 'brief_published' | 'creator_shortlisted' | 'engagement_started' | 'engagement_stage_updated' | 'ai_brief_built';
  title: string;
  detail: string;
  timestamp: string;
  linkTab?: string;
}

export type AssistantActionType =
  | 'navigate'
  | 'open_create_brief'
  | 'open_ai_brief_builder'
  | 'open_new_engagement'
  | 'view_creator'
  | 'view_portfolio'
  | 'filter_creators'
  | 'help_guide';

export interface AssistantAction {
  id: string;
  label: string;
  actionType: AssistantActionType;
  targetTab?: string;
  creatorId?: string;
  portfolioId?: string;
  specialization?: string;
  searchFilter?: string;
  description?: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mode?: 'gemini_api' | 'demo_local';
  actions?: AssistantAction[];
  suggestedPrompts?: string[];
  recommendedCreators?: Creator[];
}
