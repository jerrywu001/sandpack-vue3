import {
  OpenInCodeSandboxButton,
  SandpackCodeEditor,
  SandpackProvider,
  UnstyledOpenInCodeSandboxButton,
} from 'sandpack-vue3';

export default {
  title: 'components/OpenInCodeSandboxButton',
  component: OpenInCodeSandboxButton,
};

export const Main = (): JSX.Element => (
  <SandpackProvider>
    <SandpackCodeEditor />
    <OpenInCodeSandboxButton />
  </SandpackProvider>
);

export const Unstyled = (): JSX.Element => (
  <SandpackProvider>
    <SandpackCodeEditor />
    <UnstyledOpenInCodeSandboxButton>
      Open in CodeSandbox
    </UnstyledOpenInCodeSandboxButton>
  </SandpackProvider>
);
