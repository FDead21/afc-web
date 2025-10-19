// src/components/Quiz.tsx
'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ProductCard from './ProductCard';
import { ChevronLeft, Sparkles } from 'lucide-react';

interface QuizAnswer {
  id: string;
  text: string;
  product_tags: string[];
  question_id: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  order_index: number;
  answers: QuizAnswer[];
}

interface QuizProps {
  products: Product[];
  questions: QuizQuestion[];
}

export default function Quiz({ products, questions }: QuizProps) {
  const [step, setStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<Product | null>(null);

  // Sort questions by order_index
  const sortedQuestions = questions ? [...questions].sort((a, b) => a.order_index - b.order_index) : [];

  const handleAnswer = (answer: QuizAnswer) => {
    const newTags = [...selectedTags, ...answer.product_tags];
    setSelectedTags(newTags);

    if (step < sortedQuestions.length - 1) {
      setStep(step + 1);
    } else {
      // Find best matching product
      findRecommendation(newTags);
    }
  };

  const findRecommendation = (tags: string[]) => {
    // Count tag matches for each product
    const productScores = products.map(product => {
      const productTags = product.tags || [];
      const matches = tags.filter(tag => 
        productTags.some((pTag: string) => pTag.toLowerCase() === tag.toLowerCase())
      ).length;
      return { product, score: matches };
    });

    // Sort by score and get best match
    productScores.sort((a, b) => b.score - a.score);
    
    // If no matches, recommend first product or random
    const bestMatch = productScores[0]?.score > 0 
      ? productScores[0].product 
      : products[Math.floor(Math.random() * products.length)];
    
    setRecommendation(bestMatch);
  };

  const resetQuiz = () => {
    setStep(0);
    setSelectedTags([]);
    setRecommendation(null);
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
      // Remove last answer's tags
      const prevAnswer = sortedQuestions[step - 1].answers.find(a => 
        selectedTags.some(tag => a.product_tags.includes(tag))
      );
      if (prevAnswer) {
        setSelectedTags(selectedTags.slice(0, -prevAnswer.product_tags.length));
      }
    }
  };

  // Show recommendation
  if (recommendation) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Pilihan Ditemukan!</CardTitle>
          <p className="text-muted-foreground mt-2">Berdasarkan jawaban anda, kami sarankan:</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="w-full max-w-sm">
            <ProductCard product={recommendation} />
          </div>
          <Button onClick={resetQuiz} variant="outline" size="lg" className="w-full max-w-sm">
            Coba Quiz Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show quiz questions
  if (sortedQuestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada Quiz untuk saat ini, harap kembali lagi.
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = sortedQuestions[step];
  const progress = ((step + 1) / sortedQuestions.length) * 100;

  return (
    <Card>
      <CardHeader>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Pertanyaan {step + 1} dari {sortedQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <CardTitle className="text-xl md:text-2xl">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentQuestion.answers.map((answer) => (
          <Button 
            key={answer.id} 
            onClick={() => handleAnswer(answer)} 
            size="lg"
            variant="outline"
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {answer.text}
          </Button>
        ))}
        
        {step > 0 && (
          <Button 
            onClick={goBack} 
            variant="ghost" 
            size="sm"
            className="mt-4 w-full"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Pertanyaan sebelumnya
          </Button>
        )}
      </CardContent>
    </Card>
  );
}