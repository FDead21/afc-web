// src/app/admin/reviews/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import ReviewActions from '@/components/admin/ReviewActions';

export default async function ReviewsPage() {
  const supabase = createClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <Link href="/admin"><Button variant="outline">&larr; Back to Dashboard</Button></Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Moderate Reviews</CardTitle>
          <CardDescription>Approve or delete new customer reviews.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.products?.name}</TableCell>
                  <TableCell>{review.reviewer_name}</TableCell>
                  <TableCell>{review.rating}/5</TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>
                    <Badge variant={review.is_approved ? 'default' : 'secondary'}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ReviewActions review={review} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}