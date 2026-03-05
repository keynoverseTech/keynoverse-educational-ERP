export type RegistrationConfig = {
  programmeId: string;
  levelId: string;
  session: string;
  maxUnitsSem1: number;
  maxUnitsSem2: number;
  sem1CourseIds: string[];
  sem2CourseIds: string[];
};

const prefix = 'sa_registration_config';

const key = (programmeId: string, levelId: string, session: string) =>
  `${prefix}:${programmeId}:${levelId}:${session}`;

export const loadRegistrationConfig = (programmeId: string, levelId: string, session: string): RegistrationConfig | null => {
  try {
    const raw = localStorage.getItem(key(programmeId, levelId, session));
    return raw ? (JSON.parse(raw) as RegistrationConfig) : null;
  } catch {
    return null;
  }
};

export const saveRegistrationConfig = (config: RegistrationConfig) => {
  try {
    localStorage.setItem(key(config.programmeId, config.levelId, config.session), JSON.stringify(config));
  } catch {
    /* noop */
  }
};

