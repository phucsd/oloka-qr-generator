import React from 'react';
import { Check } from 'lucide-react';

export type BulkStep = 'data' | 'mapping' | 'design' | 'generate' | 'results';

interface BulkStepperProps {
  currentStep: BulkStep;
  onStepClick?: (step: BulkStep) => void;
  maxStepReached: number;
}

const STEPS: { key: BulkStep; label: string; index: number }[] = [
  { key: 'data', label: '1. Dữ Liệu', index: 1 },
  { key: 'mapping', label: '2. Ánh Xạ', index: 2 },
  { key: 'design', label: '3. Thiết Kế', index: 3 },
  { key: 'generate', label: '4. Tạo Mã', index: 4 },
];

export const BulkStepper: React.FC<BulkStepperProps> = ({
  currentStep,
  onStepClick,
  maxStepReached,
}) => {
  // If in results step, display a completion banner
  if (currentStep === 'results') {
    return (
      <div className="py-2.5 px-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-bold">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
            ✓
          </span>
          <span>Hoàn tất xử lý lô mã QR</span>
        </div>
        <button
          type="button"
          onClick={() => onStepClick && onStepClick('data')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
        >
          Tạo lô mới
        </button>
      </div>
    );
  }

  const currentStepObj = STEPS.find((s) => s.key === currentStep) || STEPS[0];

  return (
    <nav aria-label="Tiến trình tạo hàng loạt" className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4">
      {/* Desktop Stepper */}
      <ol className="hidden sm:flex items-center justify-between gap-2" role="list">
        {STEPS.map((step, idx) => {
          const isCompleted = step.index < currentStepObj.index;
          const isCurrent = step.key === currentStep;
          const isClickable = step.index <= maxStepReached && onStepClick;

          return (
            <li key={step.key} className="flex-1 flex items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.key)}
                className={`flex items-center gap-2 py-1 px-2 rounded-xl transition-all text-left ${
                  isCurrent
                    ? 'font-bold text-indigo-600'
                    : isCompleted
                    ? 'text-slate-700 hover:text-slate-900'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.index}
                </div>
                <span className="text-xs">{step.label.replace(/^\d+\.\s*/, '')}</span>
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
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px]">
            {currentStepObj.index}
          </span>
          <span className="font-bold text-slate-800">
            Bước {currentStepObj.index}/4: {currentStepObj.label.replace(/^\d+\.\s*/, '')}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          {Math.round((currentStepObj.index / 4) * 100)}%
        </span>
      </div>
    </nav>
  );
};
