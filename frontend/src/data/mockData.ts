export interface Programme {
  id: string;
  name: string;
  degreeType: string;
  isGlobal?: boolean;
  studentCapacity?: number;
  currentUsers?: number;
  expirationDate?: string;
}

export const mockProgrammes: Programme[] = [
  { id: '1', name: 'ND Computer Science', degreeType: 'ND', isGlobal: true, studentCapacity: 120, currentUsers: 45, expirationDate: '2028-12-31' },
  { id: '2', name: 'HND Software Engineering', degreeType: 'HND', isGlobal: true, studentCapacity: 80, currentUsers: 62, expirationDate: '2027-06-30' },
  { id: '3', name: 'ND Mass Communication', degreeType: 'ND', isGlobal: true, studentCapacity: 100, currentUsers: 30, expirationDate: '2028-06-30' },
  { id: '4', name: 'HND Business Administration', degreeType: 'HND', isGlobal: true, studentCapacity: 150, currentUsers: 80, expirationDate: '2027-12-31' },
];
