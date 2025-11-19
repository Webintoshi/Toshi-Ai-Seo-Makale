import React, { useState, useEffect } from 'react';

const QUOTES = [
  { text: "Kaliteli içerik, kaliteli müşteri getirir.", author: "Toshi AI" },
  { text: "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.", author: "Robert Collier" },
  { text: "İçerik kraldır.", author: "Bill Gates" },
  { text: "İnsanların neye ihtiyacı olduğunu bulun ve onlara verin.", author: "Dale Carnegie" },
  { text: "Kalite, kimse bakmadığında da doğru olanı yapmaktır.", author: "Henry Ford" },
  { text: "Sözcükler, dünyayı değiştirebilecek en güçlü uyuşturucudur.", author: "Rudyard Kipling" },
  { text: "Yaratıcılık, bulaşıcıdır. Onu başkalarına da bulaştırın.", author: "Albert Einstein" },
  { text: "Bir şeyi basitçe anlatamıyorsan, onu yeterince iyi anlamamışsın demektir.", author: "Albert Einstein" },
  { text: "Yazmak, keşfetmektir.", author: "Mehmet Murat İldan" },
  { text: "En iyi pazarlama, pazarlama gibi hissettirmeyendir.", author: "Tom Fishburne" },
  { text: "Gemini sizin için en doğru kelimeleri seçiyor...", author: "AI Asistanı" }
];

export const LoadingScreen: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 8000); // 8 seconds interval

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm transition-opacity duration-500">
      <div className="max-w-2xl w-full p-8 text-center">
        
        {/* Loading Animation - Premium Monochrome */}
        <div className="mb-12 relative">
          <div className="w-20 h-20 border-4 border-slate-700 border-t-white rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-mono animate-pulse tracking-widest">AI</span>
          </div>
        </div>

        {/* Quote Slider */}
        <div className="h-40 flex flex-col items-center justify-center animate-fade-in transition-all duration-500">
          <p className="text-2xl md:text-3xl font-light text-white mb-6 italic leading-relaxed">
            "{QUOTES[currentQuoteIndex].text}"
          </p>
          <p className="text-slate-400 font-medium tracking-wider uppercase text-sm">
            — {QUOTES[currentQuoteIndex].author}
          </p>
        </div>

        <div className="mt-12">
          <p className="text-slate-500 text-xs uppercase tracking-widest animate-pulse">
            Makale Stratejisi Hazırlanıyor...
          </p>
        </div>
      </div>
    </div>
  );
};