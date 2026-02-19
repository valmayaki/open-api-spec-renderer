export interface Settings {
  autoRender: boolean;
  theme: 'light' | 'dark';
}

const DEFAULT_SETTINGS: Settings = {
  autoRender: false,
  theme: 'light',
};

export async function getSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get('settings', (result) => {
      resolve({ ...DEFAULT_SETTINGS, ...(result.settings || {}) });
    });
  });
}

export async function setSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  return new Promise((resolve) => {
    chrome.storage.sync.set({ settings: updated }, () => {
      resolve();
    });
  });
}
