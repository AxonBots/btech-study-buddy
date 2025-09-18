import React from 'react';
import { StudySubject, StudyChapter } from '@/types/study';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbProps {
  currentSubject?: StudySubject;
  currentChapter?: StudyChapter;
  onHomeClick: () => void;
  onSubjectClick: (subject: StudySubject) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentSubject,
  currentChapter,
  onHomeClick,
  onSubjectClick
}) => {
  return (
    <div className="flex items-center gap-2 mb-6 p-4 bg-secondary/50 rounded-lg">
      <Button
        variant="ghost"
        onClick={onHomeClick}
        className="font-mono font-bold hover:text-primary transition-colors"
      >
        Study Tracker
      </Button>
      
      {currentSubject && (
        <>
          <ChevronRight className="w-4 h-4 text-muted-foreground breadcrumb-separator" />
          <Button
            variant="ghost"
            onClick={() => onSubjectClick(currentSubject)}
            className="font-mono font-semibold hover:text-primary transition-colors"
          >
            {currentSubject.name}
          </Button>
        </>
      )}
      
      {currentChapter && (
        <>
          <ChevronRight className="w-4 h-4 text-muted-foreground breadcrumb-separator" />
          <span className="font-mono font-semibold text-primary">
            {currentChapter.name}
          </span>
        </>
      )}
    </div>
  );
};