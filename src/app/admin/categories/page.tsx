// src/app/admin/categories/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CategoryForm from '@/components/admin/CategoryForm'; // We will create this next
import CategoryActions from '@/components/admin/CategoryActions';

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <Link href="/admin"><Button variant="outline">&larr; Back to Dashboard</Button></Link>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
              <CardDescription>Create a new category for your products.</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryForm />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-right">
                        <CategoryActions categoryId={category.id} />
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