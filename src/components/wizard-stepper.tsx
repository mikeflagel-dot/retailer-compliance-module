interface WizardStepperProps {
  steps: { id: string; label: string }[];
  currentStep: number;

  /** Optional: enable clicking steps (edit mode only) */
  onStepClick?: (index: number) => void;
}

export function WizardStepper({
  steps,
  currentStep,
  onStepClick,
}: WizardStepperProps) {
  return (
    <div className="flex items-center gap-6 border-b border-slate-200 pb-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const clickable = !!onStepClick;

        return (
          <button
            key={step.id}
            type="button"
            disabled={!clickable}
            onClick={() => onStepClick?.(index)}
            className={`flex items-center gap-2 text-sm font-medium transition ${
              clickable ? "cursor-pointer" : "cursor-default"
            }`}
          >
            {/* Circle */}
            <div
              className={`w-7 h-7 flex items-center justify-center rounded-full border text-xs font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : isCompleted
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-white text-slate-500 border-slate-300"
              }`}
            >
              {index + 1}
            </div>

            {/* Label */}
            <span
              className={`${
                isActive
                  ? "text-slate-900"
                  : isCompleted
                  ? "text-slate-700"
                  : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
