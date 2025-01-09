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
      } else if (text === '*') {
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
      } else if (text === '**') {
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
      } else if (text === '***') {
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

  const handleSave = () => {
    const content = editorState.getCurrentContent();
    localStorage.setItem('draftContent', JSON.stringify(convertToRaw(content)));
    toast("Content saved successfully!");
  };

  const styleMap = {
    'RED': {
      color: '#FF0000',
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-normal">Demo editor by &lt;Name&gt;</h1>
        <button
          onClick={handleSave}
          className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
        >
          Save
        </button>
      </div>
      <div className="border border-blue-200 rounded p-4 min-h-[500px] bg-white">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default TextEditor;