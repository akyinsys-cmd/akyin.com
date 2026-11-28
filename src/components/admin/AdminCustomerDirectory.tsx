import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search, Users } from 'lucide-react';
import { suiteApi } from '../../services/suiteApi';
import { GlassButton } from '../liquid-glass';

type Customer = Awaited<ReturnType<typeof suiteApi.getCustomers>>['customers'][number];

export function AdminCustomerDirectory() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await suiteApi.getCustomers();
      setCustomers(result.customers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load customer directory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.name, c.companyName, c.email, c.phone, c.city, c.country, ...c.sources]
        .some((value) => String(value || '').toLowerCase().includes(q))
    );
  }, [customers, search]);

  const exportCsv = () => {
    const headers = ['Name','Company','Email','Phone','City','Country','Client Status','Lead Count','Invoice Count','Appointment Count','Sources','Last Activity'];
    const quote = (value: unknown) => {
      const raw = String(value ?? '');
      const safe = /^[-=+@\t\r]/.test(raw) ? "'" + raw : raw;
      return '"' + safe.replace(/"/g, '""') + '"';
    };
    const rows = filtered.map((c) => [
      c.name,c.companyName,c.email,c.phone,c.city,c.country,c.clientStatus,c.leadIds.length,
      c.invoiceCount,c.appointmentCount,c.sources.join('; '),c.lastActivityAt
    ].map(quote).join(','));
    const blob = new Blob([[headers.map(quote).join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'akyin-customer-directory.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">Customer Directory</h2>
          <p className="mt-1 text-xs text-[#6E6E73]">One view of contacts already present in CRM leads, clients, invoices and appointments. This does not create customer login accounts.</p>
        </div>
        <div className="flex gap-2">
          <GlassButton variant="subtle" size="sm" onClick={exportCsv} disabled={!filtered.length}>Export CSV</GlassButton>
          <GlassButton variant="primary" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </GlassButton>
        </div>
      </div>

      <div className="liquid-glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[220px] flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1A6]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, company, email, phone or city" className="w-full rounded-xl border border-[#E8E8ED] bg-white py-2 pl-9 pr-3 text-xs text-[#1D1D1F] outline-none focus:border-[#1D1D1F]" />
        </div>
        <div className="text-xs font-semibold text-[#6E6E73]">{filtered.length} of {customers.length} contacts</div>
      </div>

      {error && <div role="alert" className="rounded-2xl border border-[#FECDCA] bg-[#FEF3F2] px-4 py-3 text-xs font-semibold text-[#B42318]">{error}</div>}
      {loading && customers.length === 0 ? (
        <div className="liquid-glass-card rounded-3xl p-10 text-center text-xs text-[#6E6E73]">Loading customer records...</div>
      ) : filtered.length === 0 ? (
        <div className="liquid-glass-card rounded-3xl p-10 text-center space-y-2">
          <Users className="mx-auto h-7 w-7 text-[#A1A1A6]" />
          <p className="text-sm font-semibold text-[#1D1D1F]">No matching contacts</p>
          <p className="text-xs text-[#6E6E73]">Try another search or add a lead/client using the existing CRM modules.</p>
        </div>
      ) : (
        <div className="liquid-glass-card overflow-hidden rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead><tr className="border-b border-[#E8E8ED] bg-[#F5F5F7] text-[#6E6E73]">
                <th className="px-4 py-3">Customer / Business</th><th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th><th className="px-4 py-3">Records</th>
                <th className="px-4 py-3">Source</th><th className="px-4 py-3">Last Activity</th>
              </tr></thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {filtered.map((c) => <tr key={c.customerKey} className="align-top">
                  <td className="px-4 py-3"><p className="font-bold text-[#1D1D1F]">{c.name || c.companyName || 'Unnamed contact'}</p>{c.companyName && c.companyName !== c.name && <p className="mt-0.5 text-[#6E6E73]">{c.companyName}</p>}{c.clientStatus && <span className="mt-1 inline-block rounded-md border border-[#E8E8ED] px-2 py-0.5 text-[10px]">{c.clientStatus} client</span>}</td>
                  <td className="px-4 py-3 text-[#1D1D1F]"><p>{c.email || '—'}</p><p className="mt-1 text-[#6E6E73]">{c.phone || '—'}</p></td>
                  <td className="px-4 py-3 text-[#6E6E73]">{[c.city,c.country].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-[#6E6E73]"><p>{c.leadIds.length} leads</p><p>{c.invoiceCount} invoices</p><p>{c.appointmentCount} appointments</p></td>
                  <td className="px-4 py-3 text-[#6E6E73]">{c.sources.join(', ')}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#6E6E73]">{c.lastActivityAt ? new Date(c.lastActivityAt).toLocaleDateString() : '—'}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
