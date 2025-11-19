import React, { useState, useEffect } from 'react';
import { ArticleConfig } from '../types';

interface InputSectionProps {
  onStart: (config: ArticleConfig, apiKey: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onStart, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tone, setTone] = useState('Samimi');
  const [length, setLength] = useState('2000+');
  const [apiKey, setApiKey] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiSettings(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      
      const config: ArticleConfig = {
        topic: topic.trim(),
        brandName: brandName.trim(),
        websiteUrl: websiteUrl.trim(),
        tone,
        length: length === '2000+' ? '2000-2500 Kelime' : length === '1500+' ? '1500-2000 Kelime' : length === '1000+' ? '1000-1500 Kelime' : length
      };

      onStart(config, apiKey.trim());
    }
  };

  const toneOptions = [
    'Samimi', 'Profesyonel', 'Akademik', 'Eğlenceli', 'İkna Edici', 'Otoriter'
  ];

  const lengthOptions = [
    '1000+', '1500+', '2000+', '2500+'
  ];

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-6 md:py-12 animate-fade-in flex flex-col min-h-full">
      
      {/* Header Card */}
      <div className="bg-white rounded-none md:rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-8">
        {/* Premium Header Background: Solid Dark Slate */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              <h1 className="text-xl font-bold tracking-wide font-sans">Toshi AI <span className="font-light opacity-70">Architect</span></h1>
            </div>
            <p className="text-slate-400 text-xs font-medium tracking-wide">Gemini 3 Pro & İnsan Dokunuşu</p>
          </div>
          <div className="text-slate-400 text-[10px] border border-slate-700 rounded px-2 py-1 cursor-default bg-slate-800/50 tracking-widest uppercase">
            v2.1 Pro
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-5 md:space-y-6">
          
          {/* Topic Input */}
          <div>
            <label htmlFor="topic" className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
              <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Makale Konusu <span className="text-slate-400">*</span>
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Örn: Evde fındık ezmesi yapmak"
              className="w-full px-4 py-3 rounded-none border-b-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 transition-all outline-none text-slate-900 font-medium resize-none h-24 placeholder-slate-400"
              required
            />
          </div>

          {/* Brand & Website Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Name */}
            <div>
              <label htmlFor="brand" className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Marka Adı
              </label>
              <input
                type="text"
                id="brand"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Örn: ezmeo"
                className="w-full px-4 py-3 rounded border border-slate-200 bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all outline-none text-slate-800 text-sm"
              />
            </div>

            {/* Website URL */}
            <div>
              <label htmlFor="website" className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                Websitesi
              </label>
              <input
                type="text"
                id="website"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Örn: ezmeo.com"
                className="w-full px-4 py-3 rounded border border-slate-200 bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all outline-none text-slate-800 text-sm"
              />
            </div>
          </div>

          {/* Tone & Length Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tone */}
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Dil & Ton
              </label>
              <div className="relative">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded border border-slate-200 bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-slate-800 cursor-pointer text-sm"
                >
                  {toneOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Length */}
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Uzunluk
              </label>
              <div className="relative">
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded border border-slate-200 bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-slate-800 cursor-pointer text-sm"
                >
                   {lengthOptions.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* API Key Toggle */}
          <div className="pt-2 border-t border-slate-100 mt-4">
             <button 
               type="button"
               onClick={() => setShowApiSettings(!showApiSettings)}
               className="text-xs text-slate-400 hover:text-slate-800 flex items-center transition-colors font-medium"
             >
               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               {apiKey ? 'API Anahtarı Kayıtlı (Düzenle)' : 'API Anahtarı Gir'}
             </button>
             
             {showApiSettings && (
               <div className="mt-3 animate-fade-in p-4 bg-slate-50 rounded border border-slate-200">
                  <label htmlFor="apiKey" className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none bg-white"
                  />
               </div>
             )}
          </div>

          {/* Submit Button - Premium Black */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !topic || !apiKey}
              className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 text-white font-bold tracking-wide shadow-lg transition-all transform active:scale-[0.98] touch-manipulation ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-black hover:shadow-xl border border-transparent'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  STRATEJİ OLUŞTURULUYOR...
                </>
              ) : (
                <>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   YÜKSEK HACİMLİ KELİMELERİ GETİR
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-wide">
              Sonraki adımda kitle ve kelime seçimi yapacaksınız.
            </p>
          </div>
        </form>
      </div>

      {/* Toshi AI Footer */}
      <div className="mt-auto py-6 text-center">
        <a 
          href="https://www.instagram.com/sdkahmetcelebi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#333333] hover:text-black transition-colors group"
        >
           <div className="p-1.5 rounded-full bg-white group-hover:bg-slate-50 border border-slate-200 group-hover:border-slate-300 transition-all shadow-sm">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
             </svg>
           </div>
           <span className="text-sm font-semibold tracking-wide font-mono text-slate-900">Toshi AI</span>
        </a>
      </div>
    </div>
  );
};