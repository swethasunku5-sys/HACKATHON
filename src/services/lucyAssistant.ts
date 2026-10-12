import { Creator, AssistantAction, AssistantMessage, NavTab } from '../types';

export interface LucyChatResponse {
  text: string;
  mode: 'gemini_api' | 'demo_local';
  actions?: AssistantAction[];
  suggestedPrompts?: string[];
  recommendedCreators?: Creator[];
}

export const LucyAssistantService = {
  async sendMessage(
    message: string,
    history: AssistantMessage[],
    currentTab: NavTab,
    creators: Creator[]
  ): Promise<LucyChatResponse> {
    const trimmed = message.trim().toLowerCase();

    // 1. Try server-side Gemini endpoint first
    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: history.slice(-6).map((h) => ({ sender: h.sender, text: h.text })),
          currentTab,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.mode === 'gemini_api' && json.data) {
          const geminiData = json.data;
          const actions: AssistantAction[] = [];

          if (geminiData.primaryAction) {
            actions.push({
              id: 'gemini-act-1',
              label: geminiData.primaryAction.label || 'Take Action',
              actionType: geminiData.primaryAction.actionType || 'navigate',
              targetTab: geminiData.primaryAction.targetTab,
              specialization: geminiData.primaryAction.filter,
            });
          }

          // Check if any creator was mentioned to attach interactive cards
          const matchedCreators = creators.filter((c) =>
            geminiData.text.toLowerCase().includes(c.name.toLowerCase()) ||
            geminiData.text.toLowerCase().includes(c.handle.toLowerCase())
          ).slice(0, 2);

          return {
            text: geminiData.text,
            mode: 'gemini_api',
            actions: actions.length > 0 ? actions : undefined,
            suggestedPrompts: geminiData.suggestedPrompts || [
              'Find creators in Video & Animation',
              'How do I build an AI Brief?',
              'Show me shortlisted talent',
            ],
            recommendedCreators: matchedCreators.length > 0 ? matchedCreators : undefined,
          };
        }
      }
    } catch (e) {
      console.warn('Lucy Assistant falling back to local engine:', e);
    }

    // 2. High-fidelity rule-based knowledge engine (Certified demo fallback)
    return this.generateLocalResponse(trimmed, message, currentTab, creators);
  },

  generateLocalResponse(
    trimmed: string,
    rawMessage: string,
    currentTab: NavTab,
    creators: Creator[]
  ): LucyChatResponse {
    // A. Creator Discovery & Filtering Queries
    if (
      trimmed.includes('find creator') ||
      trimmed.includes('discover') ||
      trimmed.includes('roster') ||
      trimmed.includes('hire') ||
      trimmed.includes('who can') ||
      trimmed.includes('artist') ||
      trimmed.includes('talent')
    ) {
      if (trimmed.includes('video') || trimmed.includes('runway') || trimmed.includes('kling') || trimmed.includes('fashion')) {
        const matches = creators.filter((c) => c.specialization === 'Video & Animation');
        return {
          text: `### Top Video & Cinematic AI Directors\n\nI recommend reviewing **Elena Rostova** for luxury cinematic films (Runway Gen-3, Kling AI) and **Sofia Chen** for viral short-form social video. Both pass platform pipeline reproducibility audits.\n\n*Note: Sample creator profiles and metrics are simulated for evaluation.*`,
          mode: 'demo_local',
          recommendedCreators: matches.slice(0, 2),
          actions: [
            {
              id: 'act-filter-video',
              label: 'Filter: Video & Animation',
              actionType: 'filter_creators',
              targetTab: 'discover',
              specialization: 'Video & Animation',
            },
            {
              id: 'act-view-portfolio-video',
              label: 'View Video Portfolio Pieces',
              actionType: 'navigate',
              targetTab: 'portfolio',
            },
          ],
          suggestedPrompts: [
            'Who does 3D motion design?',
            'How do I create a brief for a video campaign?',
            'What are Elena Rostova’s rates?',
          ],
        };
      }

      if (trimmed.includes('product') || trimmed.includes('e-commerce') || trimmed.includes('packshot') || trimmed.includes('comfyui')) {
        const matches = creators.filter((c) => c.specialization === 'Brand Identity & Ads');
        return {
          text: `### E-Commerce & Product Generative Specialists\n\n**Marcus Thorne** (@thorne_comfyui) specializes in locked-color, high-volume product catalogs using ComfyUI and Flux.1 Pro. His workflows support 500+ on-model variants with audited Pantone color consistency.\n\n*Simulated creator profile with reproducible node graphs.*`,
          mode: 'demo_local',
          recommendedCreators: matches.slice(0, 2),
          actions: [
            {
              id: 'act-filter-product',
              label: 'Filter: Brand Identity & Ads',
              actionType: 'filter_creators',
              targetTab: 'discover',
              specialization: 'Brand Identity & Ads',
            },
            {
              id: 'act-view-marcus',
              label: 'View Marcus Thorne Profile',
              actionType: 'view_creator',
              creatorId: 'creator-2',
            },
          ],
          suggestedPrompts: [
            'Inspect ComfyUI pipeline audit details',
            'Draft a brief for product stills',
            'Find audio creators for commercials',
          ],
        };
      }

      if (trimmed.includes('3d') || trimmed.includes('spatial') || trimmed.includes('luma') || trimmed.includes('blender')) {
        const matches = creators.filter((c) => c.specialization === '3D & Motion');
        return {
          text: `### 3D Spatial & Motion Creators\n\n**Aoi Tanaka** (@aoi_spatial3d) creates zero-g kinetic loops and product orbit turntables using Luma Dream Machine, Gaussian Splatting, and Blender AI proxies.\n\n*Simulated showcase profile with verified frame loop consistency.*`,
          mode: 'demo_local',
          recommendedCreators: matches.slice(0, 1),
          actions: [
            {
              id: 'act-filter-3d',
              label: 'Filter: 3D & Motion',
              actionType: 'filter_creators',
              targetTab: 'discover',
              specialization: '3D & Motion',
            },
            {
              id: 'act-view-portfolio-3d',
              label: 'Open Zenith Orbital in Lightbox',
              actionType: 'view_portfolio',
              portfolioId: 'port-4',
            },
          ],
          suggestedPrompts: ['Show me all 3D assets', 'How does commercial licensing work?', 'Who does audio anthems?'],
        };
      }

      if (trimmed.includes('audio') || trimmed.includes('music') || trimmed.includes('voice') || trimmed.includes('sound')) {
        const matches = creators.filter((c) => c.specialization === 'Audio & Music');
        return {
          text: `### Generative Audio & Sonic Directors\n\n**Devon Vance** (@devon_sonics) composes copyright-cleared commercial scores and voice clones using Suno v3.5, Udio v1.5, and ElevenLabs. Includes stem separation and broadcast mastering.\n\n*Simulated showcase profile with cleared stem guarantees.*`,
          mode: 'demo_local',
          recommendedCreators: matches.slice(0, 1),
          actions: [
            {
              id: 'act-filter-audio',
              label: 'Filter: Audio & Music',
              actionType: 'filter_creators',
              targetTab: 'discover',
              specialization: 'Audio & Music',
            },
          ],
          suggestedPrompts: ['Listen to Neon Horizon audio piece', 'Start campaign with Devon Vance', 'View talent shortlist'],
        };
      }

      // General discovery response
      return {
        text: `### Creator Discovery Roster\n\nCreatorConnect features 8 verified AI talent profiles across 6 specialized disciplines: Video & Animation, 3D & Motion, Product Packshots, Generative Audio, VFX & Compositing, and Concept Art.\n\nYou can filter by **Niche**, **Primary Platform**, **Tools**, and **Budget Range** in the Discover Creators directory.`,
        mode: 'demo_local',
        actions: [
          {
            id: 'act-goto-discover',
            label: 'Open Discover Creators',
            actionType: 'navigate',
            targetTab: 'discover',
          },
          {
            id: 'act-goto-shortlist',
            label: 'View Shortlisted Talent',
            actionType: 'navigate',
            targetTab: 'shortlist',
          },
        ],
        suggestedPrompts: [
          'Find luxury video creators',
          'Who works with ComfyUI and Flux?',
          'What are the typical project rates?',
        ],
      };
    }

    // B. AI Brief Building & Campaign Planning
    if (
      trimmed.includes('brief') ||
      trimmed.includes('campaign') ||
      trimmed.includes('builder') ||
      trimmed.includes('draft') ||
      trimmed.includes('prompt recipe')
    ) {
      return {
        text: `### Campaign Briefing & AI Brief Builder\n\nYou can craft campaigns in two quick ways:\n\n1. **AI Brief Builder**: Type in a rough concept (e.g., *"Futuristic sneaker drop for Gen-Z runners"*), and Gemini / our generative engine automatically structures technical deliverables, recommended AI tools, suggested pipelines, and budget guidance.\n2. **Standard Brief**: Manually specify brand constraints, deliverables, and commercial buyout terms.`,
        mode: 'demo_local',
        actions: [
          {
            id: 'act-open-ai-builder',
            label: 'Open AI Brief Builder',
            actionType: 'open_ai_brief_builder',
            targetTab: 'ai-builder',
          },
          {
            id: 'act-open-new-brief',
            label: 'Create Custom Brief Form',
            actionType: 'open_create_brief',
          },
          {
            id: 'act-view-briefs',
            label: 'Manage Existing Briefs',
            actionType: 'navigate',
            targetTab: 'briefs',
          },
        ],
        suggestedPrompts: [
          'Draft a brief for a fashion teaser',
          'What tools are best for vertical video?',
          'How do milestone deliverables work?',
        ],
      };
    }

    // C. Portfolio & Lightbox Inquiries
    if (
      trimmed.includes('portfolio') ||
      trimmed.includes('gallery') ||
      trimmed.includes('lightbox') ||
      trimmed.includes('asset') ||
      trimmed.includes('sample work')
    ) {
      return {
        text: `### AI Portfolio & Asset Showcase\n\nThe **Portfolio Feed** displays high-resolution generative deliverables across 9:16 vertical video, 16:9 widescreen, and 1:1 formats. Each piece includes full **prompt blueprints**, **production pipeline notes**, and **commercial clearance licenses** that you can inspect in the interactive lightbox modal.`,
        mode: 'demo_local',
        actions: [
          {
            id: 'act-goto-portfolio',
            label: 'Explore Portfolio Showcase',
            actionType: 'navigate',
            targetTab: 'portfolio',
          },
        ],
        suggestedPrompts: [
          'Show me video motion pieces',
          'Who created Aura Nera?',
          'Can I copy prompt recipes?',
        ],
      };
    }

    // D. Engagements & Project Management
    if (
      trimmed.includes('engagement') ||
      trimmed.includes('contract') ||
      trimmed.includes('pipeline') ||
      trimmed.includes('stage') ||
      trimmed.includes('production')
    ) {
      return {
        text: `### Engagements & Campaign Pipeline\n\nTrack your active collaborations from **Discovery** through **Briefing**, **Proposal**, **In Production**, **Review**, and **Delivered**. Each engagement includes interactive deliverable milestone checkboxes, budget tracking, and direct project notes.`,
        mode: 'demo_local',
        actions: [
          {
            id: 'act-goto-engagements',
            label: 'Open Engagements Pipeline',
            actionType: 'navigate',
            targetTab: 'engagements',
          },
          {
            id: 'act-start-new-engagement',
            label: 'Start New Engagement',
            actionType: 'open_new_engagement',
          },
        ],
        suggestedPrompts: [
          'How do I advance an engagement stage?',
          'Where do I add milestone notes?',
          'View my shortlisted talent',
        ],
      };
    }

    // E. Verification & Trust Signals
    if (
      trimmed.includes('verify') ||
      trimmed.includes('verification') ||
      trimmed.includes('rubric') ||
      trimmed.includes('provenance') ||
      trimmed.includes('audit') ||
      trimmed.includes('license')
    ) {
      return {
        text: `### Verification & Commercial Clearance Audit\n\nCreatorConnect evaluates AI talent across four verification pillars:\n\n- **Model Pipeline Audit**: Validates fixed seed consistency and multi-model handoffs.\n- **Temporal & Artifact Review**: Checks jitter, face degradation, and resolution standards.\n- **Commercial Provenance**: Clears model training terms, LoRA licensing, and IP compliance.\n- **Repeatability Index**: Ensures deliverables can be accurately reproduced for revisions.\n\n*All verification badges in this sandbox are demo audit simulations.*`,
        mode: 'demo_local',
        actions: [
          {
            id: 'act-goto-verification',
            label: 'View Verification Signals',
            actionType: 'navigate',
            targetTab: 'verification',
          },
          {
            id: 'act-goto-rubric',
            label: 'Inspect 100-Point Rubric',
            actionType: 'navigate',
            targetTab: 'evaluation',
          },
        ],
        suggestedPrompts: [
          'What is the 100-point rubric breakdown?',
          'Do creators sign commercial buyouts?',
          'How do I shortlist verified talent?',
        ],
      };
    }

    // F. Workspace & Settings
    if (
      trimmed.includes('setting') ||
      trimmed.includes('workspace') ||
      trimmed.includes('currency') ||
      trimmed.includes('brand') ||
      trimmed.includes('company') ||
      trimmed.includes('profile')
    ) {
      return {
        text: `### Workspace & Brand Settings\n\nCustomize your brand identity, contact manager name, industry category, notification alerts, and preferred billing currency (USD, EUR, GBP, CAD, AUD, JPY). Changes persist across sessions in local storage.`,
        mode: 'demo_local',
        actions: [
          {
            id: 'act-goto-settings',
            label: 'Open Workspace Settings',
            actionType: 'navigate',
            targetTab: 'settings',
          },
        ],
        suggestedPrompts: [
          'Change default currency to EUR',
          'How do I reset demo data?',
          'Return to Dashboard overview',
        ],
      };
    }

    // G. Help & Troubleshooting
    if (
      trimmed.includes('help') ||
      trimmed.includes('how to') ||
      trimmed.includes('guide') ||
      trimmed.includes('start') ||
      trimmed.includes('tutorial')
    ) {
      return {
        text: `### Quick Starter Guide for CreatorConnect AI\n\n1. **Discover Talent**: Browse the roster, filter by niche or generative tool, and bookmark creators to your Shortlist.\n2. **Generate or Post a Brief**: Use the AI Brief Builder to draft commercial briefs with locked KPIs and budgets.\n3. **Initiate an Engagement**: Click **Contact** or **Start Engagement** to commission work into your production pipeline.\n4. **Inspect Portfolio Recipes**: Browse full prompt blueprints and technical specs in the Portfolio Lightbox.\n\nHow can I help you right now?`,
        mode: 'demo_local',
        actions: [
          {
            id: 'act-quick-discover',
            label: 'Find Creators',
            actionType: 'navigate',
            targetTab: 'discover',
          },
          {
            id: 'act-quick-builder',
            label: 'Build AI Brief',
            actionType: 'open_ai_brief_builder',
            targetTab: 'ai-builder',
          },
          {
            id: 'act-quick-dashboard',
            label: 'Back to Dashboard',
            actionType: 'navigate',
            targetTab: 'dashboard',
          },
        ],
        suggestedPrompts: [
          'Find top fashion video directors',
          'Help me create a sneaker campaign brief',
          'Inspect the 100-point rubric',
        ],
      };
    }

    // Default polite response
    return {
      text: `Hello! I'm **Lucy**, your AI talent and campaign advisor at CreatorConnect AI.\n\nI can help you discover specialist AI creators, filter by niche or tool, craft production-ready campaign briefs, explore generative portfolios, and manage your pipeline.\n\nWhat would you like to do next?`,
      mode: 'demo_local',
      actions: [
        {
          id: 'act-def-discover',
          label: 'Find Creators',
          actionType: 'navigate',
          targetTab: 'discover',
        },
        {
          id: 'act-def-ai-builder',
          label: 'Build AI Brief',
          actionType: 'open_ai_brief_builder',
          targetTab: 'ai-builder',
        },
        {
          id: 'act-def-portfolio',
          label: 'View Portfolio',
          actionType: 'navigate',
          targetTab: 'portfolio',
        },
      ],
      suggestedPrompts: [
        'Find creators in Video & Animation',
        'How do I create an AI campaign brief?',
        'Who specializes in ComfyUI product photos?',
        'Explain creator verification signals',
      ],
    };
  },
};
