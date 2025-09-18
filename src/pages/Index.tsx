import React, { useState, useEffect } from 'react';
import { StudyData, StudySubject, StudyChapter, StudyTopic } from '@/types/study';
import { StudyStorage } from '@/lib/studyStorage';
import { SubjectCard, ChapterCard, TopicCard } from '@/components/StudyCards';
import { Breadcrumb } from '@/components/Breadcrumb';
import { StudyStatsCards } from '@/components/StudyStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, BookOpen, GraduationCap, Trophy, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'subjects' | 'chapters' | 'topics';

const Index = () => {
  const [data, setData] = useState<StudyData>({ subjects: [] });
  const [currentSubject, setCurrentSubject] = useState<StudySubject | null>(null);
  const [currentChapter, setCurrentChapter] = useState<StudyChapter | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('subjects');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Form states
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#3B82F6');
  const [newChapterName, setNewChapterName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicNotes, setNewTopicNotes] = useState('');
  const [newTopicPriority, setNewTopicPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newTopicDifficulty, setNewTopicDifficulty] = useState(3);
  const [newTopicStudyMode, setNewTopicStudyMode] = useState<'Theory' | 'Practical' | 'Assignment' | 'Lab Work' | 'Revision'>('Theory');

  useEffect(() => {
    setData(StudyStorage.getData());
  }, []);

  const refreshData = () => {
    setData(StudyStorage.getData());
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    
    StudyStorage.addSubject({
      name: newSubjectName,
      color: newSubjectColor,
      chapters: []
    });
    
    setNewSubjectName('');
    setNewSubjectColor('#3B82F6');
    setIsAddDialogOpen(false);
    refreshData();
    toast({
      title: "Subject Added",
      description: `${newSubjectName} has been added to your study plan!`
    });
  };

  const handleAddChapter = (subjectId: string) => {
    if (!newChapterName.trim()) return;
    
    StudyStorage.addChapter(subjectId, {
      name: newChapterName,
      topics: []
    });
    
    setNewChapterName('');
    setIsAddDialogOpen(false);
    refreshData();
    toast({
      title: "Chapter Added",
      description: `${newChapterName} has been added!`
    });
  };

  const handleAddTopic = (subjectId: string, chapterId: string) => {
    if (!newTopicName.trim()) return;
    
    StudyStorage.addTopic(subjectId, chapterId, {
      name: newTopicName,
      completed: false,
      revisions: [],
      notes: newTopicNotes,
      timeSpent: 0,
      difficulty: newTopicDifficulty,
      priority: newTopicPriority,
      studyMode: newTopicStudyMode,
      studyDate: new Date().toISOString().split('T')[0]
    });
    
    setNewTopicName('');
    setNewTopicNotes('');
    setNewTopicPriority('Medium');
    setNewTopicDifficulty(3);
    setNewTopicStudyMode('Theory');
    setIsAddDialogOpen(false);
    refreshData();
    toast({
      title: "Topic Added",
      description: `${newTopicName} has been added to your study list!`
    });
  };

  const handleTopicComplete = (topicId: string) => {
    if (currentSubject && currentChapter) {
      StudyStorage.markTopicComplete(currentSubject.id, currentChapter.id, topicId);
      refreshData();
      toast({
        title: "Topic Completed! 🎉",
        description: "Great job! Keep up the momentum!"
      });
    }
  };

  const handleAddRevision = (topicId: string) => {
    if (currentSubject && currentChapter) {
      StudyStorage.addRevision(currentSubject.id, currentChapter.id, topicId);
      refreshData();
      toast({
        title: "Revision Added",
        description: "Consistent revision leads to mastery!"
      });
    }
  };

  const navigateToSubject = (subject: StudySubject) => {
    setCurrentSubject(subject);
    setCurrentChapter(null);
    setViewMode('chapters');
  };

  const navigateToChapter = (chapter: StudyChapter) => {
    setCurrentChapter(chapter);
    setViewMode('topics');
  };

  const navigateHome = () => {
    setCurrentSubject(null);
    setCurrentChapter(null);
    setViewMode('subjects');
  };

  const getAddDialogContent = () => {
    switch (viewMode) {
      case 'subjects':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                id="subject-name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g., Mathematics, Physics, Chemistry"
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="subject-color">Subject Color</Label>
              <Input
                id="subject-color"
                type="color"
                value={newSubjectColor}
                onChange={(e) => setNewSubjectColor(e.target.value)}
                className="w-20 h-10"
              />
            </div>
            <Button onClick={handleAddSubject} className="w-full study-button">
              Add Subject
            </Button>
          </div>
        );
      case 'chapters':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="chapter-name">Chapter Name</Label>
              <Input
                id="chapter-name"
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                placeholder="e.g., Calculus, Mechanics, Organic Chemistry"
                className="font-mono"
              />
            </div>
            <Button 
              onClick={() => currentSubject && handleAddChapter(currentSubject.id)} 
              className="w-full study-button"
            >
              Add Chapter
            </Button>
          </div>
        );
      case 'topics':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic-name">Topic Name</Label>
              <Input
                id="topic-name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="e.g., Derivatives, Newton's Laws"
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="topic-notes">Notes</Label>
              <Textarea
                id="topic-notes"
                value={newTopicNotes}
                onChange={(e) => setNewTopicNotes(e.target.value)}
                placeholder="Add your study notes here..."
                className="font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select value={newTopicPriority} onValueChange={(value: any) => setNewTopicPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Study Mode</Label>
                <Select value={newTopicStudyMode} onValueChange={(value: any) => setNewTopicStudyMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Theory">Theory</SelectItem>
                    <SelectItem value="Practical">Practical</SelectItem>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                    <SelectItem value="Lab Work">Lab Work</SelectItem>
                    <SelectItem value="Revision">Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Difficulty (1-5 stars)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={newTopicDifficulty}
                onChange={(e) => setNewTopicDifficulty(parseInt(e.target.value) || 3)}
                className="font-mono"
              />
            </div>
            <Button 
              onClick={() => currentSubject && currentChapter && handleAddTopic(currentSubject.id, currentChapter.id)} 
              className="w-full study-button"
            >
              Add Topic
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground p-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GraduationCap className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-extrabold font-mono">B.Tech Study Tracker</h1>
              <p className="text-primary-foreground/80 font-mono">Master your academics with organized study planning</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Badge className="bg-success text-success-foreground font-mono">
              <Trophy className="w-3 h-3 mr-1" />
              Level 1 Student
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <Breadcrumb
          currentSubject={currentSubject}
          currentChapter={currentChapter}
          onHomeClick={navigateHome}
          onSubjectClick={navigateToSubject}
        />

        {viewMode === 'subjects' && <StudyStatsCards data={data} />}

        {/* Content Area */}
        <div className="space-y-6">
          {viewMode === 'subjects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onSubjectClick={navigateToSubject}
                  onAddChapter={() => {}}
                />
              ))}
              {data.subjects.length === 0 && (
                <Card className="study-card col-span-full text-center p-8">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold font-mono mb-2">No subjects yet</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first subject to begin tracking your B.Tech studies!</p>
                </Card>
              )}
            </div>
          )}

          {viewMode === 'chapters' && currentSubject && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSubject.chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  subjectColor={currentSubject.color}
                  onChapterClick={navigateToChapter}
                  onAddTopic={() => {}}
                />
              ))}
              {currentSubject.chapters.length === 0 && (
                <Card className="study-card col-span-full text-center p-8">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold font-mono mb-2">No chapters yet</h3>
                  <p className="text-muted-foreground mb-4">Add chapters to organize your {currentSubject.name} studies!</p>
                </Card>
              )}
            </div>
          )}

          {viewMode === 'topics' && currentChapter && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentChapter.topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  subjectColor={currentSubject?.color || '#3B82F6'}
                  onTopicComplete={handleTopicComplete}
                  onAddRevision={handleAddRevision}
                  onTopicEdit={() => {}}
                />
              ))}
              {currentChapter.topics.length === 0 && (
                <Card className="study-card col-span-full text-center p-8">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold font-mono mb-2">No topics yet</h3>
                  <p className="text-muted-foreground mb-4">Add topics to start studying {currentChapter.name}!</p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="floating-action">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="font-mono">
            <DialogHeader>
              <DialogTitle className="font-extrabold">
                Add New {viewMode === 'subjects' ? 'Subject' : viewMode === 'chapters' ? 'Chapter' : 'Topic'}
              </DialogTitle>
            </DialogHeader>
            {getAddDialogContent()}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;