import { FeedbackItem, FeatureRequest } from '@/types';
import { SEED_FEEDBACK, SEED_FEATURES } from './seedData';

const FEEDBACK_KEY = 'spf_feedback';
const FEATURES_KEY = 'spf_features';

// ─── Feedback ─────────────────────────────────────────────────────────────────

export function loadFeedback(): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (raw) return JSON.parse(raw) as FeedbackItem[];
  } catch (_) {
    /* ignore */
  }
  // First load: seed with demo data
  saveFeedback(SEED_FEEDBACK);
  return SEED_FEEDBACK;
}

export function saveFeedback(items: FeedbackItem[]): void {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(items));
}

export function addFeedbackItem(item: FeedbackItem): FeedbackItem[] {
  const existing = loadFeedback();
  const updated = [item, ...existing];
  saveFeedback(updated);
  return updated;
}

export function updateFeedbackItem(updated: FeedbackItem): FeedbackItem[] {
  const existing = loadFeedback();
  const items = existing.map((f) => (f.id === updated.id ? updated : f));
  saveFeedback(items);
  return items;
}

export function deleteFeedbackItem(id: string): FeedbackItem[] {
  const existing = loadFeedback();
  const items = existing.filter((f) => f.id !== id);
  saveFeedback(items);
  return items;
}

// ─── Features ─────────────────────────────────────────────────────────────────

export function loadFeatures(): FeatureRequest[] {
  try {
    const raw = localStorage.getItem(FEATURES_KEY);
    if (raw) return JSON.parse(raw) as FeatureRequest[];
  } catch (_) {
    /* ignore */
  }
  saveFeatures(SEED_FEATURES);
  return SEED_FEATURES;
}

export function saveFeatures(items: FeatureRequest[]): void {
  localStorage.setItem(FEATURES_KEY, JSON.stringify(items));
}

export function addFeature(item: FeatureRequest): FeatureRequest[] {
  const existing = loadFeatures();
  const updated = [item, ...existing];
  saveFeatures(updated);
  return updated;
}

export function updateFeature(updated: FeatureRequest): FeatureRequest[] {
  const existing = loadFeatures();
  const items = existing.map((f) => (f.id === updated.id ? updated : f));
  saveFeatures(items);
  return items;
}

export function deleteFeature(id: string): FeatureRequest[] {
  const existing = loadFeatures();
  const items = existing.filter((f) => f.id !== id);
  saveFeatures(items);
  return items;
}

export function resetToSeedData(): void {
  saveFeedback(SEED_FEEDBACK);
  saveFeatures(SEED_FEATURES);
}
