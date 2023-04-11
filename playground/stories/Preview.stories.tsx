/* eslint-disable no-alert */
import {
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  PreviewProps,
} from 'sandpack-vue3';
import { Story } from '@storybook/vue3';
import { SandpackClient } from './widgets/SandpackClient';
import type { StyleValue } from 'vue';

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
      <div style={{ border: '1px solid grey', display: 'inline-block' } as StyleValue}>
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

export const MultipleRoutePreviews = () => (
  <SandpackProvider
    files={{
      '/pages/index.js': 'export default () => "Home"',
      '/pages/about.js': 'export default () => "About"',
      '/pages/careers.js': 'export default () => "Careers"',
    }}
    options={{ startRoute: '/' }}
    template="nextjs"
  >
    <SandpackLayout>
      <SandpackPreview showNavigator />
      <SandpackPreview startRoute="/about" showNavigator />
      <SandpackPreview startRoute="/careers" showNavigator />
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
        style={{ minWidth: '320px' } as StyleValue}
        v-slots={{
          actionsChildren: () => <button class="sp-button">just a button</button>,
        }}
      />
      <SandpackPreview style={{ minWidth: '320px' } as StyleValue}>
        {{
          actionsChildren: () => <button class="sp-button">just a button (2)</button>,
        }}
      </SandpackPreview>
      <SandpackPreview
        style={{ minWidth: '320px' } as StyleValue}
        actionsChildren={
          <button
            class="sp-button"
            onClick={(): void => window.alert('Bug reported!')}
            style={{ padding: 'var(--sp-space-1) var(--sp-space-3)' } as StyleValue}
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
        <div style={{ background: 'lightgreen' } as StyleValue}>content after iframe</div>
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
