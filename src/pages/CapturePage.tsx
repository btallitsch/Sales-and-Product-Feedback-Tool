import React, { useState } from 'react';
import { Plus, MessageSquarePlus } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import FeedbackTable from '@/components/feedback/FeedbackTable';
import FilterBar from '@/components/feedback/FilterBar';
import Modal from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import { useFeedback } from '@/hooks/useFeedback';
import { FeedbackItem, FeedbackStatus, FeedbackFormData } from '@/types';

export default function CapturePage() {
  const {
    filteredFeedback, filters, setFilters, sortField, sortDir,
    toggleSort, addFeedback, updateFeedback, deleteFeedback,
    allFeedback, uniqueSalesReps,
  } = useFeedback();

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<FeedbackItem | null>(null);

  const handleStatusChange = (item: FeedbackItem, status: FeedbackStatus) => {
    updateFeedback({ ...item, status });
  };

  const handleEdit = (item: FeedbackItem) => setEditItem(item);

  const handleEditSubmit = (data: FeedbackFormData) => {
    if (!editItem) return;
    updateFeedback({
      ...editItem,
      customerName: data.customerName,
      companyName: data.companyName,
      dealStage: data.dealStage,
      dealValue: parseFloat(data.dealValue) || editItem.dealValue,
      salesRep: data.salesRep,
      painPoint: data.painPoint,
      category: data.category,
      frequency: data.frequency,
      urgency: data.urgency,
      revenueImpact: parseFloat(data.revenueImpact) || editItem.revenueImpact,
      tags: data.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      notes: data.notes || undefined,
    });
    setEditItem(null);
  };

  return (
    <div className="page-content">
      <TopBar
        title="Feedback Capture"
        subtitle={`${allFeedback.length} items logged`}
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={13} /> Log Feedback
          </Button>
        }
      />
      <FilterBar
        filters={filters}
        onChange={setFilters}
        salesReps={uniqueSalesReps}
        resultCount={filteredFeedback.length}
      />
      <div className="page-scroll">
        {filteredFeedback.length === 0 ? (
          <EmptyState
            icon={<MessageSquarePlus size={40} />}
            title="No feedback matches your filters"
            subtitle="Try adjusting or clearing the active filters"
          />
        ) : (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <FeedbackTable
              items={filteredFeedback}
              sortField={sortField}
              sortDir={sortDir}
              onSort={toggleSort}
              onEdit={handleEdit}
              onDelete={deleteFeedback}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Log New Feedback" subtitle="Capture raw customer insight from a sales interaction" width={680}>
        <FeedbackForm onSubmit={(data) => { addFeedback(data); setShowAdd(false); }} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Feedback" width={680}>
        {editItem && (
          <FeedbackForm
            initialData={{
              customerName: editItem.customerName,
              companyName: editItem.companyName,
              dealStage: editItem.dealStage,
              dealValue: String(editItem.dealValue),
              salesRep: editItem.salesRep,
              painPoint: editItem.painPoint,
              category: editItem.category,
              frequency: editItem.frequency,
              urgency: editItem.urgency,
              revenueImpact: String(editItem.revenueImpact),
              tags: editItem.tags.join(', '),
              notes: editItem.notes ?? '',
            }}
            onSubmit={handleEditSubmit}
            submitLabel="Save Changes"
          />
        )}
      </Modal>
    </div>
  );
}
