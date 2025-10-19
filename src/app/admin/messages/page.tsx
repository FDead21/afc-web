// src/app/admin/messages/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function MessagesPage() {
  const supabase = createClient();
  // Fetch messages, ordered by the most recent first
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <Link href="/admin">
          <Button variant="outline">&larr; Back to Dashboard</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Messages</CardTitle>
          <CardDescription>Here are the messages submitted by your site visitors.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received At</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages?.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">
                    {new Date(message.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{message.email}</TableCell>
                  <TableCell>{message.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}