import { nextTick, defineComponent, DefineComponent, Fragment, PropType, ref, watch } from 'vue';
import { SandpackStack } from '../../common';
import { css, THEME_PREFIX } from '../../styles';
import { classNames } from '../../utils/classNames';
import { CodeEditor } from '../code-editor';

import { Button } from './Button';
import { Header } from './Header';
import { useSandpackConsole } from './useSandpackConsole';
import { fromConsoleToString } from './utils/fromConsoleToString';
import { getType, type SandpackConsoleData } from './utils/getType';

interface SandpackConsoleProps {
  clientId?: string;
  showHeader?: boolean;
  showSyntaxError?: boolean;
  maxMessageCount?: number;
  onLogsChange?: (logs: SandpackConsoleData) => void;
}

/**
 * `SandpackConsole` is a Sandpack devtool that allows printing
 * the console logs from a Sandpack client. It is designed to be
 * a light version of a browser console, which means that it's
 * limited to a set of common use cases you may encounter when coding.
 */
export const SandpackConsole = defineComponent({
  name: 'SandpackConsole',
  props: {
    onLogsChange: {
      type: Function as PropType<(logs: SandpackConsoleData) => void>,
      required: false,
      default: undefined,
    },
    clientId: {
      type: String,
      required: false,
      default: undefined,
    },
    showHeader: {
      type: Boolean,
      required: false,
      default: true,
    },
    showSyntaxError: {
      type: Boolean,
      required: false,
      default: false,
    },
    maxMessageCount: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  setup(props: SandpackConsoleProps, { attrs }) {
    const { logs, reset } = useSandpackConsole({
      clientId: props.clientId,
      maxMessageCount: props.maxMessageCount,
      showSyntaxError: props.showSyntaxError,
    });
    const wrapperRef = ref<HTMLDivElement>();

    watch(
      [
        () => props.onLogsChange,
        wrapperRef,
        logs,
      ],
      () => {
        if (props.onLogsChange) {
          props.onLogsChange(logs.value);
        }

        nextTick(() => {
          setTimeout(() => {
            if (wrapperRef.value) {
              wrapperRef.value.scrollTop = wrapperRef.value.scrollHeight * 2;
            }
          });
        });
      },
    );

    return () => (
      <SandpackStack
        {...props}
        class={classNames(
          css({ height: '100%', background: '$surface1' }),
          `${THEME_PREFIX}-console`,
          attrs?.class || '',
        )}
      >
        {props.showHeader && <Header />}
        <div
          ref={wrapperRef}
          class={classNames(
            css({ overflow: 'auto', scrollBehavior: 'smooth' }),
          )}
        >
          {logs.value.map(({ data, id, method }, logIndex, references) => {
            if (!data) return null;

            if (Array.isArray(data)) {
              return (
                <Fragment key={id}>
                  {data.map((msg, msgIndex) => {
                    const fixReferences = references.slice(
                      logIndex,
                      references.length,
                    );

                    return (
                      <div
                        key={`${id}-${msgIndex}`}
                        class={classNames(
                          consoleItemClassName({ variant: getType(method) }),
                        )}
                      >
                        <CodeEditor
                          code={
                            method === 'clear'
                              ? (msg as string)
                              : fromConsoleToString(msg, fixReferences)
                          }
                          fileType="js"
                          initMode="user-visible"
                          showReadOnly={false}
                          readOnly
                          wrapContent
                        />
                      </div>
                    );
                  })}
                </Fragment>
              );
            }

            return null;
          })}
        </div>

        <Button onClick={reset} />
      </SandpackStack>
    );
  },
}) as DefineComponent<SandpackConsoleProps>;

const consoleItemClassName = css({
  width: '100%',
  padding: '$space$3 $space$2',
  fontSize: '.85em',
  position: 'relative',

  '&:not(:first-child):after': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: '$colors$surface3',
  },

  /**
   * Editor reset
   */
  '.sp-cm': {
    padding: 0,
  },

  '.cm-editor': {
    background: 'none',
  },

  '.cm-content': {
    padding: 0,
  },

  [`.${THEME_PREFIX}-pre-placeholder`]: {
    margin: '0 !important',
    fontSize: '1em',
  },

  variants: {
    variant: {
      error: {
        color: '$colors$error',
        background: '$colors$errorSurface',

        '&:not(:first-child):after': {
          background: '$colors$error',
          opacity: 0.07,
        },
      },
      warning: {
        color: '$colors$warning',
        background: '$colors$warningSurface',

        '&:not(:first-child):after': {
          background: '$colors$warning',
          opacity: 0.07,
        },
      },
      clear: {
        fontStyle: 'italic',
      },
      info: {},
    },
  },
});
