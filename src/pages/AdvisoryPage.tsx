import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  ExternalLink,
  FileCheck2,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { motion, useReducedMotion } from 'motion/react';
import { AppRoute, IMAGES, OFFICIAL_CONTACT } from '../data/akyinData';
import { useSiteConfig } from '../context/SiteConfigContext';
import { akyinApiClient } from '../utils/AkyinApiClient';
import {
  getWorkspaceAccessToken,
  initWorkspaceAuth,
  logoutWorkspaceGoogle,
  signInWithGoogleWorkspace,
} from '../services/googleWorkspaceAuth';
import {
  createCalendarEvent,
  queryCalendarFreeBusy,
  WorkspaceFreeBusyInterval,
} from '../services/googleWorkspaceClient';
import {
  advisoryBookingSchema,
  BookingConfirmationResult,
  BUSINESS_STAGES,
  CONSULTATION_TOPICS,
  DateAvailabilityResponse,
} from '../types/advisory';
import {
  addDaysIst,
  formatFriendlyDateIst,
  getCurrentMinutesIst,
  getTodayIstDate,
  parseHmMinutes,
} from '../utils/advisoryHelpers';
import { canTriggerAction, sanitizeHref } from '../utils/security';
import { EditorialReveal } from '../components/EditorialReveal';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import {
  GlassButton,
  GlassCard,
  GlassImageFrame,
  GlassModal,
  GlassPanel,
} from '../components/liquid-glass';
import { RazorpayCheckoutButton } from '../components/RazorpayCheckoutButton';
import { ResilientImage } from '../components/ResilientImage';

interface AdvisoryPageProps {
  onNavigate: (route: AppRoute) => void;
}

const FOCUS_PILLARS = [
  {
    number: '01',
    title: 'Business Clarity & Feasibility',
    description:
      'Stress-test commercial models, customer demand assumptions, pricing logic, and realistic operational milestones before committing heavy capital.',
  },
  {
    number: '02',
    title: 'Sales & Enquiry Structure',
    description:
      'Align marketing channels, enquiry qualification discipline, and showroom or B2B sales conversion habits so leads translate into revenue.',
  },
  {
    number: '03',
    title: 'Focused Venture Direction',
    description:
      'Untangle competing priorities across retail, publishing, digital products, or dealership teams into a clear sequence of next actions.',
  },
];

