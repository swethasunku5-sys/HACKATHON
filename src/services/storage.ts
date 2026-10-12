import {
  Creator,
  BrandBrief,
  Engagement,
  UserSettings,
  ActivityEvent,
  EngagementStage,
  BriefStatus,
} from '../types';
import {
  INITIAL_CREATORS,
  INITIAL_BRIEFS,
  INITIAL_ENGAGEMENTS,
  INITIAL_SETTINGS,
  INITIAL_ACTIVITIES,
} from '../data/seedData';

const KEYS = {
  CREATORS: 'creatorconnect_creators_v1',
  BRIEFS: 'creatorconnect_briefs_v1',
  ENGAGEMENTS: 'creatorconnect_engagements_v1',
  SHORTLIST: 'creatorconnect_shortlist_v1',
  SETTINGS: 'creatorconnect_settings_v1',
  ACTIVITIES: 'creatorconnect_activities_v1',
  SEEDED: 'creatorconnect_has_seeded_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  initialize(): void {
    const hasSeededV2 = localStorage.getItem('creatorconnect_has_seeded_v2');
    if (!hasSeededV2) {
      const storedCreators = safeGet<Creator[]>(KEYS.CREATORS, []);
      // If creators exist from v1, merge new avatar and portfolio fields
      if (storedCreators.length > 0) {
        const upgradedCreators = INITIAL_CREATORS.map((initC) => {
          const existing = storedCreators.find((c) => c.id === initC.id);
          return {
            ...initC,
            ...existing,
            avatarUrl: initC.avatarUrl,
            coverUrl: initC.coverUrl,
            isSampleProfile: initC.isSampleProfile,
            primaryPlatform: initC.primaryPlatform,
            portfolio: initC.portfolio,
          };
        });
        safeSet(KEYS.CREATORS, upgradedCreators);
      } else {
        safeSet(KEYS.CREATORS, INITIAL_CREATORS);
      }

      if (!localStorage.getItem(KEYS.BRIEFS)) safeSet(KEYS.BRIEFS, INITIAL_BRIEFS);
      if (!localStorage.getItem(KEYS.ENGAGEMENTS)) safeSet(KEYS.ENGAGEMENTS, INITIAL_ENGAGEMENTS);
      if (!localStorage.getItem(KEYS.SHORTLIST)) safeSet(KEYS.SHORTLIST, ['creator-1', 'creator-2']);
      if (!localStorage.getItem(KEYS.SETTINGS)) safeSet(KEYS.SETTINGS, INITIAL_SETTINGS);
      if (!localStorage.getItem(KEYS.ACTIVITIES)) safeSet(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
      localStorage.setItem('creatorconnect_has_seeded_v2', 'true');
      localStorage.setItem(KEYS.SEEDED, 'true');
    }
  },

  resetToDefaults(): void {
    safeSet(KEYS.CREATORS, INITIAL_CREATORS);
    safeSet(KEYS.BRIEFS, INITIAL_BRIEFS);
    safeSet(KEYS.ENGAGEMENTS, INITIAL_ENGAGEMENTS);
    safeSet(KEYS.SHORTLIST, ['creator-1', 'creator-2']);
    safeSet(KEYS.SETTINGS, INITIAL_SETTINGS);
    safeSet(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    localStorage.setItem(KEYS.SEEDED, 'true');
  },

  // Creators
  getCreators(): Creator[] {
    return safeGet<Creator[]>(KEYS.CREATORS, INITIAL_CREATORS);
  },

  getCreatorById(id: string): Creator | undefined {
    const creators = this.getCreators();
    return creators.find((c) => c.id === id);
  },

  // Briefs
  getBriefs(): BrandBrief[] {
    return safeGet<BrandBrief[]>(KEYS.BRIEFS, INITIAL_BRIEFS);
  },

  getBriefById(id: string): BrandBrief | undefined {
    return this.getBriefs().find((b) => b.id === id);
  },

  saveBrief(brief: BrandBrief): void {
    const briefs = this.getBriefs();
    const index = briefs.findIndex((b) => b.id === brief.id);
    const updated = {
      ...brief,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      briefs[index] = updated;
    } else {
      briefs.unshift(updated);
      this.logActivity({
        id: `act-${Date.now()}`,
        type: 'brief_published',
        title: 'Brief Saved',
        detail: `Saved "${brief.title}" (${brief.status.toUpperCase()})`,
        timestamp: 'Just now',
        linkTab: 'briefs',
      });
    }
    safeSet(KEYS.BRIEFS, briefs);
  },

  deleteBrief(id: string): void {
    const briefs = this.getBriefs().filter((b) => b.id !== id);
    safeSet(KEYS.BRIEFS, briefs);
  },

  duplicateBrief(id: string): BrandBrief | undefined {
    const original = this.getBriefById(id);
    if (!original) return undefined;

    const copy: BrandBrief = {
      ...original,
      id: `brief-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveBrief(copy);
    return copy;
  },

  // Shortlist
  getShortlist(): string[] {
    return safeGet<string[]>(KEYS.SHORTLIST, ['creator-1', 'creator-2']);
  },

  isShortlisted(creatorId: string): boolean {
    const list = this.getShortlist();
    return list.includes(creatorId);
  },

  addToShortlist(creatorId: string): boolean {
    const list = this.getShortlist();
    if (list.includes(creatorId)) return false; // Prevent duplicates

    list.push(creatorId);
    safeSet(KEYS.SHORTLIST, list);

    const creator = this.getCreatorById(creatorId);
    this.logActivity({
      id: `act-${Date.now()}`,
      type: 'creator_shortlisted',
      title: 'Creator Shortlisted',
      detail: `${creator ? creator.name : 'Creator'} was added to your shortlist.`,
      timestamp: 'Just now',
      linkTab: 'shortlist',
    });
    return true;
  },

  removeFromShortlist(creatorId: string): void {
    const list = this.getShortlist().filter((id) => id !== creatorId);
    safeSet(KEYS.SHORTLIST, list);
  },

  toggleShortlist(creatorId: string): boolean {
    if (this.isShortlisted(creatorId)) {
      this.removeFromShortlist(creatorId);
      return false;
    } else {
      this.addToShortlist(creatorId);
      return true;
    }
  },

  // Engagements
  getEngagements(): Engagement[] {
    return safeGet<Engagement[]>(KEYS.ENGAGEMENTS, INITIAL_ENGAGEMENTS);
  },

  getEngagementById(id: string): Engagement | undefined {
    return this.getEngagements().find((e) => e.id === id);
  },

  createEngagement(data: {
    briefId: string;
    briefTitle: string;
    brand: string;
    creatorId: string;
    creatorName: string;
    creatorSpecialization: string;
    budget: string;
    deadline: string;
    notes?: string;
  }): Engagement {
    const engagements = this.getEngagements();
    const newEng: Engagement = {
      id: `eng-${Date.now()}`,
      briefId: data.briefId,
      briefTitle: data.briefTitle,
      brand: data.brand,
      creatorId: data.creatorId,
      creatorName: data.creatorName,
      creatorSpecialization: data.creatorSpecialization,
      stage: 'discovery',
      budget: data.budget,
      deadline: data.deadline,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      deliverables: [
        { id: `del-${Date.now()}-1`, title: 'Kick-off alignment & prompt board review', completed: false },
        { id: `del-${Date.now()}-2`, title: 'Milestone 1: Preliminary keyframes / test reel', completed: false },
        { id: `del-${Date.now()}-3`, title: 'Milestone 2: Revisions & final high-res delivery', completed: false },
        { id: `del-${Date.now()}-4`, title: 'Asset provenance & seed documentation transfer', completed: false },
      ],
      notes: data.notes || 'Engagement initiated from campaign brief.',
    };

    engagements.unshift(newEng);
    safeSet(KEYS.ENGAGEMENTS, engagements);

    // Also update brief status to in_progress if open
    const brief = this.getBriefById(data.briefId);
    if (brief && brief.status === 'open') {
      this.saveBrief({ ...brief, status: 'in_progress' });
    }

    this.logActivity({
      id: `act-${Date.now()}`,
      type: 'engagement_started',
      title: 'New Engagement Created',
      detail: `Started engagement between ${data.creatorName} and brief "${data.briefTitle}".`,
      timestamp: 'Just now',
      linkTab: 'engagements',
    });

    return newEng;
  },

  updateEngagementStage(id: string, stage: EngagementStage): void {
    const list = this.getEngagements();
    const index = list.findIndex((e) => e.id === id);
    if (index >= 0) {
      list[index].stage = stage;
      list[index].lastUpdated = new Date().toISOString();
      safeSet(KEYS.ENGAGEMENTS, list);

      this.logActivity({
        id: `act-${Date.now()}`,
        type: 'engagement_stage_updated',
        title: 'Stage Updated',
        detail: `"${list[index].briefTitle}" engagement moved to ${stage.replace('_', ' ').toUpperCase()}.`,
        timestamp: 'Just now',
        linkTab: 'engagements',
      });
    }
  },

  toggleDeliverable(engagementId: string, deliverableId: string): void {
    const list = this.getEngagements();
    const eng = list.find((e) => e.id === engagementId);
    if (eng) {
      const task = eng.deliverables.find((d) => d.id === deliverableId);
      if (task) {
        task.completed = !task.completed;
        eng.lastUpdated = new Date().toISOString();
        safeSet(KEYS.ENGAGEMENTS, list);
      }
    }
  },

  updateEngagementNotes(engagementId: string, notes: string): void {
    const list = this.getEngagements();
    const eng = list.find((e) => e.id === engagementId);
    if (eng) {
      eng.notes = notes;
      eng.lastUpdated = new Date().toISOString();
      safeSet(KEYS.ENGAGEMENTS, list);
    }
  },

  deleteEngagement(id: string): void {
    const list = this.getEngagements().filter((e) => e.id !== id);
    safeSet(KEYS.ENGAGEMENTS, list);
  },

  updateBriefStatus(briefId: string, status: BriefStatus): void {
    const briefs = this.getBriefs();
    const b = briefs.find((item) => item.id === briefId);
    if (b) {
      b.status = status;
      b.updatedAt = new Date().toISOString();
      safeSet(KEYS.BRIEFS, briefs);
      this.logActivity({
        id: `act-${Date.now()}`,
        type: 'brief_published',
        title: 'Brief Status Updated',
        detail: `"${b.title}" status changed to ${status.toUpperCase()}.`,
        timestamp: 'Just now',
        linkTab: 'briefs',
      });
    }
  },

  // Settings
  getSettings(): UserSettings {
    return safeGet<UserSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  saveSettings(settings: UserSettings): void {
    safeSet(KEYS.SETTINGS, settings);
  },

  // Activities
  getActivities(): ActivityEvent[] {
    return safeGet<ActivityEvent[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  },

  logActivity(event: ActivityEvent): void {
    const list = this.getActivities();
    list.unshift(event);
    if (list.length > 20) list.pop();
    safeSet(KEYS.ACTIVITIES, list);
  },

  clearActivities(): void {
    safeSet(KEYS.ACTIVITIES, []);
  },
};
