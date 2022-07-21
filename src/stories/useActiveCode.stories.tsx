import { SandpackLayout, SandpackPreview, SandpackProvider, useActiveCode } from 'codesandbox-sandpack-vue3';

export default {
  title: 'hooks/useActiveCode',
};

const CustomEditor = () => {
  const { code, updateCode } = useActiveCode();
  return (
    <textarea
      style={{ height: '300px', width: '300px' }}
      onKeyup={(evt: any) => updateCode(evt.target?.value)}
    >
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
