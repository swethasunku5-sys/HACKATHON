import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    app: 'CreatorConnect AI',
    geminiConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// Server-side AI brief generation endpoint
app.post('/api/generate-brief', async (req, res) => {
  try {
    const { roughIdea, targetAudience, preferredContentType, brandName } = req.body;

    if (!roughIdea || typeof roughIdea !== 'string' || !roughIdea.trim()) {
      return res.status(400).json({ error: 'A rough campaign idea is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isKeyValid = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0;

    if (!isKeyValid) {
      // Clean disclosure when API key is unconfigured
      return res.status(200).json({
        mode: 'demo_fallback',
        message: 'No server-side Gemini API key configured. Utilizing certified local template generator.',
        usedLocalFallback: true,
      });
    }

    // Call modern GoogleGenAI SDK with gemini-3.8-flash
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const promptText = `
You are a senior creative director and AI content production supervisor at CreatorConnect AI.
Convert the following rough campaign idea into a comprehensive, production-grade creative brief for AI content creators.

Brand/Company Name: ${brandName || 'Brand Partner'}
Rough Idea / Campaign Vision: "${roughIdea}"
Target Audience Hint: "${targetAudience || 'General commercial audience'}"
Preferred Content Type Hint: "${preferredContentType || 'Video or Visual'}"

Return ONLY a valid JSON object with the following exact keys and structure:
{
  "title": "Concise, punchy campaign title (under 8 words)",
  "brand": "${brandName || 'Brand Partner'}",
  "campaignObjective": "Clear 2-sentence description of the campaign goal, conversion focus, and brand positioning",
  "targetAudience": "Specific demographic, psychographic, and platform user persona profile",
  "contentType": "Short-Form Video | Cinematic Video | 3D Animation | Photorealistic Stills | Audio & Voiceover | Generative AR Asset",
  "creativeStyle": "Specific aesthetic direction (e.g., Cyberpunk Surrealism, Scandinavian Minimalist, Hyper-Tactile Macro, 90s Retro Futurism)",
  "platform": "TikTok & Reels | YouTube | Instagram | Digital Out-of-Home | Web & Social",
  "aspectRatio": "9:16 (Vertical) | 16:9 (Landscape) | 1:1 (Square) | 4:5 (Portrait)",
  "durationOrDimensions": "e.g., '15-30 seconds' or '4K 3840x2160 stills'",
  "preferredTools": ["Array of recommended AI models/tools, e.g., Runway Gen-3 Alpha, Midjourney v6, Flux.1 Pro, Kling AI, ComfyUI, ElevenLabs"],
  "deliverables": [
    "Deliverable item 1 with format details",
    "Deliverable item 2 with variations/cuts",
    "Project files and prompt recipes"
  ],
  "suggestedWorkflow": "Step-by-step generative pipeline recommendation (e.g., Midjourney hero plate generation -> ControlNet pose lock -> Runway Gen-3 Alpha motion synthesis -> Davinci Resolve audio sync)",
  "budgetRange": "$1,500 - $3,500",
  "deadline": "2-3 weeks from kick-off",
  "licensingRequirements": "Full commercial buyout, digital and social advertising rights, worldwide perpetuity",
  "successCriteria": [
    "KPI 1 (e.g., High visual retention & hook rate in first 3s)",
    "KPI 2 (e.g., Consistent brand color grading and product geometry fidelity)",
    "KPI 3 (e.g., 100% commercially cleared AI audio and visual assets)"
  ],
  "additionalInstructions": "Notes on safety filters, reference boards, and revision milestone checkpoints."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text?.trim() || '{}';
    let briefData;
    try {
      briefData = JSON.parse(outputText);
    } catch {
      // Fallback if parsing failed
      return res.status(200).json({
        mode: 'demo_fallback',
        message: 'AI response was not valid JSON. Utilizing certified local template generator.',
        usedLocalFallback: true,
      });
    }

    return res.status(200).json({
      mode: 'gemini_api',
      message: 'Brief generated successfully via Gemini 3.8 Flash.',
      brief: briefData,
      usedLocalFallback: false,
    });
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    return res.status(200).json({
      mode: 'demo_fallback',
      message: `Gemini API encountered an issue (${error.message || 'Error'}). Switched to reliable local generator.`,
      usedLocalFallback: true,
    });
  }
});

// Server-side Lucy Chatbot Assistant endpoint
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, history, currentTab } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isKeyValid = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0;

    if (!isKeyValid) {
      return res.status(200).json({
        mode: 'demo_fallback',
        message: 'No server-side Gemini API key configured. Operating in high-fidelity local assistant mode.',
        usedLocalFallback: true,
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const conversationContext = Array.isArray(history)
      ? history
          .slice(-6)
          .map((h: any) => `${h.sender === 'user' ? 'User' : 'Lucy'}: ${h.text}`)
          .join('\n')
      : '';

    const systemPrompt = `
You are Lucy, the dedicated AI talent advisor and campaign assistant for CreatorConnect AI.
CreatorConnect AI is a marketplace connecting marketing agencies and brands with AI creators (directors, animators, 3D artists, prompt architects, sound designers).
Current active user tab: ${currentTab || 'dashboard'}.

Available App Destinations:
- 'discover': Discover Creators roster with niche, platform, rate, and model filters
- 'briefs': Brand Creative Briefs management
- 'ai-builder': AI Brief Builder (generates full briefs from rough ideas)
- 'portfolio': AI Portfolio Feed & interactive asset lightbox gallery
- 'shortlist': Saved/Shortlisted creator talent
- 'engagements': Engagements & campaign milestone pipeline
- 'verification': Verification Signals (audited workflows, reproducible seeds, commercial clearance)
- 'settings': Workspace profile, brand details, currency, notifications
- 'evaluation': Evaluation Rubric (100-point rubric breakdown)

Sample Platform Roster creators:
- Elena Rostova (@elena_synthart): Luxury fashion & cinematic video (Runway Gen-3, Kling AI, Midjourney)
- Marcus Thorne (@thorne_comfyui): High-volume e-commerce product packshots (Flux.1 Pro, ComfyUI, ControlNet)
- Aoi Tanaka (@aoi_spatial3d): Zero-G 3D loops & spatial motion (Luma Dream Machine, Blender)
- Devon Vance (@devon_sonics): Commercial soundscapes & voice clones (Suno, Udio, ElevenLabs)
- Zara Al-Mansoor (@zara_surrealvfx): Fluid dynamics & surreal beauty VFX (Stable Video Diffusion)
- Kaelen Miller (@kaelen_concept): Sci-fi & gaming worldbuilding concept art (Flux.1 Pro, Photoshop)
- Sofia Chen (@sofia_shortform): Viral 90s/retro TikTok & Reels video (Kling AI, CapCut)
- Mateo Morales (@mateo_generative): Generative brand identity systems & sref codes (Midjourney, Flux.1)

Guidelines:
- Keep responses friendly, sharp, insightful, and concise (2-4 short paragraphs or bulleted list).
- Remind users that all creator profiles in this preview are simulated demo showcases with verified sample workflow specs.
- Suggest a concrete next action in the app whenever relevant.
- Return ONLY valid JSON in this structure:
{
  "text": "Your helpful response in Markdown",
  "suggestedPrompts": ["Next query 1", "Next query 2", "Next query 3"],
  "primaryAction": {
    "actionType": "navigate" | "open_ai_brief_builder" | "open_create_brief" | "filter_creators" | "open_new_engagement",
    "label": "Button label (e.g. 'Open AI Brief Builder' or 'Explore Video Creators')",
    "targetTab": "discover" | "ai-builder" | "briefs" | "portfolio" | "shortlist" | "engagements" | "verification" | "settings",
    "filter": "Video & Animation" (optional)
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `
${systemPrompt}

Prior Conversation:
${conversationContext}

User's Latest Message:
"${message}"
`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(outputText);
    } catch {
      return res.status(200).json({
        mode: 'demo_fallback',
        message: 'Could not parse AI JSON output. Fallback to local engine.',
        usedLocalFallback: true,
      });
    }

    return res.status(200).json({
      mode: 'gemini_api',
      message: 'Lucy response generated via Gemini 3.8 Flash.',
      data,
      usedLocalFallback: false,
    });
  } catch (error: any) {
    console.error('Lucy assistant error:', error);
    return res.status(200).json({
      mode: 'demo_fallback',
      message: `Gemini API issue (${error.message || 'Error'}). Operating in local assistant mode.`,
      usedLocalFallback: true,
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorConnect AI running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
