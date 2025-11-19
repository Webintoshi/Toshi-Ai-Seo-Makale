import { GoogleGenAI, Type } from "@google/genai";
import { SelectionData, FinalContent, UserSelections, ArticleConfig } from "../types";

/**
 * Simulates fetching data from Google Ads and Trends by using Gemini's semantic understanding.
 */
export const fetchSeoProposals = async (apiKey: string, topic: string): Promise<SelectionData> => {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Kıdemli bir SEO Stratejisti olarak hareket et. Google Ads Anahtar Kelime Planlayıcı ve Google Trends verilerine erişimin olduğunu varsay.
    Konu: "${topic}"

    Görev:
    1. Konuyla ilgili 5-8 adet "Yüksek Hacimli Anahtar Kelime" (High Volume/Short-tail) üret. Varsayımsal aylık aranma hacimlerini (örn: 10B - 100B) ekle.
    2. Konuyla ilgili 5-8 adet "Uzun Kuyruklu Anahtar Kelime" (Long Tail) üret.
    3. Arama niyetine dayalı 5 adet "Hedef Kitle" (Target Audience) segmenti/personas üret.

    Çıktı Dili: Türkçe.
    SADECE JSON formatında yanıt ver.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          highVolume: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                volume: { type: Type.STRING }
              }
            }
          },
          longTail: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          audiences: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  const data = JSON.parse(response.text || "{}");

  return {
    highVolumeKeywords: (data.highVolume || []).map((item: any, idx: number) => ({
      id: `hv-${idx}`,
      text: item.keyword,
      source: 'Google Ads',
      volume: item.volume
    })),
    longTailKeywords: (data.longTail || []).map((item: string, idx: number) => ({
      id: `lt-${idx}`,
      text: item,
      source: 'Google Trends'
    })),
    targetAudiences: (data.audiences || []).map((item: string, idx: number) => ({
      id: `aud-${idx}`,
      text: item
    }))
  };
};

/**
 * Helper function to truncate text nicely
 */
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

/**
 * Generates the final plain text blocks based on user selections.
 */
