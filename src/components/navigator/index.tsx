import { BackwardIcon, ForwardIcon, RefreshIcon } from '../../icons';
import { buttonClassName, iconClassName } from '../../styles/shared';
import { classNames } from '../../utils/classNames';
import { css, THEME_PREFIX } from '../../styles';
import {
  DefineComponent,
  defineComponent,
  onBeforeUnmount,
  onUnmounted,
  PropType,
  ref,
  watch,
} from 'vue';
import { useClasser } from 'code-hike-classer-vue3';
import { useSandpack } from '../../contexts/sandpackContext';
import type { UnsubscribeFunction } from '@codesandbox/sandpack-client';

const navigatorClassName = css({
  display: 'flex',
  alignItems: 'center',
  height: '$layout$headerHeight',
  borderBottom: '1px solid $colors$surface2',
  padding: '$space$3 $space$2',
  background: '$colors$surface1',
});

const inputClassName = css({
  backgroundColor: '$colors$surface2',
  color: '$colors$clickable',
  padding: '$space$1 $space$3',
  borderRadius: '99999px',
  border: '1px solid $colors$surface2',
  height: '24px',
  lineHeight: '24px',
  fontSize: 'inherit',
  outline: 'none',
  flex: 1,
  marginLeft: '$space$4',
  width: '0',
  transition: 'background $transitions$default',

  '&:hover': {
    backgroundColor: '$colors$surface3',
  },

  '&:focus': {
    backgroundColor: '$surface1',
    border: '1px solid $colors$accent',
    color: '$colors$base',
  },
});

const splitUrl = (url: string): string[] => {
  const match = url.match(/(https?:\/\/.*?)\//);

  if (match && match[1]) {
    return [match[1], url.replace(match[1], '')];
  }

  return [url, '/'];
};

interface NavigatorProps {
  clientId: string;
  onURLChange?: (newURL: string) => void;
}

export const Navigator = defineComponent({
  name: 'Navigator',
  props: {
    clientId: {
      type: String,
      required: true,
    },
    onURLChange: {
      type: Function as PropType<(newURL: string) => void>,
      required: false,
      default: undefined,
    },
  },
  setup(props: NavigatorProps, { attrs }) {
    let unsub: UnsubscribeFunction;
    const baseUrl = ref<string>('');
    const { sandpack, dispatch, listen } = useSandpack();

    const relativeUrl = ref<string>(sandpack.startRoute ?? '/');

    const backEnabled = ref(false);
    const forwardEnabled = ref(false);

    const c = useClasser(THEME_PREFIX);

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
          // eslint-disable-next-line no-unsafe-optional-chaining
          props.onURLChange(baseUrl.value + e.currentTarget?.value);
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

    const buttonsClassNames = classNames(
      c('button', 'icon'),
      buttonClassName,
      iconClassName,
      css({
        minWidth: '$space$6',
        justifyContent: 'center',
      }),
    );

    onBeforeUnmount(() => {
      if (unsub) unsub();
    });

    onUnmounted(() => {
      if (unsub) unsub();
    });

    return () => (
      <div
        class={classNames(c('navigator'), navigatorClassName, attrs?.class || '')}
      >
        <button
          aria-label="Go back one page"
          class={buttonsClassNames}
          disabled={!backEnabled.value}
          onClick={handleBack}
          type="button"
        >
          <BackwardIcon />
        </button>
        <button
          aria-label="Go forward one page"
          class={buttonsClassNames}
          disabled={!forwardEnabled.value}
          onClick={handleForward}
          type="button"
        >
          <ForwardIcon />
        </button>
        <button
          aria-label="Refresh page"
          class={buttonsClassNames}
          onClick={handleRefresh}
          type="button"
        >
          <RefreshIcon />
        </button>

        <input
          aria-label="Current Sandpack URL"
          class={classNames(c('input'), inputClassName)}
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
