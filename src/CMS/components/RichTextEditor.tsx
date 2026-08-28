import React, { useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List, 
  ListOrdered,
  RemoveFormatting
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tulis konten di sini...',
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value from props to contentEditable div
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const isFocused = document.activeElement === editorRef.current;
      if (!isFocused && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      isUpdatingRef.current = false;
    }
  };

  const handleBlur = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      isUpdatingRef.current = false;
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleInput();
  };

  return (
    <div className={`border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('bold')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Tebal (Bold)"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('italic')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Miring (Italic)"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('underline')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Garis Bawah (Underline)"
        >
          <Underline size={15} />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('justifyLeft')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Rata Kiri"
        >
          <AlignLeft size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('justifyCenter')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Rata Tengah"
        >
          <AlignCenter size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('justifyRight')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Rata Kanan"
        >
          <AlignRight size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('justifyFull')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Rata Kiri Kanan (Justify)"
        >
          <AlignJustify size={15} />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Daftar Simbol (Bullet List)"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Daftar Angka (Numbered List)"
        >
          <ListOrdered size={15} />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('removeFormat')}
          className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Hapus Format"
        >
          <RemoveFormatting size={15} />
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleBlur}
        className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto outline-none prose prose-slate rich-text-content max-w-none text-sm text-slate-800 focus:outline-none"
        data-placeholder={placeholder}
        style={{
          wordBreak: 'break-word',
        }}
      />
    </div>
  );
};