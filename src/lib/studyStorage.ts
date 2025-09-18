import { StudyData, StudySubject, StudyChapter, StudyTopic, StudyRevision } from '@/types/study';

const STORAGE_KEY = 'btech-study-tracker';

// Sample data for demonstration
const sampleData: StudyData = {
  subjects: [
    {
      id: '1',
      name: 'Mathematics',
      color: '#3B82F6',
      chapters: [
        {
          id: '1-1',
          name: 'Calculus',
          topics: [
            {
              id: '1-1-1',
              name: 'Derivatives',
              studyDate: '2025-09-18',
              completed: true,
              completedDate: '2025-09-20',
              revisions: [
                { date: '2025-09-22', count: 1 },
                { date: '2025-09-25', count: 2 }
              ],
              notes: 'Important rules: Product rule, Chain rule, Quotient rule. Applications in optimization problems.',
              timeSpent: 120,
              difficulty: 4,
              priority: 'High',
              studyMode: 'Theory'
            },
            {
              id: '1-1-2',
              name: 'Integration',
              studyDate: '2025-09-19',
              completed: false,
              revisions: [],
              notes: 'Basic integration techniques and applications.',
              timeSpent: 90,
              difficulty: 3,
              priority: 'Medium',
              studyMode: 'Theory'
            }
          ]
        },
        {
          id: '1-2',
          name: 'Linear Algebra',
          topics: [
            {
              id: '1-2-1',
              name: 'Matrices',
              studyDate: '2025-09-17',
              completed: true,
              completedDate: '2025-09-19',
              revisions: [{ date: '2025-09-21', count: 1 }],
              notes: 'Matrix operations, determinants, and inverse matrices.',
              timeSpent: 150,
              difficulty: 3,
              priority: 'High',
              studyMode: 'Theory'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Physics',
      color: '#10B981',
      chapters: [
        {
          id: '2-1',
          name: 'Mechanics',
          topics: [
            {
              id: '2-1-1',
              name: 'Newton\'s Laws',
              studyDate: '2025-09-16',
              completed: true,
              completedDate: '2025-09-18',
              revisions: [],
              notes: 'Three laws of motion and their applications in problem solving.',
              timeSpent: 100,
              difficulty: 2,
              priority: 'Medium',
              studyMode: 'Theory'
            }
          ]
        }
      ]
    }
  ]
};

export class StudyStorage {
  static getData(): StudyData {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with sample data
    this.saveData(sampleData);
    return sampleData;
  }

  static saveData(data: StudyData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  static addSubject(subject: Omit<StudySubject, 'id'>): void {
    const data = this.getData();
    const newSubject: StudySubject = {
      ...subject,
      id: Date.now().toString(),
    };
    data.subjects.push(newSubject);
    this.saveData(data);
  }

  static addChapter(subjectId: string, chapter: Omit<StudyChapter, 'id'>): void {
    const data = this.getData();
    const subject = data.subjects.find(s => s.id === subjectId);
    if (subject) {
      const newChapter: StudyChapter = {
        ...chapter,
        id: Date.now().toString(),
      };
      subject.chapters.push(newChapter);
      this.saveData(data);
    }
  }

  static addTopic(subjectId: string, chapterId: string, topic: Omit<StudyTopic, 'id'>): void {
    const data = this.getData();
    const subject = data.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);
    if (chapter) {
      const newTopic: StudyTopic = {
        ...topic,
        id: Date.now().toString(),
      };
      chapter.topics.push(newTopic);
      this.saveData(data);
    }
  }

  static updateTopic(subjectId: string, chapterId: string, topicId: string, updates: Partial<StudyTopic>): void {
    const data = this.getData();
    const subject = data.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);
    const topic = chapter?.topics.find(t => t.id === topicId);
    if (topic) {
      Object.assign(topic, updates);
      this.saveData(data);
    }
  }

  static addRevision(subjectId: string, chapterId: string, topicId: string): void {
    const data = this.getData();
    const subject = data.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);
    const topic = chapter?.topics.find(t => t.id === topicId);
    if (topic) {
      const today = new Date().toISOString().split('T')[0];
      const revisionCount = topic.revisions.length + 1;
      topic.revisions.push({ date: today, count: revisionCount });
      this.saveData(data);
    }
  }

  static markTopicComplete(subjectId: string, chapterId: string, topicId: string): void {
    const data = this.getData();
    const subject = data.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);
    const topic = chapter?.topics.find(t => t.id === topicId);
    if (topic) {
      topic.completed = true;
      topic.completedDate = new Date().toISOString().split('T')[0];
      this.saveData(data);
    }
  }
}