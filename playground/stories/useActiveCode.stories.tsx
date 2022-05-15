import { SandpackLayout, SandpackPreview, SandpackProvider, useActiveCode } from '@codesandbox/sandpack-vue3';

export default {
  title: 'hooks/useActiveCode',
};

const CustomEditor = () => {
  const { code, updateCode } = useActiveCode();
  return (
    <textarea onChange={(evt: any): void => updateCode(evt.target?.value)}>
      {code.value}
    </textarea>
  );
};

export const CustomCodeEditor = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <CustomEditor />
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);
