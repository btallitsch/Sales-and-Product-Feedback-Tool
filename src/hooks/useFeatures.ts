import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FeatureRequest, FeatureStatus, FeedbackCategory } from '@/types';
import { loadFeatures, addFeature, updateFeature, deleteFeature } from '@/services/storage';

export function useFeatures() {
  const [features, setFeatures] = useState<FeatureRequest[]>(() => loadFeatures());

  const createFeature = useCallback(
    (data: Omit<FeatureRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const item: FeatureRequest = {
        ...data,
        id: `feat-${uuidv4().slice(0, 8)}`,
        createdAt: now,
        updatedAt: now,
      };
      const updated = addFeature(item);
      setFeatures(updated);
      return item;
    },
    [],
  );

  const updateFeatureItem = useCallback((item: FeatureRequest) => {
    const updated = { ...item, updatedAt: new Date().toISOString() };
    const result = updateFeature(updated);
    setFeatures(result);
  }, []);

  const deleteFeatureItem = useCallback((id: string) => {
    const result = deleteFeature(id);
    setFeatures(result);
  }, []);

  const updateStatus = useCallback(
    (id: string, status: FeatureStatus) => {
      const feature = features.find((f) => f.id === id);
      if (!feature) return;
      updateFeatureItem({ ...feature, status });
    },
    [features, updateFeatureItem],
  );

  const featuresByStatus = (status: FeatureStatus) =>
    features.filter((f) => f.status === status);

  const featuresByCategory = (category: FeedbackCategory) =>
    features.filter((f) => f.category === category);

  return {
    features,
    createFeature,
    updateFeatureItem,
    deleteFeatureItem,
    updateStatus,
    featuresByStatus,
    featuresByCategory,
  };
}
