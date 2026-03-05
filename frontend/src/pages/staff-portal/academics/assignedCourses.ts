import { loadCatalogue } from '../../../state/academics/catalogueStorage';

export const currentStaffId = 'stf-1';

export const getAssignedCourses = () => {
  const catalogue = loadCatalogue();
  return catalogue
    .filter(c => c.status === 'active' && c.assignedStaffId === currentStaffId)
    .sort((a, b) => a.code.localeCompare(b.code));
};

