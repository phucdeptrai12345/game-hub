export type GameProvider = 'famobi' | 'gamedistribution' | 'gamepix' | 'gamemonetize';

export interface Game {
  id: string;
  sourceId?: string;
  provider?: GameProvider;
  title: string;
  slug: string;
  thumb: string;
  url: string;
  sourceUrl?: string;
  category: string;
  tags: string[];
  description: string;
  instructions: string;
  width: string;
  height: string;
  developer: string;
  dateAdded?: string;
  orientation?: string;
  qualityScore?: number;
  featured?: boolean;
  previewVideo?: string;
}

export interface CategoryColor {
  bg: string;
  text: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  color: CategoryColor;
  description: string;
}
