import React, { useState, useEffect } from 'react';
import { SelectionData, UserSelections, KeywordProposal } from '../types';

interface SelectionSectionProps {
  data: SelectionData;
  onConfirm: (selections: UserSelections) => void;
  isLoading: boolean;
}

// Steps definition
const STEPS = [
  { 
    id: 0, 
    title: "Yüksek Hacimli Anahtar Kelimeler", 
    subtitle: "SEO iskeletini oluşturacak popüler aramaları seçin.",
    min: 1,
    max: 3,
    key: 'selectedHighVolume' as keyof UserSelections 
  },
  { 
    id: 1, 
    title: "Uzun Kuyruklu Anahtar Kelimeler", 
    subtitle: "Niş trafiği yakalamak için detaylı aramaları seçin.",
    min: 1,
    max: 5,
    key: 'selectedLongTail' as keyof UserSelections
  },
  { 
    id: 2, 
    title: "Hedef Kitle", 
    subtitle: "İçeriğin kiminle konuşacağını belirleyin.",
    min: 1,
    max: 3,
    key: 'selectedAudience' as keyof UserSelections
  }
];

export const SelectionSection: React.FC<SelectionSectionProps> = ({ data, onConfirm, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<UserSelections>({
    selectedHighVolume: [],
    selectedLongTail: [],
    selectedAudience: [],
  });

  // Helper to get current list items based on step
  const getCurrentItems = () => {
    switch (currentStep) {
      case 0: return data.highVolumeKeywords;
      case 1: return data.longTailKeywords;
      case 2: return data.targetAudiences;
      default: return [];
    }
  };

  const currentStepConfig = STEPS[currentStep];
  const currentSelectionList = selections[currentStepConfig.key];
  const isValid = currentSelectionList.length >= currentStepConfig.min;

  const toggleSelection = (id: string) => {
    setSelections((prev) => {
      const list = prev[currentStepConfig.key];
      const isSelected = list.includes(id);

      if (isSelected) {
        return { ...prev, [currentStepConfig.key]: list.filter((item) => item !== id) };
      } else {
        if (list.length >= currentStepConfig.max) return prev; // Limit reached
        return { ...prev, [currentStepConfig.key]: [...list, id] };
      }
    });
  };

  const handleNext = () => {
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else if (isValid && currentStep === STEPS.length - 1) {
      onConfirm(selections);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Calculate Progress Percentage
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32 animate-fade-in min-h-[80vh] flex flex-col">
      
      {/* Header & Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
             <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Adım {currentStep + 1} / {STEPS.length}</span>
             <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{currentStepConfig.title}</h2>
          </div>
        </div>
        
        {/* Progress Track */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-900 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-500 mt-4 text-sm">{currentStepConfig.subtitle} <span className="font-semibold text-slate-900 ml-1">({currentSelectionList.length}/{currentStepConfig.max} Seçim)</span></p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 flex-grow flex flex-col overflow-hidden animate-fade-in">
        <div className="p-6 md:p-8 flex-grow overflow-y-auto max-h-[500px]">
          <div className="space-y-3">
            {getCurrentItems().map((item) => {
              const isSelected = currentSelectionList.includes(item.id);
              // Safe check for volume property using type narrowing logic
              const hasVolume = 'volume' in item;
              
              return (
                <label 
                  key={item.id} 
                  onClick={() => toggleSelection(item.id)}
                  className={`group flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer select-none
                    ${isSelected 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.01]' 
                      : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors mr-4 flex-shrink-0
                    ${isSelected ? 'bg-white border-white' : 'bg-transparent border-slate-300'}`}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <p className={`font-bold text-base ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {item.text}
                    </p>
                    {hasVolume && (
                      <p className={`text-xs mt-1 font-mono ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                        Hacim: {(item as KeywordProposal).volume}
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
        
        {/* Validation Message inside Card */}
        {!isValid && (
          <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Devam etmek için en az {currentStepConfig.min} seçenek işaretlemelisiniz.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 md:p-6 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
          
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
            className={`px-6 py-3 rounded-lg text-sm font-bold tracking-wide transition-all
              ${currentStep === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            GERİ
          </button>

          {/* Next/Confirm Button */}
          <button
            onClick={handleNext}
            disabled={!isValid || isLoading}
            className={`flex-grow md:flex-grow-0 md:w-64 px-6 py-4 rounded-lg text-white font-bold tracking-wide shadow-lg transition-all flex items-center justify-center gap-2
              ${!isValid || isLoading
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-slate-900 hover:bg-black hover:shadow-xl active:scale-[0.98]'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                HAZIRLANIYOR...
              </>
            ) : (
              currentStep === STEPS.length - 1 ? (
                <>
                  STRATEJİYİ TAMAMLA
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </>
              ) : (
                <>
                  DEVAM ET
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )
            )}
          </button>
        </div>
      </div>
    </div>
  );
};