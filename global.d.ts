import '@vue/runtime-core';
import {
  Sandpack,
  SandpackLayout,
  CodeEditor,
  SandpackProvider,
  ErrorOverlay,
  LoadingOverlay,
  SandpackCodeEditor,
  SandpackCodeViewer,
  SandpackPreview,
  SandpackRunner,
  SandpackStack,
  SandpackTranspiledCode,
} from 'codesandbox-sandpack-vue3';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Sandpack: typeof Sandpack;
    SandpackLayout: typeof SandpackLayout;
    SandpackProvider: typeof SandpackProvider;
    CodeEditor: typeof CodeEditor;
    ErrorOverlay: typeof ErrorOverlay;
    LoadingOverlay: typeof LoadingOverlay;
    SandpackCodeEditor: typeof SandpackCodeEditor;
    SandpackCodeViewer: typeof SandpackCodeViewer;
    SandpackPreview: typeof SandpackPreview;
    SandpackRunner: typeof SandpackRunner;
    SandpackStack: typeof SandpackStack;
    SandpackTranspiledCode: typeof SandpackTranspiledCode;
  }
}

export {};
