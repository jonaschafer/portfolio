interface ExerciseStepProps {
  stepNumber: number;
  name: string;
  sets: number;
  reps: string;
  videoSrc: string;
  isCompleted: boolean;
  onComplete: () => void;
  color: string;
}

export function ExerciseStep({
  stepNumber,
  name,
  sets,
  reps,
  videoSrc,
  isCompleted,
  onComplete,
}: ExerciseStepProps) {
  return (
    <div className="min-h-screen flex flex-col p-4 py-8 bg-white">
      {/* Step Number - Brutal and direct */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
        <div className="brutalist-text">
          STEP {stepNumber}/8
        </div>
        {isCompleted && (
          <div className="bg-black text-white px-3 py-1 brutalist-text">
            ✓
          </div>
        )}
      </div>

      {/* Exercise Name - Bold and stark */}
      <h2
        className="brutalist-title mb-8"
        style={{ 
          fontSize: '2.5rem',
        }}
      >
        {name}
      </h2>

      {/* Video Container - Sharp edges, thick border */}
      <div
        className="relative w-full mb-8 border-4 border-black brutal-shadow"
        style={{ aspectRatio: '9/16' }}
      >
        <video
          className="w-full h-full object-cover bg-gray-100"
          src={videoSrc}
          controls
          playsInline
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='1280'%3E%3Crect width='720' height='1280' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23000'%3EVIDEO%3C/text%3E%3C/svg%3E"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Sets and Reps Info - Grid layout */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-4 border-black p-4 bg-white">
          <div className="brutalist-text mb-2">
            SETS
          </div>
          <div className="brutalist-title" style={{ fontSize: '3rem' }}>
            {sets}
          </div>
        </div>
        <div className="border-4 border-black p-4 bg-white">
          <div className="brutalist-text mb-2">
            REPS
          </div>
          <div className="brutalist-title overflow-hidden" style={{ fontSize: '3rem', wordBreak: 'break-word', hyphens: 'none' }}>
            {reps.replace(' seconds', 'S').replace(' second', 'S')}
          </div>
        </div>
      </div>

      {/* Complete Button - Brutal interaction */}
      <button
        onClick={onComplete}
        disabled={isCompleted}
        className={`w-full py-6 px-6 border-4 border-black brutalist-text brutal-button ${
          isCompleted
            ? 'bg-gray-200 cursor-not-allowed'
            : 'bg-blue-600 text-white brutal-shadow hover:bg-blue-700'
        }`}
      >
        {isCompleted ? '✓ DONE' : 'MARK COMPLETE'}
      </button>
    </div>
  );
}