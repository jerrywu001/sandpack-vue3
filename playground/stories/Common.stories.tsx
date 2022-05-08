import * as OpenOn from '@codesandbox/sandpack-vue3/common/OpenInCodeSandboxButton';
import {
  ErrorOverlay,
  LoadingOverlay,
  RunButton,
  SandpackLayout,
  SandpackProvider,
  SandpackStack,
} from '@codesandbox/sandpack-vue3';
import { Provider } from './Provider';

export default {
  title: 'components/Common',
};

export const OpenInCodeSandboxButton = () => (
  <Provider>
    <OpenOn.OpenInCodeSandboxButton />
  </Provider>
);

export const UnstyledOpenInCodeSandboxButton = () => (
  <SandpackProvider>
    <OpenOn.UnstyledOpenInCodeSandboxButton>
      Open on CodeSandbox
    </OpenOn.UnstyledOpenInCodeSandboxButton>
  </SandpackProvider>
);

export const ErrorOverlayStory = () => (
  <Provider>
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <ErrorOverlay>Error message</ErrorOverlay>
    </div>
  </Provider>
);

export const SandpackLayoutStory = () => (
  <SandpackProvider>
    <SandpackLayout>Layout</SandpackLayout>
  </SandpackProvider>
);

export const LoadingOverlayStory = () => (
  <Provider>
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <LoadingOverlay />
    </div>
  </Provider>
);

export const RunButtonStory = () => (
  <Provider>
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <RunButton />
    </div>
  </Provider>
);

export const StackStory = () => (
  <Provider>
    <SandpackStack>
      <div style={{ width: '100px', height: '100px', backgroundColor: 'red' }} />
      <div style={{ width: '100px', height: '100px', backgroundColor: 'blue' }} />
    </SandpackStack>
  </Provider>
);