export const generateFinalContent = async (apiKey: string, config: ArticleConfig, selections: UserSelections, allData: SelectionData): Promise<FinalContent> => {
  const ai = new GoogleGenAI({ apiKey });

  // Reconstruct full objects for context
  const highVolKeywords = selections.selectedHighVolume.map(id => allData.highVolumeKeywords.find(k => k.id === id)?.text).filter(Boolean);
  const longTailKeywords = selections.selectedLongTail.map(id => allData.longTailKeywords.find(k => k.id === id)?.text).filter(Boolean);
  const selectedAudiences = selections.selectedAudience.map(id => allData.targetAudiences.find(a => a.id === id)?.text).filter(Boolean);

  const highVolText = highVolKeywords.join(", ");
  const longTailText = longTailKeywords.join(", ");
  const audienceText = selectedAudiences.join(", ");
  const brandContext = config.brandName ? `Marka: ${config.brandName}` : "Marka: Belirtilmemiş";

  // 1. Generate Metadata using AI (Fast Model)
  // STRICT PROMPT for Length
  const metadataPrompt = `
    Konu: ${config.topic}
    ${brandContext}
    Web Sitesi: ${config.websiteUrl || "Belirtilmemiş"}
    Seçilen Anahtar Kelimeler: ${highVolText}, ${longTailText}
    Hedef Kitle: ${audienceText}

    Görev: Aşağıdaki alanlar için Türkçe içerik oluştur. 
    ÇOK ÖNEMLİ: Karakter sınırlarına kesinlikle uy.

    1. Meta Title: SEO uyumlu başlık. MAKİSMUM 50 KARAKTER OLMALI. (Kısa ve vurucu).
    2. Meta Description: Tıklama odaklı açıklama. MAKSİMUM 145 KARAKTER OLMALI. (Asla kesilmemeli).
    3. SEO Slug: Konu ve kelimelerden türetilen URL dostu yapı (Türkçe karakterler sadeleştirilmiş, kısa).
    4. İç Link Önerileri: En az 3 adet. Eğer web sitesi ("${config.websiteUrl}") girildiyse tam URL, girilmediyse sadece başlık ve path önerisi (/ornek-yazi). Dizi (Array) olarak ver.
    5. Görsel Alt Metinleri: Tam olarak 3 adet farklı görsel için açıklayıcı alt metin (Alt Text). Dizi (Array) olarak ver.
    
    SADECE JSON döndür.
  `;

  const metadataResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: metadataPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metaTitle: { type: Type.STRING },
          metaDescription: { type: Type.STRING },
          seoSlug: { type: Type.STRING },
          internalLinks: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          imageAltTexts: { 
             type: Type.ARRAY,
             items: { type: Type.STRING }
          },
        }
      }
    }
  });

  const metaData = JSON.parse(metadataResponse.text || "{}");

  // Force Truncation Logic to Ensure compliance even if AI hallucinates
  const safeMetaTitle = truncateText(metaData.metaTitle || "", 55); 
  const safeMetaDesc = truncateText(metaData.metaDescription || "", 155);

  // 2. Generate the Actual Article
  const articlePrompt = `
Rol: Sen dünyanın en iyi SEO içerik yazarı ve konu otoritesisin.
Görev: Aşağıdaki parametrelere göre ${config.length} uzunluğunda, %100 özgün, insan tarafından yazılmış gibi hissettiren, derinlemesine bir blog yazısı yaz.

--- GİRDİLER ---
Konu: ${config.topic}
Ana Anahtar Kelime: ${highVolKeywords[0] || config.topic}
LSI/Yan Anahtar Kelimeler: ${[...highVolKeywords.slice(1), ...longTailKeywords].join(', ')}
Hedef Kitle: ${audienceText}
Ton: ${config.tone}
Marka Adı: ${config.brandName || "Belirtilmemiş"}

--- KALİTE KURALLARI (KESİN UYGULA) ---
1. E-E-A-T PRENSİBİ: İçeriği "deneyim" kat. Sanki yazar bunu bizzat yaşamış gibi anlat. Teorik bilgi verme, pratik uygualanabilir tavsiye ver.
2. İNSAN DOKUNUŞU: Robotik dilden kaçın. "Sonuç olarak", "Özetle" gibi klişe girişleri kullanma. Okuyucuyla sohbet et (Sen dili kullan).
3. BAŞLIK FORMATI: 
   - KESİNLİKLE başlıkların başına 1., 2., 1- gibi sayılar KOYMA. (Örn: "1. Giriş" YANLIŞ. "Giriş" DOĞRU).
   - Sadece Başlık metnini yaz.
   - H1 (#), H2 (##) ve H3 (###) kullan.
4. FORMAT:
   - Paragrafları kısa tut.
   - Önemli yerleri **kalın** yap.
   - Madde işaretleri (-) kullan.
5. SEO: Anahtar kelimeleri metne doğal bir şekilde yedir.

Makaleyi Markdown formatında yaz. Sadece makale metnini ver, başka açıklama yapma.
`;

  let generatedArticle = "";
  
  // Attempt 1: Try Gemini 3 Pro (High Quality)
  try {
    const articleResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: articlePrompt,
      config: {
        temperature: 0.7,
      }
    });
    generatedArticle = articleResponse.text || "";
  } catch (error) {
    console.warn("Gemini 3 Pro generation failed, falling back to Flash...", error);
  }

  // Attempt 2: Fallback to Gemini 2.5 Flash (High Reliability)
  if (!generatedArticle) {
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: articlePrompt,
        config: {
          temperature: 0.7,
        }
      });
      generatedArticle = fallbackResponse.text || "";
    } catch (fallbackError) {
      console.error("Fallback generation failed", fallbackError);
      throw new Error("İçerik oluşturulamadı. Lütfen API anahtarınızı kontrol edip tekrar deneyin.");
    }
  }

  if (!generatedArticle) {
     throw new Error("API yanıtı boş döndü.");
  }

  // Formating the list blocks manually for display
  const keywordListBlock = 
`-- Yüksek Hacimli --
${highVolKeywords.join('\n')}

-- Uzun Kuyruklu --
${longTailKeywords.join('\n')}`;

  const audienceListBlock = selectedAudiences.join('\n');

  return {
    metaTitle: safeMetaTitle,
    metaDescription: safeMetaDesc,
    seoSlug: metaData.seoSlug || "",
    articlePrompt: articlePrompt,
    articleContent: generatedArticle,
    internalLinks: metaData.internalLinks || [],
    imageAltTexts: metaData.imageAltTexts || [],
    keywordListBlock,
    audienceListBlock
  };
};