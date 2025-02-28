/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {$createCodeNode} from '@lexical/code';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
} from 'lexical';
import {initializeUnitTest} from 'lexical/src/__tests__/utils';

// No idea why we suddenly need to do this, but it fixes the tests
// with latest experimental React version.
global.IS_REACT_ACT_ENVIRONMENT = true;

const editorConfig = Object.freeze({
  theme: {
    code: 'my-code-class',
  },
});

describe('LexicalCodeNode tests', () => {
  initializeUnitTest((testEnv) => {
    test('CodeNode.constructor', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const codeNode = $createCodeNode();
        expect(codeNode.getType()).toBe('code');
        expect(codeNode.getTextContent()).toBe('');
      });
      expect(() => $createCodeNode()).toThrow();
    });

    test('CodeNode.createDOM()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const codeNode = $createCodeNode();
        expect(codeNode.createDOM(editorConfig).outerHTML).toBe(
          '<code class="my-code-class" spellcheck="false"></code>',
        );
        expect(codeNode.createDOM({theme: {}}).outerHTML).toBe(
          '<code spellcheck="false"></code>',
        );
      });
    });

    test('CodeNode.updateDOM()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const newCodeNode = $createCodeNode();
        const codeNode = $createCodeNode();
        const domElement = codeNode.createDOM({theme: {}});
        expect(domElement.outerHTML).toBe('<code spellcheck="false"></code>');
        const result = newCodeNode.updateDOM(codeNode, domElement);
        expect(result).toBe(false);
        expect(domElement.outerHTML).toBe('<code spellcheck="false"></code>');
      });
    });

    test.skip('CodeNode.insertNewAfter()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const root = $getRoot();
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode('foo');
        paragraphNode.append(textNode);
        root.append(paragraphNode);
        textNode.select(0, 0);
        const selection = $getSelection();
        expect(selection).toEqual({
          anchorKey: '_2',
          anchorOffset: 0,
          dirty: true,
          focusKey: '_2',
          focusOffset: 0,
          needsSync: false,
        });
      });
      expect(testEnv.outerHTML).toBe(
        '<div contenteditable="true" style="user-select: text; white-space: pre-wrap; word-break: break-word;" data-lexical-editor="true"><p dir="ltr"><span>foo</span></p></div>',
      );
      await editor.update(() => {
        const codeNode = $createCodeNode();
        const selection = $getSelection();
        codeNode.insertNewAfter(selection);
      });
    });

    test('$createCodeNode()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const codeNode = $createCodeNode();
        const createdCodeNode = $createCodeNode();
        expect(codeNode.__type).toEqual(createdCodeNode.__type);
        expect(codeNode.__parent).toEqual(createdCodeNode.__parent);
        expect(codeNode.__src).toEqual(createdCodeNode.__src);
        expect(codeNode.__altText).toEqual(createdCodeNode.__altText);
        expect(codeNode.__key).not.toEqual(createdCodeNode.__key);
      });
    });
  });
});
