/* eslint-disable no-alert */
import {
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  PreviewProps,
} from 'codesandbox-sandpack-vue3';
import { Story } from '@storybook/vue3';
import { SandpackClient } from './widgets/SandpackClient';

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
    files={{
      '/App.js': code,
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
    files={{
      '/App.js': code,
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

export const WithNavigator = () => (
  <SandpackProvider
    files={{
      '/App.js': code,
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
    files={{
      '/App.js': code,
    }}
    template="react"
  >
    <SandpackThemeProvider>
      <SandpackPreview />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const AdditionalButtons = () => (
  // For actionsChildren: slot has a higher priority than props
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackPreview
        v-slots={{
          actionsChildren: () => <button class="sp-button">just a button</button>,
        }}
      />
      <SandpackPreview>
        {{
          actionsChildren: () => <button class="sp-button">just a button (2)</button>,
        }}
      </SandpackPreview>
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

export const GetClient = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackClient />
      <SandpackCodeEditor />
    </SandpackLayout>
  </SandpackProvider>
);
