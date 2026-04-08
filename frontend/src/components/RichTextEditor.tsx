import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Props {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const RichTextEditor: React.FC<Props> = ({ value, onChange, placeholder, style }) => {
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
  ];

  const combinedStyle: React.CSSProperties = {
    height: '150px',
    marginBottom: '45px',
    ...style
  };

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={combinedStyle}
      />
      <style>{`
        .rich-text-editor-wrapper .ql-toolbar.ql-snow {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          border-color: #d9d9d9;
          background: #fafafa;
        }
        .rich-text-editor-wrapper .ql-container.ql-snow {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          border-color: #d9d9d9;
          font-family: 'Inter', sans-serif;
        }
        .rich-text-editor-wrapper .ql-editor {
          min-height: 100px;
          font-size: 14px;
        }
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          font-style: normal;
          color: #bfbfbf;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

