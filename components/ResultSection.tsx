import React, { useState } from 'react';
import { FinalContent } from '../types';

interface ResultSectionProps {
  content: FinalContent;
  onReset: () => void;
}

/**
 * Markdown to HTML Converter for Display & Clipboard
 */
const convertMarkdownToHtml = (markdown: string): string => {
  let html = markdown;

  // 1. STRICT CLEANUP
  html = html.replace(/^(#+)\s*\d+[\.)]\s+(.*)$/gm, '$1 $2');
  html = html.replace(/^\*\*\d+[\.)]\s+(.*)\*\*$/gm, '**$1**');
  html = html.replace(/^(\d+[\.)]\s+)(.*)$/gm, '$2'); 

  // Headers - Updated to Dark Slate (#111) instead of Indigo
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25em; font-weight: 700; margin-top: 1em; margin-bottom: 0.5em; color: #1f2937;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 1.5em; font-weight: 800; margin-top: 1.2em; margin-bottom: 0.6em; color: #111827;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 2em; font-weight: 900; margin-bottom: 0.8em; color: #000000;">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Lists
  html = html.replace(/^- (.*$)/gim, '• $1<br>');

  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (!para.trim().startsWith('<h') && !para.trim().startsWith('•')) {
      return `<p style="margin-bottom: 1em; line-height: 1.6; color: #374151;">${para.trim()}</p>`;
    }
    return para;
  }).join('');

  html = html.replace(/\n/g, ' '); 

  return html;
};

/**
 * Helper component to render the HTML safely
 */
const SimpleMarkdownDisplay: React.FC<{ content: string }> = ({ content }) => {
  const htmlContent = convertMarkdownToHtml(content);
  return <div className="prose max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const CopyButton: React.FC<{ text: string, label?: string, small?: boolean, isRichText?: boolean }> = ({ text, label = "Kopyala", small = false, isRichText = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (isRichText) {
        const html = convertMarkdownToHtml(text);
        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobText = new Blob([text], { type: 'text/plain' });
        
        const data = [new ClipboardItem({ 
          'text/html': blobHtml, 
          'text/plain': blobText 
        })];
        
        await navigator.clipboard.write(data);
      } else {
        await navigator.clipboard.writeText(text);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      alert("Kopyalama başarısız oldu. Lütfen izinleri kontrol edin.");
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`flex items-center gap-1 rounded transition-all font-medium border shadow-sm touch-manipulation
        ${small ? 'px-2 py-1 text-[10px] uppercase tracking-wide' : 'px-4 py-2 text-xs uppercase tracking-wide'}
        ${copied 
          ? 'bg-slate-800 text-white border-slate-800' 
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
        }`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          {small ? 'Kopyalandı' : 'Kopyalandı'}
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          {label}
        </>
      )}
    </button>
  );
};

const InfoCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }> = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
      {icon}
      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

export const ResultSection: React.FC<ResultSectionProps> = ({ content, onReset }) => {
  const [editMode, setEditMode] = useState(false);
  const [articleText, setArticleText] = useState(content.articleContent);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-32 animate-fade-in">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
             <span className="text-[#333333]">Toshi AI</span> Hazır! 🎉
          </h2>
          <p className="text-slate-500 mt-1 text-sm md:text-base font-light">Güncel SEO kriterlerine göre insansı dokunuşla hazırlandı.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onReset}
            className="w-full md:w-auto px-6 py-3 rounded bg-slate-900 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            YENİ İÇERİK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: The Article */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col min-h-[600px] md:min-h-[800px]">
            {/* Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-10 gap-3 md:gap-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <div>
                   <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Makale Taslağı</h3>
                   <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Markdown Destekli</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                 <button
                  onClick={() => setEditMode(!editMode)}
                  className={`text-[10px] uppercase tracking-wide font-bold px-3 py-2 rounded border transition-colors flex-1 md:flex-none text-center ${editMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                 >
                   {editMode ? 'Önizlemeye Dön' : 'Düzenle'}
                 </button>
                 <div className="flex-1 md:flex-none">
                    <CopyButton text={articleText} label="Kopyala" isRichText={true} small />
                 </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow p-4 md:p-12 bg-white relative">
              {editMode ? (
                <textarea
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  className="w-full h-full min-h-[600px] outline-none resize-none font-mono text-sm text-slate-800 bg-slate-50 p-4 rounded border border-slate-200 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  spellCheck={false}
                />
              ) : (
                <div className="article-preview select-text text-slate-800">
                  <SimpleMarkdownDisplay content={articleText} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SEO Assets (Premium Monochrome Icons) */}
        <div className="space-y-6 order-1 lg:order-2">
          
          {/* 1. Slug */}
          <InfoCard 
            title="URL Yapısı (Slug)" 
            icon={<svg className="w-4 h-4 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
          >
            <div className="bg-slate-50 p-3 rounded text-xs text-slate-800 font-mono break-all mb-2 border border-slate-100">
              {content.seoSlug}
            </div>
            <div className="flex justify-end">
              <CopyButton text={content.seoSlug} small />
            </div>
          </InfoCard>

          {/* NEW: Meta Title */}
          <InfoCard 
            title="Meta Başlığı (Title)" 
            icon={<svg className="w-4 h-4 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
          >
            <p className="text-sm text-slate-800 font-medium mb-2 font-serif leading-relaxed">{content.metaTitle || "Oluşturuluyor..."}</p>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono ${content.metaTitle?.length > 55 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                {content.metaTitle?.length || 0} / 55
              </span>
              <CopyButton text={content.metaTitle || ""} small />
            </div>
          </InfoCard>

          {/* 2. Meta Description */}
          <InfoCard 
            title="Meta Açıklaması" 
            icon={<svg className="w-4 h-4 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <p className="text-xs text-slate-600 leading-relaxed mb-3">{content.metaDescription}</p>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono ${content.metaDescription.length > 155 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                {content.metaDescription.length} / 155
              </span>
              <CopyButton text={content.metaDescription} small />
            </div>
          </InfoCard>

          {/* 3. Image Alt Texts */}
          <InfoCard 
            title="Görsel Alt Metinleri" 
            icon={<svg className="w-4 h-4 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          >
            <div className="space-y-3">
              {content.imageAltTexts.map((text, i) => (
                <div key={i} className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Görsel {i + 1}</span>
                    <CopyButton text={text} label="Al" small />
                  </div>
                  <p className="text-xs text-slate-700 leading-normal">{text}</p>
                </div>
              ))}
            </div>
          </InfoCard>

          {/* 4. Internal Links */}
          <InfoCard 
            title="İç Link Önerileri" 
            icon={<svg className="w-4 h-4 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
          >
             <div className="space-y-2">
              {content.internalLinks.map((link, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100 gap-2">
                  <span className="text-xs text-slate-600 truncate font-mono flex-1">{link}</span>
                  <CopyButton text={link} label="Link" small />
                </div>
              ))}
            </div>
          </InfoCard>

          {/* 5. Keywords Summary */}
           <InfoCard 
            title="Hedeflenen Kelimeler" 
            icon={<svg className="w-4 h-4 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
          >
            <div className="text-xs text-slate-500 max-h-32 overflow-y-auto whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-100 font-mono">
               {content.keywordListBlock}
            </div>
          </InfoCard>
        </div>
      </div>

       {/* Toshi AI Footer */}
      <div className="mt-12 border-t border-slate-200 pt-8 text-center">
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