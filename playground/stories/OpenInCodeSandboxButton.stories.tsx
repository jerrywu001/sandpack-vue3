import {
  OpenInCodeSandboxButton,
  SandpackCodeEditor,
  SandpackProvider,
  SandpackThemeProvider,
  UnstyledOpenInCodeSandboxButton,
} from '@codesandbox/sandpack-vue3';

export default {
  title: 'components/OpenInCodeSandboxButton',
  component: OpenInCodeSandboxButton,
};

export const Main = (): JSX.Element => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <SandpackCodeEditor />
      <OpenInCodeSandboxButton />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const Unstyled = (): JSX.Element => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <SandpackCodeEditor />
      <UnstyledOpenInCodeSandboxButton>
        Open in CodeSandbox
      </UnstyledOpenInCodeSandboxButton>
    </SandpackThemeProvider>
  </SandpackProvider>
);
