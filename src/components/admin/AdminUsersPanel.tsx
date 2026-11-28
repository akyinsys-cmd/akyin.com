import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Plus, Shield, UserCheck, UserX, Trash2 } from 'lucide-react';
import { PublicSuiteUser, UserRole, suiteApi } from '../../services/suiteApi';
import { GlassButton, GlassModal } from '../liquid-glass';

interface AdminUsersPanelProps {
  currentUserId: string;
}

export function AdminUsersPanel({ currentUserId }: AdminUsersPanelProps) {
  const [users, setUsers] = useState<PublicSuiteUser[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([
    'Super Admin',
    'Sales Manager',
    'Finance Manager',
    'Staff',
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Staff' as UserRole,
    password: '',
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await suiteApi.getUsers();
      setUsers(res.users);
      if (res.roles?.length) setRoles(res.roles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.createUser(newUser);
      setCreateOpen(false);
      setNewUser({ name: '', email: '', role: 'Staff', password: '' });
      setNotice(`Provisioned internal ${res.user.role} account for ${res.user.email}.`);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (user: PublicSuiteUser, role: UserRole) => {
    setSaving(true);
    setError('');
    try {
      await suiteApi.updateUser(user.id, { role });
      setNotice(`Updated role for ${user.email} to ${role}.`);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Role update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: PublicSuiteUser) => {
    setSaving(true);
    setError('');
    try {
      await suiteApi.updateUser(user.id, { active: !user.active });
      setNotice(`${user.email} is now ${!user.active ? 'active' : 'disabled'}.`);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status toggle failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user: PublicSuiteUser) => {
    const confirmed = window.confirm(
      `Permanently delete the internal account for ${user.email}? Their active sessions will be revoked. This does not delete customer, lead, quotation or payment records.`
    );
    if (!confirmed) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await suiteApi.deleteUser(user.id);
      setNotice(`Deleted internal account for ${user.email}. Related business records were preserved.`);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'User deletion failed.');
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
            User &amp; Admin Management (RBAC)
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            No public registration exists. Only Super Admins can provision internal team accounts and enforce role permissions.
          </p>
        </div>

        <GlassButton variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Create Internal Account</span>
        </GlassButton>
      </div>

      {notice && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#067647]" />
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
          <div className="p-8 text-center text-xs text-[#6E6E73]">Loading team directory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F7]/85 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#1D1D1F]">{u.name}</p>
                      <p className="text-[11px] text-[#6E6E73]">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        disabled={saving}
                        value={u.role}
                        onChange={(e) => void handleRoleChange(u, e.target.value as UserRole)}
                        className="rounded-lg border border-[#E8E8ED] bg-white px-2.5 py-1 text-xs font-semibold"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 font-mono-num text-[11px] text-[#6E6E73]">
                      {u.lastLoginAt ? u.lastLoginAt.slice(0, 16).replace('T', ' ') : 'Never'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                          u.active
                            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                            : 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]'
                        }`}
                      >
                        {u.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.id === currentUserId ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6E6E73]">
                          <Shield className="w-3.5 h-3.5" /> Current Session
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => void handleToggleActive(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold cursor-pointer"
                          >
                            {u.active ? (
                              <>
                                <UserX className="w-3 h-3 text-[#B42318]" /> Disable
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3 text-[#067647]" /> Activate
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => void handleDeleteUser(u)}
                            className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#FECDCA] bg-white hover:bg-[#FEF3F2] text-[11px] font-semibold text-[#B42318] cursor-pointer"
                            aria-label={`Delete account for ${u.email}`}
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GlassModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        subtitle="INTERNAL ACCESS PROVISIONING"
        title="Create Admin / Staff User"
      >
        <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">Full Name *</label>
            <input
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">Email Address *</label>
            <input
              required
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">Role *</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
              className={inputCls}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">
              Initial Password (min 8 chars) *
            </label>
            <input
              required
              type="password"
              minLength={8}
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="subtle" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
              {saving ? 'Provisioning...' : 'Provision User'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
