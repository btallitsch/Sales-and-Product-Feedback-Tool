import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FeedbackItem,
  FeedbackFormData,
  FeedbackFilters,
  SortField,
  SortDir,
} from '@/types';
import {
  loadFeedback,
  addFeedbackItem,
  updateFeedbackItem,
  deleteFeedbackItem,
} from '@/services/storage';
import { filterFeedback, sortFeedback } from '@/utils/metrics';

export function useFeedback() {
  const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>(() => loadFeedback());
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: '',
    category: 'all',
    status: 'all',
    urgency: 0,
    dealStage: 'all',
    salesRep: '',
  });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filteredFeedback = sortFeedback(
    filterFeedback(allFeedback, filters),
    sortField,
    sortDir,
  );

  const addFeedback = useCallback((data: FeedbackFormData) => {
    const now = new Date().toISOString();
    const item: FeedbackItem = {
      id: `fb-${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
      customerName: data.customerName.trim(),
      companyName: data.companyName.trim(),
      dealStage: data.dealStage,
      dealValue: parseFloat(data.dealValue) || 0,
      salesRep: data.salesRep.trim(),
      painPoint: data.painPoint.trim(),
      category: data.category,
      frequency: data.frequency,
      urgency: data.urgency,
      revenueImpact: parseFloat(data.revenueImpact) || 0,
      tags: data.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      status: 'new',
      notes: data.notes.trim() || undefined,
    };
    const updated = addFeedbackItem(item);
    setAllFeedback(updated);
    return item;
  }, []);

  const updateFeedback = useCallback((item: FeedbackItem) => {
    const updated = item.updatedAt
      ? { ...item, updatedAt: new Date().toISOString() }
      : item;
    const result = updateFeedbackItem(updated);
    setAllFeedback(result);
  }, []);

  const deleteFeedback = useCallback((id: string) => {
    const result = deleteFeedbackItem(id);
    setAllFeedback(result);
  }, []);

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }, [sortField]);

  const uniqueSalesReps = [...new Set(allFeedback.map((f) => f.salesRep))].sort();

  return {
    allFeedback,
    filteredFeedback,
    filters,
    setFilters,
    sortField,
    sortDir,
    toggleSort,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    setAllFeedback,
    uniqueSalesReps,
  };
}
