// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock_quantity: number;
  created_at: string;
  tags: string[];
  categories?: { name: string };
  product_images?: Array<{
    id: string;
    image_url: string;
  }>;
}

export interface QuizAnswer {
  id: string;
  text: string;
  product_tags: string[];
  question_id: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  order_index: number;
  answers: QuizAnswer[];
}