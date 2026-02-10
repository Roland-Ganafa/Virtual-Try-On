
import React from 'react';
import { WorkflowStep } from '../types';

interface WorkflowStatusProps {
  currentStep: WorkflowStep;
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ currentStep }) => {
  const steps = [
    { key: WorkflowStep.PARSING, label: 'Human Parsing', desc: 'Segmenting body parts & clothes' },
    { key: WorkflowStep.DENSEPOSE, label: 'DensePose Estimation', desc: 'Mapping 3D surface geometry' },
    { key: WorkflowStep.SEMANTIC, label: 'Semantic Correspondence', desc: 'Aligning garment features' },
    { key: WorkflowStep.LIGHTING, label: 'Lighting Synthesis', desc: 'Generating shadows & highlights' },
  ];

  const getStatus = (stepKey: WorkflowStep) => {
    const stepOrder = [
      WorkflowStep.PARSING, 
      WorkflowStep.DENSEPOSE, 
      WorkflowStep.SEMANTIC, 
      WorkflowStep.LIGHTING,
      WorkflowStep.GENERATING,
      WorkflowStep.COMPLETE
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (currentStep === WorkflowStep.IDLE) return 'pending';
    if (currentIndex > stepIndex) return 'complete';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      {steps.map((step) => {
        const status = getStatus(step.key);
        return (
          <div 
            key={step.key}
            className={`p-4 rounded-xl border transition-all duration-500 ${
              status === 'active' 
                ? 'bg-indigo-500/10 border-indigo-500 shimmer' 
                : status === 'complete'
                ? 'bg-emerald-500/5 border-emerald-500/50 opacity-100'
                : 'bg-white/5 border-white/10 opacity-40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {status === 'complete' ? (
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : status === 'active' ? (
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-600 rounded-full"></div>
              )}
              <span className={`text-sm font-bold ${status === 'active' ? 'text-indigo-400' : 'text-gray-300'}`}>
                {step.label}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-tighter text-gray-500 font-medium">
              {status === 'active' ? 'Processing...' : status === 'complete' ? 'Optimized' : 'Waiting'}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowStatus;
