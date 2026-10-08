interface LicenseInfo {
  key: string;
  expiryDate: string; // ISO string
  clientName: string;
  issuedBy: string;
  isTrial?: boolean;
}

export interface GeneratedLicenseRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  adminPin: string;
  key: string;
  days: number;
  expiryDate: string;
  createdAt: string;
}

const getStoredSettings = () => {
  try {
    const s = localStorage.getItem('crust_settings');
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

export const getLicenseInfo = (): LicenseInfo => {
  try {
    const saved = localStorage.getItem('crust_system_license');
    if (!saved) {
      const trialExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const trialLic: LicenseInfo = {
        key: 'TRIAL-7DAYS-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        expiryDate: trialExpiry,
        clientName: 'Default Pizzeria',
        issuedBy: 'System Auto-Trial',
        isTrial: true
      };
      localStorage.setItem('crust_system_license', JSON.stringify(trialLic));
      return trialLic;
    }
    return JSON.parse(saved);
  } catch {
    const trialExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    return {
      key: 'TRIAL-7DAYS-DEFAULT',
      expiryDate: trialExpiry,
      clientName: 'Default Pizzeria',
      issuedBy: 'System Auto-Trial',
      isTrial: true
    };
  }
};

export const isLicenseValid = (): boolean => {
  const lic = getLicenseInfo();
  if (!lic || !lic.expiryDate) return false;
  const expiry = new Date(lic.expiryDate).getTime();
  const now = Date.now();
  return now < expiry;
};

export const activateLicenseKey = (key: string): boolean => {
  const trimmed = key.trim().toUpperCase();
  if (trimmed.startsWith('CRUST-') || trimmed.startsWith('TRIAL-') || trimmed === 'SUPER-MASTER-KEY-2026') {
    let days = 365;
    let isTrial = false;
    if (trimmed.includes('-7-') || trimmed.includes('TRIAL-7')) { days = 7; isTrial = true; }
    else if (trimmed.includes('-14-')) { days = 14; isTrial = true; }
    else if (trimmed.includes('-30-')) days = 30;
    else if (trimmed.includes('-90-')) days = 90;
    else if (trimmed.includes('-365-') || trimmed === 'CRUST-PRO-2026-UNLIMITED') days = 365;
    else if (trimmed.includes('-730-')) days = 730;

    const newLic: LicenseInfo = {
      key: trimmed,
      expiryDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      clientName: 'Licensed POS Client',
      issuedBy: 'Super Admin',
      isTrial
    };
    localStorage.setItem('crust_system_license', JSON.stringify(newLic));
    return true;
  }
  return false;
};

export const getGeneratedLicenses = (): GeneratedLicenseRecord[] => {
  try {
    const saved = localStorage.getItem('crust_generated_licenses');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const generateLicenseKey = (days: number, clientName: string, clientEmail: string, adminPin: string): string => {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const prefix = days <= 14 ? `TRIAL-${days}` : `CRUST-${days}`;
  const key = `${prefix}-${clientName.replace(/\s+/g, '').toUpperCase()}-${randomStr}`;
  const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const record: GeneratedLicenseRecord = {
    id: `lic-${Date.now()}`,
    clientName,
    clientEmail,
    adminPin,
    key,
    days,
    expiryDate,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  try {
    const current = getGeneratedLicenses();
    localStorage.setItem('crust_generated_licenses', JSON.stringify([record, ...current]));

    // Also save user locally for immediate login
    const existingUsers = JSON.parse(localStorage.getItem('crust_client_users') || '[]');
    const newUser = {
      id: `u-${Date.now()}`,
      name: clientName + ' Admin',
      email: clientEmail.trim().toLowerCase(),
      role: 'Super Admin',
      phone: '03000000000',
      pin: adminPin.trim(),
      active: true
    };
    localStorage.setItem('crust_client_users', JSON.stringify([newUser, ...existingUsers]));
  } catch {}

  // Sync to Google Sheet if configured
  const settings = getStoredSettings();
  if (settings && settings.googleSheetWebAppUrl) {
    try {
      const licensePayload = {
        action: 'sync_license',
        sheet: 'Licenses',
        payload: {
          ClientName: clientName,
          LicenseKey: key,
          DurationDays: days,
          ExpiryDate: expiryDate.substring(0, 10),
          Status: 'Active',
          CreatedAt: record.createdAt
        }
      };
      fetch(settings.googleSheetWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(licensePayload)
      });

      const userPayload = {
        action: 'sync_user',
        sheet: 'Users',
        payload: {
          ClientName: clientName,
          Name: clientName + ' Admin',
          Email: clientEmail.trim().toLowerCase(),
          Role: 'Super Admin',
          Phone: '03000000000',
          Pin: adminPin.trim(),
          Active: true
        }
      };
      fetch(settings.googleSheetWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });
    } catch (err) {
      console.error('Failed to sync generated license & user to Google Sheet:', err);
    }
  }

  return key;
};
