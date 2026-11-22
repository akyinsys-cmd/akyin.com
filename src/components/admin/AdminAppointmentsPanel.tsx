import { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Edit3, Plus, Search } from 'lucide-react';
import {
  AppointmentRecord,
  BOOKING_STATUS_OPTIONS,
  BookingStatus,
  BUSINESS_STAGES,
  CONSULTATION_TOPICS,
  PAYMENT_STATUS_OPTIONS,
  PaymentStatus,
} from '../../types/advisory';
import { formatSlotRangeIst, getTodayIstDate } from '../../utils/advisoryHelpers';
import { GlassButton, GlassModal } from '../liquid-glass';

interface AdminAppointmentsPanelProps {
  appointments: AppointmentRecord[];
  onSaveAppointment: (payload: Partial<AppointmentRecord>) => Promise<void>;
}

export function AdminAppointmentsPanel({
  appointments,
  onSaveAppointment,
}: AdminAppointmentsPanelProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editing, setEditing] = useState<Partial<AppointmentRecord> | null>(null);
  const [isNewModal, setIsNewModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments.filter((a) => {
      if (statusFilter !== 'ALL' && a.bookingStatus !== statusFilter) return false;
      if (!q) return true;
      return (
        a.bookingId.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.businessName.toLowerCase().includes(q) ||
        a.consultationTopic.toLowerCase().includes(q)
      );
    });
  }, [appointments, search, statusFilter]);

  const openAddModal = () => {
    setIsNewModal(true);
    setEditing({
      customerName: '',
      phone: '',
      email: '',
      city: '',
      country: 'India',
      businessName: '',
      website: '',
      businessStage: BUSINESS_STAGES[1],
      consultationTopic: CONSULTATION_TOPICS[0],
      businessChallenge: '',
      appointmentDate: getTodayIstDate(),
      startTime: '18:00',
      endTime: '18:30',
      paymentStatus: 'Payment Awaited',
      bookingStatus: 'Pending',
      adminNotes: '',
    });
  };

  const handleQuickAction = async (
    appt: AppointmentRecord,
    updates: Partial<AppointmentRecord>,
    label: string
  ) => {
    setSaving(true);
    setFeedback('');
    try {
      await onSaveAppointment({ ...appt, ...updates });
      setFeedback(`${appt.bookingId}: ${label}`);
    } finally {
      setSaving(false);
    }
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setFeedback('');
    try {
      await onSaveAppointment(editing);
      setFeedback(
        isNewModal
          ? 'Added new appointment and updated calendar.'
          : `Updated ${editing.bookingId}.`
      );
      setEditing(null);
      setIsNewModal(false);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Appointments Ledger
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Verify payments, confirm or reschedule IST slots, and keep Google Calendar synchronized.
          </p>
        </div>

        <GlassButton variant="primary" size="sm" onClick={openAddModal}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Manual Appointment</span>
        </GlassButton>
      </div>

      {/* Filters */}
      <div className="liquid-glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, name, phone, email, topic..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
          >
            <option value="ALL">All Statuses ({appointments.length})</option>
            {BOOKING_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table */}
      <div className="liquid-glass-card rounded-3xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-[#1D1D1F]">No appointments match this filter.</p>
            <p className="text-xs text-[#6E6E73]">
              Consultation requests submitted on /advisory or added manually appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/80 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date &amp; Slot (IST)</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {filtered.map((appt) => (
                  <tr key={appt.bookingId} className="hover:bg-[#FFFFFF]/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono-num font-bold text-[#1D1D1F] whitespace-nowrap">
                      {appt.bookingId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#1D1D1F]">{appt.customerName}</p>
                      <p className="text-[11px] text-[#6E6E73] font-mono-num">
                        {appt.phone} · {appt.email}
                      </p>
                      {appt.businessName && (
                        <p className="text-[11px] text-[#6E6E73]">{appt.businessName}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-mono-num font-semibold text-[#1D1D1F]">
                        {appt.appointmentDate}
                      </p>
                      <p className="font-mono-num text-[11px] text-[#6E6E73]">
                        {formatSlotRangeIst(appt.startTime, appt.endTime)}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <p className="font-medium text-[#1D1D1F] truncate">
                        {appt.consultationTopic}
                      </p>
                      <p className="text-[11px] text-[#6E6E73] truncate">
                        {appt.city}, {appt.country}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                          appt.paymentStatus === 'Payment Received'
                            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                            : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
                        }`}
                      >
                        {appt.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                          appt.bookingStatus === 'Confirmed' || appt.bookingStatus === 'Completed'
                            ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white'
                            : appt.bookingStatus === 'Cancelled'
                              ? 'bg-[#F5F5F7] border-[#E8E8ED] text-[#A1A1A6]'
                              : 'bg-[#FFFFFF] border-[#1D1D1F]/25 text-[#1D1D1F]'
                        }`}
                      >
                        {appt.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {appt.paymentStatus !== 'Payment Received' && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              handleQuickAction(
                                appt,
                                { paymentStatus: 'Payment Received' },
                                'Marked payment received'
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] hover:border-[#1D1D1F] text-[11px] font-semibold text-[#1D1D1F] cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                        {appt.bookingStatus !== 'Confirmed' && appt.bookingStatus !== 'Cancelled' && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              handleQuickAction(
                                appt,
                                { bookingStatus: 'Confirmed' },
                                'Booking confirmed'
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-[#1D1D1F] hover:bg-[#3A3A3F] text-white text-[11px] font-semibold cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewModal(false);
                            setEditing({ ...appt });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] hover:border-[#1D1D1F] text-[11px] font-semibold text-[#1D1D1F] cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" aria-hidden="true" />
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Add Liquid Glass Modal */}
      <GlassModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        subtitle={isNewModal ? 'NEW APPOINTMENT' : editing?.bookingId}
        title={isNewModal ? 'Add Manual Consultation Booking' : 'Manage & Reschedule Appointment'}
      >
        {editing && (
          <form onSubmit={handleModalSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Customer Name</label>
                <input
                  required
                  value={editing.customerName || ''}
                  onChange={(e) => setEditing({ ...editing, customerName: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Phone</label>
                <input
                  required
                  value={editing.phone || ''}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={editing.email || ''}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Business Name</label>
                <input
                  value={editing.businessName || ''}
                  onChange={(e) => setEditing({ ...editing, businessName: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Appointment Date (IST)
                </label>
                <input
                  type="date"
                  required
                  value={editing.appointmentDate || ''}
                  onChange={(e) => setEditing({ ...editing, appointmentDate: e.target.value })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">Start (IST)</label>
                  <input
                    type="time"
                    required
                    value={editing.startTime || '18:00'}
                    onChange={(e) => setEditing({ ...editing, startTime: e.target.value })}
                    className={`${inputCls} font-mono-num`}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">End (IST)</label>
                  <input
                    type="time"
                    required
                    value={editing.endTime || '18:30'}
                    onChange={(e) => setEditing({ ...editing, endTime: e.target.value })}
                    className={`${inputCls} font-mono-num`}
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Booking Status</label>
                <select
                  value={editing.bookingStatus || 'Pending'}
                  onChange={(e) =>
                    setEditing({ ...editing, bookingStatus: e.target.value as BookingStatus })
                  }
                  className={inputCls}
                >
                  {BOOKING_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Payment Status</label>
                <select
                  value={editing.paymentStatus || 'Payment Awaited'}
                  onChange={(e) =>
                    setEditing({ ...editing, paymentStatus: e.target.value as PaymentStatus })
                  }
                  className={inputCls}
                >
                  {PAYMENT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Consultation Topic</label>
              <input
                value={editing.consultationTopic || ''}
                onChange={(e) => setEditing({ ...editing, consultationTopic: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Client Challenge / Request Notes
              </label>
              <textarea
                rows={2}
                value={editing.businessChallenge || ''}
                onChange={(e) => setEditing({ ...editing, businessChallenge: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Internal Admin Notes
              </label>
              <textarea
                rows={2}
                value={editing.adminNotes || ''}
                onChange={(e) => setEditing({ ...editing, adminNotes: e.target.value })}
                placeholder="Payment verification remarks, call notes, reschedule reason..."
                className={inputCls}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E8ED]">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-[#6E6E73]">
                <Calendar className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                <span>Syncs automatically with Google Calendar when live</span>
              </div>
              <div className="flex items-center gap-2">
                <GlassButton variant="subtle" size="sm" onClick={() => setEditing(null)}>
                  Cancel
                </GlassButton>
                <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
                  {saving ? 'Saving...' : 'Save Appointment'}
                </GlassButton>
              </div>
            </div>
          </form>
        )}
      </GlassModal>
    </div>
  );
}
