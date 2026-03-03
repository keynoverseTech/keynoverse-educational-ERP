export type MaterialStatus = 'Published' | 'Draft' | 'Archived';

export interface CourseMaterial {
  id: string;
  courseId: string; // Auto-filled
  title: string;
  description: string;
  topicOrWeek: string;
  fileUrl: string;
  fileType: string;
  visibilityDate: string;
  allowDownload: boolean;
  expiryDate?: string;
  status: MaterialStatus;
  uploadedAt: string;
}

export interface DownloadLogEntry {
  id: string;
  materialId: string;
  studentId: string;
  studentName: string;
  downloadedAt: string;
}
