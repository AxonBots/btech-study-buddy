import React, { useState } from 'react';
import { StudySubject, StudyChapter, StudyTopic } from '@/types/study';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Star, 
  RotateCcw, 
  ChevronRight,
  Plus,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
  subject: StudySubject;
  onSubjectClick: (subject: StudySubject) => void;
  onAddChapter: (subjectId: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onSubjectClick, 
  onAddChapter 
}) => {
  const totalTopics = subject.chapters.reduce((acc, chapter) => acc + chapter.topics.length, 0);
  const completedTopics = subject.chapters.reduce(
    (acc, chapter) => acc + chapter.topics.filter(topic => topic.completed).length, 
    0
  );
  const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  const totalStudyTime = subject.chapters.reduce(
    (acc, chapter) => acc + chapter.topics.reduce((topicAcc, topic) => topicAcc + topic.timeSpent, 0),
    0
  );

  return (
    <Card className="study-card hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardHeader 
        className="pb-3 cursor-pointer" 
        onClick={() => onSubjectClick(subject)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-extrabold font-mono flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: subject.color }}
            />
            {subject.name}
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddChapter(subject.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{subject.chapters.length} chapters</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{totalTopics} topics</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="font-bold">{completedTopics}/{totalTopics} completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {progress === 100 && (
          <Badge className="completion-badge">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Complete
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

interface ChapterCardProps {
  chapter: StudyChapter;
  subjectColor: string;
  onChapterClick: (chapter: StudyChapter) => void;
  onAddTopic: (chapterId: string) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ 
  chapter, 
  subjectColor, 
  onChapterClick, 
  onAddTopic 
}) => {
  const completedTopics = chapter.topics.filter(topic => topic.completed).length;
  const totalTopics = chapter.topics.length;
  const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <Card className="study-card hover:shadow-md transition-all duration-300 cursor-pointer group">
      <CardHeader 
        className="pb-3 cursor-pointer" 
        onClick={() => onChapterClick(chapter)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold font-mono flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: subjectColor }}
            />
            {chapter.name}
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddTopic(chapter.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{totalTopics} topics</span>
          <span className="font-bold">{completedTopics} completed</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {progress === 100 && (
          <Badge className="completion-badge">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Complete
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

interface TopicCardProps {
  topic: StudyTopic;
  subjectColor: string;
  onTopicComplete: (topicId: string) => void;
  onAddRevision: (topicId: string) => void;
  onTopicEdit: (topic: StudyTopic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  subjectColor, 
  onTopicComplete, 
  onAddRevision, 
  onTopicEdit 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-destructive text-destructive-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={cn(
          "w-3 h-3",
          i < difficulty ? "fill-warning text-warning" : "text-muted-foreground"
        )}
      />
    ));
  };

  return (
    <Card className="study-card hover:shadow-md transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={topic.completed}
              onCheckedChange={() => onTopicComplete(topic.id)}
              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
            <CardTitle className="text-base font-bold font-mono">
              {topic.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(topic.priority)}>
              {topic.priority}
            </Badge>
            {topic.completed && (
              <Badge className="completion-badge">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span>{Math.round(topic.timeSpent / 60)}h {topic.timeSpent % 60}m</span>
            </div>
            <div className="flex items-center gap-1">
              {getDifficultyStars(topic.difficulty)}
            </div>
            <Badge variant="outline">{topic.studyMode}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {topic.revisions.length > 0 && (
              <Badge variant="secondary">
                <RotateCcw className="w-3 h-3 mr-1" />
                {topic.revisions.length} revisions
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddRevision(topic.id)}
              className="study-button"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Revise
            </Button>
          </div>
        </div>
        
        {topic.notes && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">{topic.notes}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          {topic.studyDate && (
            <span>Studied: {new Date(topic.studyDate).toLocaleDateString()}</span>
          )}
          {topic.completedDate && (
            <span>Completed: {new Date(topic.completedDate).toLocaleDateString()}</span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTopicEdit(topic)}
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity study-button"
        >
          Edit Topic
        </Button>
      </CardContent>
    </Card>
  );
};