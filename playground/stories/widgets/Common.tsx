import {
  UnstyledOpenInCodeSandboxButton,
  useActiveCode,
  useSandpack,
  useSandpackNavigation,
  useSandpackTheme,
} from 'codesandbox-sandpack-vue3';
import { defineComponent, ref } from 'vue';

export const CustomRefreshButton = () => {
  const { refresh } = useSandpackNavigation();

  return (
    <button onClick={() => refresh()} type="button">
      Refresh Sandpack
    </button>
  );
};

export const ResetButtonComp = () => {
  const { sandpack } = useSandpack();

  return (
    <button
       class="sp-tab-button"
      onClick={sandpack.resetAllFiles}
      style={{
        background: 'none',
        border: 'none',
        position: 'absolute',
        right: '1em',
      }}
    >
      Reset all file
    </button>
  );
};

export const ResetCurrentFileButton = () => {
  const { sandpack } = useSandpack();

  return (
    <button
       class="sp-tab-button"
      onClick={() => sandpack.resetFile(sandpack.activePath)}
      style={{
        background: 'none',
        border: 'none',
        position: 'absolute',
        right: '1em',
      }}
    >
      Reset current files
    </button>
  );
};

export const CustomOpenInCSB = () => (
  <UnstyledOpenInCodeSandboxButton>
    Open in CodeSandbox
  </UnstyledOpenInCodeSandboxButton>
);

export const CustomCodeEditor = () => {
  const { code, updateCode } = useActiveCode();
  const { theme } = useSandpackTheme();

  return (
    <textarea
      onChange={(evt: any) => updateCode(evt.target.value)}
      style={{
        width: '400px',
        height: '200px',
        padding: '8px',
        fontFamily: theme.typography.monoFont,
        fontSize: theme.typography.fontSize,
        background: theme.palette.defaultBackground,
        border: `1px solid ${theme.palette.inactiveText}`,
        color: theme.palette.activeText,
        lineHeight: theme.typography.lineHeight,
      }}
    >
      {code.value}
    </textarea>
  );
};

export const ListenerIframeMessage = defineComponent({
  name: 'JustIframeStory',
  inheritAttrs: true,
  setup() {
    const text = ref('Hello World');
    const { sandpack } = useSandpack();

    const sender = () => {
      Object.values(sandpack.clients).forEach((client) => {
        // @ts-ignore
        client.iframe.contentWindow.postMessage(text.value, '*');
      });
    };

    return () => (
      <>
        <button onClick={sender}>Send message</button>
        <input type="text" value={text.value} onChange={(e) => {
          // @ts-ignore
          text.value = e.currentTarget.value;
        }} />
      </>
    );
  },
});

export const VIEWPORTS = ['Pixel 2', 'Moto G4', 'iPhone X'];
