export interface StudyRevision {
  date: string;
  count: number;
}

export interface StudyTopic {
  id: string;
  name: string;
  studyDate?: string;
  completed: boolean;
  completedDate?: string;
  revisions: StudyRevision[];
  notes: string;
  timeSpent: number; // minutes
  difficulty: number; // 1-5 stars
  priority: 'Low' | 'Medium' | 'High';
  studyMode: 'Theory' | 'Practical' | 'Assignment' | 'Lab Work' | 'Revision';
}

export interface StudyChapter {
  id: string;
  name: string;
  topics: StudyTopic[];
}

export interface StudySubject {
  id: string;
  name: string;
  color: string;
  chapters: StudyChapter[];
}

export interface StudyData {
  subjects: StudySubject[];
}

export interface StudyStats {
  totalTopicsCompleted: number;
  totalStudyTime: number;
  currentStreak: number;
  weeklyProgress: number;
  totalRevisions: number;
}