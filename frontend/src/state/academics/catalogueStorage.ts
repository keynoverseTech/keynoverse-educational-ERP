export type CatalogueCourse = {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  programmeId: string;
  levelId: string;
  semesterId: string;
  status: 'active' | 'inactive';
  assignedStaffId?: string;
  type: 'core' | 'elective' | 'general';
};

const KEY = 'sa_course_catalogue';

export const loadCatalogue = (): CatalogueCourse[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CatalogueCourse[];
  } catch {
    return [];
  }
};

export const saveCatalogue = (courses: CatalogueCourse[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(courses));
  } catch {
    /* noop */
  }
};

