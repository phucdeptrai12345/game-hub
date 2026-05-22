export interface Game {
  id: string;
  title: string;
  slug: string;
  thumb: string;
  url: string;
  category: string;
  tags: string[];
  description: string;
  instructions: string;
  width: string;
  height: string;
  developer: string;
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
