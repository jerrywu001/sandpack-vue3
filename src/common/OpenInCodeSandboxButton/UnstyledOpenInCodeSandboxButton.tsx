import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import LZString from 'lz-string';
import { useSandpack } from '../../contexts/sandpackContext';
import { defineComponent, onMounted, ref, watch } from 'vue';
import type { SandboxEnvironment } from '../../types';

const getParameters = (parameters: Record<string, any>): string => LZString.compressToBase64(JSON.stringify(parameters))
  .replace(/\+/g, '-') // Convert '+' to '-'
  .replace(/\//g, '_') // Convert '/' to '_'
  .replace(/=+$/, ''); /* Remove ending '=' */

const CSB_URL = 'https://codesandbox.io/api/v1/sandboxes/define';

const getFileParameters = (
  files: SandpackBundlerFiles,
  environment?: SandboxEnvironment,
): string => {
  type NormalizedFiles = Record<
  string,
  {
    content: string;
    isBinary: boolean;
  }
  >;

  const normalizedFiles = Object.keys(files).reduce((prev, next) => {
    const fileName = next.replace('/', '');
    const value = {
      content: files[next].code,
      isBinary: false,
    };

    return { ...prev, [fileName]: value };
  }, {} as NormalizedFiles);

  return getParameters({
    files: normalizedFiles,
    ...(environment ? { template: environment } : null),
  });
};

export const UnstyledOpenInCodeSandboxButton = defineComponent({
  name: 'UnstyledOpenInCodeSandboxButton',
  inheritAttrs: true,
  setup(_, { slots }) {
    let timer: NodeJS.Timeout;
    const { sandpack } = useSandpack();
    const formRef = ref<HTMLFormElement>();
    const paramsValues = ref({} as URLSearchParams);

    watch([
      () => sandpack.activePath,
      () => sandpack.environment,
      () => sandpack.files,
    ], () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const params = getFileParameters(sandpack.files, sandpack.environment);

        const searchParams = new URLSearchParams({
          parameters: params,
          query: new URLSearchParams({
            file: sandpack.activePath,
            'from-sandpack': 'true',
          }).toString(),
        });

        paramsValues.value = searchParams;
      }, 600);
    }, { deep: true, immediate: true });

    onMounted(() => {
      sandpack.openInCSBRegisteredRef = true;
    });

    return () => (paramsValues.value?.get?.('parameters')?.length ?? 0) > 1500 ? (
      <button
        onClick={(): void => formRef.value?.submit()}
        title="Open in CodeSandbox"
      >
        <form ref={formRef} action={CSB_URL} method="POST" target="_blank">
          {Array.from(
            paramsValues as unknown as Array<[string, string]>,
            ([key, value]) => (
              <input key={key} name={key} type="hidden" value={value} />
            ),
          )}
        </form>
        { slots.default ? slots.default() : null }
      </button>
    ) : (
      <a
        href={`${CSB_URL}?${paramsValues.value?.toString()}`}
        rel="noreferrer noopener"
        target="_blank"
        title="Open in CodeSandbox"
      >
        { slots.default ? slots.default() : null }
      </a>
    );
  },
});
