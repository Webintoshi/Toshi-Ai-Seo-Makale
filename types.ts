export interface KeywordProposal {
  id: string;
  text: string;
  source: 'Google Ads' | 'Google Trends' | 'Gemini Inference';
  volume?: string; // Simulated volume
}

export interface AudienceProposal {
  id: string;
  text: string;
}

export interface SelectionData {
  highVolumeKeywords: KeywordProposal[];
  longTailKeywords: KeywordProposal[];
  targetAudiences: AudienceProposal[];
}

export interface UserSelections {
  selectedHighVolume: string[];
  selectedLongTail: string[];
  selectedAudience: string[];
}

export interface ArticleConfig {
  topic: string;
  brandName: string;
  websiteUrl: string;
  tone: string;
  length: string;
}

export interface FinalContent {
  metaTitle: string; // Added Meta Title
  metaDescription: string;
  seoSlug: string;
  keywordListBlock: string;
  audienceListBlock: string;
  articlePrompt: string; 
  articleContent: string; 
  internalLinks: string[]; 
  imageAltTexts: string[]; 
}

export enum AppStep {
  INPUT = 0,
  SELECTION = 1,
  RESULT = 2,
}