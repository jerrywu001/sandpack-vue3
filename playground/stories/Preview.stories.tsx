/* eslint-disable no-alert */
import {
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  PreviewProps,
  useSandpack,
  SandpackPreviewRef,
} from '@codesandbox/sandpack-vue3';
import { Story } from '@storybook/vue3';
import { ref, watch } from 'vue';

export default {
  title: 'components/Preview',
  component: SandpackPreview,
};

const code = `export default function Kitten() {
  return (
    <>
      <img src="https://placekitten.com/200/250" alt="Kitten" />
      <img src="https://placekitten.com/200/250" alt="Kitten" />
      <img src="https://placekitten.com/200/250" alt="Kitten" />
    </>
  );
}`;

export const Component = () => (
  <SandpackProvider
    customSetup={{
      files: {
        '/App.js': code,
      },
    }}
    template="react"
  >
    <SandpackLayout>
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);

export const Viewport: Story<PreviewProps> = (args) => (
  <SandpackProvider
    customSetup={{
      files: {
        '/App.js': code,
      },
    }}
    template="react"
  >
    <SandpackThemeProvider>
      <div style={{ border: '1px solid grey', display: 'inline-block' }}>
        <SandpackPreview {...args} />
      </div>
    </SandpackThemeProvider>
  </SandpackProvider>
);

Viewport.argTypes = {
  viewportSize: {
    control: {
      type: 'select',
      options: [
        'iPhone X',
        'iPad',
        'Pixel 2',
        'Moto G4',
        'Surface Duo',
        'auto',
      ],
    },
  },
};

export const WithNavigator = () => (
  <SandpackProvider
    customSetup={{
      files: {
        '/App.js': code,
      },
    }}
    template="react"
  >
    <SandpackLayout>
      <SandpackPreview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);

export const AutoResize = () => (
  <SandpackProvider
    customSetup={{
      files: {
        '/App.js': code,
      },
    }}
    template="react"
  >
    <SandpackThemeProvider>
      <SandpackPreview />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const AdditionalButtons = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackPreview
        actionsChildren={
          <button
            class="sp-button"
            onClick={(): void => window.alert('Bug reported!')}
            style={{ padding: 'var(--sp-space-1) var(--sp-space-3)' }}
          >
            Report bug
          </button>
        }
      />
      <SandpackCodeEditor />
    </SandpackLayout>
  </SandpackProvider>
);

export const AdditionalContent = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackPreview>
        <div style={{ background: 'lightgreen' }}>content after iframe</div>
      </SandpackPreview>
      <SandpackCodeEditor />
    </SandpackLayout>
  </SandpackProvider>
);

const SandpackClient = () => { // TODO: n
  const { sandpack } = useSandpack();
  const previewRef = ref<SandpackPreviewRef>();

  watch(sandpack, () => {
    const client = previewRef.value?.getClient();
    const clientId = previewRef.value?.clientId;

    if (client && clientId) {
      console.log(client);
      console.log(sandpack.clients[clientId]);
    }
  });

  return <SandpackPreview ref={previewRef} />;
};

export const GetClient = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackClient />
      <SandpackCodeEditor />
    </SandpackLayout>
  </SandpackProvider>
);
