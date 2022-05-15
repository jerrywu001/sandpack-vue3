import type { UnsubscribeFunction } from '@codesandbox/sandpack-client';
import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../../contexts/sandpackContext';
import { DefineComponent, defineComponent, PropType, ref, watch } from 'vue';
import { BackwardIcon, ForwardIcon, RefreshIcon } from '../../icons';

const splitUrl = (url: string): string[] => {
  const match = url.match(/(https?:\/\/.*?)\//);

  if (match && match[1]) {
    return [match[1], url.replace(match[1], '')];
  }

  return [url, '/'];
};

interface NavigatorProps {
  clientId?: string;
  onURLChange?: (newURL: string) => void;
}

export const Navigator = defineComponent({
  name: 'Navigator',
  inheritAttrs: true,
  props: {
    clientId: {
      type: String,
      required: false,
      default: undefined,
    },
    onURLChange: {
      type: Function as PropType<(newURL: string) => void>,
      required: false,
      default: undefined,
    },
  },
  setup(props: NavigatorProps, { slots }) {
    let unsub: UnsubscribeFunction;
    const baseUrl = ref<string>('');
    const { sandpack, dispatch, listen } = useSandpack();

    const relativeUrl = ref<string>(sandpack.startRoute ?? '/');

    const backEnabled = ref(false);
    const forwardEnabled = ref(false);

    const c = useClasser('sp');

    watch(
      () => props.clientId,
      () => {
        if (unsub) unsub();
        unsub = listen((message) => {
          if (message.type === 'urlchange') {
            const { url, back, forward } = message;

            const [newBaseUrl, newRelativeUrl] = splitUrl(url);

            baseUrl.value = newBaseUrl;
            relativeUrl.value = newRelativeUrl;
            backEnabled.value = back;
            forwardEnabled.value = forward;
          }
        }, props.clientId);
      },
      { immediate: true },
    );

    const handleInputChange = (e: any): void => {
      const path = e.target.value.startsWith('/')
        ? e.target.value
        : `/${e.target.value}`;

      relativeUrl.value = path;
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.code === 'Enter') {
        //  Enter
        e.preventDefault();
        e.stopPropagation();

        if (typeof props.onURLChange === 'function') {
          // @ts-ignore
          onURLChange(baseUrl.value + e.currentTarget.value);
        }
      }
    };

    const handleRefresh = (): void => {
      dispatch({ type: 'refresh' });
    };

    const handleBack = (): void => {
      dispatch({ type: 'urlback' });
    };

    const handleForward = (): void => {
      dispatch({ type: 'urlforward' });
    };

    return () => (
      <div class={c('navigator')}>
        <button
          aria-label="Go back one page"
          class={c('button', 'icon')}
          disabled={!backEnabled.value}
          onClick={handleBack}
          type="button"
        >
          <BackwardIcon />
        </button>
        <button
          aria-label="Go forward one page"
          class={c('button', 'icon')}
          disabled={!forwardEnabled.value}
          onClick={handleForward}
          type="button"
        >
          <ForwardIcon />
        </button>
        <button
          aria-label="Refresh page"
          class={c('button', 'icon')}
          onClick={handleRefresh}
          type="button"
        >
          <RefreshIcon />
        </button>

        <input
          aria-label="Current Sandpack URL"
          class={c('input')}
          name="Current Sandpack URL"
          onChange={handleInputChange}
          onKeydown={handleKeyDown}
          type="text"
          value={relativeUrl.value}
        />
      </div>
    );
  },
}) as DefineComponent<NavigatorProps>;
