import React from 'react';
import { Upload, Columns3, Palette, Play, CheckCircle2, Check } from 'lucide-react';

export type BulkStep = 'data' | 'mapping' | 'design' | 'generate' | 'results';

interface BulkStepperProps {
  currentStep: BulkStep;
  onStepClick?: (step: BulkStep) => void;
  maxStepReached: number;
}

interface StepItem {
  key: BulkStep;
  label: string;
  index: number;
  icon: React.FC<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { key: 'data', label: 'Dữ liệu', index: 1, icon: Upload },
  { key: 'mapping', label: 'Ánh xạ', index: 2, icon: Columns3 },
  { key: 'design', label: 'Thiết kế', index: 3, icon: Palette },
  { key: 'generate', label: 'Tạo mã', index: 4, icon: Play },
];

export const BulkStepper: React.FC<BulkStepperProps> = ({
  currentStep,
  onStepClick,
  maxStepReached,
}) => {
  // If in results step, display a completion banner
  if (currentStep === 'results') {
    return (
      <div className="py-2.5 px-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Hoàn tất xử lý lô mã QR</span>
        </div>
        <button
          type="button"
          onClick={() => onStepClick && onStepClick('data')}
          className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline transition-colors"
        >
          Tạo lô mới
        </button>
      </div>
    );
  }

  const currentStepObj = STEPS.find((s) => s.key === currentStep) || STEPS[0];
  const CurrentIcon = currentStepObj.icon;

  return (
    <nav aria-label="Tiến trình tạo hàng loạt" className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4">
      {/* Desktop Stepper with Icons */}
      <ol className="hidden sm:flex items-center justify-between gap-2" role="list">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = step.index < currentStepObj.index;
          const isCurrent = step.key === currentStep;
          const isClickable = step.index <= maxStepReached && onStepClick;

          return (
            <li key={step.key} className="flex-1 flex items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.key)}
                className={`flex items-center gap-2.5 py-1 px-2 rounded-xl transition-all text-left ${
                  isCurrent
                    ? 'font-semibold text-indigo-700'
                    : isCompleted
                    ? 'text-slate-700 hover:text-slate-900 font-medium'
                    : 'text-slate-400 cursor-not-allowed font-normal'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <StepIcon className="w-3.5 h-3.5 stroke-[1.8]" />}
                </div>
                <span className="text-xs">{step.label}</span>
              </button>

              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                    step.index < currentStepObj.index ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile Stepper */}
      <div className="flex sm:hidden items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-medium flex items-center justify-center">
            <CurrentIcon className="w-3.5 h-3.5 stroke-[1.8]" />
          </span>
          <span className="font-semibold text-slate-800">
            Bước {currentStepObj.index}/4: {currentStepObj.label}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {Math.round((currentStepObj.index / 4) * 100)}%
        </span>
      </div>
    </nav>
  );
};
