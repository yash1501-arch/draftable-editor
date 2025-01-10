import React, { useEffect, useState } from 'react';
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { toast } from "sonner";

const TextEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem('draftContent');
    if (savedContent) {
      const content = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(content);
    }
    return EditorState.createEmpty();
  });

  const handleBeforeInput = (chars: string, editorState: EditorState) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const start = selection.getStartOffset();
    const text = currentBlock.getText();

    if (chars === ' ' && start > 0) {
      // Handle heading with #
      if (text === '#') {
        const newContent = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: start,
          }),
          ''
        );
        const newEditorState = EditorState.push(
          editorState,
          newContent,
          'change-block-type'
        );
        setEditorState(RichUtils.toggleBlockType(newEditorState, 'header-one'));
        return 'handled';
      }
      // Handle bold with single *
      else if (text === '*') {
        const newContent = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: start,
          }),
          ''
        );
        const newEditorState = EditorState.push(
          editorState,
          newContent,
          'change-inline-style'
        );
        setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'BOLD'));
        return 'handled';
      }
      // Handle red color with **
      else if (text === '**') {
        const newContent = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: start,
          }),
          ''
        );
        const newEditorState = EditorState.push(
          editorState,
          newContent,
          'change-inline-style'
        );
        setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'RED'));
        return 'handled';
      }
      // Handle underline with ***
      else if (text === '***') {
        const newContent = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: start,
          }),
          ''
        );
        const newEditorState = EditorState.push(
          editorState,
          newContent,
          'change-inline-style'
        );
        setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE'));
        return 'handled';
      }
    }
    return 'not-handled';
  };

  const handleReturn = (e: React.KeyboardEvent) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    
    // Create a new block but maintain current styles
    const newContent = Modifier.splitBlock(currentContent, selection);
    let newEditorState = EditorState.push(
      editorState,
      newContent,
      'split-block'
    );

    // Only reset block type (for headings) but keep inline styles
    const newSelection = newEditorState.getSelection();
    newEditorState = EditorState.push(
      newEditorState,
      Modifier.setBlockType(newContent, newSelection, 'unstyled'),
      'change-block-type'
    );

    setEditorState(newEditorState);
    return 'handled';
  };

  const handleSave = () => {
    const content = editorState.getCurrentContent();
    localStorage.setItem('draftContent', JSON.stringify(convertToRaw(content)));
    toast("Content saved successfully!");
  };

  const styleMap = {
    'RED': {
      color: 'red',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    'BOLD': {
      fontWeight: 'bold',
      fontSize: '18px',
      color: 'black',
    },
    'UNDERLINE': {
      textDecoration: 'underline',
      fontSize: '18px',
      color: 'black',
      fontWeight: 'normal',
    },
  };

  const blockStyleFn = (contentBlock: any) => {
    const type = contentBlock.getType();
    if (type === 'header-one') {
      return 'header-style';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex-grow text-center">
          <h1 className="text-xs font-normal">Demo editor by &lt;Name&gt;</h1>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-1 bg-white border border-gray-300 rounded text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 transition-colors min-w-[80px]"
        >
          Save
        </button>
      </div>
      <div className="border border-[#99c5ff] rounded p-4 min-h-[500px] bg-white">
        <style>
          {`
            .header-style {
              font-size: 24px;
              font-weight: bold;
              color: black;
            }
          `}
        </style>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          handleReturn={handleReturn}
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFn}
        />
      </div>
    </div>
  );
};

export default TextEditor;
