import '@vue/runtime-core';
import {
  Sandpack,
  SandpackLayout,
  SandpackConsole,
  SandpackTests,
  CodeEditor,
  SandpackProvider,
  ErrorOverlay,
  LoadingOverlay,
  SandpackCodeEditor,
  SandpackCodeViewer,
  SandpackPreview,
  SandpackStack,
  SandpackTranspiledCode,
  SandpackFileExplorer,
} from 'sandpack-vue3';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Sandpack: typeof Sandpack;
    SandpackLayout: typeof SandpackLayout;
    SandpackConsole: typeof SandpackConsole;
    SandpackTests: typeof SandpackTests;
    CodeEditor: typeof CodeEditor;
    SandpackProvider: typeof SandpackProvider;
    ErrorOverlay: typeof ErrorOverlay;
    LoadingOverlay: typeof LoadingOverlay;
    SandpackCodeEditor: typeof SandpackCodeEditor;
    SandpackCodeViewer: typeof SandpackCodeViewer;
    SandpackPreview: typeof SandpackPreview;
    SandpackStack: typeof SandpackStack;
    SandpackTranspiledCode: typeof SandpackTranspiledCode;
    SandpackFileExplorer: typeof SandpackFileExplorer;
  }
}

export {};
