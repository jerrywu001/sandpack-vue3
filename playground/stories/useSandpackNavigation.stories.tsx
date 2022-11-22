import { SandpackLayout, SandpackPreview, SandpackProvider, useSandpackNavigation } from 'sandpack-vue3';

export default {
  title: 'hooks/useSandpackNavigation',
};

const CustomRefreshButton = () => {
  const { refresh } = useSandpackNavigation();
  return (
    <button onClick={refresh} type="button">
      Refresh
    </button>
  );
};

export const CustomCodeEditor = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackPreview showRefreshButton={false} />
    </SandpackLayout>
    <CustomRefreshButton />
  </SandpackProvider>
);
