import { BrandBrief } from '../types';

export interface GenerationResult {
  brief: Partial<BrandBrief>;
  mode: 'gemini_api' | 'demo_local';
  sourceLabel: string;
  notes: string;
}

export async function generateAIBrief(params: {
  roughIdea: string;
  brandName?: string;
  targetAudienceHint?: string;
  contentTypeHint?: string;
}): Promise<GenerationResult> {
  const { roughIdea, brandName = 'Brand Partner', targetAudienceHint, contentTypeHint } = params;

  // Attempt server-side Gemini API call first
  try {
    const response = await fetch('/api/generate-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roughIdea,
        brandName,
        targetAudience: targetAudienceHint,
        preferredContentType: contentTypeHint,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.mode === 'gemini_api' && data.brief) {
        return {
          brief: {
            ...data.brief,
            brand: data.brief.brand || brandName,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            generatedByAI: true,
            aiMode: 'gemini_api',
          },
          mode: 'gemini_api',
          sourceLabel: 'Gemini 3.8 Flash (Live Server API)',
          notes: 'Generated using server-side Gemini 3.8 Flash model via @google/genai SDK.',
        };
      }
    }
  } catch (err) {
    console.warn('Backend /api/generate-brief unreachable or offline, using certified local generator:', err);
  }

  // Reliable, high-fidelity local generator fallback
  const localBrief = generateLocalTemplateBrief(roughIdea, brandName, targetAudienceHint, contentTypeHint);
  return {
    brief: localBrief,
    mode: 'demo_local',
    sourceLabel: 'Demo Mode (Local Intelligent Generator)',
    notes: 'Generated via local creative heuristics engine. Fully functional without external API key or paid services.',
  };
}

function generateLocalTemplateBrief(
  idea: string,
  brand: string,
  audienceHint?: string,
  contentTypeHint?: string
): Partial<BrandBrief> {
  const lower = idea.toLowerCase();

  // Detect style
  let creativeStyle = 'Modern High-Contrast Commercial Aesthetic with Cinematic Lighting';
  if (lower.includes('cyber') || lower.includes('neon') || lower.includes('futur')) {
    creativeStyle = 'Cyberpunk Surrealism with Hyper-Tactile Chrome Materials and Dark Slate Canvas';
  } else if (lower.includes('luxur') || lower.includes('perfume') || lower.includes('eleg')) {
    creativeStyle = 'Minimalist Luxury Haute Couture with Soft Diffused Anamorphic Lighting';
  } else if (lower.includes('organ') || lower.includes('nature') || lower.includes('botan')) {
    creativeStyle = 'Scandinavian Biophilic Organic Minimalism with Morning Dew Textures';
  } else if (lower.includes('retro') || lower.includes('90s') || lower.includes('vhs')) {
    creativeStyle = '1990s Nostalgic Grain with Vibrant Pop Accents and VHS Scanline Texture';
  } else if (lower.includes('tech') || lower.includes('b2b') || lower.includes('saas') || lower.includes('cloud')) {
    creativeStyle = 'Clean Precision Isometric 3D with Cyan & Emerald Data Beam Accents';
  }

  // Detect content type & aspect ratio
  let contentType = contentTypeHint || 'Short-Form Video';
  let aspectRatio = '9:16 (Vertical)';
  let durationOrDimensions = '15-30 seconds';
  let platform = 'TikTok & Instagram Reels';
  let preferredTools = ['Runway Gen-3 Alpha', 'Kling AI', 'Midjourney v6.1'];

  if (lower.includes('still') || lower.includes('photo') || lower.includes('catalog') || lower.includes('packshot')) {
    contentType = 'Photorealistic Stills';
    aspectRatio = '1:1 (Square) & 4:5 (Portrait)';
    durationOrDimensions = '3840x3840 Lossless PNG (300 DPI)';
    platform = 'E-Commerce Website & Social Ads';
    preferredTools = ['Flux.1 Pro', 'ComfyUI', 'Midjourney v6.1', 'Magnific AI'];
  } else if (lower.includes('3d') || lower.includes('loop') || lower.includes('orbit')) {
    contentType = '3D Animation';
    aspectRatio = '16:9 (Landscape)';
    durationOrDimensions = '20-30s Seamless Loop';
    platform = 'Website Hero & LinkedIn Video';
    preferredTools = ['Luma Dream Machine', 'Blender', 'ComfyUI', 'Unreal Engine 5.4'];
  } else if (lower.includes('music') || lower.includes('audio') || lower.includes('voice') || lower.includes('song')) {
    contentType = 'Audio & Voiceover';
    aspectRatio = 'N/A (Audio Master)';
    durationOrDimensions = '30-60 seconds';
    platform = 'Commercial Broadcast & Streaming';
    preferredTools = ['Suno v3.5', 'Udio v1.5', 'ElevenLabs', 'Logic Pro X'];
  }

  // Derive title
  const words = idea.split(/\s+/).filter((w) => w.length > 2);
  const sampleWords = words.slice(0, 4).join(' ');
  const title = sampleWords ? `${sampleWords.charAt(0).toUpperCase() + sampleWords.slice(1)} Campaign` : `${brand} Creative Brief`;

  // Audience
  const targetAudience =
    audienceHint ||
    (lower.includes('gen z') || lower.includes('tiktok')
      ? 'Ages 18-26 digital natives, trend seekers, and mobile-first social media consumers'
      : lower.includes('b2b') || lower.includes('enterprise')
      ? 'Decision makers, senior directors, and enterprise technology buyers'
      : 'Affluent lifestyle and modern consumers seeking high-design premium experiences');

  return {
    title,
    brand,
    campaignObjective: `Execute a high-impact generative campaign centered on "${idea.trim()}", driving top-of-funnel brand recall and social conversion while establishing cutting-edge visual distinction.`,
    targetAudience,
    contentType,
    creativeStyle,
    platform,
    aspectRatio,
    durationOrDimensions,
    preferredTools,
    budgetRange: '$1,800 - $3,500',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliverables: [
      `1x Primary master cut (${durationOrDimensions}, ${aspectRatio})`,
      '2x Alternate visual hook variations for A/B testing',
      'Reproducible ComfyUI/model seed recipe and prompt manifests',
      'Commercial clearance and original asset documentation',
    ],
    suggestedWorkflow: `Phase 1: Seed concept exploration in ${preferredTools[0]} -> Phase 2: Geometry & color lock with ControlNet/LoRA -> Phase 3: Motion synthesis & temporal consistency filters -> Phase 4: 4K mastering and deliverable packaging.`,
    licensingRequirements: 'Perpetual worldwide commercial digital buyout including paid advertising and social media distribution rights.',
    successCriteria: [
      'Strong hook engagement within the initial 3 seconds',
      'Zero noticeable temporal flickering or geometric facial distortion',
      'Delivery of raw seed parameters and reproducible prompts',
    ],
    additionalInstructions: 'Maintain strict brand color accuracy and submit work-in-progress checkpoint frames before final high-res render.',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    generatedByAI: true,
    aiMode: 'demo_local',
  };
}
