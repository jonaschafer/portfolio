interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
      <div className="h-3 bg-white border-b-2 border-black">
        <div
          className="h-full transition-none bg-black"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="brutalist-text">
          {currentStep}/{totalSteps}
        </div>
        <div className="brutalist-text">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}