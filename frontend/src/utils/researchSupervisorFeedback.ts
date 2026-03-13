export type FeedbackThreadStatus = 'pending' | 'approved' | 'revision_required' | 'rejected';

export type FeedbackMessage = {
  id: string;
  sender: 'supervisor' | 'student';
  text: string;
  createdAt: string;
};

export type FeedbackThread = {
  id: string;
  submission: string;
  date: string;
  status: FeedbackThreadStatus;
  studentMatric: string;
  supervisor: {
    name: string;
    avatar: string;
  };
  messages: FeedbackMessage[];
};

type FeedbackMap = Record<string, FeedbackThread[]>;

const STORAGE_KEY = 'student_supervisor_feedback_threads';

const loadMap = (): FeedbackMap => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as FeedbackMap;
  } catch {
    return {};
  }
};

const saveMap = (map: FeedbackMap) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    return;
  }
};

const initialsFromName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const getStudentFeedbackThreads = (studentMatric: string): FeedbackThread[] => {
  const map = loadMap();
  return map[studentMatric] ?? [];
};

export const ensureSubmissionThread = (args: {
  studentMatric: string;
  threadId: string;
  submissionLabel: string;
  supervisorName: string;
  status: FeedbackThreadStatus;
}): FeedbackThread => {
  const map = loadMap();
  const existing = map[args.studentMatric] ?? [];
  const found = existing.find((t) => t.id === args.threadId);
  if (found) return found;

  const now = new Date();
  const thread: FeedbackThread = {
    id: args.threadId,
    submission: args.submissionLabel,
    date: now.toISOString().slice(0, 10),
    status: args.status,
    studentMatric: args.studentMatric,
    supervisor: {
      name: args.supervisorName,
      avatar: initialsFromName(args.supervisorName)
    },
    messages: []
  };

  map[args.studentMatric] = [thread, ...existing].slice(0, 30);
  saveMap(map);
  return thread;
};

export const upsertThread = (studentMatric: string, thread: FeedbackThread) => {
  const map = loadMap();
  const existing = map[studentMatric] ?? [];
  const idx = existing.findIndex((t) => t.id === thread.id);
  if (idx >= 0) {
    existing[idx] = thread;
    map[studentMatric] = existing;
  } else {
    map[studentMatric] = [thread, ...existing].slice(0, 30);
  }
  saveMap(map);
};

export const appendFeedbackMessage = (args: {
  studentMatric: string;
  threadId: string;
  sender: FeedbackMessage['sender'];
  text: string;
  nextStatus?: FeedbackThreadStatus;
  supervisorName?: string;
}): FeedbackThread => {
  const map = loadMap();
  const existing = map[args.studentMatric] ?? [];
  const now = new Date();
  let thread = existing.find((t) => t.id === args.threadId);

  if (!thread) {
    thread = {
      id: args.threadId,
      submission: 'Submission',
      date: now.toISOString().slice(0, 10),
      status: args.nextStatus ?? 'pending',
      studentMatric: args.studentMatric,
      supervisor: {
        name: args.supervisorName ?? 'Supervisor',
        avatar: initialsFromName(args.supervisorName ?? 'Supervisor')
      },
      messages: []
    };
    map[args.studentMatric] = [thread, ...existing].slice(0, 30);
  }

  const message: FeedbackMessage = {
    id: `msg-${args.threadId}-${now.getTime()}`,
    sender: args.sender,
    text: args.text,
    createdAt: now.toISOString()
  };

  const updated: FeedbackThread = {
    ...thread,
    status: args.nextStatus ?? thread.status,
    supervisor: args.supervisorName ? { name: args.supervisorName, avatar: initialsFromName(args.supervisorName) } : thread.supervisor,
    messages: [...thread.messages, message]
  };

  map[args.studentMatric] = (map[args.studentMatric] ?? []).map((t) => (t.id === updated.id ? updated : t));
  saveMap(map);
  return updated;
};

