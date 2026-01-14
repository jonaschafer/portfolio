import { useState, useRef, useEffect } from 'react';
import { ExerciseStep } from './components/ExerciseStep';
import { ProgressBar } from './components/ProgressBar';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  videoSrc: string;
  color: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    name: 'Hang',
    sets: 3,
    reps: '30 seconds',
    videoSrc: '/videos/hang.mp4',
    color: 'black',
  },
  {
    id: 2,
    name: 'Scapular Pull-ups',
    sets: 3,
    reps: '15',
    videoSrc: '/videos/scapular-pullups.mp4',
    color: 'black',
  },
  {
    id: 3,
    name: 'Inverted Rows',
    sets: 3,
    reps: '10',
    videoSrc: '/videos/inverted-rows.mp4',
    color: 'black',
  },
  {
    id: 4,
    name: 'Jacknife Pull-ups',
    sets: 3,
    reps: '10',
    videoSrc: '/videos/jacknife-pullups.mp4',
    color: 'black',
  },
  {
    id: 5,
    name: 'Band-Assisted Pull-ups',
    sets: 3,
    reps: '10',
    videoSrc: '/videos/band-assisted.mp4',
    color: 'black',
  },
  {
    id: 6,
    name: 'Top-Hold',
    sets: 3,
    reps: '30 seconds',
    videoSrc: '/videos/top-hold.mp4',
    color: 'black',
  },
  {
    id: 7,
    name: 'Negatives',
    sets: 3,
    reps: '5 seconds',
    videoSrc: '/videos/negatives.mp4',
    color: 'black',
  },
  {
    id: 8,
    name: 'Pull-ups',
    sets: 3,
    reps: '1',
    videoSrc: '/videos/pullups.mp4',
    color: 'black',
  },
];

export default function App() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleComplete = (stepId: number) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));
    
    // Auto-scroll to next step if not the last one
    if (stepId < exercises.length) {
      setTimeout(() => {
        scrollToStep(stepId + 1);
      }, 300);
    }
  };

  const scrollToStep = (stepNumber: number) => {
    const index = stepNumber - 1;
    stepRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setCurrentStep(index + 1);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const allCompleted = completedSteps.size === exercises.length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <ProgressBar
        currentStep={completedSteps.size}
        totalSteps={exercises.length}
      />

      {/* Hero Section - Brutalist and direct */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative pt-16 bg-white">
        <div className="text-center max-w-md border-8 border-black p-8 brutal-shadow bg-white">
          <h1
            className="brutalist-title mb-6"
            style={{
              fontSize: '3.5rem',
            }}
          >
            Get yer first pull up
          </h1>
          
          {/* Progress display - stark box */}
          <div className="border-4 border-black p-6 bg-white mt-8">
            <div className="brutalist-text mb-2">
              PROGRESS
            </div>
            <div 
              className="brutalist-title"
              style={{ fontSize: '4rem' }}
            >
              {completedSteps.size}/{exercises.length}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => scrollToStep(1)}
            className="w-full mt-8 py-6 px-6 bg-blue-600 text-[rgba(255,255,255,1)] border-4 border-black brutalist-text brutal-shadow brutal-button hover:bg-blue-700"
          >
            START →
          </button>
        </div>
      </div>

      {/* Exercise Steps */}
      {exercises.map((exercise, index) => (
        <div
          key={exercise.id}
          ref={(el) => (stepRefs.current[index] = el)}
        >
          <ExerciseStep
            stepNumber={exercise.id}
            name={exercise.name}
            sets={exercise.sets}
            reps={exercise.reps}
            videoSrc={exercise.videoSrc}
            isCompleted={completedSteps.has(exercise.id)}
            onComplete={() => handleComplete(exercise.id)}
            color={exercise.color}
          />
        </div>
      ))}

      {/* Completion Screen */}
      {allCompleted && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white">
          <div className="text-center max-w-md border-8 border-black p-8 brutal-shadow bg-white">
            <h2
              className="brutalist-title mb-6"
              style={{ 
                fontSize: '3rem',
              }}
            >
              ALL DONE
            </h2>
            <p className="brutalist-text mb-8">
              YOU COMPLETED ALL 8 STEPS
            </p>
            <button
              onClick={() => {
                setCompletedSteps(new Set());
                scrollToStep(1);
              }}
              className="w-full py-6 px-6 bg-black text-white border-4 border-black brutalist-text brutal-shadow brutal-button hover:bg-gray-900"
            >
              START AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}