// src/app/admin/ingredients/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import IngredientForm from '@/components/admin/IngredientForm';
import IngredientActions from '@/components/admin/IngredientActions';

export default async function IngredientsPage() {
  const supabase = createClient();
  const { data: ingredients } = await supabase.from('ingredients').select('*').order('name');

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <Link href="/admin"><Button variant="outline">&larr; Back to Dashboard</Button></Link>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <IngredientForm />
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader><CardTitle>Existing Ingredients</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients?.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell className="font-medium">{ingredient.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{ingredient.description}</TableCell>
                      <TableCell className="text-right">
                        <IngredientActions ingredientId={ingredient.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}