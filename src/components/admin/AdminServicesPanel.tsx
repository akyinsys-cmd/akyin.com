import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Bell,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  FolderKanban,
  Globe,
  History,
  LayoutGrid,
  List,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import {
  ServiceCategoryRecord,
  ServicePriceHistoryRecord,
  SuiteNotificationLog,
  SuiteServiceItem,
  UserRole,
  suiteApi,
} from '../../services/suiteApi';
import { GlassButton, GlassModal } from '../liquid-glass';
import { ServiceBillingDisclaimer } from '../ServiceBillingDisclaimer';

interface AdminServicesPanelProps {
  currentUserRole?: UserRole;
  currentUserName?: string;
  currentUserEmail?: string;
}

function formatAlertFeedback(
  notification: SuiteNotificationLog | undefined,
  adminName?: string,
  adminEmail?: string
): string {
  if (!notification) return '';
  const actorLabel =
    adminName && adminEmail
      ? `${adminName} (${adminEmail})`
      : adminName || adminEmail || '';
  const actorNote = actorLabel ? ` · Authorized by ${actorLabel}` : '';
  if (notification.deliveryStatus === 'sent') {
    return ` Admin email alert sent to ${notification.recipient}${actorNote}.`;
  }
  if (notification.deliveryStatus === 'logged_unconfigured') {
    return ` Admin email alert logged for ${notification.recipient} (configure SMTP env to dispatch live emails)${actorNote}.`;
  }
  if (notification.deliveryStatus === 'skipped_disabled') {
    return ` Email alert skipped (rule paused in notification settings).`;
  }
  return ` Email alert delivery failed (${notification.errorMessage || 'SMTP error'}).`;
}

