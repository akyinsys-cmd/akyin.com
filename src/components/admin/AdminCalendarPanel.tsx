import { useState } from 'react';
import { AlertTriangle, CalendarOff, CheckCircle2, Clock, Save, Trash2 } from 'lucide-react';
import {
  AppointmentRecord,
  AvailabilityRule,
  BlockedDateRecord,
} from '../../types/advisory';
import { formatSlotRangeIst, getTodayIstDate } from '../../utils/advisoryHelpers';
import { GlassButton } from '../liquid-glass';

interface AdminCalendarPanelProps {
  availability: AvailabilityRule[];
  blockedDates: BlockedDateRecord[];
  appointments: AppointmentRecord[];
  onSaveAvailability: (rules: AvailabilityRule[]) => Promise<{ activeBookingsProtected: number }>;
  onBlockDate: (date: string, reason: string) => Promise<{ conflictWarningCount: number }>;
  onUnblockDate: (date: string) => Promise<void>;
}

export function AdminCalendarPanel({
  availability,
  blockedDates,
  appointments,
  onSaveAvailability,
  onBlockDate,
  onUnblockDate,
}: AdminCalendarPanelProps) {
  const [rules, setRules] = useState<AvailabilityRule[]>(() =>
    availability.map((r) => ({ ...r }))
  );
  const [blockDateInput, setBlockDateInput] = useState<string>(getTodayIstDate());
  const [blockReason, setBlockReason] = useState<string>('Owner Unavailable / Holiday');
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<string>(getTodayIstDate());
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [warning, setWarning] = useState('');

  const handleRuleChange = (idx: number, patch: Partial<AvailabilityRule>) => {
    setRules((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    );
  };

  const handleSaveRules = async () => {
    setSaving(true);
    setNotice('');
    setWarning('');
    try {
      const res = await onSaveAvailability(rules);
      setNotice(
        `Saved weekly Asia/Kolkata consultation schedule. ${res.activeBookingsProtected} existing pending/confirmed appointments remain preserved.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) return;
    setSaving(true);
    setNotice('');
    setWarning('');
    try {
      const res = await onBlockDate(blockDateInput, blockReason);
      setNotice(`Blocked ${blockDateInput} from new public consultation requests.`);
      if (res.conflictWarningCount > 0) {
        setWarning(
          `Conflict Alert: ${res.conflictWarningCount} existing booking(s) already exist on ${blockDateInput}. Confirmed appointments were preserved—please contact or reschedule them in Appointments if needed.`
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const dayScheduleAppointments = appointments.filter(
    (a) => a.appointmentDate === selectedScheduleDate
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
          Calendar, Availability &amp; Blocked Dates
        </h2>
        <p className="text-xs text-[#6E6E73] mt-0.5">
          Configure weekly IST windows, slot duration, daily booking caps, holidays, and review daily schedule conflicts.
        </p>
      </div>

      {notice && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
          <span>{notice}</span>
        </div>
      )}

      {warning && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#D92D20] shrink-0 mt-0.5" aria-hidden="true" />
          <span>{warning}</span>
        </div>
      )}

      {/* Weekly Schedule Table */}
      <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1D1D1F]">
            <Clock className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
            <span>Weekly Consultation Windows (Asia/Kolkata IST)</span>
          </div>
          <GlassButton disabled={saving} onClick={handleSaveRules} variant="primary" size="sm">
            <Save className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Save Weekly Schedule</span>
          </GlassButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#E8E8ED] text-[#6E6E73]">
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3">Enabled</th>
                <th className="py-2.5 px-3">Start (IST)</th>
                <th className="py-2.5 px-3">End (IST)</th>
                <th className="py-2.5 px-3">Slot Mins</th>
                <th className="py-2.5 px-3">Max / Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8ED]">
              {rules.map((rule, idx) => (
                <tr key={rule.day}>
                  <td className="py-2.5 px-3 font-semibold text-[#1D1D1F]">{rule.day}</td>
                  <td className="py-2.5 px-3">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => handleRuleChange(idx, { enabled: e.target.checked })}
                      className="accent-[#1D1D1F] w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="time"
                      value={rule.startTime}
                      onChange={(e) => handleRuleChange(idx, { startTime: e.target.value })}
                      className="rounded-lg border border-[#E8E8ED] bg-[#FFFFFF] px-2.5 py-1 font-mono-num text-xs focus:outline-none focus:border-[#1D1D1F]"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="time"
                      value={rule.endTime}
                      onChange={(e) => handleRuleChange(idx, { endTime: e.target.value })}
                      className="rounded-lg border border-[#E8E8ED] bg-[#FFFFFF] px-2.5 py-1 font-mono-num text-xs focus:outline-none focus:border-[#1D1D1F]"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min={15}
                      max={120}
                      step={15}
                      value={rule.slotDuration}
                      onChange={(e) =>
                        handleRuleChange(idx, { slotDuration: Number(e.target.value) || 30 })
                      }
                      className="w-20 rounded-lg border border-[#E8E8ED] bg-[#FFFFFF] px-2.5 py-1 font-mono-num text-xs focus:outline-none focus:border-[#1D1D1F]"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={rule.maximumBookings}
                      onChange={(e) =>
                        handleRuleChange(idx, { maximumBookings: Number(e.target.value) || 2 })
                      }
                      className="w-20 rounded-lg border border-[#E8E8ED] bg-[#FFFFFF] px-2.5 py-1 font-mono-num text-xs focus:outline-none focus:border-[#1D1D1F]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block / Unblock Dates + Daily Schedule View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1D1D1F]">
            <CalendarOff className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
            <span>Block Holidays &amp; Unavailable Dates</span>
          </div>

          <form onSubmit={handleBlock} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
            <div className="sm:col-span-4">
              <input
                type="date"
                min={getTodayIstDate()}
                value={blockDateInput}
                onChange={(e) => setBlockDateInput(e.target.value)}
                className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 font-mono-num focus:outline-none focus:border-[#1D1D1F]"
              />
            </div>
            <div className="sm:col-span-5">
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Reason (e.g. Public Holiday)"
                className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 focus:outline-none focus:border-[#1D1D1F]"
              />
            </div>
            <div className="sm:col-span-3">
              <GlassButton type="submit" disabled={saving} variant="primary" size="sm" className="w-full">
                Block Date
              </GlassButton>
            </div>
          </form>

          {blockedDates.length === 0 ? (
            <p className="text-xs text-[#6E6E73] py-3">No dates currently blocked.</p>
          ) : (
            <ul className="divide-y divide-[#E8E8ED] text-xs">
              {blockedDates.map((b) => (
                <li key={b.date} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-mono-num font-bold text-[#1D1D1F]">{b.date}</span>
                    <span className="text-[#6E6E73] ml-2">{b.reason}</span>
                  </div>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onUnblockDate(b.date)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E8E8ED] hover:border-[#D92D20] text-[11px] font-semibold text-[#1D1D1F] cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 text-[#D92D20]" aria-hidden="true" />
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[#1D1D1F]">Daily Schedule Inspection</h3>
            <input
              type="date"
              value={selectedScheduleDate}
              onChange={(e) => setSelectedScheduleDate(e.target.value)}
              className="rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-1.5 font-mono-num text-xs focus:outline-none focus:border-[#1D1D1F]"
            />
          </div>

          {dayScheduleAppointments.length === 0 ? (
            <p className="text-xs text-[#6E6E73] py-3">
              No appointments booked for {selectedScheduleDate}.
            </p>
          ) : (
            <ul className="divide-y divide-[#E8E8ED] text-xs">
              {dayScheduleAppointments.map((a) => (
                <li key={a.bookingId} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono-num font-bold text-[#1D1D1F]">
                      {formatSlotRangeIst(a.startTime, a.endTime)}
                    </p>
                    <p className="font-semibold text-[#1D1D1F] mt-0.5">
                      {a.customerName} · {a.consultationTopic}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg border border-[#E8E8ED] bg-[#FFFFFF]/85 text-[11px] font-semibold text-[#1D1D1F]">
                    {a.bookingStatus}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