export function AdvisoryBookingForm() {
  const { settings } = useSiteConfig();
  const todayIst = getTodayIstDate();

  const [selectedDate, setSelectedDate] = useState<string>(() => addDaysIst(todayIst, 1));
  const [dateValidationError, setDateValidationError] = useState('');
  const [availability, setAvailability] = useState<DateAvailabilityResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(
    null
  );

  // Booking Request Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [businessName, setBusinessName] = useState('');
  const [website, setWebsite] = useState('');
  const [businessStage, setBusinessStage] = useState<string>(BUSINESS_STAGES[1]);
  const [consultationTopic, setConsultationTopic] = useState<string>(CONSULTATION_TOPICS[0]);
  const [businessChallenge, setBusinessChallenge] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmationResult | null>(null);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string | null>(null);

  // Personal Google Calendar Integration (in-memory OAuth token only)
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const [busyIntervals, setBusyIntervals] = useState<WorkspaceFreeBusyInterval[]>([]);
  const [calendarNotice, setCalendarNotice] = useState('');
  const [calendarError, setCalendarError] = useState('');
  const [confirmCalendarModalOpen, setConfirmCalendarModalOpen] = useState(false);
  const [creatingCalendarEvent, setCreatingCalendarEvent] = useState(false);
  const [createdCalendarLink, setCreatedCalendarLink] = useState('');

  const feeDisplay = settings.consultationFee || 'Contact Us for Consultation Fee.';

  useEffect(() => {
    const unsub = initWorkspaceAuth(
      (authedUser, token) => {
        setGoogleUser(authedUser);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
        setBusyIntervals([]);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    if (!googleToken || !selectedDate || dateValidationError) {
      setBusyIntervals([]);
      return;
    }
    let active = true;
    const dayStartIso = `${selectedDate}T00:00:00+05:30`;
    const dayEndIso = `${selectedDate}T23:59:59+05:30`;
    queryCalendarFreeBusy(googleToken, ['primary'], dayStartIso, dayEndIso)
      .then((busy) => {
        if (active) setBusyIntervals(busy);
      })
      .catch(() => {
        if (active) setBusyIntervals([]);
      });
    return () => {
      active = false;
    };
  }, [googleToken, selectedDate, dateValidationError]);

  const handleGoogleConnect = async () => {
    setGoogleSigningIn(true);
    setCalendarError('');
    setCalendarNotice('');
    try {
      const res = await signInWithGoogleWorkspace();
      setGoogleUser(res.user);
      setGoogleToken(res.accessToken);
      setCalendarNotice(
        `Connected ${res.user.email || 'Google Calendar'} to check slot availability.`
      );
    } catch (err) {
      setCalendarError(
        err instanceof Error ? err.message : 'Unable to connect Google Calendar.'
      );
    } finally {
      setGoogleSigningIn(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    await logoutWorkspaceGoogle();
    setGoogleToken(null);
    setGoogleUser(null);
    setBusyIntervals([]);
    setCalendarNotice('');
  };

  const isSlotBusyInPersonalCalendar = (
    dateStr: string,
    startTime: string,
    endTime: string
  ): boolean => {
    if (busyIntervals.length === 0) return false;
    const slotStart = Date.parse(`${dateStr}T${startTime}:00+05:30`);
    const slotEnd = Date.parse(`${dateStr}T${endTime}:00+05:30`);
    return busyIntervals.some((b) => {
      const busyStart = Date.parse(b.start);
      const busyEnd = Date.parse(b.end);
      return Number.isFinite(busyStart) && Number.isFinite(busyEnd) && slotStart < busyEnd && slotEnd > busyStart;
    });
  };

  const handleConfirmedAddToCalendar = async () => {
    if (!confirmation) return;
    setCalendarError('');
    setCreatingCalendarEvent(true);
    try {
      let token = googleToken || (await getWorkspaceAccessToken());
      if (!token) {
        const res = await signInWithGoogleWorkspace();
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        token = res.accessToken;
      }
      const created = await createCalendarEvent(token, 'primary', {
        summary: `AKYIN Business Advisory (${confirmation.bookingId})`,
        description: `Business Advisory consultation request (${confirmation.bookingId}). Status: ${confirmation.bookingStatus} · ${confirmation.paymentStatus}. Contact: connect@akyin.com · WhatsApp Connect`,
        startDateTime: `${confirmation.appointmentDate}T${confirmation.startTime}:00+05:30`,
        endDateTime: `${confirmation.appointmentDate}T${confirmation.endTime}:00+05:30`,
        timeZone: 'Asia/Kolkata',
      });
      setCreatedCalendarLink(created.htmlLink || '');
      setCalendarNotice('Added consultation hold to your Google Calendar.');
      setConfirmCalendarModalOpen(false);
    } catch (err) {
      setCalendarError(
        err instanceof Error ? err.message : 'Could not create Google Calendar event.'
      );
    } finally {
      setCreatingCalendarEvent(false);
    }
  };

  const validateClientDate = (dateValue: string): string => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return 'Please select a valid date (YYYY-MM-DD).';
    }
    const currentTodayIst = getTodayIstDate();
    if (dateValue < currentTodayIst) {
      return 'Past dates cannot be selected. Please pick today or an upcoming IST date.';
    }
    return '';
  };

  useEffect(() => {
    const clientErr = validateClientDate(selectedDate);
    setDateValidationError(clientErr);
    setSelectedSlot(null);

    if (clientErr) {
      setAvailability(null);
      setSlotError('');
      setLoadingSlots(false);
      return;
    }

    let active = true;
    setLoadingSlots(true);
    setSlotError('');

    akyinApiClient
      .fetchAvailability(selectedDate)
      .then((res) => {
        if (!active) return;
        setAvailability(res);
        const firstOpen = res.slots.find((s) => s.available);
        if (firstOpen) {
          setSelectedSlot({ startTime: firstOpen.startTime, endTime: firstOpen.endTime });
        }
      })
      .catch((err) => {
        if (!active) return;
        setSlotError(
          err instanceof Error ? err.message : 'Unable to fetch time slots from Google Sheets.'
        );
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDate]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (honeypot.trim().length > 0) return;

    if (!canTriggerAction('advisory-booking-submit', 2000)) {
      setSubmitError('Please wait a moment before submitting another request.');
      return;
    }

    const dateErr = validateClientDate(selectedDate);
    if (dateErr) {
      setDateValidationError(dateErr);
      setSubmitError(dateErr);
      return;
    }

    if (!selectedSlot) {
      const slotMsg = 'Please select an available IST consultation slot.';
      setFormErrors((prev) => ({
        ...prev,
        startTime: slotMsg,
      }));
      setSubmitError(slotMsg);
      return;
    }

    if (selectedDate === getTodayIstDate()) {
      const nowMinIst = getCurrentMinutesIst();
      if (parseHmMinutes(selectedSlot.startTime) <= nowMinIst + 15) {
        const elapsedMsg =
          'This IST slot has already elapsed. Please select a later slot or date.';
        setFormErrors((prev) => ({
          ...prev,
          startTime: elapsedMsg,
        }));
        setSubmitError(elapsedMsg);
        return;
      }
    }

    const candidate = {
      customerName,
      phone,
      email,
      city,
      country,
      businessName,
      website,
      businessStage,
      consultationTopic,
      businessChallenge,
      appointmentDate: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    };

    const parsed = advisoryBookingSchema.safeParse(candidate);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || 'form');
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFormErrors(nextErrors);
      setSubmitError('Please review the highlighted fields above before submitting your request.');
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    try {
      const result = await akyinApiClient.submitBooking(parsed.data);
      setConfirmation(result);
      const updated = await akyinApiClient.fetchAvailability(selectedDate);
      setAvailability(updated);
      setSelectedSlot(null);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to submit booking request. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const quickDates = Array.from({ length: 7 }, (_, i) => addDaysIst(todayIst, i));

  const fieldCls = (hasErr: boolean) =>
    `w-full rounded-xl border bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] transition-colors focus:outline-none ${
      hasErr
        ? 'border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/15'
        : 'border-[#E8E8ED] focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15'
    }`;

  if (confirmation) {
    return (
      <GlassPanel className="rounded-3xl p-8 sm:p-10 max-w-3xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="font-mono-num text-xs font-bold text-[#1D1D1F]">
              Reference ID: {confirmation.bookingId}
            </p>
            <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">
              Consultation Request Received
            </h3>
            <p className="text-sm text-[#1D1D1F] leading-relaxed bg-[#FFFFFF]/80 border border-[#E8E8ED] rounded-2xl p-4">
              {confirmation.confirmationNotice}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#1D1D1F]/8 text-sm">
          <div>
            <p className="text-xs text-[#6E6E73]">Requested Date</p>
            <p className="font-mono-num font-semibold text-[#1D1D1F] mt-0.5">
              {formatFriendlyDateIst(confirmation.appointmentDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#6E6E73]">Time Slot (IST)</p>
            <p className="font-mono-num font-semibold text-[#1D1D1F] mt-0.5">
              {confirmation.slotLabel}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#6E6E73]">Current Status</p>
            <p className="font-semibold text-[#1D1D1F] mt-0.5">
              {razorpayPaymentId
                ? `Paid · Verified (${razorpayPaymentId})`
                : `${confirmation.bookingStatus} · ${confirmation.paymentStatus}`}
            </p>
          </div>
        </div>

        {/* Instant Razorpay Settlement Option for Requested Slot */}
        <div className="rounded-2xl border border-white/85 bg-white/70 backdrop-blur-md p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[#1D1D1F]">
                Complete Consultation Fee Online (Razorpay · ₹3,998)
              </p>
              <p className="text-[11px] text-[#6E6E73]">
                Pay via UPI, Card, or NetBanking to fast-track your slot confirmation for reference{' '}
                <span className="font-mono-num font-semibold text-[#1D1D1F]">
                  {confirmation.bookingId}
                </span>
                .
              </p>
            </div>
            <span className="font-mono-num text-sm font-bold text-[#1D1D1F]">₹3,998</span>
          </div>
          <RazorpayCheckoutButton
            sku="advisory-session"
            label="Pay ₹3,998 Consultation Fee via Razorpay"
            variant="primary"
            size="md"
            referenceId={confirmation.bookingId}
            prefill={{
              name: customerName,
              email,
              contact: phone,
            }}
            onVerified={(res) => setRazorpayPaymentId(res.paymentId)}
          />
        </div>

        {confirmation.emailStatus.error && (
          <p className="text-xs text-[#6E6E73] bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl px-4 py-3">
            Notification status: {confirmation.emailStatus.error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <GlassButton
            href={sanitizeHref(OFFICIAL_CONTACT.whatsappUrl, OFFICIAL_CONTACT.whatsappChannelUrl)}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            size="md"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Follow Up via WhatsApp Connect</span>
          </GlassButton>
          {createdCalendarLink ? (
            <GlassButton
              href={sanitizeHref(createdCalendarLink, '#')}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              size="md"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>View Event in Google Calendar</span>
            </GlassButton>
          ) : (
            <GlassButton
              variant="subtle"
              size="md"
              onClick={() => setConfirmCalendarModalOpen(true)}
            >
              <CalendarPlus className="w-4 h-4" aria-hidden="true" />
              <span>Add to My Google Calendar</span>
            </GlassButton>
          )}
          <GlassButton
            variant="subtle"
            size="md"
            onClick={() => {
              setConfirmation(null);
              setRazorpayPaymentId(null);
              setCreatedCalendarLink('');
              setCalendarNotice('');
            }}
          >
            Submit Another Request
          </GlassButton>
        </div>

        {calendarNotice && (
          <p className="text-xs font-semibold text-[#1D1D1F]">{calendarNotice}</p>
        )}
        {calendarError && (
          <p className="text-xs font-semibold text-[#D92D20]">{calendarError}</p>
        )}

        <GlassModal
          open={confirmCalendarModalOpen}
          onClose={() => !creatingCalendarEvent && setConfirmCalendarModalOpen(false)}
          subtitle="GOOGLE CALENDAR CONFIRMATION"
          title="Add Consultation Hold to Your Google Calendar?"
        >
          <div className="space-y-4 text-sm">
            <p className="text-[#1D1D1F] leading-relaxed">
              This will create an event titled{' '}
              <strong>AKYIN Business Advisory ({confirmation.bookingId})</strong> on{' '}
              <span className="font-mono-num">
                {formatFriendlyDateIst(confirmation.appointmentDate)} ({confirmation.slotLabel})
              </span>{' '}
              in your primary Google Calendar.
            </p>
            {!googleToken && (
              <p className="text-xs text-[#6E6E73]">
                You will be prompted to sign in with Google if not already connected.
              </p>
            )}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E8E8ED]">
              <GlassButton
                variant="subtle"
                size="sm"
                disabled={creatingCalendarEvent}
                onClick={() => setConfirmCalendarModalOpen(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="primary"
                size="sm"
                disabled={creatingCalendarEvent}
                onClick={() => void handleConfirmedAddToCalendar()}
              >
                {creatingCalendarEvent ? 'Creating Event...' : 'Confirm & Add Event'}
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      </GlassPanel>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Dynamic IST Slot Picker + Consultation Policy + Payment Requirement */}
      <div className="lg:col-span-5 space-y-5">
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="advisory-date"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                <span>1. Select Date (Asia/Kolkata IST)</span>
              </label>
              <span className="font-mono-num text-[11px] text-[#6E6E73]">Min: {todayIst}</span>
            </div>

            <input
              id="advisory-date"
              type="date"
              min={todayIst}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-white/80 bg-white/75 backdrop-blur-md px-3.5 py-2.5 text-sm font-mono-num text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#1D1D1F]/50 focus:ring-2 focus:ring-[#1D1D1F]/15"
            />

            {dateValidationError && (
              <p role="alert" className="text-xs font-semibold text-[#D92D20]">
                {dateValidationError}
              </p>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 gap-1.5 pt-1">
              {quickDates.map((d) => {
                const active = selectedDate === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`px-2 py-2 rounded-xl text-[11px] font-mono-num font-semibold transition-all cursor-pointer ${
                      active
                        ? 'liquid-glass-pill-dark text-white shadow-xs'
                        : 'frosted-glass-pill text-[#1D1D1F] hover:bg-white'
                    }`}
                  >
                    {d.slice(5)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[#1D1D1F]/8" />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]">
                <Clock className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                <span>2. Available Time Slots</span>
              </p>
              <span className="text-[11px] text-[#6E6E73]">
                {formatFriendlyDateIst(selectedDate)}
              </span>
            </div>

            {loadingSlots ? (
              <div className="space-y-2">
                <div className="h-12 rounded-xl bg-[#ECECF0] animate-pulse" />
                <div className="h-12 rounded-xl bg-[#ECECF0] animate-pulse" />
              </div>
            ) : slotError ? (
              <p className="text-xs text-[#D92D20] font-semibold">{slotError}</p>
            ) : availability?.blocked ? (
              <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-4 text-xs text-[#6E6E73]">
                {availability.reason}
              </div>
            ) : (
              <div className="space-y-2.5">
                {availability?.reason && (
                  <p className="text-xs text-[#3A3A3F] font-medium">{availability.reason}</p>
                )}
                {(availability?.slots || []).map((slot) => {
                  const isSelected =
                    selectedSlot?.startTime === slot.startTime &&
                    selectedSlot?.endTime === slot.endTime;
                  const personalBusy =
                    slot.available &&
                    isSlotBusyInPersonalCalendar(selectedDate, slot.startTime, slot.endTime);
                  return (
                    <button
                      key={`${slot.startTime}-${slot.endTime}`}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => {
                        setSelectedSlot({
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                        });
                        setFormErrors((prev) => {
                          const next = { ...prev };
                          delete next.startTime;
                          return next;
                        });
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
                        !slot.available
                          ? 'bg-[#F5F5F7]/80 border-[#E8E8ED] text-[#A1A1A6] cursor-not-allowed'
                          : isSelected
                            ? 'liquid-glass-pill-dark text-white cursor-pointer shadow-xs'
                            : 'frosted-glass-card hover:border-[#1D1D1F]/30 text-[#1D1D1F] cursor-pointer'
                      }`}
                    >
                      <span className="font-mono-num text-xs sm:text-sm font-semibold">
                        {slot.label}
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${
                          isSelected
                            ? 'text-white'
                            : personalBusy
                              ? 'text-[#B42318]'
                              : slot.available
                                ? 'text-[#1D1D1F]'
                                : 'text-[#A1A1A6]'
                        }`}
                      >
                        {slot.available
                          ? isSelected
                            ? 'Selected'
                            : personalBusy
                              ? 'Busy on Your Calendar'
                              : 'Available'
                          : slot.reason}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {formErrors.startTime && (
              <p role="alert" className="text-xs font-semibold text-[#D92D20]">
                {formErrors.startTime}
              </p>
            )}
          </div>

          <div className="h-px bg-[#1D1D1F]/8" />

          {/* Optional Personal Google Calendar Conflict Check */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#1D1D1F]">
              Check Against Your Google Calendar (Optional)
            </p>
            {googleUser && googleToken ? (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#6E6E73] truncate max-w-[220px]">
                  Connected: <strong className="text-[#1D1D1F]">{googleUser.email}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => void handleGoogleDisconnect()}
                  className="text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] underline cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <GoogleSignInButton
                onClick={() => void handleGoogleConnect()}
                loading={googleSigningIn}
                label="Sign in with Google"
              />
            )}
            {calendarNotice && (
              <p className="text-[11px] text-[#6E6E73]">{calendarNotice}</p>
            )}
            {calendarError && (
              <p className="text-[11px] font-semibold text-[#D92D20]">{calendarError}</p>
            )}
          </div>
        </div>

        {/* Consultation Policy & Payment Requirement Card */}
        <GlassPanel className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 font-bold text-[#1D1D1F]">
              <FileCheck2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
              <span>Consultation Policy</span>
            </div>
            <p className="text-[#6E6E73] leading-relaxed">
              Sessions run on India Standard Time (<span className="font-mono-num">Asia/Kolkata</span>), limited to daily capacity (default 2 slots per day, {settings.advisorySlotDuration || '30'} minutes each). Submitting a request reserves the slot provisionally pending team review.
            </p>
          </div>

          <div className="h-px bg-[#1D1D1F]/8" />

          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 font-bold text-[#1D1D1F]">
              <CreditCard className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
              <span>Payment &amp; Razorpay Checkout</span>
            </div>
            <p className="font-semibold text-[#1D1D1F]">
              Consultation Fee: {feeDisplay}
            </p>
            <p className="text-[#6E6E73] leading-relaxed">
              Submit your requested IST slot to settle the fee online via Razorpay (UPI, Cards, NetBanking) with HMAC-SHA256 verification, or confirm directly with our advisory desk. Appointments finalize once payment is verified.
            </p>
            <RazorpayCheckoutButton
              sku="advisory-session"
              label="Pay ₹1,999 Consultation Fee Now"
              variant="glass"
              size="sm"
              prefill={{
                name: customerName,
                email,
                contact: phone,
              }}
              className="w-full"
            />
          </div>
        </GlassPanel>
      </div>

      {/* Right: Frosted Glass Consultation Request Form */}
      <form
        onSubmit={handleBookingSubmit}
        noValidate
        toolname="book_akyin_advisory"
        tooldescription="Submit a 1-on-1 30-minute IST business advisory consultation booking request with AKYIN Ventures."
        className="lg:col-span-7 frosted-glass-panel rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
      >
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="advisory-honeypot">Organization Ref</label>
          <input
            id="advisory-honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8E8ED]">
          <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
            3. Consultation Details
          </h3>
          {selectedSlot && (
            <span className="font-mono-num text-xs font-semibold text-[#1D1D1F]">
              {selectedDate} · {selectedSlot.startTime}–{selectedSlot.endTime} IST
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="adv-name" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Customer Name *
            </label>
            <input
              id="adv-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your full name"
              className={fieldCls(Boolean(formErrors.customerName))}
            />
            {formErrors.customerName && (
              <p className="mt-1 text-xs text-[#D92D20] font-semibold">
                {formErrors.customerName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="adv-phone" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Phone / WhatsApp *
            </label>
            <input
              id="adv-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98XXXXXXXX"
              className={fieldCls(Boolean(formErrors.phone))}
            />
            {formErrors.phone && (
              <p className="mt-1 text-xs text-[#D92D20] font-semibold">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="adv-email" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Email Address *
            </label>
            <input
              id="adv-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className={fieldCls(Boolean(formErrors.email))}
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-[#D92D20] font-semibold">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="adv-business" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Business Name
            </label>
            <input
              id="adv-business"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Company or proposed venture"
              className={fieldCls(Boolean(formErrors.businessName))}
            />
          </div>

          <div>
            <label htmlFor="adv-city" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              City *
            </label>
            <input
              id="adv-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Hyderabad, Mumbai"
              className={fieldCls(Boolean(formErrors.city))}
            />
            {formErrors.city && (
              <p className="mt-1 text-xs text-[#D92D20] font-semibold">{formErrors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="adv-country" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Country *
            </label>
            <input
              id="adv-country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. India, UAE"
              className={fieldCls(Boolean(formErrors.country))}
            />
            {formErrors.country && (
              <p className="mt-1 text-xs text-[#D92D20] font-semibold">{formErrors.country}</p>
            )}
          </div>

          <div>
            <label htmlFor="adv-website" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Website (Optional)
            </label>
            <input
              id="adv-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className={fieldCls(Boolean(formErrors.website))}
            />
            {formErrors.website && (
              <p className="mt-1 text-xs text-[#D92D20] font-semibold">{formErrors.website}</p>
            )}
          </div>

          <div>
            <label htmlFor="adv-stage" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Business Stage *
            </label>
            <select
              id="adv-stage"
              value={businessStage}
              onChange={(e) => setBusinessStage(e.target.value)}
              className={fieldCls(Boolean(formErrors.businessStage))}
            >
              {BUSINESS_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="adv-topic" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
            Consultation Topic *
          </label>
          <select
            id="adv-topic"
            value={consultationTopic}
            onChange={(e) => setConsultationTopic(e.target.value)}
            className={fieldCls(Boolean(formErrors.consultationTopic))}
          >
            {CONSULTATION_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="adv-challenge" className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
            Business Challenge / Context *
          </label>
          <textarea
            id="adv-challenge"
            rows={4}
            value={businessChallenge}
            onChange={(e) => setBusinessChallenge(e.target.value)}
            placeholder="Briefly describe your business question, current bottlenecks, or goals for this consultation..."
            className={fieldCls(Boolean(formErrors.businessChallenge))}
          />
          {formErrors.businessChallenge && (
            <p className="mt-1 text-xs text-[#D92D20] font-semibold">
              {formErrors.businessChallenge}
            </p>
          )}
        </div>

        {submitError && (
          <div
            role="alert"
            className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] p-4 flex items-start gap-2.5 text-xs font-semibold text-[#B42318]"
          >
            <AlertCircle className="w-4 h-4 text-[#D92D20] shrink-0 mt-0.5" aria-hidden="true" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <GlassButton
            type="submit"
            disabled={submitting || Boolean(dateValidationError)}
            variant="primary"
            size="lg"
          >
            <span>{submitting ? 'Submitting Request...' : 'Submit Consultation Request'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </GlassButton>
          <p className="text-[11px] text-[#6E6E73] max-w-xs">
            Confirmed only after AKYIN team review &amp; payment verification.
          </p>
        </div>
      </form>
    </div>
  );
}

export function AdvisoryPage({ onNavigate }: AdvisoryPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const { settings, isLiveBackend } = useSiteConfig();
  const [showAppsScriptBridge, setShowAppsScriptBridge] = useState(false);

  const appsScriptUrl = akyinApiClient.getEndpointUrl();
  const feeDisplay = settings.consultationFee || 'Contact Us for Consultation Fee.';

  useEffect(() => {
    if (!showAppsScriptBridge || !appsScriptUrl) return;
    let allowedOrigin = '';
    try {
      allowedOrigin = new URL(appsScriptUrl).origin;
    } catch {
      return;
    }
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== allowedOrigin &&
        event.origin !== 'https://script.googleusercontent.com'
      ) {
        return;
      }
      if (
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === 'AKYIN_BOOKING_CREATED'
      ) {
        setShowAppsScriptBridge(false);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [showAppsScriptBridge, appsScriptUrl]);

  return (
    <div>
      {/* 1. Apple-Inspired Liquid Glass Advisory Hero */}
      <section className="surface-silver-gradient text-[#1D1D1F] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E8E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              AKYIN Business Advisory · 1-on-1 Strategy &amp; Consultation
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.025em] leading-[1.06] text-[#1D1D1F] text-balance">
              {settings.advisoryHeadline || 'Your Business. Your Vision. A Clearer Direction.'}
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed max-w-2xl">
              {settings.advisorySubheadline}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <GlassButton href="#book-advisory" variant="primary" size="lg">
                <span>Select Consultation Slot</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </GlassButton>
              <GlassButton
                variant="glass"
                size="lg"
                onClick={() => onNavigate('/ventures/biznxt')}
              >
                Explore BizNXT.online
              </GlassButton>
            </div>
          </motion.div>

          {/* Right Frosted Studio Frame + Schedule Summary GlassPanel */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            <GlassImageFrame>
              <div className="aspect-[16/9] bg-[#FFFFFF] overflow-hidden">
                <ResilientImage
                  src={IMAGES.liquidGlassAdvisory}
                  alt="Apple-style translucent sapphire-grey crystal desk clock with brushed steel frame bearing AKYIN emblem"
                  loading="eager"
                  fallbackTitle="AKYIN Business Advisory Studio"
                  className="w-full h-full bg-[#FFFFFF]"
                  imageClassName="object-contain p-3"
                />
              </div>
            </GlassImageFrame>

            <GlassPanel className="p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                  Consultation Schedule Overview
                </p>
                <span className="font-mono-num text-[11px] font-semibold text-[#6E6E73]">
                  Asia/Kolkata (IST)
                </span>
              </div>

              <div className="space-y-2.5 text-sm divide-y divide-[#1D1D1F]/8">
                <div className="pt-1 pb-2.5 flex items-center justify-between gap-4">
                  <span className="text-[#6E6E73]">Default Evening Window</span>
                  <span className="font-mono-num font-semibold text-[#1D1D1F]">
                    6:00 PM – 7:00 PM IST
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between gap-4">
                  <span className="text-[#6E6E73]">Session Duration</span>
                  <span className="font-mono-num font-semibold text-[#1D1D1F]">
                    {settings.advisorySlotDuration || '30'} Minutes
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between gap-4">
                  <span className="text-[#6E6E73]">Consultation Fee</span>
                  <span className="font-semibold text-[#1D1D1F] text-right">
                    {feeDisplay}
                  </span>
                </div>
                <div className="pt-2.5 flex items-start gap-2.5 text-xs text-[#6E6E73] leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-[#1D1D1F] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Appointments are reviewed personally by AKYIN Ventures. Slots are finalized only after team contact and payment verification.
                  </span>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      {/* 2. Focus Pillars */}
      <section className="py-16 lg:py-20 bg-[#FFFFFF] border-b border-[#E8E8ED]">
        <EditorialReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
              Advisory Scope
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
              Practical Business Guidance Without Generic Formulas.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FOCUS_PILLARS.map((item) => (
              <GlassCard key={item.number} interactive className="p-7 space-y-3">
                <span className="font-mono-num text-xs font-bold text-[#1D1D1F]">
                  {item.number}
                </span>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  {item.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </EditorialReveal>
      </section>

      {/* 3. Live IST Slot Selection & AdvisoryBookingForm */}
      <section id="book-advisory" className="py-20 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                <Compass className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                <span>Schedule a Consultation Request</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                Choose Your Date &amp; IST Time Slot.
              </h2>
            </div>

            {appsScriptUrl && (
              <GlassButton
                variant="subtle"
                size="sm"
                onClick={() => setShowAppsScriptBridge((prev) => !prev)}
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                <span>
                  {showAppsScriptBridge
                    ? 'Use Branded Booking Form'
                    : 'Open Standalone Google Booking View'}
                </span>
              </GlassButton>
            )}
          </div>

          {!isLiveBackend && (
            <GlassPanel className="px-5 py-3.5 text-xs text-[#6E6E73] flex flex-wrap items-center justify-between gap-3">
              <span>
                Preview scheduling mode active — connect your deployed Google Apps Script Web App URL in Admin Security to sync directly with Google Sheets, Google Calendar, and MailApp.
              </span>
              <span className="font-mono-num font-semibold text-[#1D1D1F]">IST · Asia/Kolkata</span>
            </GlassPanel>
          )}

          {showAppsScriptBridge && appsScriptUrl ? (
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E8E8ED] overflow-hidden p-4 space-y-3 shadow-[0_10px_32px_rgba(0,0,0,0.04)]">
              <p className="text-xs text-[#6E6E73]">
                Direct Google Apps Script HTML Service view (origin-validated):
              </p>
              <iframe
                title="AKYIN Business Advisory Google Apps Script Booking"
                src={`${appsScriptUrl}${appsScriptUrl.includes('?') ? '&' : '?'}view=booking`}
                className="w-full h-[640px] rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]"
                sandbox="allow-scripts allow-forms allow-same-origin"
              />
            </div>
          ) : (
            <AdvisoryBookingForm />
          )}
        </div>
      </section>
    </div>
  );
}
