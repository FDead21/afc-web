// src/components/admin/QuizManager.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit } from 'lucide-react';

interface Answer {
  id: string;
  text: string;
  product_tags: string[];
  question_id: string;
}

interface Question {
  id: string;
  question: string;
  order_index: number;
  answers: Answer[];
}

export default function QuizManager({ questions }: { questions: Question[] }) {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Add Question Button */}
      <Button onClick={() => setShowQuestionForm(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>

      {/* Question Form */}
      {showQuestionForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => {
              const { createQuizQuestion } = await import('@/app/admin/actions');
              await createQuizQuestion(formData);
              setShowQuestionForm(false);
            }} className="space-y-4">
              <Input name="question" placeholder="Question text" required />
              <Input name="order_index" type="number" placeholder="Order (e.g., 1, 2, 3)" required />
              <div className="flex gap-2">
                <Button type="submit">Create</Button>
                <Button type="button" variant="outline" onClick={() => setShowQuestionForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-muted-foreground">Question #{question.order_index}</span>
                <CardTitle className="text-xl mt-1">{question.question}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={async () => {
                if (confirm('Delete this question?')) {
                  const { deleteQuizQuestion } = await import('@/app/admin/actions');
                  await deleteQuizQuestion(question.id);
                }
              }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Answers */}
            {question.answers.map((answer) => (
              <div key={answer.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{answer.text}</p>
                  <p className="text-sm text-muted-foreground">
                    Tags: {answer.product_tags.join(', ')}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={async () => {
                  if (confirm('Delete this answer?')) {
                    const { deleteQuizAnswer } = await import('@/app/admin/actions');
                    await deleteQuizAnswer(answer.id);
                  }
                }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {/* Add Answer Form */}
            {showAnswerForm === question.id ? (
              <form action={async (formData) => {
                const { createQuizAnswer } = await import('@/app/admin/actions');
                formData.append('question_id', question.id);
                await createQuizAnswer(formData);
                setShowAnswerForm(null);
              }} className="space-y-3 p-4 border rounded">
                <Input name="text" placeholder="Answer text" required />
                <Input name="tags" placeholder="Product tags (comma-separated: focus,energy)" required />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Add Answer</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setShowAnswerForm(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowAnswerForm(question.id)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Answer
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}