export type ResearchNotificationType = 'defense_schedule_created' | 'defense_schedule_updated';

export type ResearchNotification = {
  id: string;
  type: ResearchNotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  data: Record<string, unknown>;
};

export type NotificationMap = Record<string, ResearchNotification[]>;

const loadMap = (storageKey: string): NotificationMap => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as NotificationMap;
  } catch {
    return {};
  }
};

const saveMap = (storageKey: string, map: NotificationMap) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    return;
  }
};

export const pushNotification = (storageKey: string, recipientKey: string, notification: ResearchNotification) => {
  const map = loadMap(storageKey);
  const existing = map[recipientKey] ?? [];
  map[recipientKey] = [notification, ...existing].slice(0, 50);
  saveMap(storageKey, map);
};

export const getNotifications = (storageKey: string, recipientKey: string): ResearchNotification[] => {
  const map = loadMap(storageKey);
  return map[recipientKey] ?? [];
};

export const markAllRead = (storageKey: string, recipientKey: string) => {
  const map = loadMap(storageKey);
  const items = map[recipientKey] ?? [];
  map[recipientKey] = items.map((n) => ({ ...n, read: true }));
  saveMap(storageKey, map);
};

export const markRead = (storageKey: string, recipientKey: string, notificationId: string) => {
  const map = loadMap(storageKey);
  const items = map[recipientKey] ?? [];
  map[recipientKey] = items.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
  saveMap(storageKey, map);
};

export const clearNotifications = (storageKey: string, recipientKey: string) => {
  const map = loadMap(storageKey);
  map[recipientKey] = [];
  saveMap(storageKey, map);
};

