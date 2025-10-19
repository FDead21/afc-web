// src/components/admin/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';

// Toolbar component
const EditorToolbar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="border rounded-t-md p-2 flex flex-wrap gap-2">
      <Button type="button" variant={editor.isActive('bold') ? 'default' : 'outline'} size="sm" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</Button>
      <Button type="button" variant={editor.isActive('italic') ? 'default' : 'outline'} size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</Button>
      <Button type="button" variant={editor.isActive('strike') ? 'default' : 'outline'} size="sm" onClick={() => editor.chain().focus().toggleStrike().run()}>Strike</Button>
      <Button type="button" variant={editor.isActive('bulletList') ? 'default' : 'outline'} size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()}>List</Button>
      <Button type="button" variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
    </div>
  );
};

// Main Editor component
export default function RichTextEditor({
  initialContent = '',
  onChange,
}: {
  initialContent?: string;
  onChange: (content: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose lg:prose-xl min-h-[250px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}