export function AdminServicesPanel({
  currentUserRole,
  currentUserName,
  currentUserEmail,
}: AdminServicesPanelProps = {}) {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryRecords, setCategoryRecords] = useState<ServiceCategoryRecord[]>([]);
  const [services, setServices] = useState<SuiteServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [activeTab, setActiveTab] = useState<'catalogue' | 'categories' | 'sms' | 'whatsapp' | 'history'>('catalogue');

  // Category Management State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryRecord | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

  // Multi-Select & Bulk Action Toolbar State
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkGstEnabled, setBulkGstEnabled] = useState(true);
  const [bulkGstRate, setBulkGstRate] = useState('18');

  // Automated Email Alert State
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [notifSettings, setNotifSettings] = useState<{
    ownerNotificationEmail: string;
    sendClientReceipts: boolean;
    events: Record<string, boolean>;
  } | null>(null);
  const [serviceAlertLogs, setServiceAlertLogs] = useState<SuiteNotificationLog[]>([]);
  const [alertPanelOpen, setAlertPanelOpen] = useState(false);
  const [savingAlerts, setSavingAlerts] = useState(false);
  const [testingAlert, setTestingAlert] = useState(false);

  const [editing, setEditing] = useState<Partial<SuiteServiceItem> | null>(null);
  const [deliverablesDraft, setDeliverablesDraft] = useState('');
  const [benefitsDraft, setBenefitsDraft] = useState('');
  const [workProcessDraft, setWorkProcessDraft] = useState('');
  const [priceChangeNoteDraft, setPriceChangeNoteDraft] = useState('');
  const [modalError, setModalError] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // Database-backed Price Revision History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyFilterServiceId, setHistoryFilterServiceId] = useState('ALL');
  const [historySearch, setHistorySearch] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [historyRecords, setHistoryRecords] = useState<ServicePriceHistoryRecord[]>([]);
  const [historyServices, setHistoryServices] = useState<
    Array<{ id: string; name: string; category: string; revisionCount: number }>
  >([]);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [res, catRes, settingsRes] = await Promise.all([
        suiteApi.getServices(),
        suiteApi.getServiceCategories().catch(() => null),
        suiteApi.getSettings().catch(() => null),
      ]);
      setCategories(res.categories);
      if (catRes?.categoryRecords) {
        setCategoryRecords(catRes.categoryRecords);
      } else if (res.categoryRecords) {
        setCategoryRecords(res.categoryRecords);
      }
      setServices(res.services);
      const validIds = new Set(res.services.map((s) => s.id));
      setSelectedServiceIds((prev) => prev.filter((id) => validIds.has(id)));
      if (settingsRes) {
        setSmtpConfigured(Boolean(settingsRes.smtpConfigured));
        setNotifSettings(settingsRes.notificationSettings);
        setServiceAlertLogs(
          (settingsRes.notificationLogs || []).filter(
            (l) => l.event === 'service_price_updated' || l.event === 'service_added'
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load service catalogue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((s) => {
      if (catFilter !== 'ALL' && s.category !== catFilter) return false;
      if (statusFilter === 'ACTIVE' && !s.active) return false;
      if (statusFilter === 'ARCHIVED' && s.active) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  }, [services, search, catFilter, statusFilter]);

  const selectedSet = useMemo(() => new Set(selectedServiceIds), [selectedServiceIds]);
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((srv) => selectedSet.has(srv.id));
  const someFilteredSelected =
    filtered.some((srv) => selectedSet.has(srv.id)) && !allFilteredSelected;

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filtered.map((s) => s.id);
    if (allFilteredSelected) {
      const removeSet = new Set(filteredIds);
      setSelectedServiceIds((prev) => prev.filter((id) => !removeSet.has(id)));
    } else {
      setSelectedServiceIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleBulkAction = async (action: 'activate' | 'archive' | 'adjust_gst') => {
    if (selectedServiceIds.length === 0) return;
    const parsedGst = Number(bulkGstRate);
    if (action === 'adjust_gst' && (!Number.isFinite(parsedGst) || parsedGst < 0 || parsedGst > 100)) {
      setError('Enter a valid GST percentage between 0 and 100.');
      return;
    }

    setBulkSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.bulkUpdateServices({
        serviceIds: selectedServiceIds,
        action,
        ...(action === 'adjust_gst'
          ? {
              gstEnabled: bulkGstEnabled,
              gstRate: bulkGstEnabled ? parsedGst : 0,
            }
          : {}),
      });
      const verb =
        action === 'activate'
          ? `Activated ${res.updatedCount} service(s).`
          : action === 'archive'
            ? `Archived ${res.updatedCount} service(s).`
            : `Updated GST configuration (${bulkGstEnabled ? `${parsedGst}%` : 'Exempt'}) for ${res.updatedCount} service(s).`;
      setNotice(`${verb}${formatAlertFeedback(res.notification, currentUserName, currentUserEmail)}`);
      setSelectedServiceIds([]);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to execute bulk service update.');
    } finally {
      setBulkSaving(false);
    }
  };

  // Bulk SMS item
  const bulkSmsItem = useMemo(
    () =>
      services.find(
        (s) => s.id === 'srv-bulk-sms' || s.slug === 'bulk-sms' || s.name.toLowerCase().includes('bulk sms')
      ),
    [services]
  );

  // WhatsApp item
  const whatsappItem = useMemo(
    () =>
      services.find(
        (s) =>
          s.id === 'srv-whatsapp-messaging' ||
          s.slug === 'whatsapp-business-setup' ||
          s.name.toLowerCase().includes('whatsapp')
      ),
    [services]
  );

  // Category CRUD Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSavingCategory(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.createServiceCategory({
        name: newCategoryName.trim(),
        slug: newCategorySlug.trim() || undefined,
        description: newCategoryDesc.trim(),
        active: true,
      });
      setNewCategoryName('');
      setNewCategorySlug('');
      setNewCategoryDesc('');
      setNotice(`Added service category "${res.category.name}".`);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create service category.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleSaveEditedCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSavingCategory(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.updateServiceCategory(editingCategory.id, {
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description,
        menuOrder: Number(editingCategory.menuOrder) || editingCategory.sortOrder,
        active: editingCategory.active,
      });
      setEditingCategory(null);
      setNotice(`Updated category "${res.category.name}".`);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update service category.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleToggleCategoryActive = async (cat: ServiceCategoryRecord) => {
    setSavingCategory(true);
    setError('');
    try {
      await suiteApi.updateServiceCategory(cat.id, { active: !cat.active });
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update category visibility.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleMoveCategory = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= categoryRecords.length) return;
    const reordered = [...categoryRecords];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setCategoryRecords(reordered);
    setSavingCategory(true);
    setError('');
    try {
      await suiteApi.reorderServiceCategories(reordered.map((c) => c.id));
      setNotice('Updated category menu order.');
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reorder categories.');
      await loadServices();
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat: ServiceCategoryRecord) => {
    if (!window.confirm(`Delete empty category "${cat.name}"?`)) return;
    setSavingCategory(true);
    setError('');
    try {
      await suiteApi.deleteServiceCategory(cat.id);
      setNotice(`Deleted category "${cat.name}".`);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete category.');
    } finally {
      setSavingCategory(false);
    }
  };

  const openModal = (item?: SuiteServiceItem) => {
    setPriceChangeNoteDraft('');
    setModalError('');
    if (item) {
      setIsNew(false);
      setEditing({
        ...item,
        showInMenu: item.showInMenu !== false,
        menuOrder: item.menuOrder ?? item.sortOrder ?? 100,
        internationalPricing: item.internationalPricing
          ? {
              aed: { ...(item.internationalPricing.aed || {}) },
              usd: { ...(item.internationalPricing.usd || {}) },
              notes: item.internationalPricing.notes || '',
            }
          : { aed: {}, usd: {}, notes: '' },
      });
      setDeliverablesDraft((item.deliverables || []).join('\n'));
      setBenefitsDraft((item.benefits || []).join('\n'));
      setWorkProcessDraft((item.workProcess || []).join('\n'));
    } else {
      setIsNew(true);
      setEditing({
        name: '',
        slug: '',
        category: categories[0] || 'Digital Marketing',
        description: '',
        pricingModel: 'fixed',
        setupFee: 0,
        recurringFee: 0,
        oneTimePrice: 0,
        monthlyPrice: 0,
        revisionLimit: '2 rounds of revision',
        additionalDeliverableCharge: 0,
        subscriptionDuration: 'Standalone engagement',
        renewalTerms: 'Independent billing',
        cancellationPolicy: '7 days advance notice',
        packagePrice: 0,
        includedUnits: 0,
        unitLabel: '',
        unitRate: 0,
        additionalUnitRate: 0,
        billingCycle: 'one-time',
        gstEnabled: true,
        gstRate: 18,
        deliveryPeriod: '3–5 business days',
        active: true,
        menuOrder: services.length + 1,
        showInMenu: true,
        disclaimer: '',
        integrationConfigured: false,
        transactionalSmsEnabled: false,
        internationalPricing: { aed: {}, usd: {}, notes: '' },
      });
      setDeliverablesDraft('');
      setBenefitsDraft('');
      setWorkProcessDraft('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    setModalError('');
    setNotice('');
    try {
      const parseLines = (raw: string) =>
        raw
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
      const deliverables = parseLines(deliverablesDraft);
      const benefits = parseLines(benefitsDraft);
      const workProcess = parseLines(workProcessDraft);
      const aed = editing.internationalPricing?.aed;
      const usd = editing.internationalPricing?.usd;
      const payload: Record<string, unknown> = {
        ...editing,
        slug: editing.slug?.trim() || undefined,
        menuOrder: Number(editing.menuOrder) || editing.sortOrder || undefined,
        showInMenu: editing.showInMenu !== false,
        deliverables,
        benefits,
        workProcess,
        setupFee: Number(editing.setupFee) || 0,
        recurringFee: Number(editing.recurringFee ?? editing.packagePrice) || 0,
        oneTimePrice: Number(editing.oneTimePrice ?? editing.setupFee) || 0,
        monthlyPrice: Number(editing.monthlyPrice ?? editing.recurringFee) || 0,
        revisionLimit: editing.revisionLimit ?? '2 rounds',
        additionalDeliverableCharge: Number(editing.additionalDeliverableCharge) || 0,
        subscriptionDuration: editing.subscriptionDuration || '',
        renewalTerms: editing.renewalTerms || '',
        cancellationPolicy: editing.cancellationPolicy || '',
        transactionalSmsEnabled: Boolean(editing.transactionalSmsEnabled),
        priceChangeNote: priceChangeNoteDraft || undefined,
        packagePrice:
          editing.packagePrice !== undefined
            ? Number(editing.packagePrice) || 0
            : Number(editing.recurringFee) || 0,
        includedUnits: editing.includedUnits !== undefined ? Number(editing.includedUnits) || 0 : undefined,
        unitLabel: editing.unitLabel || undefined,
        unitRate: editing.unitRate !== undefined ? Number(editing.unitRate) || 0 : undefined,
        additionalUnitRate:
          editing.additionalUnitRate !== undefined ? Number(editing.additionalUnitRate) || 0 : undefined,
        gstRate: Number(editing.gstRate) || 18,
        internationalPricing: {
          aed: aed
            ? {
                ...(aed.setupFee !== undefined ? { setupFee: Number(aed.setupFee) || 0 } : {}),
                ...(aed.packagePrice !== undefined ? { packagePrice: Number(aed.packagePrice) || 0 } : {}),
                ...(aed.unitRate !== undefined ? { unitRate: Number(aed.unitRate) || 0 } : {}),
                ...(aed.additionalUnitRate !== undefined ? { additionalUnitRate: Number(aed.additionalUnitRate) || 0 } : {}),
              }
            : undefined,
          usd: usd
            ? {
                ...(usd.setupFee !== undefined ? { setupFee: Number(usd.setupFee) || 0 } : {}),
                ...(usd.packagePrice !== undefined ? { packagePrice: Number(usd.packagePrice) || 0 } : {}),
                ...(usd.unitRate !== undefined ? { unitRate: Number(usd.unitRate) || 0 } : {}),
                ...(usd.additionalUnitRate !== undefined ? { additionalUnitRate: Number(usd.additionalUnitRate) || 0 } : {}),
              }
            : undefined,
          notes: editing.internationalPricing?.notes || undefined,
        },
      };

      if (isNew) {
        const res = await suiteApi.createService(payload);
        setNotice(
          `Added "${editing.name}" to service catalogue.${formatAlertFeedback(res.notification, currentUserName, currentUserEmail)}`
        );
      } else if (editing.id) {
        const res = await suiteApi.updateService(editing.id, payload);
        setNotice(
          `Updated "${editing.name}".${formatAlertFeedback(res.notification, currentUserName, currentUserEmail)}`
        );
      }
      setEditing(null);
      await loadServices();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to save service.';
      setModalError(msg);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (item: SuiteServiceItem) => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.duplicateService(item.id);
      setNotice(
        `Duplicated "${item.name}" as "${res.service.name}".${formatAlertFeedback(res.notification, currentUserName, currentUserEmail)}`
      );
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to duplicate service.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: SuiteServiceItem) => {
    setSaving(true);
    try {
      await suiteApi.updateService(item.id, { active: !item.active });
      await loadServices();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: SuiteServiceItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    setSaving(true);
    try {
      await suiteApi.deleteService(item.id);
      setNotice(`Removed service "${item.name}".`);
      await loadServices();
    } finally {
      setSaving(false);
    }
  };

  // Dedicated save for SMS Config panel
  const handleSaveSmsConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bulkSmsItem) return;
    setSaving(true);
    setError('');
    setNotice('');
    const form = new FormData(e.currentTarget);
    try {
      const payload = {
        packagePrice: Number(form.get('packagePrice')) || 3000,
        recurringFee: Number(form.get('packagePrice')) || 3000,
        includedUnits: Number(form.get('includedUnits')) || 10000,
        unitRate: Number(form.get('unitRate')) || 0.3,
        additionalUnitRate: Number(form.get('additionalUnitRate')) || 0.3,
        transactionalSmsEnabled: form.get('transactionalSmsEnabled') === 'on',
        priceChangeNote: 'SMS Service Configuration updated from Admin panel',
      };
      const res = await suiteApi.updateService(bulkSmsItem.id, payload);
      setNotice(
        `Bulk SMS configuration updated successfully.${formatAlertFeedback(res.notification, currentUserName, currentUserEmail)}`
      );
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update SMS configuration.');
    } finally {
      setSaving(false);
    }
  };

  // Dedicated save for WhatsApp Setup module
  const handleSaveWhatsappSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!whatsappItem) return;
    setSaving(true);
    setError('');
    setNotice('');
    const form = new FormData(e.currentTarget);
    try {
      const payload = {
        setupFee: Number(form.get('setupFee')) || 4999,
        oneTimePrice: Number(form.get('setupFee')) || 4999,
        unitRate: Number(form.get('unitRate')) || 1.5,
        additionalUnitRate: Number(form.get('unitRate')) || 1.5,
        priceChangeNote: 'WhatsApp Business Setup rates updated from Admin panel',
      };
      const res = await suiteApi.updateService(whatsappItem.id, payload);
      setNotice(
        `WhatsApp Business setup configuration updated successfully.${formatAlertFeedback(res.notification, currentUserName, currentUserEmail)}`
      );
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update WhatsApp setup.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAlertSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifSettings) return;
    setSavingAlerts(true);
    setError('');
    setNotice('');
    try {
      await suiteApi.updateNotificationSettings({
        ownerNotificationEmail: notifSettings.ownerNotificationEmail,
        events: {
          service_price_updated: Boolean(notifSettings.events.service_price_updated),
          service_added: Boolean(notifSettings.events.service_added),
        },
      });
      setNotice(`Saved automated price & service alert rules for ${notifSettings.ownerNotificationEmail}.`);
      setAlertPanelOpen(false);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save alert settings.');
    } finally {
      setSavingAlerts(false);
    }
  };

  const handleSendTestAlert = async () => {
    setTestingAlert(true);
    setError('');
    setNotice('');
    try {
      const res = await suiteApi.sendTestNotification();
      setNotice(
        `SMTP test email processed (${res.notification.deliveryStatus}) for ${res.notification.recipient}.${formatAlertFeedback(res.notification, currentUserName, currentUserEmail)}`
      );
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send SMTP verification alert.');
    } finally {
      setTestingAlert(false);
    }
  };

  const fetchPriceHistoryFromDb = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await suiteApi.getServicePriceHistory();
      setHistoryRecords(res.revisions || []);
      setHistoryServices(res.services || []);
    } catch (err) {
      setHistoryError(
        err instanceof Error ? err.message : 'Unable to fetch price revision history from database.'
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const openPriceHistoryModal = useCallback(
    (serviceId = 'ALL') => {
      setHistoryFilterServiceId(serviceId);
      setHistorySearch('');
      setHistoryModalOpen(true);
      void fetchPriceHistoryFromDb();
    },
    [fetchPriceHistoryFromDb]
  );

  const filteredHistoryRecords = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    return historyRecords.filter((rev) => {
      if (historyFilterServiceId !== 'ALL' && rev.serviceId !== historyFilterServiceId) {
        return false;
      }
      if (!q) return true;
      return (
        rev.serviceName.toLowerCase().includes(q) ||
        rev.changedBy.toLowerCase().includes(q) ||
        rev.changedByEmail.toLowerCase().includes(q) ||
        rev.priceField.toLowerCase().includes(q) ||
        rev.note.toLowerCase().includes(q)
      );
    });
  }, [historyRecords, historyFilterServiceId, historySearch]);

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-white px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]';

  const updateIntl = (
    cur: 'aed' | 'usd',
    field: 'setupFee' | 'packagePrice' | 'unitRate' | 'additionalUnitRate',
    val: string
  ) => {
    if (!editing) return;
    const parsed = val === '' ? undefined : Number(val);
    setEditing({
      ...editing,
      internationalPricing: {
        ...(editing.internationalPricing || {}),
        [cur]: {
          ...(editing.internationalPricing?.[cur] || {}),
          [field]: parsed,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            Service Catalogue &amp; Pricing Management
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Manage standalone services, one-time vs monthly pricing, WhatsApp/SMS setup rates, and revision history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openPriceHistoryModal('ALL')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] cursor-pointer whitespace-nowrap shrink-0"
          >
            <History className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
            <span>Price Revision History</span>
          </button>
          <GlassButton variant="primary" size="sm" onClick={() => openModal()}>
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Standalone Service</span>
          </GlassButton>
        </div>
      </div>

      {/* Automated Admin Email Alert Monitor */}
      {notifSettings && (
        <div className="rounded-2xl border border-[#E8E8ED] bg-white p-4 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center text-[#0071E3] shrink-0">
                <Bell className="w-4 h-4" aria-hidden="true" />
              </span>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#1D1D1F]">
                    Automated Service &amp; Price Email Alerts
                  </span>
                  <span className="text-[11px] font-mono-num text-[#6E6E73]">
                    · Recipient: {notifSettings.ownerNotificationEmail || 'connect@akyin.com'}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E6E73]">
                  Price Update Alert:{' '}
                  <strong className={notifSettings.events.service_price_updated ? 'text-[#067647]' : 'text-[#B42318]'}>
                    {notifSettings.events.service_price_updated ? 'Enabled' : 'Paused'}
                  </strong>
                  {' · '}
                  New Service Alert:{' '}
                  <strong className={notifSettings.events.service_added ? 'text-[#067647]' : 'text-[#B42318]'}>
                    {notifSettings.events.service_added ? 'Enabled' : 'Paused'}
                  </strong>
                  {' · '}
                  SMTP:{' '}
                  <strong className="font-mono-num text-[#1D1D1F]">
                    {smtpConfigured ? 'Live Dispatch' : 'Audit Queue Mode'}
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentUserRole === 'Super Admin' && (
                <>
                  <button
                    type="button"
                    disabled={testingAlert}
                    onClick={() => void handleSendTestAlert()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-white hover:border-[#0071E3] text-[11px] font-semibold text-[#1D1D1F] whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                    <span>{testingAlert ? 'Sending Test...' : 'Send Test Alert'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertPanelOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] hover:bg-white text-[11px] font-semibold text-[#1D1D1F] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                    <span>{alertPanelOpen ? 'Close Alert Settings' : 'Configure Email Alerts'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {alertPanelOpen && currentUserRole === 'Super Admin' && (
            <form
              onSubmit={handleSaveAlertSettings}
              className="pt-3 border-t border-[#E8E8ED] grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
            >
              <div className="md:col-span-5">
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Administrator Alert Email
                </label>
                <input
                  type="email"
                  required
                  value={notifSettings.ownerNotificationEmail}
                  onChange={(e) =>
                    setNotifSettings({
                      ...notifSettings,
                      ownerNotificationEmail: e.target.value,
                    })
                  }
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-5 flex flex-wrap items-center gap-4 pb-2">
                <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(notifSettings.events.service_price_updated)}
                    onChange={(e) =>
                      setNotifSettings({
                        ...notifSettings,
                        events: {
                          ...notifSettings.events,
                          service_price_updated: e.target.checked,
                        },
                      })
                    }
                    className="accent-[#0071E3]"
                  />
                  <span>Price Update Alerts</span>
                </label>
                <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(notifSettings.events.service_added)}
                    onChange={(e) =>
                      setNotifSettings({
                        ...notifSettings,
                        events: {
                          ...notifSettings.events,
                          service_added: e.target.checked,
                        },
                      })
                    }
                    className="accent-[#0071E3]"
                  />
                  <span>New Service Alerts</span>
                </label>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <GlassButton type="submit" variant="primary" size="sm" disabled={savingAlerts}>
                  {savingAlerts ? 'Saving...' : 'Save Rules'}
                </GlassButton>
              </div>
            </form>
          )}

          {serviceAlertLogs.length > 0 && (
            <div className="pt-2.5 border-t border-[#E8E8ED] space-y-1.5">
              <p className="text-[11px] font-semibold text-[#6E6E73]">
                Recent Catalogue Alert Dispatches ({serviceAlertLogs.length})
              </p>
              <div className="space-y-1">
                {serviceAlertLogs.slice(0, 3).map((al) => (
                  <div
                    key={al.id}
                    className="flex flex-wrap items-center justify-between gap-2 text-[11px] bg-[#F5F5F7]/70 rounded-xl px-3 py-1.5"
                  >
                    <span className="font-medium text-[#1D1D1F] truncate max-w-xl">
                      {al.subject}
                    </span>
                    <span className="font-mono-num text-[#6E6E73] whitespace-nowrap">
                      {al.recipient} · {al.deliveryStatus} · {al.timestamp.slice(0, 16).replace('T', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Centralized Disclaimer Banner */}
      <ServiceBillingDisclaimer />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E8ED] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('catalogue')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'catalogue'
              ? 'bg-[#0071E3] text-white shadow-sm'
              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
          }`}
        >
          All Services ({services.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#0071E3] text-white shadow-sm'
              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Categories &amp; Menu Order ({categoryRecords.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'sms'
              ? 'bg-[#0071E3] text-white shadow-sm'
              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>SMS Service Configuration</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'whatsapp'
              ? 'bg-[#0071E3] text-white shadow-sm'
              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp Business Setup</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#0071E3] text-white shadow-sm'
              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Price Revision History</span>
        </button>
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

      {/* TAB 1: ALL SERVICES CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="space-y-4">
          {/* Filters & View Switcher */}
          <div className="liquid-glass-card rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search
                  className="w-4 h-4 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search service title, deliverable, description..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs"
                />
              </div>
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs font-semibold text-[#1D1D1F] max-w-[240px]"
              >
                <option value="ALL">
                  All {categories.length} Categories ({services.length})
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'ARCHIVED')}
                className="px-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs font-semibold text-[#1D1D1F]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="ARCHIVED">Archived Only</option>
              </select>
            </div>

            <div
              role="group"
              aria-label="Catalogue view mode"
              className="inline-flex p-1 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] gap-1 shrink-0"
            >
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <List className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                  viewMode === 'cards'
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Cards</span>
              </button>
            </div>
          </div>

          {/* Multi-Select Bulk Action Toolbar */}
          {selectedServiceIds.length > 0 && (
            <div
              role="region"
              aria-label="Bulk service actions"
              className="rounded-2xl border border-[#0071E3]/30 bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0071E3]/10 text-[#0071E3] font-bold font-mono-num tabular-nums">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{selectedServiceIds.length} selected</span>
                </span>

                <button
                  type="button"
                  disabled={bulkSaving}
                  onClick={() => void handleBulkAction('activate')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ABEFC6] bg-[#ECFDF3] hover:bg-[#D1FADF] text-[#067647] font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Activate Selected</span>
                </button>

                <button
                  type="button"
                  disabled={bulkSaving}
                  onClick={() => void handleBulkAction('archive')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <Archive className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
                  <span>Archive Selected</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] px-2.5 py-1">
                  <label className="inline-flex items-center gap-1.5 font-semibold text-[#1D1D1F] cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={bulkGstEnabled}
                      onChange={(e) => setBulkGstEnabled(e.target.checked)}
                      className="accent-[#0071E3]"
                    />
                    <span>Apply GST</span>
                  </label>
                  {bulkGstEnabled && (
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="number"
                        aria-label="Bulk GST rate percentage"
                        min={0}
                        max={100}
                        step="0.5"
                        value={bulkGstRate}
                        onChange={(e) => setBulkGstRate(e.target.value)}
                        className="w-16 rounded-lg border border-[#E8E8ED] bg-white px-2 py-1 text-xs font-mono-num tabular-nums text-[#1D1D1F]"
                      />
                      <span className="text-[#6E6E73] font-semibold">%</span>
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={bulkSaving}
                    onClick={() => void handleBulkAction('adjust_gst')}
                    className="px-2.5 py-1 rounded-lg bg-[#0071E3] hover:bg-[#0062C4] text-white font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    {bulkSaving ? 'Updating...' : 'Apply GST Rate'}
                  </button>
                </div>

                <button
                  type="button"
                  disabled={bulkSaving}
                  onClick={() => setSelectedServiceIds([])}
                  className="px-2.5 py-1.5 rounded-xl border border-[#E8E8ED] bg-white hover:bg-[#F5F5F7] text-[#6E6E73] font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="liquid-glass-card rounded-3xl p-10 text-center text-xs text-[#6E6E73]">
              Loading service catalogue...
            </div>
          ) : filtered.length === 0 ? (
            <div className="liquid-glass-card rounded-3xl p-10 text-center text-xs text-[#6E6E73]">
              No services match the current filter.
            </div>
          ) : viewMode === 'table' ? (
            <div className="liquid-glass-card rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F5F7]/90 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                      <th className="py-3 pl-4 pr-2 w-10">
                        <input
                          type="checkbox"
                          aria-label="Select all filtered services"
                          checked={allFilteredSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someFilteredSelected;
                          }}
                          onChange={toggleSelectAllFiltered}
                          className="w-4 h-4 accent-[#0071E3] cursor-pointer rounded"
                        />
                      </th>
                      <th className="py-3 px-3">Service &amp; Category</th>
                      <th className="py-3 px-3">Pricing (INR)</th>
                      <th className="py-3 px-3 whitespace-nowrap">GST Rate</th>
                      <th className="py-3 px-3 whitespace-nowrap">Turnaround</th>
                      <th className="py-3 px-3 whitespace-nowrap">Status</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E8ED]">
                    {filtered.map((srv) => {
                      const isSelected = selectedSet.has(srv.id);
                      const isMessaging =
                        srv.id === 'srv-bulk-sms' ||
                        srv.id === 'srv-whatsapp-messaging' ||
                        srv.category === 'Messaging and Communication' ||
                        Boolean(srv.unitLabel);

                      return (
                        <tr
                          key={srv.id}
                          className={`transition-colors ${
                            isSelected
                              ? 'bg-[#0071E3]/[0.04]'
                              : !srv.active
                                ? 'bg-[#F5F5F7]/45 opacity-75 hover:bg-[#F5F5F7]/80'
                                : 'hover:bg-white/75'
                          }`}
                        >
                          <td className="py-3 pl-4 pr-2 align-top">
                            <input
                              type="checkbox"
                              aria-label={`Select ${srv.name}`}
                              checked={isSelected}
                              onChange={() => toggleServiceSelection(srv.id)}
                              className="w-4 h-4 accent-[#0071E3] cursor-pointer mt-0.5 rounded"
                            />
                          </td>
                          <td className="py-3 px-3 align-top">
                            <p className="font-bold text-[#1D1D1F]">{srv.name}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-semibold text-[#0071E3]">
                                {srv.category}
                              </span>
                              {srv.slug && (
                                <span className="font-mono-num text-[10px] text-[#6E6E73]">
                                  /{srv.slug}
                                </span>
                              )}
                              {isMessaging && srv.integrationConfigured === false && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#C2410C]">
                                  <ShieldAlert className="w-3 h-3" aria-hidden="true" />
                                  Provider Pending
                                </span>
                              )}
                              {srv.priceHistory && srv.priceHistory.length > 0 && (
                                <span className="text-[10px] font-mono-num text-[#6E6E73]">
                                  · {srv.priceHistory.length} rev
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 align-top font-mono-num tabular-nums text-[#1D1D1F]">
                            {srv.pricingModel === 'custom' ? (
                              <span className="font-sans text-[11px] text-[#6E6E73]">Custom Quote</span>
                            ) : (
                              <div className="space-y-0.5">
                                {(srv.oneTimePrice ?? srv.setupFee) > 0 && (
                                  <p>One-Time: ₹{(srv.oneTimePrice ?? srv.setupFee).toLocaleString('en-IN')}</p>
                                )}
                                {(srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0) > 0 && (
                                  <p>
                                    Monthly: ₹
                                    {(srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0).toLocaleString('en-IN')}
                                  </p>
                                )}
                                {srv.unitRate ? (
                                  <p className="text-[11px] text-[#6E6E73]">
                                    Usage: ₹{srv.unitRate.toFixed(2)}/{srv.unitLabel || 'unit'}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 align-top font-mono-num tabular-nums whitespace-nowrap">
                            {srv.gstEnabled ? (
                              <span className="font-semibold text-[#1D1D1F]">{srv.gstRate}% GST</span>
                            ) : (
                              <span className="text-[#6E6E73]">Exempt</span>
                            )}
                          </td>
                          <td className="py-3 px-3 align-top text-[#6E6E73]">
                            <p>{srv.deliveryPeriod}</p>
                            {srv.revisionLimit && (
                              <p className="text-[11px]">{srv.revisionLimit}</p>
                            )}
                          </td>
                          <td className="py-3 px-3 align-top whitespace-nowrap">
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => void handleToggleActive(srv)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${
                                srv.active
                                  ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                                  : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
                              }`}
                            >
                              {srv.active ? 'Active' : 'Archived'}
                            </button>
                          </td>
                          <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openPriceHistoryModal(srv.id)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E8E8ED] bg-[#F5F5F7] text-[11px] font-semibold text-[#1D1D1F] hover:bg-white cursor-pointer"
                                title="View price revision history"
                              >
                                <History className="w-3 h-3" aria-hidden="true" />
                                <span>History</span>
                              </button>
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => void handleDuplicate(srv)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold cursor-pointer"
                                title="Duplicate service"
                              >
                                <Copy className="w-3 h-3" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openModal(srv)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" aria-hidden="true" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => void handleDelete(srv)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#D92D20] text-[#B42318] cursor-pointer"
                                title="Delete service"
                              >
                                <Trash2 className="w-3 h-3" aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((srv) => {
                const isSelected = selectedSet.has(srv.id);
                const isMessaging =
                  srv.id === 'srv-bulk-sms' ||
                  srv.id === 'srv-whatsapp-messaging' ||
                  srv.category === 'Messaging and Communication' ||
                  Boolean(srv.unitLabel);

                return (
                  <article
                    key={srv.id}
                    className={`liquid-glass-card rounded-3xl p-5 space-y-3 text-xs ${
                      isSelected ? 'ring-2 ring-[#0071E3]/40' : ''
                    } ${!srv.active ? 'opacity-65' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          aria-label={`Select ${srv.name}`}
                          checked={isSelected}
                          onChange={() => toggleServiceSelection(srv.id)}
                          className="w-4 h-4 accent-[#0071E3] cursor-pointer mt-1 shrink-0 rounded"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F5F5F7] border border-[#E8E8ED] text-[10px] font-semibold text-[#0071E3]">
                              {srv.category}
                            </span>
                            {isMessaging && srv.integrationConfigured === false && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[10px] font-semibold text-[#C2410C]">
                                <ShieldAlert className="w-3 h-3" aria-hidden="true" />
                                Provider API Not Connected
                              </span>
                            )}
                            {srv.priceHistory && srv.priceHistory.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-[10px] font-semibold text-violet-700">
                                <History className="w-2.5 h-2.5" />
                                {srv.priceHistory.length} Revisions
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-base font-bold text-[#1D1D1F]">{srv.name}</h3>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void handleToggleActive(srv)}
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer ${
                          srv.active
                            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                            : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
                        }`}
                      >
                        {srv.active ? 'Active' : 'Archived'}
                      </button>
                    </div>

                    <p className="text-[#6E6E73] leading-relaxed">{srv.description}</p>

                    <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-3 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {srv.pricingModel === 'custom' ? (
                          <span className="font-semibold text-[#1D1D1F]">
                            Custom Quote Only (No fabricated price)
                          </span>
                        ) : (
                          <div className="font-mono-num text-[#1D1D1F] flex flex-wrap gap-x-3 gap-y-1">
                            {(srv.oneTimePrice ?? srv.setupFee) > 0 && (
                              <span>
                                One-Time: ₹{(srv.oneTimePrice ?? srv.setupFee).toLocaleString('en-IN')}
                              </span>
                            )}
                            {(srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0) > 0 && (
                              <span>
                                Monthly: ₹
                                {(srv.monthlyPrice ?? srv.recurringFee ?? srv.packagePrice ?? 0).toLocaleString('en-IN')}
                              </span>
                            )}
                            {srv.includedUnits ? (
                              <span>
                                Included: {srv.includedUnits.toLocaleString('en-IN')}{' '}
                                {srv.unitLabel || 'units'}
                              </span>
                            ) : null}
                            {srv.unitRate ? (
                              <span>
                                Usage Rate: ₹{srv.unitRate.toFixed(2)}/{srv.unitLabel || 'unit'}
                              </span>
                            ) : null}
                          </div>
                        )}
                        <span className="text-[11px] text-[#6E6E73]">
                          {srv.gstEnabled ? `GST ${srv.gstRate}%` : 'No GST'} · {srv.deliveryPeriod}
                        </span>
                      </div>

                      {srv.revisionLimit && (
                        <p className="text-[11px] text-[#6E6E73]">
                          • Revisions: <strong>{srv.revisionLimit}</strong>
                          {srv.additionalDeliverableCharge ? ` · Extra: ₹${srv.additionalDeliverableCharge.toLocaleString('en-IN')}` : ''}
                        </p>
                      )}

                      {(srv.internationalPricing?.aed || srv.internationalPricing?.usd) && (
                        <div className="pt-1 border-t border-[#E8E8ED] flex flex-wrap items-center gap-3 text-[11px] text-[#6E6E73] font-mono-num">
                          <span className="inline-flex items-center gap-1 font-sans font-semibold text-[#1D1D1F]">
                            <Globe className="w-3 h-3 text-[#0071E3]" aria-hidden="true" />
                            Intl Tiers:
                          </span>
                          {srv.internationalPricing.aed && (
                            <span>
                              AED{' '}
                              {srv.internationalPricing.aed.setupFee
                                ? `Setup ${srv.internationalPricing.aed.setupFee}`
                                : srv.internationalPricing.aed.packagePrice
                                  ? `Pkg ${srv.internationalPricing.aed.packagePrice}`
                                  : ''}
                              {srv.internationalPricing.aed.unitRate
                                ? ` · ${srv.internationalPricing.aed.unitRate}/${srv.unitLabel || 'unit'}`
                                : ''}
                            </span>
                          )}
                          {srv.internationalPricing.usd && (
                            <span>
                              USD{' '}
                              {srv.internationalPricing.usd.setupFee
                                ? `Setup ${srv.internationalPricing.usd.setupFee}`
                                : srv.internationalPricing.usd.packagePrice
                                  ? `Pkg ${srv.internationalPricing.usd.packagePrice}`
                                  : ''}
                              {srv.internationalPricing.usd.unitRate
                                ? ` · ${srv.internationalPricing.usd.unitRate}/${srv.unitLabel || 'unit'}`
                                : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {srv.deliverables?.length > 0 && (
                      <ul className="space-y-1 text-[11px] text-[#1D1D1F]">
                        {srv.deliverables.slice(0, 4).map((d, i) => (
                          <li key={i} className="truncate">
                            · {d}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E8E8ED]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openPriceHistoryModal(srv.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#E8E8ED] bg-[#F5F5F7] text-[10px] font-semibold text-[#1D1D1F] hover:bg-white cursor-pointer whitespace-nowrap"
                        >
                          <History className="w-3 h-3" aria-hidden="true" />
                          <span>Price History</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void handleDuplicate(srv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold cursor-pointer"
                          title="Duplicate this service"
                        >
                          <Copy className="w-3 h-3" /> Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => openModal(srv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void handleDelete(srv)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#D92D20] text-[#B42318] cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 1B: SERVICE CATEGORIES & MEGA-MENU ORDER */}
      {activeTab === 'categories' && (
        <div className="space-y-5">
          <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
            <div className="border-b border-[#E8E8ED] pb-3">
              <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                Add Service Category
              </h3>
              <p className="text-xs text-[#6E6E73]">
                Create new standalone marketplace categories or control their display sequence inside the navigation Mega-Menu.
              </p>
            </div>
            <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end text-xs">
              <div className="md:col-span-4">
                <label className="block font-semibold text-[#1D1D1F] mb-1">Category Name *</label>
                <input
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., E-Commerce Growth"
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block font-semibold text-[#1D1D1F] mb-1">URL Slug (Optional)</label>
                <input
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="e-commerce-growth"
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block font-semibold text-[#1D1D1F] mb-1">Description</label>
                <input
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Short navigation summary"
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <GlassButton type="submit" variant="primary" size="sm" disabled={savingCategory}>
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{savingCategory ? 'Adding...' : 'Add Category'}</span>
                </GlassButton>
              </div>
            </form>
          </div>

          <div className="liquid-glass-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F5F7]/90 border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-3">Category &amp; Slug</th>
                    <th className="py-3 px-3 hidden md:table-cell">Description</th>
                    <th className="py-3 px-3 text-center">Services</th>
                    <th className="py-3 px-3">Visibility</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8ED]">
                  {categoryRecords.map((cat, idx) => {
                    const count = services.filter((s) => s.category === cat.name).length;
                    return (
                      <tr key={cat.id} className="hover:bg-white/75">
                        <td className="py-3 px-4 font-mono-num font-bold text-[#1D1D1F]">
                          <div className="inline-flex items-center gap-1.5">
                            <span>#{idx + 1}</span>
                            <button
                              type="button"
                              disabled={savingCategory || idx === 0}
                              onClick={() => void handleMoveCategory(idx, -1)}
                              aria-label={`Move ${cat.name} up`}
                              className="p-1 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] disabled:opacity-35 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={savingCategory || idx === categoryRecords.length - 1}
                              onClick={() => void handleMoveCategory(idx, 1)}
                              aria-label={`Move ${cat.name} down`}
                              className="p-1 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] disabled:opacity-35 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-[#1D1D1F]">{cat.name}</p>
                          <p className="font-mono-num text-[11px] text-[#6E6E73]">/{cat.slug}</p>
                        </td>
                        <td className="py-3 px-3 text-[#6E6E73] hidden md:table-cell max-w-xs">
                          {cat.description || '—'}
                        </td>
                        <td className="py-3 px-3 text-center font-mono-num font-bold text-[#1D1D1F]">
                          {count}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            disabled={savingCategory}
                            onClick={() => void handleToggleCategoryActive(cat)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${
                              cat.active
                                ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                                : 'bg-[#F5F5F7] border-[#E8E8ED] text-[#6E6E73]'
                            }`}
                          >
                            {cat.active ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingCategory({ ...cat })}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#1D1D1F] text-[11px] font-semibold cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" aria-hidden="true" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              disabled={savingCategory || count > 0}
                              onClick={() => void handleDeleteCategory(cat)}
                              title={count > 0 ? 'Reassign services before deleting category' : 'Delete empty category'}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E8E8ED] bg-white hover:border-[#D92D20] text-[#B42318] disabled:opacity-35 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMS SERVICE CONFIGURATION PANEL */}
      {activeTab === 'sms' && (
        <div className="liquid-glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200">
                <Send className="w-3.5 h-3.5" />
                <span>SMS Service Configuration Module</span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                Bulk SMS Marketing Rates &amp; Telecom Package Controls
              </h3>
              <p className="text-xs text-[#6E6E73]">
                Configure the starter SMS package, credit volume, effective rate per SMS, and toggle transactional route enablement.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#6E6E73] block">Base Starter Rate</span>
              <span className="text-lg font-bold font-mono-num text-[#1D1D1F]">
                ₹{bulkSmsItem?.packagePrice?.toLocaleString('en-IN') || '3,000'} / {bulkSmsItem?.includedUnits?.toLocaleString('en-IN') || '10,000'} SMS
              </span>
            </div>
          </div>

          {bulkSmsItem ? (
            <form onSubmit={handleSaveSmsConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1D1D1F] block">
                    Base Package Price (INR)
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="packagePrice"
                    defaultValue={bulkSmsItem.packagePrice ?? 3000}
                    className={`${inputCls} font-mono-num`}
                    required
                  />
                  <p className="text-[10px] text-[#6E6E73]">Default: ₹3,000 package</p>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1D1D1F] block">
                    Base Package Credits
                  </label>
                  <input
                    type="number"
                    step="100"
                    name="includedUnits"
                    defaultValue={bulkSmsItem.includedUnits ?? 10000}
                    className={`${inputCls} font-mono-num`}
                    required
                  />
                  <p className="text-[10px] text-[#6E6E73]">Default: 10,000 SMS credits</p>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1D1D1F] block">
                    Rate Per Credit (INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="unitRate"
                    defaultValue={bulkSmsItem.unitRate ?? 0.3}
                    className={`${inputCls} font-mono-num`}
                    required
                  />
                  <p className="text-[10px] text-[#6E6E73]">Effective rate (₹0.30/SMS)</p>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1D1D1F] block">
                    Additional Credit Rate (INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="additionalUnitRate"
                    defaultValue={bulkSmsItem.additionalUnitRate ?? 0.3}
                    className={`${inputCls} font-mono-num`}
                    required
                  />
                  <p className="text-[10px] text-[#6E6E73]">Calculated for usage above base</p>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="font-semibold text-blue-900 block text-xs">
                      Transactional SMS Route Status
                    </label>
                    <p className="text-[11px] text-blue-700">
                      Enable transactional templates (e.g. OTPs, order updates) where supported by the DLT provider.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="transactionalSmsEnabled"
                    defaultChecked={Boolean(bulkSmsItem.transactionalSmsEnabled)}
                    className="w-5 h-5 accent-[#0071E3] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <GlassButton type="submit" variant="primary" size="sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save SMS Configuration'}
                </GlassButton>
              </div>
            </form>
          ) : (
            <p className="text-xs text-[#6E6E73]">Bulk SMS service not found in catalogue.</p>
          )}
        </div>
      )}

      {/* TAB 3: WHATSAPP BUSINESS SETUP MODULE */}
      {activeTab === 'whatsapp' && (
        <div className="liquid-glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Business Setup Configuration</span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                WhatsApp Onboarding &amp; Usage Separation Module
              </h3>
              <p className="text-xs text-[#6E6E73]">
                Configure the one-time setup fee and per-message rate. Invoices render setup and metered usage strictly separate.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#6E6E73] block">Setup + Usage Rates</span>
              <span className="text-lg font-bold font-mono-num text-[#1D1D1F]">
                ₹{whatsappItem?.setupFee?.toLocaleString('en-IN') || '4,999'} + ₹{whatsappItem?.unitRate?.toFixed(2) || '1.50'}/msg
              </span>
            </div>
          </div>

          {whatsappItem ? (
            <form onSubmit={handleSaveWhatsappSetup} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                  <label className="font-semibold text-emerald-950 block text-xs">
                    One-Time Setup Fee (INR)
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="setupFee"
                    defaultValue={whatsappItem.setupFee ?? 4999}
                    className={`${inputCls} font-mono-num`}
                    required
                  />
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Covers Business Manager verification, API workflow setup, and customer communication design.
                  </p>
                </div>

                <div className="space-y-1 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                  <label className="font-semibold text-emerald-950 block text-xs">
                    Per-Message Usage Charge (INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="unitRate"
                    defaultValue={whatsappItem.unitRate ?? 1.5}
                    className={`${inputCls} font-mono-num`}
                    required
                  />
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Billed strictly separate from setup fee according to message categories (Marketing, Utility, Service).
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3 text-[11px] text-amber-800 space-y-1">
                <p className="font-semibold">⚠️ Commercial Invoicing Rule:</p>
                <p>
                  Do not combine setup charges and message usage into one misleading price. Quotations and invoices will render these on separate line items.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <GlassButton type="submit" variant="primary" size="sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save WhatsApp Configuration'}
                </GlassButton>
              </div>
            </form>
          ) : (
            <p className="text-xs text-[#6E6E73]">WhatsApp Business service not found in catalogue.</p>
          )}
        </div>
      )}

      {/* TAB 4: PRICE REVISION HISTORY */}
      {activeTab === 'history' && (
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
          <div className="border-b border-[#E8E8ED] pb-3">
            <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
              Service Price Revision Audit Trail
            </h3>
            <p className="text-xs text-[#6E6E73]">
              Chronological ledger tracking commercial price doubling, admin rate adjustments, and package updates.
            </p>
          </div>

          <div className="space-y-3">
            {services
              .filter((s) => s.priceHistory && s.priceHistory.length > 0)
              .map((srv) => (
                <div key={srv.id} className="rounded-2xl border border-[#E8E8ED] bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#1D1D1F] text-sm">{srv.name}</h4>
                      <span className="text-[11px] text-[#0071E3] font-semibold">{srv.category}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-xs font-mono-num font-semibold">
                      Current: ₹{(srv.oneTimePrice ?? srv.setupFee ?? srv.recurringFee ?? srv.packagePrice ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="divide-y divide-[#E8E8ED] border-t border-[#E8E8ED] pt-2">
                    {srv.priceHistory?.map((h, idx) => (
                      <div key={idx} className="py-2 text-xs flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="text-[#1D1D1F] font-medium">{h.note || 'Price change'}</p>
                          <p className="text-[10px] text-[#6E6E73]">
                            By {h.changedBy} on {new Date(h.changedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="font-mono-num text-right">
                          <span className="text-[#6E6E73] line-through mr-2">
                            ₹{h.previousPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[#067647] font-bold">
                            → ₹{h.newPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL: EDIT / CREATE SERVICE */}
      <GlassModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        subtitle={isNew ? 'NEW STANDALONE SERVICE' : editing?.id}
        title={isNew ? 'Add Standalone Service' : 'Configure Service Pricing & Terms'}
      >
        {editing && (
          <form onSubmit={handleSave} className="space-y-3 text-xs max-h-[80vh] overflow-y-auto pr-1">
            {modalError && (
              <div role="alert" className="rounded-xl bg-[#FEF3F2] border border-[#FECDCA] px-3 py-2 text-xs font-semibold text-[#B42318]">
                {modalError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Service Name *</label>
                <input
                  required
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">URL Slug (/services/:slug)</label>
                <input
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="auto-generated-from-name"
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Category *</label>
                <select
                  value={editing.category || ''}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className={inputCls}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Menu Order</label>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={editing.menuOrder ?? editing.sortOrder ?? 1}
                  onChange={(e) => setEditing({ ...editing, menuOrder: Number(e.target.value) || 1 })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Pricing Model</label>
                <select
                  value={editing.pricingModel || 'fixed'}
                  onChange={(e) =>
                    setEditing({ ...editing, pricingModel: e.target.value as 'fixed' | 'custom' })
                  }
                  className={inputCls}
                >
                  <option value="fixed">Fixed / Standalone Price</option>
                  <option value="custom">Custom Scope Only</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Billing Cycle</label>
                <select
                  value={editing.billingCycle || 'one-time'}
                  onChange={(e) => setEditing({ ...editing, billingCycle: e.target.value as any })}
                  className={inputCls}
                >
                  <option value="one-time">One-Time Project</option>
                  <option value="monthly">Monthly Subscription</option>
                  <option value="quarterly">Quarterly Retainer</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Standalone Project & Monthly Pricing */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Standalone Project / Setup Fee (INR)
                </label>
                <input
                  type="number"
                  step="1"
                  min={0}
                  disabled={editing.pricingModel === 'custom'}
                  value={editing.oneTimePrice ?? editing.setupFee ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditing({ ...editing, oneTimePrice: val, setupFee: val });
                  }}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Monthly Subscription Fee (INR)
                </label>
                <input
                  type="number"
                  step="1"
                  min={0}
                  disabled={editing.pricingModel === 'custom'}
                  value={editing.monthlyPrice ?? editing.recurringFee ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditing({ ...editing, monthlyPrice: val, recurringFee: val, packagePrice: val });
                  }}
                  className={`${inputCls} font-mono-num`}
                />
              </div>

              {/* Revision limits & delivery terms */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Revision Limit</label>
                <input
                  value={String(editing.revisionLimit || '2 rounds included')}
                  onChange={(e) => setEditing({ ...editing, revisionLimit: e.target.value })}
                  placeholder="e.g., 3 rounds included"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Additional Deliverable Charge (INR)
                </label>
                <input
                  type="number"
                  step="1"
                  min={0}
                  value={editing.additionalDeliverableCharge ?? 0}
                  onChange={(e) => setEditing({ ...editing, additionalDeliverableCharge: Number(e.target.value) })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Delivery Period / Turnaround</label>
                <input
                  value={editing.deliveryPeriod || ''}
                  onChange={(e) => setEditing({ ...editing, deliveryPeriod: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">GST Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.gstRate ?? 18}
                  onChange={(e) => setEditing({ ...editing, gstRate: Number(e.target.value) })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
            </div>

            {/* Messaging Units */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#E8E8ED] pt-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Unit Label</label>
                <input
                  value={editing.unitLabel || ''}
                  onChange={(e) => setEditing({ ...editing, unitLabel: e.target.value })}
                  placeholder="SMS or message"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Usage Rate (INR/unit)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={editing.unitRate ?? 0}
                  onChange={(e) => setEditing({ ...editing, unitRate: Number(e.target.value) })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Included Units</label>
                <input
                  type="number"
                  min={0}
                  value={editing.includedUnits ?? 0}
                  onChange={(e) => setEditing({ ...editing, includedUnits: Number(e.target.value) })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
            </div>

            {/* Subscription & Policy Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#E8E8ED] pt-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Subscription Duration</label>
                <input
                  value={editing.subscriptionDuration || ''}
                  onChange={(e) => setEditing({ ...editing, subscriptionDuration: e.target.value })}
                  placeholder="e.g. Monthly retainer"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Renewal Terms</label>
                <input
                  value={editing.renewalTerms || ''}
                  onChange={(e) => setEditing({ ...editing, renewalTerms: e.target.value })}
                  placeholder="e.g. Auto-renews monthly"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Cancellation Policy</label>
                <input
                  value={editing.cancellationPolicy || ''}
                  onChange={(e) => setEditing({ ...editing, cancellationPolicy: e.target.value })}
                  placeholder="e.g. 7 days notice"
                  className={inputCls}
                />
              </div>
            </div>

            {/* International AED / USD */}
            <div className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/70 p-3 space-y-2.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                <Globe className="w-3.5 h-3.5 text-[#0071E3]" aria-hidden="true" />
                <span>Configurable International Pricing (AED / USD)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-[#6E6E73]">AED (UAE) Tier</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="Setup"
                      value={editing.internationalPricing?.aed?.setupFee ?? ''}
                      onChange={(e) => updateIntl('aed', 'setupFee', e.target.value)}
                      className={`${inputCls} font-mono-num`}
                    />
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="Package"
                      value={editing.internationalPricing?.aed?.packagePrice ?? ''}
                      onChange={(e) => updateIntl('aed', 'packagePrice', e.target.value)}
                      className={`${inputCls} font-mono-num`}
                    />
                    <input
                      type="number"
                      step="0.001"
                      min={0}
                      placeholder="Unit Rate"
                      value={editing.internationalPricing?.aed?.unitRate ?? ''}
                      onChange={(e) => updateIntl('aed', 'unitRate', e.target.value)}
                      className={`${inputCls} font-mono-num`}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-[#6E6E73]">USD (Global) Tier</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="Setup"
                      value={editing.internationalPricing?.usd?.setupFee ?? ''}
                      onChange={(e) => updateIntl('usd', 'setupFee', e.target.value)}
                      className={`${inputCls} font-mono-num`}
                    />
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="Package"
                      value={editing.internationalPricing?.usd?.packagePrice ?? ''}
                      onChange={(e) => updateIntl('usd', 'packagePrice', e.target.value)}
                      className={`${inputCls} font-mono-num`}
                    />
                    <input
                      type="number"
                      step="0.001"
                      min={0}
                      placeholder="Unit Rate"
                      value={editing.internationalPricing?.usd?.unitRate ?? ''}
                      onChange={(e) => updateIntl('usd', 'unitRate', e.target.value)}
                      className={`${inputCls} font-mono-num`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Description</label>
              <textarea
                rows={2}
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Deliverables (one per line)
              </label>
              <textarea
                rows={3}
                value={deliverablesDraft}
                onChange={(e) => setDeliverablesDraft(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Key Benefits (one per line)
                </label>
                <textarea
                  rows={3}
                  value={benefitsDraft}
                  onChange={(e) => setBenefitsDraft(e.target.value)}
                  placeholder="Measurable standalone ROI..."
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Work Process Steps (one per line)
                </label>
                <textarea
                  rows={3}
                  value={workProcessDraft}
                  onChange={(e) => setWorkProcessDraft(e.target.value)}
                  placeholder="1. Requirement brief & audit..."
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Price Change Audit Reason / Note (Recorded in History)
              </label>
              <input
                value={priceChangeNoteDraft}
                onChange={(e) => setPriceChangeNoteDraft(e.target.value)}
                placeholder="e.g. Revised commercial rate card Q2"
                className={inputCls}
              />
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-1">
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editing.gstEnabled)}
                  onChange={(e) => setEditing({ ...editing, gstEnabled: e.target.checked })}
                  className="accent-[#0071E3]"
                />
                <span>GST Applicable</span>
              </label>
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editing.active)}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="accent-[#0071E3]"
                />
                <span>Active / Visible</span>
              </label>
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.showInMenu !== false}
                  onChange={(e) => setEditing({ ...editing, showInMenu: e.target.checked })}
                  className="accent-[#0071E3]"
                />
                <span>Show in Mega-Menu</span>
              </label>
              <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editing.transactionalSmsEnabled)}
                  onChange={(e) => setEditing({ ...editing, transactionalSmsEnabled: e.target.checked })}
                  className="accent-[#0071E3]"
                />
                <span>Transactional SMS Route Enabled</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E8ED]">
              <GlassButton variant="subtle" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" disabled={saving} variant="primary" size="sm">
                {saving ? 'Saving...' : 'Save Service Configuration'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* MODAL: EDIT SERVICE CATEGORY */}
      <GlassModal
        open={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        subtitle={editingCategory?.id}
        title="Edit Service Category"
      >
        {editingCategory && (
          <form onSubmit={handleSaveEditedCategory} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Category Name *</label>
              <input
                required
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">URL Slug *</label>
                <input
                  required
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className={`${inputCls} font-mono-num`}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Menu Order</label>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={editingCategory.menuOrder ?? editingCategory.sortOrder}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      menuOrder: Number(e.target.value) || 1,
                    })
                  }
                  className={`${inputCls} font-mono-num`}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Description</label>
              <textarea
                rows={2}
                value={editingCategory.description}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, description: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={editingCategory.active}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, active: e.target.checked })
                }
                className="accent-[#0071E3]"
              />
              <span>Active in Navigation &amp; Catalogue</span>
            </label>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E8ED]">
              <GlassButton variant="subtle" size="sm" onClick={() => setEditingCategory(null)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" disabled={savingCategory} variant="primary" size="sm">
                {savingCategory ? 'Saving...' : 'Save Category'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* MODAL: DATABASE-BACKED PRICE REVISION HISTORY */}
      <GlassModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        maxWidthClass="max-w-5xl"
        subtitle="SERVICE DATABASE AUDIT TRAIL"
        title="Price Revision History"
      >
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
              <select
                aria-label="Filter price history by service"
                value={historyFilterServiceId}
                onChange={(e) => setHistoryFilterServiceId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs font-semibold text-[#1D1D1F] max-w-xs"
              >
                <option value="ALL">
                  All Services ({historyRecords.length} revisions)
                </option>
                {historyServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.revisionCount})
                  </option>
                ))}
              </select>

              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search
                  className="w-3.5 h-3.5 text-[#A1A1A6] absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search service, admin email, note..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E8ED] bg-white text-xs text-[#1D1D1F]"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={historyLoading}
              onClick={() => void fetchPriceHistoryFromDb()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E8E8ED] bg-white hover:bg-[#F5F5F7] text-[11px] font-semibold text-[#1D1D1F] cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{historyLoading ? 'Loading...' : 'Refresh from DB'}</span>
            </button>
          </div>

          {historyError && (
            <div className="rounded-xl bg-[#FEF3F2] border border-[#FECDCA] px-3 py-2.5 text-xs font-semibold text-[#B42318]">
              {historyError}
            </div>
          )}

          {historyLoading && historyRecords.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/60 p-8 text-center text-xs text-[#6E6E73]">
              Fetching price revision history from service database...
            </div>
          ) : filteredHistoryRecords.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/60 p-8 text-center text-xs text-[#6E6E73]">
              No price revision entries match the selected filter.
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E8E8ED] bg-white overflow-hidden">
              <div className="overflow-x-auto max-h-[55vh] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-[#F5F5F7] border-b border-[#E8E8ED] text-[#6E6E73] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3.5">Service</th>
                      <th className="py-2.5 px-3.5 text-right">Previous Price</th>
                      <th className="py-2.5 px-3.5 text-right">New Price</th>
                      <th className="py-2.5 px-3.5">Effective Date</th>
                      <th className="py-2.5 px-3.5">Administering User</th>
                      <th className="py-2.5 px-3.5">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E8ED]">
                    {filteredHistoryRecords.map((rev) => {
                      const effectiveFormatted = rev.effectiveDate
                        ? new Date(rev.effectiveDate).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—';
                      return (
                        <tr key={rev.id} className="hover:bg-[#F5F5F7]/50">
                          <td className="py-2.5 px-3.5">
                            <p className="font-semibold text-[#1D1D1F]">{rev.serviceName}</p>
                            <p className="text-[11px] text-[#6E6E73]">
                              {rev.category} · {rev.priceField}
                            </p>
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono-num tabular-nums text-[#6E6E73]">
                            ₹{rev.previousPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono-num tabular-nums font-bold text-[#067647]">
                            ₹{rev.newPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3.5 font-mono-num tabular-nums text-[#1D1D1F] whitespace-nowrap">
                            {effectiveFormatted}
                          </td>
                          <td className="py-2.5 px-3.5">
                            <p className="font-semibold text-[#1D1D1F]">{rev.changedBy}</p>
                            {rev.changedByEmail && (
                              <p className="text-[11px] font-mono-num text-[#6E6E73]">
                                {rev.changedByEmail}
                              </p>
                            )}
                          </td>
                          <td className="py-2.5 px-3.5 text-[#6E6E73] max-w-xs">
                            {rev.note || 'Rate revision recorded'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E8E8ED]">
            <p className="text-[11px] text-[#6E6E73] font-mono-num tabular-nums">
              Showing {filteredHistoryRecords.length} of {historyRecords.length} database revisions
            </p>
            <GlassButton variant="subtle" size="sm" onClick={() => setHistoryModalOpen(false)}>
              Close
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}

export default AdminServicesPanel;
