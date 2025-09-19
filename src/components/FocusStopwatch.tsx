import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Target, 
  Clock, 
  Trophy,
  Zap,
  BookOpen 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FocusSession {
  subject: string;
  startTime: number;
  endTime?: number;
  duration: number;
}

export const FocusStopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentSubject, setCurrentSubject] = useState('Mathematics');
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample subjects - could be fetched from user data
  const subjects = [
    'Mathematics',
    'Physics', 
    'Chemistry',
    'Computer Science',
    'Engineering Graphics',
    'English',
    'Environmental Science'
  ];

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        if (startTime) {
          setElapsedTime(now - startTime);
        }
      }, 100); // Update every 100ms for smooth display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('focusSessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setFocusSessions(sessions);
      const total = sessions.reduce((acc: number, session: FocusSession) => acc + session.duration, 0);
      setTotalFocusTime(total);
    }
  }, []);

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);
    
    toast({
      title: "Focus Session Started! 🎯",
      description: `You're now focusing on ${currentSubject}. Stay concentrated!`
    });
  };

  const pauseTimer = () => {
    setIsRunning(false);
    
    toast({
      title: "Session Paused ⏸️",
      description: "Take a quick break if needed, then resume your focus!"
    });
  };

  const stopTimer = () => {
    if (elapsedTime < 1000) {
      // Don't save sessions less than 1 second
      resetTimer();
      return;
    }

    const session: FocusSession = {
      subject: currentSubject,
      startTime: startTime!,
      endTime: Date.now(),
      duration: elapsedTime
    };

    const newSessions = [...focusSessions, session];
    setFocusSessions(newSessions);
    setTotalFocusTime(totalFocusTime + elapsedTime);
    
    // Save to localStorage
    localStorage.setItem('focusSessions', JSON.stringify(newSessions));
    
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    
    toast({
      title: "Focus Session Complete! 🎉",
      description: `Great job! You focused on ${currentSubject} for ${minutes}m ${seconds}s.`
    });

    resetTimer();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const centiseconds = Math.floor((milliseconds % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTodaysSessions = () => {
    const today = new Date().toDateString();
    return focusSessions.filter(session => 
      new Date(session.startTime).toDateString() === today
    );
  };

  const getTodaysFocusTime = () => {
    return getTodaysSessions().reduce((acc, session) => acc + session.duration, 0);
  };

  const getSubjectTime = (subject: string) => {
    return focusSessions
      .filter(session => session.subject === subject)
      .reduce((acc, session) => acc + session.duration, 0);
  };

  return (
    <Card className="focus-card w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-extrabold font-mono flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-primary animate-pulse-slow" />
          Focus Stopwatch
        </CardTitle>
        <Badge className="bg-primary/10 text-primary animate-bounce-in">
          <Zap className="w-3 h-3 mr-1" />
          Deep Focus Mode
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Subject Selection */}
        <div className="space-y-2">
          <label className="text-sm font-mono font-semibold">Current Subject</label>
          <Select
            value={currentSubject}
            onValueChange={setCurrentSubject}
            disabled={isRunning}
          >
            <SelectTrigger className="interactive-button">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {subject}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className={cn(
            "timer-display",
            isRunning && "animate-pulse-slow"
          )}>
            {formatTime(elapsedTime)}
          </div>
          
          {isRunning && (
            <Badge className="bg-success/10 text-success animate-glow">
              <Clock className="w-3 h-3 mr-1" />
              Focusing on {currentSubject}
            </Badge>
          )}
        </div>

        {/* Controls */}
        <div className="timer-controls">
          {!isRunning && elapsedTime === 0 ? (
            <Button
              onClick={startTimer}
              size="lg"
              className="interactive-button study-button bg-success hover:bg-success/90"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Focus
            </Button>
          ) : (
            <>
              <Button
                onClick={isRunning ? pauseTimer : startTimer}
                size="lg"
                className="interactive-button study-button"
                variant={isRunning ? "secondary" : "default"}
              >
                {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              
              <Button
                onClick={stopTimer}
                size="lg"
                variant="outline"
                className="interactive-button study-button"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
              
              <Button
                onClick={resetTimer}
                size="sm"
                variant="ghost"
                className="interactive-button"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg animate-fade-in">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-warning" />
              <span className="text-xs font-mono font-semibold">Today</span>
            </div>
            <div className="font-mono font-bold text-lg">
              {formatDuration(getTodaysFocusTime())}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono font-semibold">Sessions</span>
            </div>
            <div className="font-mono font-bold text-lg">
              {getTodaysSessions().length}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        {focusSessions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-sm">Recent Sessions</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {focusSessions.slice(-3).reverse().map((session, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-muted/20 rounded text-sm animate-slide-up"
                >
                  <span className="font-mono">{session.subject}</span>
                  <Badge variant="outline">
                    {formatDuration(session.duration)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};