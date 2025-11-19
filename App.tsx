import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { SelectionSection } from './components/SelectionSection';
import { ResultSection } from './components/ResultSection';
import { LoadingScreen } from './components/LoadingScreen';
import { AppStep, SelectionData, UserSelections, FinalContent, ArticleConfig } from './types';
import { fetchSeoProposals, generateFinalContent } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [apiKey, setApiKey] = useState('');
  const [articleConfig, setArticleConfig] = useState<ArticleConfig>({
    topic: '',
    brandName: '',
    websiteUrl: '',
    tone: 'Samimi ve Bilgilendirici',
    length: '1500-2000 Kelime'
  });
  
  const [selectionData, setSelectionData] = useState<SelectionData | null>(null);
  const [finalContent, setFinalContent] = useState<FinalContent | null>(null);

  const handleStart = async (config: ArticleConfig, inputKey: string) => {
    setIsLoading(true);
    setError(null);
    setArticleConfig(config); // Save config
    setApiKey(inputKey);

    try {
      // Pass additional config context if needed for proposals (currently mainly topic)
      const data = await fetchSeoProposals(inputKey, config.topic);
      setSelectionData(data);
      setStep(AppStep.SELECTION);
    } catch (err: any) {
      console.error(err);
      setError("Veri alınamadı. API Anahtarınızı ve internet bağlantınızı kontrol edin. (Hata: " + (err.message || 'Bilinmiyor') + ")");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionsConfirmed = async (selections: UserSelections) => {
    if (!selectionData) return;
    setIsLoading(true);
    setError(null);

    try {
      // Pass the full article config (brand, tone, length) to generation service
      const content = await generateFinalContent(apiKey, articleConfig, selections, selectionData);
      setFinalContent(content);
      setStep(AppStep.RESULT);
    } catch (err: any) {
      console.error(err);
      setError("İçerik oluşturulurken hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Keep apiKey, reset content flow
    setSelectionData(null);
    setFinalContent(null);
    setStep(AppStep.INPUT);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Global Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg flex items-center animate-fade-in">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
        </div>
      )}

      {/* Full Screen Loading with Quotes */}
      {isLoading && step === AppStep.SELECTION && (
         <LoadingScreen />
      )}

      {step === AppStep.INPUT && (
        <InputSection onStart={handleStart} isLoading={isLoading} />
      )}

      {step === AppStep.SELECTION && selectionData && (
        // Hide selection screen content if loading result to prevent double scrollbars/messy UI behind overlay
        <div className={isLoading ? 'hidden' : 'block'}>
          <SelectionSection 
            data={selectionData} 
            onConfirm={handleSelectionsConfirmed} 
            isLoading={isLoading} 
          />
        </div>
      )}

      {step === AppStep.RESULT && finalContent && (
        <ResultSection 
          content={finalContent} 
          onReset={handleReset} 
        />
      )}
    </div>
  );
};

export default App;