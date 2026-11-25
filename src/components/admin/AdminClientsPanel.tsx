import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { SuiteClientRecord, suiteApi } from '../../services/suiteApi';
import { GlassButton, GlassModal } from '../liquid-glass';

interface AdminClientsPanelProps {
  onChanged?: () => void;
}

const PAGE_SIZE = 12;

export function AdminClientsPanel({ onChanged }: AdminClientsPanelProps) {
  const [clients, setClients] = useState<SuiteClientRecord[]>([]);
  const [reportedCount, setReportedCount] = useState<number>(58);
  const [reportedDraft, setReportedDraft] = useState<string>('58');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<Partial<SuiteClientRecord> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadClients = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await suiteApi.getClients();
      setClients(res.clients);
      setReportedCount(res.reportedClientsHandled || 58);
      setReportedDraft(String(res.reportedClientsHandled || 58));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load client directory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.supportScope.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleSaveReportedCount = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Math.max(0, Math.round(Number(reportedDraft) || 58));
    setSaving(true);
    setNotice('');
    try {
      await suiteApi.updateSettings({ reportedClientsCount: num });
      setReportedCount(num);
      setNotice(`Updated public headline count to "${num} Clients Currently Handled".`);
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update count.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTicker = async (client: SuiteClientRecord) => {
    setSaving(true);
    try {
      await suiteApi.updateClient(client.id, { showInTicker: !client.showInTicker });
      setNotice(
        `${client.name} is now ${!client.showInTicker ? 'visible in' : 'hidden from'} the public portfolio ticker.`
      );
      await loadClients();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await suiteApi.createClient(editing);
        setNotice(`Added verified client "${editing.name}".`);
      } else if (editing.id) {
        await suiteApi.updateClient(editing.id, editing);
        setNotice(`Updated client "${editing.name}".`);
      }
      setEditing(null);
      await loadClients();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClient = async (client: SuiteClientRecord) => {
    setSaving(true);
    try {
      await suiteApi.deleteClient(client.id);
      setNotice(`Removed "${client.name}" from directory.`);
      await loadClients();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
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
            Clients &amp; Portfolio Ticker Directory
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Displays strictly verified client identities ({clients.length} in directory vs.{' '}
            {reportedCount} Clients Currently Handled). Add, edit, hide, or remove ticker entries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <GlassButton
            variant="subtle"
            size="sm"
            onClick={() =>
              void suiteApi.downloadAuthorizedCsv('/api/suite/clients/export.csv', 'akyin-clients.csv')
            }
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export CSV</span>
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => {
              setIsNew(true);
              setEditing({
                name: '',
                companyName: '',
                category: 'Retail & E-Commerce',
                contactPerson: '',
                email: '',
                phone: '',
                city: '',
                country: 'India',
                websiteUrl: '',
                supportScope: '',
                summary: '',
                verified: true,
                showInTicker: true,
                wordmarkStyle: 'sans',
              });
            }}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Verified Client</span>
          </GlassButton>
        </div>
      </div>

      {/* Reported Handled Counter Bar */}
      <form
        onSubmit={handleSaveReportedCount}
        className="liquid-glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        <div className="space-y-0.5">
          <p className="font-semibold text-[#1D1D1F]">
            &ldquo;{reportedCount} Clients Currently Handled&rdquo; Public Counter
          </p>
          <p className="text-[#6E6E73]">
            Only the verified client records added below are shown by name. Remaining client identities are never fabricated.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={reportedDraft}
            onChange={(e) => setReportedDraft(e.target.value)}
            className="w-24 rounded-xl border border-[#E8E8ED] bg-white px-3 py-1.5 font-mono-num text-xs font-bold"
          />
          <GlassButton type="submit" disabled={saving} variant="subtle" size="sm">
            Update Metric
          </GlassButton>
        </div>
      </form>

      {/* Search */}
      <div className="liquid-glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter verified clients by name, category, scope..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs"
          />
        </div>
        <span className="font-mono-num text-xs text-[#6E6E73]">
          {clients.filter((c) => c.showInTicker).length} shown in live ticker
        </span>
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
          <div className="p-10 text-center text-xs text-[#6E6E73]">Loading client directory...</div>
        ) : paged.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#6E6E73]">
            No client records match this search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Client / Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Support Scope</th>
                  <th className="py-3 px-4">Ticker Visibility</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {paged.map((c) => (
                  <tr key={c.id} className="hover:bg-white/75 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#1D1D1F]">{c.name}</p>
                      <p className="text-[11px] text-[#6E6E73]">
                        {[c.contactPerson, c.city, c.country].filter(Boolean).join(' · ') || 'Verified record'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-[#1D1D1F]">{c.category}</td>
                    <td className="py-3.5 px-4 max-w-[220px] truncate text-[#6E6E73]">
                      {c.supportScope || c.summary || '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void handleToggleTicker(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                          c.showInTicker
                            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                            : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
                        }`}
                      >
                        {c.showInTicker ? (
                          <>
                            <Eye className="w-3 h-3" /> In Ticker
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E8ED] text-[10px] font-bold">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNew(false);
                            setEditing({ ...c });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void handleDeleteClient(c)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#D92D20] text-[11px] font-semibold text-[#B42318] cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
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
              Page {page} of {totalPages}
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

      {/* Add / Edit Client Modal */}
      <GlassModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        subtitle={isNew ? 'NEW VERIFIED CLIENT' : editing?.id}
        title={isNew ? 'Add Client to Directory' : `Edit ${editing?.name || 'Client'}`}
      >
        {editing && (
          <form onSubmit={handleSaveClient} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Client / Brand Name *</label>
                <input
                  required
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Industry Category *</label>
                <input
                  required
                  value={editing.category || ''}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Contact Person</label>
                <input
                  value={editing.contactPerson || ''}
                  onChange={(e) => setEditing({ ...editing, contactPerson: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Email</label>
                <input
                  value={editing.email || ''}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Phone</label>
                <input
                  value={editing.phone || ''}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Website URL</label>
                <input
                  value={editing.websiteUrl || ''}
                  onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">City</label>
                <input
                  value={editing.city || ''}
                  onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Status</label>
                <select
                  value={editing.status || 'Active'}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}
                  className={inputCls}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Support Scope</label>
              <input
                value={editing.supportScope || ''}
                onChange={(e) => setEditing({ ...editing, supportScope: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Summary</label>
              <textarea
                rows={2}
                value={editing.summary || ''}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-1">
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editing.showInTicker)}
                  onChange={(e) => setEditing({ ...editing, showInTicker: e.target.checked })}
                  className="accent-[#0071E3]"
                />
                <span>Display in Public Portfolio Ticker</span>
              </label>
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editing.verified)}
                  onChange={(e) => setEditing({ ...editing, verified: e.target.checked })}
                  className="accent-[#0071E3]"
                />
                <span>Verified Identity</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E8ED]">
              <GlassButton variant="subtle" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
                {saving ? 'Saving...' : 'Save Client'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>
    </div>
  );
}
