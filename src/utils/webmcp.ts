import {
  AppRoute,
  OFFICIAL_CONTACT,
  PRICING_PACKAGES,
  RATE_CARD_ITEMS,
  VENTURES_PORTFOLIO,
} from '../data/akyinData';
import { buildFormattedEnquiryText, validateEnquiryPayload } from './dispatchEnquiry';
import { submitEnquiryRecord } from '../services/appsScriptClient';

let registeredOnLoad = false;

export function registerAkyinWebMcpTools(onNavigate?: (route: AppRoute) => void): void {
  if (typeof navigator === 'undefined') return;
  const mc = navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;
  if (registeredOnLoad) return;

  registeredOnLoad = true;

  try {
    mc.registerTool({
      name: 'akyin_list_ventures',
      description:
        'List all seven AKYIN Ventures operating businesses, their industries, value propositions, and dedicated internal/external URLs.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          sectorFilter: {
            type: 'string',
            description: 'Optional keyword to filter ventures by industry or name.',
          },
        },
      },
      execute: (args) => {
        const q = typeof args?.sectorFilter === 'string' ? args.sectorFilter.trim().toLowerCase() : '';
        const items = q
          ? VENTURES_PORTFOLIO.filter(
              (v) =>
                v.name.toLowerCase().includes(q) ||
                v.sector.toLowerCase().includes(q) ||
                v.description.toLowerCase().includes(q)
            )
          : VENTURES_PORTFOLIO;

        return {
          organization: 'AKYIN Ventures',
          domain: OFFICIAL_CONTACT.domain,
          count: items.length,
          ventures: items.map((v) => ({
            code: v.code,
            name: v.name,
            sector: v.sector,
            positioning: v.positioning,
            url: `${OFFICIAL_CONTACT.domain}${v.route}`,
            externalUrl: v.externalUrl || null,
          })),
        };
      },
    });

    mc.registerTool({
      name: 'akyin_get_pricing',
      description:
        'Retrieve transparent INR pricing for AKYIN MARKETINGS retainer packages (Package A & Package B), commercial sales training, and the 21-item individual service rate card.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Optional rate card category (e.g. "Lead Generation", "Qualification", "Campaigns", "Training").',
          },
        },
      },
      execute: (args) => {
        const cat = typeof args?.category === 'string' ? args.category.trim().toLowerCase() : '';
        const rateCard = cat
          ? RATE_CARD_ITEMS.filter((item) => item.category.toLowerCase().includes(cat))
          : RATE_CARD_ITEMS;

        return {
          currency: 'INR',
          pricingPageUrl: `${OFFICIAL_CONTACT.domain}/pricing`,
          packages: PRICING_PACKAGES.map((pkg) => ({
            code: pkg.code,
            name: pkg.name,
            setupFee: pkg.setupFee,
            monthlyFee: pkg.monthlyFee,
            includes: pkg.includes,
            excludes: pkg.excludes,
          })),
          rateCard,
        };
      },
    });

    mc.registerTool({
      name: 'akyin_get_contact_info',
      description:
        'Retrieve official corporate contact details (email, telephone, WhatsApp, social handles) and legal page links for AKYIN Ventures.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: () => ({
        organization: OFFICIAL_CONTACT.parentBrand,
        website: OFFICIAL_CONTACT.domain,
        email: OFFICIAL_CONTACT.email,
        mailto: `mailto:${OFFICIAL_CONTACT.email}`,
        telephone: OFFICIAL_CONTACT.phoneDisplay,
        tel: `tel:+${OFFICIAL_CONTACT.whatsappNumber}`,
        whatsappUrl: OFFICIAL_CONTACT.whatsappUrl,
        socialHandle: OFFICIAL_CONTACT.marketingSocialHandle,
        socials: OFFICIAL_CONTACT.marketingSocials,
        legalPages: {
          terms: `${OFFICIAL_CONTACT.domain}/terms`,
          privacy: `${OFFICIAL_CONTACT.domain}/privacy`,
          about: `${OFFICIAL_CONTACT.domain}/about`,
          contact: `${OFFICIAL_CONTACT.domain}/contact`,
          pricing: `${OFFICIAL_CONTACT.domain}/pricing`,
        },
      }),
    });

    mc.registerTool({
      name: 'akyin_navigate',
      description:
        'Navigate the browser view to a specific page on AKYIN.com (e.g. /, /about, /ventures, /ventures/marketing, /marketing/automotive, /pricing, /advisory, /insights, /contact, /terms, /privacy, /sitemap).',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          route: {
            type: 'string',
            description: 'Target route path starting with "/".',
          },
        },
        required: ['route'],
      },
      execute: (args) => {
        const target = (typeof args?.route === 'string' ? args.route.trim() : '/') as AppRoute;
        if (onNavigate) {
          onNavigate(target);
        } else if (typeof window !== 'undefined') {
          window.history.pushState({}, '', target);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        return { navigatedTo: target, url: `${OFFICIAL_CONTACT.domain}${target}` };
      },
    });

    mc.registerTool({
      name: 'akyin_submit_enquiry',
      description:
        'Validate and submit a structured corporate, marketing agency, automotive dealership, or partnership enquiry to AKYIN Ventures.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Full name of the requester.' },
          email: { type: 'string', description: 'Business or personal email address.' },
          phone: { type: 'string', description: 'Contact phone number with country code.' },
          company: { type: 'string', description: 'Company or dealership name (optional).' },
          country: { type: 'string', description: 'Country (e.g. India, UAE, UK).' },
          city: { type: 'string', description: 'City name.' },
          vertical: { type: 'string', description: 'Target AKYIN business vertical.' },
          category: { type: 'string', description: 'Enquiry category.' },
          message: { type: 'string', description: 'Detailed requirement or enquiry context.' },
        },
        required: ['name', 'email', 'phone', 'country', 'city', 'message'],
      },
      execute: async (args) => {
        const payload = {
          category:
            typeof args?.category === 'string' && args.category.trim()
              ? args.category.trim()
              : 'General Business Enquiry',
          vertical:
            typeof args?.vertical === 'string' && args.vertical.trim()
              ? args.vertical.trim()
              : 'AKYIN Ventures (Corporate Group)',
          enquiryType: 'General Consultation / Proposal',
          name: String(args?.name || '').trim(),
          company: String(args?.company || '').trim(),
          email: String(args?.email || '').trim(),
          phone: String(args?.phone || '').trim(),
          country: String(args?.country || '').trim(),
          city: String(args?.city || '').trim(),
          message: String(args?.message || '').trim(),
        };

        const errors = validateEnquiryPayload(payload);
        if (Object.keys(errors).length > 0) {
          return {
            success: false,
            validationErrors: errors,
          };
        }

        try {
          const result = await submitEnquiryRecord({
            name: payload.name,
            company: payload.company,
            phone: payload.phone,
            email: payload.email,
            city: payload.city,
            country: payload.country,
            vertical: payload.vertical,
            enquiryType: payload.enquiryType,
            message: payload.message,
          });
          return {
            success: true,
            enquiryId: result.enquiryId,
            savedToLiveSheet: result.savedToLiveSheet,
            formattedDraft: buildFormattedEnquiryText(payload),
          };
        } catch {
          return {
            success: true,
            enquiryId: '',
            savedToLiveSheet: false,
            formattedDraft: buildFormattedEnquiryText(payload),
          };
        }
      },
    });
  } catch {
    // Non-blocking safeguard if environment provides a partial mock modelContext
  }
}
