import { useMemo, useState } from 'react';
import { Download, Mail, MessageCircle, Search } from 'lucide-react';
import { BUSINESS_VERTICAL_OPTIONS } from '../../data/akyinData';
import {
  ENQUIRY_STATUS_OPTIONS,
  EnquiryRecord,
  EnquiryStatus,
} from '../../types/advisory';
import { sanitizeHref } from '../../utils/security';
import { GlassButton } from '../liquid-glass';

interface AdminEnquiriesPanelProps {
  enquiries: EnquiryRecord[];
  onUpdateEnquiry: (payload: {
    enquiryId: string;
    enquiryStatus: EnquiryStatus;
    adminNotes: string;
  }) => Promise<void>;
}

function escapeCsvCell(val: string): string {
  const raw = String(val || '');
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function AdminEnquiriesPanel({
  enquiries,
  onUpdateEnquiry,
}: AdminEnquiriesPanelProps) {
  const [verticalFilter, setVerticalFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((item) => {
      if (verticalFilter !== 'ALL' && item.vertical !== verticalFilter) return false;
      if (statusFilter !== 'ALL' && item.enquiryStatus !== statusFilter) return false;
      if (!q) return true;
      return (
        item.enquiryId.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.business.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.enquiryType.toLowerCase().includes(q)
      );
    });
  }, [enquiries, verticalFilter, statusFilter, search]);

  const handleExportCsv = () => {
    const headers = [
      'Enquiry ID',
      'Created At',
      'Name',
      'Business',
      'Phone',
      'Email',
      'City',
      'Country',
      'Business Vertical',
      'Enquiry Type',
      'Message',
      'Status',
      'Admin Notes',
    ];
    const rows = filtered.map((e) =>
      [
        e.enquiryId,
        e.createdAt,
        e.name,
        e.business,
        e.phone,
        e.email,
        e.city,
        e.country,
        e.vertical,
        e.enquiryType,
        e.message,
        e.enquiryStatus,
        e.adminNotes,
      ]
        .map(escapeCsvCell)
        .join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `akyin-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Enquiries Inbox
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Track, filter, annotate, and export incoming corporate and vertical enquiries.
          </p>
        </div>

        <GlassButton
          onClick={handleExportCsv}
          disabled={filtered.length === 0}
          variant="subtle"
          size="sm"
        >
          <Download className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
          <span>Export CSV ({filtered.length})</span>
        </GlassButton>
      </div>

      {/* Filters */}
      <div className="liquid-glass-card rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search
            className="w-4 h-4 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiry ID, contact, company..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] text-xs text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={verticalFilter}
            onChange={(e) => setVerticalFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
          >
            <option value="ALL">All Verticals</option>
            {BUSINESS_VERTICAL_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
          >
            <option value="ALL">All Statuses</option>
            {ENQUIRY_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="liquid-glass-card rounded-3xl p-10 text-center space-y-2">
          <p className="text-sm font-semibold text-[#1D1D1F]">No enquiries recorded yet.</p>
          <p className="text-xs text-[#6E6E73]">
            Submissions from Contact &amp; Vertical Enquiry forms appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const notesValue =
              editingNotes[item.enquiryId] !== undefined
                ? editingNotes[item.enquiryId]
                : item.adminNotes;
            const digitsOnly = item.phone.replace(/\D/g, '');
            return (
              <article
                key={item.enquiryId}
                className="liquid-glass-card rounded-3xl p-5 sm:p-6 space-y-4 text-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-num font-bold text-[#1D1D1F]">
                        {item.enquiryId}
                      </span>
                      <span className="text-[#A1A1A6]">·</span>
                      <span className="font-mono-num text-[#6E6E73]">{item.createdAt}</span>
                      <span className="text-[#A1A1A6]">·</span>
                      <span className="font-semibold text-[#1D1D1F]">{item.vertical}</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-[#1D1D1F]">
                      {item.name} {item.business ? `(${item.business})` : ''}
                    </h3>
                    <p className="text-[#6E6E73]">
                      {item.city}, {item.country} · <span className="font-mono-num">{item.phone}</span> · {item.email}
                    </p>
                    <p className="font-semibold text-[#1D1D1F]">Type: {item.enquiryType}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {digitsOnly && (
                      <a
                        href={sanitizeHref(`https://wa.me/${digitsOnly}`, '#')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF]/80 hover:border-[#1D1D1F] font-semibold text-[#1D1D1F]"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                        WhatsApp
                      </a>
                    )}
                    <a
                      href={sanitizeHref(`mailto:${item.email}`, '#', true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF]/80 hover:border-[#1D1D1F] font-semibold text-[#1D1D1F]"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                      Email
                    </a>
                    <select
                      value={item.enquiryStatus}
                      onChange={(e) =>
                        onUpdateEnquiry({
                          enquiryId: item.enquiryId,
                          enquiryStatus: e.target.value as EnquiryStatus,
                          adminNotes: notesValue,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] font-semibold text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
                    >
                      {ENQUIRY_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {item.message && (
                  <p className="bg-[#FFFFFF]/80 border border-[#E8E8ED] rounded-2xl p-3.5 text-[#1D1D1F] leading-relaxed">
                    {item.message}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={notesValue}
                    onChange={(e) =>
                      setEditingNotes((prev) => ({
                        ...prev,
                        [item.enquiryId]: e.target.value,
                      }))
                    }
                    placeholder="Add internal follow-up notes..."
                    className="flex-1 rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
                  />
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      onUpdateEnquiry({
                        enquiryId: item.enquiryId,
                        enquiryStatus: item.enquiryStatus,
                        adminNotes: notesValue,
                      })
                    }
                  >
                    Save Notes
                  </GlassButton>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
