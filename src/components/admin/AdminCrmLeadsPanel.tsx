import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  MessageSquarePlus,
  Plus,
  Search,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { CrmLead, CrmStage, PublicSuiteUser, suiteApi } from '../../services/suiteApi';
import { GlassButton, GlassModal } from '../liquid-glass';

interface AdminCrmLeadsPanelProps {
  staffUsers?: PublicSuiteUser[];
  onChanged?: () => void;
}

const SECONDARY_TAGS = ['', 'Follow-up required', 'On hold', 'Not interested'] as const;
const PAGE_SIZE = 10;

export function AdminCrmLeadsPanel({ staffUsers = [], onChanged }: AdminCrmLeadsPanelProps) {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [stages, setStages] = useState<string[]>([
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'PROPOSAL SENT',
    'NEGOTIATION',
    'WON',
    'LOST',
  ]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [saving, setSaving] = useState(false);

  // Selected lead editable fields
  const [draftStage, setDraftStage] = useState<CrmStage>('NEW');
  const [draftTag, setDraftTag] = useState('');
  const [draftAssignee, setDraftAssignee] = useState('');
  const [draftFollowUp, setDraftFollowUp] = useState('');
  const [draftSource, setDraftSource] = useState('Website');
  const [draftDealValue, setDraftDealValue] = useState('0');
  const [draftLostReason, setDraftLostReason] = useState('');
  const [draftNotes, setDraftNotes] = useState('');

  // Activity composer
  const [actType, setActType] = useState<'note' | 'call' | 'email' | 'whatsapp'>('call');
  const [actSummary, setActSummary] = useState('');

  // New Lead Modal
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    fullName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    city: '',
    country: 'India',
    businessCategory: '',
    requiredService: 'Digital marketing',
    estimatedBudget: '',
    campaignSource: 'Direct contact',
    expectedDealValue: '0',
    description: '',
  });

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await suiteApi.getLeads({
        q: search.trim() || undefined,
        stage: stageFilter !== 'ALL' ? stageFilter : undefined,
        source: sourceFilter !== 'ALL' ? sourceFilter : undefined,
      });
      setLeads(res.leads);
      if (res.stages?.length) setStages(res.stages);
      if (res.sources?.length) setSources(res.sources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load leads.');
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter, sourceFilter]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    setPage(1);
  }, [search, stageFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(leads.length / PAGE_SIZE));
  const pagedLeads = useMemo(
    () => leads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [leads, page]
  );

  const openLeadDetail = (lead: CrmLead) => {
    setSelectedLead(lead);
    setDraftStage(lead.stage);
    setDraftTag(lead.secondaryTag || '');
    setDraftAssignee(lead.assignedToUserId || '');
    setDraftFollowUp(lead.followUpAt || '');
    setDraftSource(lead.campaignSource || 'Website');
    setDraftDealValue(String(lead.expectedDealValue || 0));
    setDraftLostReason(lead.lostReason || '');
    setDraftNotes(lead.privateNotes || '');
    setActSummary('');
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.updateLead(selectedLead.leadId, {
        stage: draftStage,
        secondaryTag: draftTag,
        assignedToUserId: draftAssignee,
        followUpAt: draftFollowUp,
        campaignSource: draftSource,
        expectedDealValue: Math.max(0, Number(draftDealValue) || 0),
        lostReason: draftLostReason,
        privateNotes: draftNotes,
      });
      setSelectedLead(res.lead);
      setNotice(`Saved CRM updates for ${res.lead.leadId}.`);
      await loadLeads();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !actSummary.trim()) return;
    setSaving(true);
    try {
      const res = await suiteApi.addLeadActivity(selectedLead.leadId, actType, actSummary.trim());
      setSelectedLead(res.lead);
      setActSummary('');
      await loadLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log activity.');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertClient = async (leadId: string) => {
    setSaving(true);
    setError('');
    try {
      const res = await suiteApi.convertLeadToClient(leadId);
      setSelectedLead(res.lead);
      setNotice(`Converted ${leadId} into verified client "${res.client.name}".`);
      await loadLeads();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await suiteApi.createLead({
        ...newLead,
        expectedDealValue: Math.max(0, Number(newLead.expectedDealValue) || 0),
      });
      setNewModalOpen(false);
      setNewLead({
        fullName: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        city: '',
        country: 'India',
        businessCategory: '',
        requiredService: 'Digital marketing',
        estimatedBudget: '',
        campaignSource: 'Direct contact',
        expectedDealValue: '0',
        description: '',
      });
      setNotice('Created new CRM lead.');
      await loadLeads();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create lead.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Leads &amp; CRM Pipeline
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Track enquiries from submission through qualification, proposal, negotiation, and client conversion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <GlassButton
            variant="subtle"
            size="sm"
            onClick={() =>
              void suiteApi.downloadAuthorizedCsv('/api/suite/leads/export.csv', 'akyin-leads-crm.csv')
            }
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export CSV</span>
          </GlassButton>
          <GlassButton variant="primary" size="sm" onClick={() => setNewModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Manual Lead</span>
          </GlassButton>
        </div>
      </div>

      {/* Filters */}
      <div className="liquid-glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, name, company, email, phone, service..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs font-semibold text-[#1D1D1F]"
          >
            <option value="ALL">All Stages ({leads.length})</option>
            {stages.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs font-semibold text-[#1D1D1F]"
          >
            <option value="ALL">All Sources</option>
            {sources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#067647]" aria-hidden="true" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#B42318]">
          {error}
        </div>
      )}

      <div className="liquid-glass-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-[#6E6E73]">Loading CRM pipeline...</div>
        ) : pagedLeads.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-[#1D1D1F]">No matching leads found.</p>
            <p className="text-xs text-[#6E6E73]">
              Website enquiries and manual leads appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Lead</th>
                  <th className="py-3 px-4">Company &amp; Location</th>
                  <th className="py-3 px-4">Service &amp; Budget</th>
                  <th className="py-3 px-4">Source &amp; Owner</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {pagedLeads.map((lead) => (
                  <tr key={lead.leadId} className="hover:bg-white/75 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono-num text-[11px] font-bold text-[#0071E3]">
                        {lead.leadId}
                      </p>
                      <p className="font-semibold text-[#1D1D1F]">{lead.fullName}</p>
                      <p className="font-mono-num text-[11px] text-[#6E6E73]">
                        {lead.mobileNumber} · {lead.email}
                      </p>
                      {lead.duplicateWarning && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-[#B54708]">
                          <AlertTriangle className="w-3 h-3" /> {lead.duplicateWarning}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#1D1D1F]">{lead.companyName || '—'}</p>
                      <p className="text-[11px] text-[#6E6E73]">
                        {[lead.city, lead.country].filter(Boolean).join(', ') || '—'}
                      </p>
                      {lead.followUpAt && (
                        <p className="font-mono-num text-[10px] text-[#0071E3] mt-0.5">
                          Follow-up: {lead.followUpAt}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <p className="font-medium text-[#1D1D1F] truncate">{lead.requiredService}</p>
                      <p className="text-[11px] text-[#6E6E73] truncate">
                        Budget: {lead.estimatedBudget || 'Custom'}
                      </p>
                      {lead.expectedDealValue > 0 && (
                        <p className="font-mono-num text-[11px] font-semibold text-[#1D1D1F]">
                          Est: {lead.currency} {lead.expectedDealValue.toLocaleString('en-IN')}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#1D1D1F]">{lead.campaignSource}</p>
                      <p className="text-[11px] text-[#6E6E73]">
                        {lead.assignedToName ? `Assigned: ${lead.assignedToName}` : 'Unassigned'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          lead.stage === 'WON'
                            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                            : lead.stage === 'LOST'
                              ? 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]'
                              : lead.stage === 'NEW'
                                ? 'bg-[#0071E3] border-[#0071E3] text-white'
                                : 'bg-white border-[#E8E8ED] text-[#1D1D1F]'
                        }`}
                      >
                        {lead.stage}
                      </span>
                      {lead.secondaryTag && (
                        <p className="text-[10px] text-[#6E6E73] mt-1">{lead.secondaryTag}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openLeadDetail(lead)}
                        className="px-3 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold text-[#1D1D1F] cursor-pointer"
                      >
                        Open Pipeline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#E8E8ED] flex items-center justify-between text-xs text-[#6E6E73]">
            <span>
              Page {page} of {totalPages} ({leads.length} leads)
            </span>
            <div className="flex items-center gap-2">
              <GlassButton
                variant="subtle"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </GlassButton>
              <GlassButton
                variant="subtle"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </GlassButton>
            </div>
          </div>
        )}
      </div>

      {/* Lead Pipeline & Activity Drawer Modal */}
      <GlassModal
        open={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        subtitle={selectedLead ? `${selectedLead.leadId} · ${selectedLead.sourcePage}` : ''}
        title={
          selectedLead
            ? `${selectedLead.fullName} — ${selectedLead.companyName || 'Enquiry'}`
            : 'Lead Details'
        }
      >
        {selectedLead && (
          <div className="space-y-5 text-xs">
            <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-4 space-y-1.5">
              <p className="text-[#1D1D1F]">
                <strong>Contact:</strong> {selectedLead.mobileNumber} · {selectedLead.email}
                {selectedLead.website ? ` · ${selectedLead.website}` : ''}
              </p>
              <p className="text-[#1D1D1F]">
                <strong>Service:</strong> {selectedLead.requiredService} ·{' '}
                <strong>Budget:</strong> {selectedLead.estimatedBudget || 'Not specified'} ·{' '}
                <strong>Prefers:</strong> {selectedLead.preferredContactMethod}
              </p>
              <p className="text-[#6E6E73] leading-relaxed">{selectedLead.description}</p>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">CRM Stage</label>
                  <select
                    value={draftStage}
                    onChange={(e) => setDraftStage(e.target.value as CrmStage)}
                    className={inputCls}
                  >
                    {stages.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">Secondary Tag</label>
                  <select
                    value={draftTag}
                    onChange={(e) => setDraftTag(e.target.value)}
                    className={inputCls}
                  >
                    {SECONDARY_TAGS.map((t) => (
                      <option key={t || 'none'} value={t}>
                        {t || 'None'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Assigned Team Member
                  </label>
                  <select
                    value={draftAssignee}
                    onChange={(e) => setDraftAssignee(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Unassigned</option>
                    {staffUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">Follow-Up Date</label>
                  <input
                    type="date"
                    value={draftFollowUp}
                    onChange={(e) => setDraftFollowUp(e.target.value)}
                    className={`${inputCls} font-mono-num`}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Campaign / Lead Source
                  </label>
                  <select
                    value={draftSource}
                    onChange={(e) => setDraftSource(e.target.value)}
                    className={inputCls}
                  >
                    {sources.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Expected Deal Value ({selectedLead.currency})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={draftDealValue}
                    onChange={(e) => setDraftDealValue(e.target.value)}
                    className={`${inputCls} font-mono-num`}
                  />
                </div>
              </div>

              {draftStage === 'LOST' && (
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">Lost Reason</label>
                  <input
                    value={draftLostReason}
                    onChange={(e) => setDraftLostReason(e.target.value)}
                    placeholder="Price sensitivity, timing, went with competitor..."
                    className={inputCls}
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Private Internal CRM Notes
                </label>
                <textarea
                  rows={2}
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                {selectedLead.convertedClientId ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#067647]">
                    <UserCheck className="w-4 h-4" /> Converted to Client ({selectedLead.convertedClientId})
                  </span>
                ) : (
                  <GlassButton
                    type="button"
                    variant="subtle"
                    size="sm"
                    disabled={saving}
                    onClick={() => void handleConvertClient(selectedLead.leadId)}
                  >
                    <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Convert WON Lead to Client</span>
                  </GlassButton>
                )}

                <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
                  {saving ? 'Saving...' : 'Save CRM Changes'}
                </GlassButton>
              </div>
            </form>

            {/* Activity Logger & Timeline */}
            <div className="pt-4 border-t border-[#E8E8ED] space-y-3">
              <p className="font-semibold text-[#1D1D1F] inline-flex items-center gap-1.5">
                <MessageSquarePlus className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                <span>Log Call / Follow-Up Note</span>
              </p>
              <form onSubmit={handleAddActivity} className="flex flex-col sm:flex-row gap-2">
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value as any)}
                  className="sm:w-32 rounded-xl border border-[#E8E8ED] bg-white px-2.5 py-2 text-xs font-semibold"
                >
                  <option value="call">Call</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="note">Note</option>
                </select>
                <input
                  value={actSummary}
                  onChange={(e) => setActSummary(e.target.value)}
                  placeholder="Summary of call, objection, or next step..."
                  className="flex-1 rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 text-xs"
                />
                <GlassButton type="submit" disabled={saving || !actSummary.trim()} variant="primary" size="sm">
                  Add Entry
                </GlassButton>
              </form>

              <ul className="max-h-48 overflow-y-auto divide-y divide-[#E8E8ED] rounded-xl border border-[#E8E8ED] bg-white px-3">
                {(selectedLead.activities || []).map((act) => (
                  <li key={act.id} className="py-2 text-[11px]">
                    <div className="flex items-center justify-between text-[#6E6E73]">
                      <span className="font-semibold text-[#1D1D1F] uppercase">
                        {act.type} · {act.actor}
                      </span>
                      <span className="font-mono-num">{act.timestamp.slice(0, 16).replace('T', ' ')}</span>
                    </div>
                    <p className="text-[#1D1D1F] mt-0.5">{act.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </GlassModal>

      {/* New Lead Modal */}
      <GlassModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        subtitle="NEW CRM ENTRY"
        title="Add Manual Enquiry / Lead"
      >
        <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Full Name *</label>
              <input
                required
                value={newLead.fullName}
                onChange={(e) => setNewLead({ ...newLead, fullName: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Company Name</label>
              <input
                value={newLead.companyName}
                onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Mobile *</label>
              <input
                required
                value={newLead.mobileNumber}
                onChange={(e) => setNewLead({ ...newLead, mobileNumber: e.target.value })}
                className={`${inputCls} font-mono-num`}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Email *</label>
              <input
                required
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Required Service *</label>
              <input
                required
                value={newLead.requiredService}
                onChange={(e) => setNewLead({ ...newLead, requiredService: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Campaign Source</label>
              <select
                value={newLead.campaignSource}
                onChange={(e) => setNewLead({ ...newLead, campaignSource: e.target.value })}
                className={inputCls}
              >
                {(sources.length ? sources : ['Direct contact', 'Website', 'Referral', 'WhatsApp']).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Estimated Budget</label>
              <input
                value={newLead.estimatedBudget}
                onChange={(e) => setNewLead({ ...newLead, estimatedBudget: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Expected Deal Value (INR)</label>
              <input
                type="number"
                min={0}
                value={newLead.expectedDealValue}
                onChange={(e) => setNewLead({ ...newLead, expectedDealValue: e.target.value })}
                className={`${inputCls} font-mono-num`}
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">Notes</label>
            <textarea
              rows={2}
              value={newLead.description}
              onChange={(e) => setNewLead({ ...newLead, description: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="subtle" size="sm" onClick={() => setNewModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
              {saving ? 'Saving...' : 'Create Lead'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
