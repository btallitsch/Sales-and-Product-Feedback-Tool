import React, { useState } from 'react';
import { FeedbackFormData, DealStage, FeedbackCategory, FrequencyLevel, UrgencyLevel } from '@/types';
import Button from '@/components/shared/Button';
import { CheckCircle2 } from 'lucide-react';

const EMPTY_FORM: FeedbackFormData = {
  customerName: '', companyName: '', dealStage: 'qualified', dealValue: '',
  salesRep: '', painPoint: '', category: 'integration', frequency: 'frequent',
  urgency: 3, revenueImpact: '', tags: '', notes: '',
};

interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => void;
  initialData?: Partial<FeedbackFormData>;
  submitLabel?: string;
}

const field = (label: string, child: React.ReactNode, full = false) => (
  <div className="form-group" style={full ? { gridColumn: '1 / -1' } : {}}>
    <label>{label}</label>
    {child}
  </div>
);

export default function FeedbackForm({ onSubmit, initialData, submitLabel = 'Submit Feedback' }: FeedbackFormProps) {
  const [form, setForm] = useState<FeedbackFormData>({ ...EMPTY_FORM, ...initialData });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackFormData, string>>>({});

  const set = (key: keyof FeedbackFormData, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Partial<Record<keyof FeedbackFormData, string>> = {};
    if (!form.customerName.trim()) e.customerName = 'Required';
    if (!form.companyName.trim()) e.companyName = 'Required';
    if (!form.salesRep.trim()) e.salesRep = 'Required';
    if (!form.painPoint.trim()) e.painPoint = 'Required';
    if (!form.dealValue || isNaN(Number(form.dealValue))) e.dealValue = 'Enter a valid number';
    if (!form.revenueImpact || isNaN(Number(form.revenueImpact))) e.revenueImpact = 'Enter a valid number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    setForm(EMPTY_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const inputStyle = (key: keyof FeedbackFormData): React.CSSProperties => ({
    borderColor: errors[key] ? 'var(--red)' : undefined,
  });

  if (submitted) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', gap: 12, animation: 'fadeIn 200ms ease',
      }}>
        <CheckCircle2 size={40} color="var(--green)" />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
          Feedback Captured
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          It's been logged and is ready for product review.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Section: Customer / Deal */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
          § Customer &amp; Deal
        </div>
        <div className="form-row">
          {field('Customer Name', <input value={form.customerName} onChange={(e) => set('customerName', e.target.value)} placeholder="Jane Smith" style={inputStyle('customerName')} />)}
          {field('Company', <input value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="Acme Corp" style={inputStyle('companyName')} />)}
          {field('Sales Rep', <input value={form.salesRep} onChange={(e) => set('salesRep', e.target.value)} placeholder="Your name" style={inputStyle('salesRep')} />)}
          {field('Deal Stage',
            <select value={form.dealStage} onChange={(e) => set('dealStage', e.target.value as DealStage)}>
              {(['prospecting','qualified','proposal','negotiation','closed-lost','closed-won'] as DealStage[]).map(s => (
                <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          )}
          {field('Deal Value ($)', <input type="number" min="0" value={form.dealValue} onChange={(e) => set('dealValue', e.target.value)} placeholder="50000" style={inputStyle('dealValue')} />)}
          {field('Revenue at Risk ($)', <input type="number" min="0" value={form.revenueImpact} onChange={(e) => set('revenueImpact', e.target.value)} placeholder="50000" style={inputStyle('revenueImpact')} />)}
        </div>
      </div>

      <div className="divider" />

      {/* Section: Pain Point */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
          § Feedback Details
        </div>
        <div className="form-group">
          <label>Pain Point <span style={{ color: 'var(--red)', fontWeight: 400 }}>*</span></label>
          <textarea
            rows={3}
            value={form.painPoint}
            onChange={(e) => set('painPoint', e.target.value)}
            placeholder="Describe the exact customer problem, blocker, or friction in detail..."
            style={{ resize: 'vertical', ...inputStyle('painPoint') }}
          />
          {errors.painPoint && <span style={{ fontSize: 10, color: 'var(--red)' }}>{errors.painPoint}</span>}
        </div>
        <div className="form-row">
          {field('Category',
            <select value={form.category} onChange={(e) => set('category', e.target.value as FeedbackCategory)}>
              {(['integration','performance','ux','pricing','reporting','api','security','mobile','onboarding','other'] as FeedbackCategory[]).map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          )}
          {field('Frequency',
            <select value={form.frequency} onChange={(e) => set('frequency', e.target.value as FrequencyLevel)}>
              <option value="one-time">One-Time</option>
              <option value="occasional">Occasional</option>
              <option value="frequent">Frequent</option>
              <option value="critical">Critical Blocker</option>
            </select>
          )}
        </div>

        {/* Urgency slider */}
        <div className="form-group">
          <label>Urgency: <span style={{ color: ['','var(--text-muted)','var(--blue)','var(--accent)','var(--orange)','var(--red)'][form.urgency] }}>
            {['','Very Low','Low','Medium','High','Critical'][form.urgency]}
          </span></label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {([1,2,3,4,5] as UrgencyLevel[]).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => set('urgency', u)}
                style={{
                  flex: 1, height: 28, borderRadius: 5, border: '1px solid',
                  cursor: 'pointer', transition: 'all var(--transition)',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                  background: form.urgency === u
                    ? ['','var(--text-muted)','var(--blue)','var(--accent)','var(--orange)','var(--red)'][u]
                    : 'var(--bg-elevated)',
                  borderColor: form.urgency === u
                    ? ['','var(--text-muted)','var(--blue)','var(--accent)','var(--orange)','var(--red)'][u]
                    : 'var(--border)',
                  color: form.urgency === u ? (u >= 3 ? 'var(--text-inverted)' : 'var(--text-primary)') : 'var(--text-muted)',
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          {field('Tags (comma-separated)', <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="salesforce, crm, integration" />)}
          {field('Internal Notes', <input value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Context, follow-up actions..." />)}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <Button variant="primary" onClick={handleSubmit}>{submitLabel}</Button>
      </div>
    </div>
  );
}
