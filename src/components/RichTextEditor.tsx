import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import 'prosemirror-view/style/prosemirror.css';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Link as LinkIcon,
  Youtube as YoutubeIcon,
  Pilcrow,
  WrapText
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../lib/supabase';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start typing...", 
  disabled = false,
  className = ""
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            style: 'list-style-type: disc; padding-left: 2rem; margin: 1rem 0;',
          },
        },
        orderedList: {
          HTMLAttributes: {
            style: 'list-style-type: decimal; padding-left: 2rem; margin: 1rem 0;',
          },
        },
        listItem: {
          HTMLAttributes: {
            style: 'display: list-item; margin: 0.5rem 0;',
          },
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Youtube.configure({
        width: '100%',
        height: 'auto',
        HTMLAttributes: {
          class: 'rounded-lg my-4',
          style: 'width: 100%; aspect-ratio: 16/9;',
        },
      }),
      TextStyle,
      Color,
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `focus:outline-none whitespace-pre-wrap ${className}`,
        placeholder: placeholder,
        style: 'white-space: pre-wrap;',
      },
    },
  });

  const handleImageUpload = useCallback(async () => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      alert('Supabase not configured. Please set up your .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('File size too large. Please select an image smaller than 10MB.');
          return;
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `editor-images/${fileName}`;

        console.log('Uploading to:', filePath);

        const { data, error } = await supabase.storage
          .from('site_images')
          .upload(filePath, file);

        if (error) {
          console.error('Upload error details:', error);
          
          // Provide specific error messages
          if (error.message.includes('Bucket not found')) {
            alert('Storage bucket "site_images" not found. Please create it in your Supabase dashboard.');
          } else if (error.message.includes('permission')) {
            alert('Permission denied. Please check your Supabase Storage policies.');
          } else {
            alert(`Upload failed: ${error.message}`);
          }
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('site_images')
          .getPublicUrl(filePath);

        console.log('Upload successful, URL:', urlData.publicUrl);

        // Insert image into editor
        editor?.chain().focus().setImage({ src: urlData.publicUrl }).run();
        
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt('Enter YouTube URL:');
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="border border-gray-300 rounded-lg p-4">Loading editor...</div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      {!disabled && (
        <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`h-8 w-8 p-0 ${editor?.isActive('underline') ? 'bg-gray-200' : ''}`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Line Break */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setHardBreak().run()}
            className="h-8 w-8 p-0"
            title="Line Break (Shift+Enter)"
          >
            <WrapText className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Bullet button clicked!');
              console.log('Editor exists:', !!editor);
              console.log('Editor object:', editor);
              console.log('Can toggle bulletList:', editor?.can().toggleBulletList());
              if (editor) {
                try {
                  const result = editor.chain().focus().toggleBulletList().run();
                  console.log('Toggle result:', result);
                } catch (e) {
                  console.error('Error toggling bullet list:', e);
                }
              }
            }}
            className={`h-8 w-8 p-0 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Media */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            className="h-8 w-8 p-0"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={`h-8 w-8 p-0 ${editor?.isActive('link') ? 'bg-gray-200' : ''}`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addYoutube}
            className="h-8 w-8 p-0"
            title="Embed YouTube Video"
          >
            <YoutubeIcon className="w-4 h-4" />
          </Button>

        </div>
      )}

      {/* Editor Content */}
      <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
