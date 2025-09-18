import React from 'react';
import { StudyData, StudyStats as StudyStatsType } from '@/types/study';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  RotateCcw,
  Calendar,
  Award
} from 'lucide-react';

interface StatsProps {
  data: StudyData;
}

export const StudyStatsCards: React.FC<StatsProps> = ({ data }) => {
  const calculateStats = (): StudyStatsType => {
    let totalTopicsCompleted = 0;
    let totalStudyTime = 0;
    let totalRevisions = 0;
    
    data.subjects.forEach(subject => {
      subject.chapters.forEach(chapter => {
        chapter.topics.forEach(topic => {
          if (topic.completed) totalTopicsCompleted++;
          totalStudyTime += topic.timeSpent;
          totalRevisions += topic.revisions.length;
        });
      });
    });

    const totalTopics = data.subjects.reduce(
      (acc, subject) => acc + subject.chapters.reduce(
        (chapterAcc, chapter) => chapterAcc + chapter.topics.length, 0
      ), 0
    );

    const weeklyProgress = totalTopics > 0 ? (totalTopicsCompleted / totalTopics) * 100 : 0;

    return {
      totalTopicsCompleted,
      totalStudyTime,
      currentStreak: 5, // Mock data - would be calculated based on study dates
      weeklyProgress,
      totalRevisions
    };
  };

  const stats = calculateStats();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="study-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Topics Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">{stats.totalTopicsCompleted}</div>
          <Badge className="completion-badge mt-2">
            <TrendingUp className="w-3 h-3 mr-1" />
            This week
          </Badge>
        </CardContent>
      </Card>

      <Card className="study-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">{formatTime(stats.totalStudyTime)}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Total time invested
          </p>
        </CardContent>
      </Card>

      <Card className="study-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
          <Award className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">{stats.currentStreak} days</div>
          <p className="text-xs text-muted-foreground mt-2">
            Keep it up!
          </p>
        </CardContent>
      </Card>

      <Card className="study-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revisions</CardTitle>
          <RotateCcw className="h-4 w-4 text-accent-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">{stats.totalRevisions}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Total revisions done
          </p>
        </CardContent>
      </Card>
    </div>
  );
};