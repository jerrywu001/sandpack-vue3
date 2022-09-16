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
        top: '1em',
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
      onClick={() => sandpack.resetFile(sandpack.activeFile)}
      style={{
        background: 'none',
        border: 'none',
        position: 'absolute',
        right: '1em',
        top: '1em',
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
  let { size } = theme.font;
  let { lineHeight } = theme.font;
  size = size.includes('px') ? size : `${size}px`;
  lineHeight = lineHeight.includes('px') ? lineHeight : `${lineHeight}px`;

  return (
    <textarea
      onChange={(evt: any) => updateCode(evt.target.value)}
      style={{
        width: '400px',
        height: '200px',
        padding: '8px',
        fontFamily: theme.font.mono,
        fontSize: size,
        background: theme.colors.surface1,
        border: `1px solid ${theme.colors.surface2}`,
        color: theme.colors.base,
        lineHeight,
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
