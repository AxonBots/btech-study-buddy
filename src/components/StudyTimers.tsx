import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { FocusStopwatch } from '@/components/FocusStopwatch';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Timer, Target, Zap } from 'lucide-react';

export const StudyTimers: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Timer Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-success-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 animate-float hover:animate-glow"
      >
        <Timer className="w-6 h-6" />
      </Button>

      {/* Timer Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-br from-background via-background to-accent/10 p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold font-mono bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent mb-2">
                Study Timers
              </h2>
              <p className="text-muted-foreground font-mono">
                Boost your productivity with focused study sessions
              </p>
            </div>

            <Tabs defaultValue="pomodoro" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="pomodoro" className="font-mono font-semibold">
                  <Timer className="w-4 h-4 mr-2" />
                  Pomodoro Timer
                </TabsTrigger>
                <TabsTrigger value="stopwatch" className="font-mono font-semibold">
                  <Target className="w-4 h-4 mr-2" />
                  Focus Stopwatch
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pomodoro" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <PomodoroTimer />
                  </div>
                  <div className="space-y-4">
                    <Card className="study-card">
                      <CardHeader>
                        <CardTitle className="text-lg font-mono font-bold flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          How Pomodoro Works
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <p>Work for 25 minutes with full focus on one task</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <p>Take a 5-minute break to rest and recharge</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-warning text-warning-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <p>After 4 sessions, take a longer 15-30 minute break</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
                          <p>Repeat the cycle to maintain peak productivity</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="study-card">
                      <CardHeader>
                        <CardTitle className="text-lg font-mono font-bold">Benefits</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>• Improves focus and concentration</p>
                        <p>• Reduces mental fatigue</p>
                        <p>• Increases productivity</p>
                        <p>• Better time management</p>
                        <p>• Prevents burnout</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stopwatch" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <FocusStopwatch />
                  </div>
                  <div className="space-y-4">
                    <Card className="study-card">
                      <CardHeader>
                        <CardTitle className="text-lg font-mono font-bold flex items-center gap-2">
                          <Target className="w-5 h-5 text-success" />
                          Focus Tracking
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <p>Select the subject you want to focus on</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <p>Start the timer and focus deeply on studying</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-warning text-warning-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <p>Track your progress and build study habits</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
                          <p>Review your daily and weekly focus statistics</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="study-card">
                      <CardHeader>
                        <CardTitle className="text-lg font-mono font-bold">Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>• Precise time tracking</p>
                        <p>• Subject-wise session logging</p>
                        <p>• Daily focus statistics</p>
                        <p>• Session history</p>
                        <p>• Progress visualization</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};