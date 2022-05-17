import {
  CodeEditor,
  SandpackCodeEditor,
  SandpackCodeViewer,
  SandpackPreview,
  SandpackTranspiledCode,
} from './components';
import { ErrorOverlay, LoadingOverlay, SandpackLayout, SandpackStack } from './common';
import { Sandpack, SandpackRunner } from './presets';
import { SandpackProvider } from './contexts/sandpackContext';
import type { Plugin } from 'vue';

export function SanpackPlugin(): Plugin {
  return {
    install(app) {
      app.component('Sandpack', Sandpack);
      app.component('SandpackLayout', SandpackLayout);
      app.component('SandpackProvider', SandpackProvider);
      app.component('ErrorOverlay', ErrorOverlay);
      app.component('LoadingOverlay', LoadingOverlay);
      app.component('CodeEditor', CodeEditor);
      app.component('SandpackCodeEditor', SandpackCodeEditor);
      app.component('SandpackCodeViewer', SandpackCodeViewer);
      app.component('SandpackPreview', SandpackPreview);
      app.component('SandpackRunner', SandpackRunner);
      app.component('SandpackStack', SandpackStack);
      app.component('SandpackTranspiledCode', SandpackTranspiledCode);
    },
  };
}
