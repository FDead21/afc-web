// src/app/admin/quiz/page.tsx
import { createClient } from '@/utils/supabase/server';
import QuizManager from '@/components/admin/QuizManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Link } from 'lucide-react';

export default async function AdminQuizPage() {
  const supabase = createClient();
  
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*, answers:quiz_answers(*)')
    .order('order_index');

  return (
      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Quiz Management</h1>
          <p className="text-gray-600">Create and manage quiz questions for product recommendations</p>
        </div>
        <QuizManager questions={questions || []} />
      </div>
    </div>
  );
}