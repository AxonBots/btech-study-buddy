import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  CheckCircle2, 
  Settings,
  Volume2,
  VolumeX 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export const PomodoroTimer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
  }, [isRunning, timeLeft]);

  const playNotificationSound = () => {
    if (!soundEnabled || !audioRef.current) return;
    
    // Create a simple beep sound using Web Audio API
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handlePhaseComplete = () => {
    setIsRunning(false);
    playNotificationSound();

    if (phase === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      const shouldTakeLongBreak = newSessionsCompleted % settings.sessionsUntilLongBreak === 0;
      const nextPhase: TimerPhase = shouldTakeLongBreak ? 'longBreak' : 'shortBreak';
      
      setPhase(nextPhase);
      setTimeLeft(shouldTakeLongBreak ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60);
      
      toast({
        title: "Work Session Complete! 🎉",
        description: shouldTakeLongBreak 
          ? "Time for a long break! You've earned it." 
          : "Time for a short break! Step away from your studies.",
      });
    } else {
      setPhase('work');
      setTimeLeft(settings.workDuration * 60);
      
      toast({
        title: "Break Complete! 💪",
        description: "Ready to get back to focused studying?",
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPhase('work');
    setTimeLeft(settings.workDuration * 60);
    setSessionsCompleted(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInfo = () => {
    switch (phase) {
      case 'work':
        return {
          title: 'Focus Time',
          icon: Brain,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          totalTime: settings.workDuration * 60
        };
      case 'shortBreak':
        return {
          title: 'Short Break',
          icon: Coffee,
          color: 'text-success',
          bgColor: 'bg-success/10',
          totalTime: settings.shortBreakDuration * 60
        };
      case 'longBreak':
        return {
          title: 'Long Break',
          icon: Coffee,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          totalTime: settings.longBreakDuration * 60
        };
    }
  };

  const phaseInfo = getPhaseInfo();
  const progress = ((phaseInfo.totalTime - timeLeft) / phaseInfo.totalTime) * 100;

  return (
    <Card className="focus-card w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-extrabold font-mono flex items-center gap-2">
            <phaseInfo.icon className={cn("w-6 h-6", phaseInfo.color)} />
            Pomodoro Timer
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="interactive-button"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="interactive-button"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Badge className={cn("animate-bounce-in", phaseInfo.bgColor, phaseInfo.color)}>
          {phaseInfo.title}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="timer-display">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="h-3 animated-progress" />
        </div>

        {/* Controls */}
        <div className="timer-controls">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="interactive-button study-button"
            variant={isRunning ? "secondary" : "default"}
          >
            {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="interactive-button study-button"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Sessions Counter */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="font-mono font-semibold">
              Sessions Completed: {sessionsCompleted}
            </span>
          </div>
          <div className="flex justify-center gap-1">
            {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full border-2",
                  i < (sessionsCompleted % settings.sessionsUntilLongBreak)
                    ? "bg-success border-success"
                    : "border-muted-foreground"
                )}
              />
            ))}
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg animate-fade-in">
            <h4 className="font-mono font-bold">Timer Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-mono">Work (min)</label>
                <Select
                  value={settings.workDuration.toString()}
                  onValueChange={(value) => 
                    setSettings({ ...settings, workDuration: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="45">45</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-mono">Short Break</label>
                <Select
                  value={settings.shortBreakDuration.toString()}
                  onValueChange={(value) => 
                    setSettings({ ...settings, shortBreakDuration: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};