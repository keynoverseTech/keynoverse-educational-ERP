import type { CourseMaterial, DownloadLogEntry } from './types';

const STORAGE_KEYS = {
  MATERIALS: 'course_materials',
  DOWNLOAD_LOG: 'course_material_download_log',
};

// Generic Local Storage Functions
const save = <T,>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

const get = <T,>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// --- Course Material Service ---
const getMaterials = (): CourseMaterial[] => {
  return get<CourseMaterial>(STORAGE_KEYS.MATERIALS);
};

const saveMaterial = (material: CourseMaterial): void => {
  const materials = getMaterials();
  const index = materials.findIndex(m => m.id === material.id);
  if (index >= 0) {
    materials[index] = material;
  } else {
    materials.push(material);
  }
  save(STORAGE_KEYS.MATERIALS, materials);
};

const deleteMaterial = (id: string): void => {
  let materials = getMaterials();
  materials = materials.filter(m => m.id !== id);
  save(STORAGE_KEYS.MATERIALS, materials);
};

// --- Download Log Service ---
const getDownloadLog = (materialId?: string): DownloadLogEntry[] => {
  const log = get<DownloadLogEntry>(STORAGE_KEYS.DOWNLOAD_LOG);
  return materialId ? log.filter(entry => entry.materialId === materialId) : log;
};

const logDownload = (materialId: string, studentId: string, studentName: string): void => {
  const log = getDownloadLog();
  const newEntry: DownloadLogEntry = {
    id: `log-${Date.now()}`,
    materialId,
    studentId,
    studentName,
    downloadedAt: new Date().toISOString(),
  };
  log.push(newEntry);
  save(STORAGE_KEYS.DOWNLOAD_LOG, log);
};

// --- Seed Data (for demo purposes) ---
const seedData = (): void => {
  if (getMaterials().length === 0) {
    const demoMaterials: CourseMaterial[] = [
      {
        id: 'mat-1',
        courseId: 'CS101',
        title: 'Introduction to Algorithms',
        description: 'Lecture notes for the first week, covering Big O notation.',
        topicOrWeek: 'Week 1',
        fileUrl: '/demo-files/cs101-week1.pdf',
        fileType: 'PDF',
        visibilityDate: new Date().toISOString(),
        allowDownload: true,
        status: 'Published',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'mat-2',
        courseId: 'CS101',
        title: 'Data Structures Overview',
        description: 'Presentation slides for basic data structures.',
        topicOrWeek: 'Week 2',
        fileUrl: '/demo-files/cs101-week2.pptx',
        fileType: 'PPTX',
        visibilityDate: new Date().toISOString(),
        allowDownload: false,
        status: 'Draft',
        uploadedAt: new Date().toISOString(),
      },
    ];
    save(STORAGE_KEYS.MATERIALS, demoMaterials);
  }

  if (getDownloadLog().length === 0) {
    const demoLog: DownloadLogEntry[] = [
      {
        id: 'log-1',
        materialId: 'mat-1',
        studentId: 'ST-001',
        studentName: 'Alice Johnson',
        downloadedAt: new Date().toISOString(),
      },
    ];
    save(STORAGE_KEYS.DOWNLOAD_LOG, demoLog);
  }
};

export const courseMaterialService = {
  getMaterials,
  saveMaterial,
  deleteMaterial,
  getDownloadLog,
  logDownload,
  seedData,
};
