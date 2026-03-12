export type ArchivedProjectDocument = {
  stage?: string;
  version?: string;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  documentUrl?: string;
  uploadedAt?: string;
};

export type ArchivedProject = {
  id: string;
  title: string;
  student: string;
  matricNumber?: string;
  year: string;
  department: string;
  faculty: string;
  programme: string;
  abstract?: string;
  keywords?: string[];
  supervisor?: string;
  archivedAt: string;
  documents?: ArchivedProjectDocument[];
};

export const PROJECT_ARCHIVE_STORAGE_KEY = 'school_admin_research_project_archive';

export const loadProjectArchive = (): ArchivedProject[] => {
  const raw = localStorage.getItem(PROJECT_ARCHIVE_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ArchivedProject[];
  } catch {
    return [];
  }
};

export const saveProjectArchive = (items: ArchivedProject[]) => {
  try {
    localStorage.setItem(PROJECT_ARCHIVE_STORAGE_KEY, JSON.stringify(items));
  } catch {
    return;
  }
};

const normalizeKey = (s: string) => s.trim().toLowerCase();

export const upsertArchivedProjects = (items: ArchivedProject[]) => {
  const existing = loadProjectArchive();
  const next = [...existing];

  items.forEach((item) => {
    const matchIndex = next.findIndex((x) => {
      const sameMatric = item.matricNumber && x.matricNumber ? normalizeKey(item.matricNumber) === normalizeKey(x.matricNumber) : false;
      if (sameMatric) return normalizeKey(item.year) === normalizeKey(x.year);
      return normalizeKey(x.title) === normalizeKey(item.title) && normalizeKey(x.student) === normalizeKey(item.student) && normalizeKey(x.year) === normalizeKey(item.year);
    });

    if (matchIndex >= 0) {
      next[matchIndex] = { ...next[matchIndex], ...item, id: next[matchIndex].id, archivedAt: item.archivedAt || next[matchIndex].archivedAt };
      return;
    }

    next.unshift(item);
  });

  saveProjectArchive(next);
};
