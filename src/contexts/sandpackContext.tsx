/* eslint-disable @typescript-eslint/no-unused-expressions */
import isEqual from 'lodash.isequal';
import { convertedFilesToBundlerFiles, getSandpackStateFromProps } from '../utils/sandpackUtils';
import { SandpackFiles, useContext } from '..';
import { extractErrorDetails, SandpackClient } from '@codesandbox/sandpack-client';
import { generateRandomId } from '../utils/stringUtils';
import {
  DefineComponent,
  defineComponent,
  InjectionKey,
  onUnmounted,
  reactive,
  Ref,
  ref,
  watch,
  provide,
  PropType,
  onMounted,
} from 'vue';
import type {
  BundlerState,
  ListenerFunction,
  SandpackBundlerFiles,
  SandpackError,
  SandpackMessage,
  UnsubscribeFunction,
  ReactDevToolsMode,
  SandpackLogLevel,
} from '@codesandbox/sandpack-client';
import type {
  SandpackContext,
  SandboxEnvironment,
  FileResolver,
  SandpackStatus,
  EditorState,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackInitMode,
  SandpackClientListen,
  SandpackState,
  SandpackClientDispatch,
} from '../types';

const BUNDLER_TIMEOUT = 30000; // 30 seconds timeout for the bundler to respond.

export interface UseSandpackReturnType {
  sandpack: SandpackState;
  dispatch: SandpackClientDispatch;
  listen: SandpackClientListen;
}

export interface SandpackProviderState {
  files: SandpackBundlerFiles;
  environment?: SandboxEnvironment;
  activePath: string;
  openPaths: string[];
  startRoute?: string;
  bundlerState?: BundlerState;
  error: SandpackError | null;
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
  renderHiddenIframe: boolean;
  initMode: SandpackInitMode;
  reactDevTools?: ReactDevToolsMode;
}

export interface SandpackProviderProps {
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;

  // editor state (override values)
  activePath?: string;
  openPaths?: string[];

  // execution and recompile
  recompileMode?: 'immediate' | 'delayed';
  recompileDelay?: number;
  autorun?: boolean;

  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
  initModeObserverOptions?: IntersectionObserverInit;

  // bundler options
  bundlerURL?: string;
  logLevel?: SandpackLogLevel;
  startRoute?: string;
  skipEval?: boolean;
  fileResolver?: FileResolver;
  externalResources?: string[];
}

const SandpackStateContext: InjectionKey<SandpackContext> = Symbol('sandpackStateContext');

/**
 * SandpackProvider
 * Main context provider that should wraps your entire component.
 * Use * [`useSandpack`](/api/react/#usesandpack) hook, which gives you the entire context object to play with.
 */
const SandpackProvider = defineComponent({
  name: 'SandpackProvider',
  inheritAttrs: false,
  props: {
    template: {
      type: String as PropType<SandpackPredefinedTemplate>,
      required: false,
    },
    customSetup: {
      type: Object as PropType<SandpackSetup>,
      required: false,
    },

    // // editor state (override values)
    activePath: {
      type: String,
      required: false,
    },
    openPaths: {
      type: Array as PropType<string[]>,
      required: false,
    },

    // // execution and recompile
    recompileMode: {
      type: String as PropType<'immediate' | 'delayed'>,
      required: false,
      default: 'delayed',
    },
    recompileDelay: {
      type: Number,
      required: false,
      default: 500,
    },
    autorun: {
      type: Boolean,
      required: false,
      default: true,
    },
    initMode: {
      type: String as PropType<SandpackInitMode>,
      required: false,
    },
    initModeObserverOptions: {
      type: Object as PropType<IntersectionObserverInit>,
      required: false,
    },

    // // bundler options
    bundlerURL: {
      type: String,
      required: false,
    },
    logLevel: {
      type: Number as PropType<SandpackLogLevel>,
      required: false,
    },
    startRoute: {
      type: String,
      required: false,
    },
    skipEval: {
      type: Boolean,
      required: false,
      default: false,
    },
    fileResolver: {
      type: Object as PropType<FileResolver>,
      required: false,
    },
    externalResources: {
      type: Array as PropType<string[]>,
      required: false,
    },
  },
  // @ts-ignore
  setup(props: SandpackProviderProps, { slots }) {
    let debounceHook: number = 0;
    let timeoutHook: NodeJS.Timer | null = null;
    let initializeSandpackIframeHook: NodeJS.Timer | null = null;
    let intersectionObserver: IntersectionObserver;
    const preregisteredIframes: Record<string, HTMLIFrameElement> = {};
    const clients: Record<string, SandpackClient> = {};
    const unsubscribeQueuedListeners: Record<string, Record<string, UnsubscribeFunction>> = {};
    const queuedListeners: Record<string, Record<string, ListenerFunction>> = { global: {} };

    let unsubscribe: UnsubscribeFunction | undefined;

    const lazyAnchorRef = ref<HTMLDivElement>();

    const { activePath, openPaths, files, environment } = getSandpackStateFromProps(props);

    const data = reactive({
      renderHiddenIframe: false,
      reactDevTools: undefined,
    } as SandpackProviderState);

    const state = reactive({
      files,
      environment,
      openPaths,
      activePath,
      startRoute: props.startRoute,
      error: { message: '' } as SandpackError,
      bundlerState: undefined,
      status: props.autorun ? 'initial' : 'idle',
      editorState: 'pristine',
      initMode: props.initMode || 'lazy',
      clients,
      closeFile,
      deleteFile,
      dispatch: dispatchMessage,
      openInCSBRegisteredRef: false,
      errorScreenRegisteredRef: false,
      loadingScreenRegisteredRef: false,
      lazyAnchorRef: lazyAnchorRef as Ref<HTMLDivElement>,
      listen: addListener,
      openFile,
      registerBundler,
      resetAllFiles,
      resetFile,
      runSandpack,
      setActiveFile,
      unregisterBundler,
      updateCurrentFile,
      updateFile,
      registerReactDevTools,
    } as Record<string, any>);

    provide(SandpackStateContext, state);

    function handleMessage(msg: SandpackMessage) {
      if (timeoutHook) {
        clearTimeout(timeoutHook);
      }

      if (msg.type === 'state') {
        state.bundlerState = msg.state;
      } else if (msg.type === 'done' && !msg.compilatonError) {
        state.error = { message: '' };
      } else if (msg.type === 'action' && msg.action === 'show-error') {
        state.error = extractErrorDetails(msg);
      } else if (
        msg.type === 'action' &&
          msg.action === 'notification' &&
          msg.notificationType === 'error'
      ) {
        state.error = { message: msg.title };
      }
    }

    function registerReactDevTools(value: ReactDevToolsMode) {
      data.reactDevTools = value;
    }

    function updateCurrentFile(code: string) {
      updateFile(state.activePath, code);
    }

    function updateFile(pathOrFiles: string | SandpackFiles, code?: string) {
      if (typeof pathOrFiles === 'string' && code) {
        if (code === state.files[pathOrFiles]?.code) {
          return;
        }

        state.files = { ...state.files, [pathOrFiles]: { code } };
      } else if (typeof pathOrFiles === 'object') {
        state.files = { ...state.files, ...convertedFilesToBundlerFiles(pathOrFiles) };
      }
      updateClients();
    }

    function updateClients() {
      const { status: latestStatus } = state;
      const { recompileMode, recompileDelay } = props;

      if (latestStatus !== 'running') {
        return;
      }

      if (recompileMode === 'immediate') {
        Object.values(clients).forEach((client) => {
          client.updatePreview({
            files: state.files,
          });
        });
      }

      if (recompileMode === 'delayed') {
        window.clearTimeout(debounceHook);
        debounceHook = window.setTimeout(() => {
          Object.values(clients).forEach((client) => {
            client.updatePreview({
              files: state.files,
            });
          });
        }, recompileDelay);
      }
    }

    function initializeSandpackIframe() {
      if (!props.autorun) {
        return;
      }

      const observerOptions = props.initModeObserverOptions ?? {
        rootMargin: '1000px 0px',
      };

      if (intersectionObserver && lazyAnchorRef.value) {
        intersectionObserver?.unobserve(lazyAnchorRef.value);
      }

      if (lazyAnchorRef.value && state.initMode === 'lazy') {
        // If any component registerd a lazy anchor ref component, use that for the intersection observer
        intersectionObserver = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
            initializeSandpackIframeHook = setTimeout(() => {
              runSandpack();
            }, 50);

            if (lazyAnchorRef.value) {
              intersectionObserver?.unobserve(lazyAnchorRef.value);
            }
          }
        }, observerOptions);

        intersectionObserver?.observe(lazyAnchorRef.value);
      } else if (
        lazyAnchorRef.value &&
        state.initMode === 'user-visible'
      ) {
        intersectionObserver = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
            initializeSandpackIframeHook = setTimeout(() => {
              runSandpack();
            }, 50);
          } else {
            if (initializeSandpackIframeHook) {
              clearTimeout(initializeSandpackIframeHook);
            }

            Object.keys(clients).map(unregisterBundler);
            unregisterAllClients();
          }
        }, observerOptions);

        intersectionObserver?.observe(lazyAnchorRef.value);
      } else {
        // else run the sandpack on mount, with a slight delay to allow all subcomponents to mount/register components
        initializeSandpackIframeHook = setTimeout(
          () => runSandpack(),
          50,
        );
      }
    }

    function createClient(
      iframe: HTMLIFrameElement,
      clientId: string,
    ) {
      const client = new SandpackClient(
        iframe,
        {
          files: state.files,
          template: state.environment,
        },
        {
          externalResources: props.externalResources,
          bundlerURL: props.bundlerURL,
          logLevel: props.logLevel,
          startRoute: props.startRoute,
          fileResolver: props.fileResolver,
          skipEval: props.skipEval,
          showOpenInCodeSandbox: !state.openInCSBRegisteredRef,
          showErrorScreen: !state.errorScreenRegisteredRef,
          showLoadingScreen: !state.loadingScreenRegisteredRef,
          reactDevTools: data.reactDevTools,
        },
      );

      /**
       * Subscribe inside the context with the first client that gets instantiated.
       * This subscription is for global states like error and timeout, so no need for a per client listen
       * Also, set the timeout timer only when the first client is instantiated
       */
      if (typeof unsubscribe !== 'function') {
        unsubscribe = client.listen(handleMessage);

        timeoutHook = setTimeout(() => {
          state.status = 'timeout';
        }, BUNDLER_TIMEOUT);
      }

      /**
       * Register any potential listeners that subscribed before sandpack ran
       */
      if (queuedListeners[clientId]) {
        Object.keys(queuedListeners[clientId]).forEach((listenerId) => {
          const listener = queuedListeners[clientId][listenerId];
          const unsubscribe_a = client.listen(listener) as () => void;
          unsubscribeQueuedListeners[clientId][listenerId] = unsubscribe_a;
        });

        // Clear the queued listeners after they were registered
        queuedListeners[clientId] = {};
      }

      /**
       * Register global listeners
       */
      const globalListeners = Object.entries(queuedListeners.global);
      globalListeners.forEach(([listenerId, listener]) => {
        const unsubscribe_a = client.listen(listener) as () => void;
        unsubscribeQueuedListeners[clientId][listenerId] = unsubscribe_a;

        /**
         * Important: Do not clean the global queue
         * Instead of cleaning the queue, keep it there for the
         * following clients that might be created
         */
      });

      return client;
    }

    function runSandpack() {
      Object.keys(preregisteredIframes).forEach((clientId) => {
        const iframe = preregisteredIframes[clientId];
        clients[clientId] = createClient(iframe, clientId);
      });

      state.status = 'running';
    }

    function registerBundler(iframe: HTMLIFrameElement, clientId: string) {
      if (state.status === 'running') {
        clients[clientId] = createClient(iframe, clientId);
      } else {
        preregisteredIframes[clientId] = iframe;
      }
    }

    function unregisterBundler(clientId: string) {
      const client = clients[clientId];
      if (client) {
        client.cleanup();
        client.iframe.contentWindow?.location.replace('about:blank');
        delete clients[clientId];
      } else {
        delete preregisteredIframes[clientId];
      }

      if (timeoutHook) {
        clearTimeout(timeoutHook);
      }

      state.status = 'idle';
    }

    function unregisterAllClients() {
      Object.keys(clients).map(unregisterBundler);

      if (typeof unsubscribe === 'function') {
        unsubscribe();
        unsubscribe = undefined;
      }
    }

    function setActiveFile(theActivePath: string) {
      state && (state.activePath = theActivePath);
    }

    function openFile(path: string) {
      const { openPaths: prevOpenPaths } = data;
      const newPaths = prevOpenPaths.includes(path) ? prevOpenPaths : [...prevOpenPaths, path];
      state.activePath = path;
      state.openPaths = newPaths;
    }

    function closeFile(path: string) {
      if (state.openPaths.length === 1 || !state) {
        return;
      }

      const indexOfRemovedPath = state.openPaths.indexOf(path);
      const newPaths = state.openPaths.filter((openPath: any) => openPath !== path);
      state.activePath =
          path === state.activePath
            ? indexOfRemovedPath === 0
              ? state.openPaths[1]
              : state.openPaths[indexOfRemovedPath - 1]
            : state.activePath;
      state.openPaths = newPaths;
    }

    function deleteFile(path: string) {
      const { openPaths: prevOpenPaths, files: prevFiles } = data;
      const newPaths = prevOpenPaths.filter((openPath) => openPath !== path);
      const newFiles = Object.keys(prevFiles).reduce(
        (acc: SandpackBundlerFiles, filePath) => {
          if (filePath === path) {
            return acc;
          }
          acc[filePath] = prevFiles[filePath];
          return acc;
        },
        {},
      );
      state.openPaths = newPaths;
      state.files = newFiles;
      updateClients();
    }

    function dispatchMessage(message: SandpackMessage, clientId?: string) {
      if (state.status !== 'running') {
        console.warn('dispatch cannot be called while in idle mode');
        return;
      }

      if (clientId) {
        clients[clientId].dispatch(message);
      } else {
        Object.values(clients).forEach((client) => {
          client.dispatch(message);
        });
      }
    }

    function addListener(
      listener: ListenerFunction,
      clientId?: string,
    ): UnsubscribeFunction {
      if (clientId) {
        if (clients[clientId]) {
          const unsubscribeListener = clients[clientId].listen(listener);

          return unsubscribeListener;
        } else {
          // When listeners are added before the client is instantiated, they are stored with an unique id
          // When the client is eventually instantiated, the listeners are registered on the spot
          // Their unsubscribe functions are stored in unsubscribeQueuedListeners for future cleanup
          const listenerId = generateRandomId();
          queuedListeners[clientId] = queuedListeners[clientId] || {};
          unsubscribeQueuedListeners[clientId] =
              unsubscribeQueuedListeners[clientId] || {};

          queuedListeners[clientId][listenerId] = listener;

          const unsubscribeListener = () => {
            if (queuedListeners[clientId][listenerId]) {
              // unsubscribe was called before the client was instantiated
              // common example - a component with autorun=false that unmounted
              delete queuedListeners[clientId][listenerId];
            } else if (unsubscribeQueuedListeners[clientId][listenerId]) {
              // unsubscribe was called for a listener that got added before the client was instantiated
              // call the unsubscribe function and remove it from memory
              unsubscribeQueuedListeners[clientId][listenerId]();
              delete unsubscribeQueuedListeners[clientId][listenerId];
            }
          };

          return unsubscribeListener;
        }
      } else {
        // Push to the **global** queue
        const listenerId = generateRandomId();
        queuedListeners.global[listenerId] = listener;

        // Add to the current clients
        const latestClients = Object.values(clients);
        const currentClientUnsubscribeListeners = latestClients.map((client) => client.listen(listener));

        const unsubscribeListener = () => {
          const unsubscribeQueuedClients = Object.values(
            unsubscribeQueuedListeners,
          );

          // Unsubscribing all listener registered
          unsubscribeQueuedClients.forEach((listenerOfClient) => {
            const listenerFunctions = Object.values(listenerOfClient);
            listenerFunctions.forEach((unsubscribe_a) => unsubscribe_a());
          });

          // Unsubscribing from the clients already created
          currentClientUnsubscribeListeners.forEach((unsubscribe_a) => unsubscribe_a());
        };

        return unsubscribeListener;
      }
    }

    function resetFile(path: string) {
      const { files: newFiles } = getSandpackStateFromProps(props);
      state.files = { ...state.files, [path]: newFiles[path] };
      updateClients();
    }

    function resetAllFiles() {
      const { files: newFiles } = getSandpackStateFromProps(props);
      state.files = newFiles;
      updateClients();
    }

    watch(
      [
        () => props.initMode,
        () => props.template,
        () => props.activePath,
        () => props.openPaths,
        () => props.customSetup,
      ],
      (
        [newInitMode, newTemplate, newActivePath, newOpenPaths, newCustomSetup],
        [prevInitMode, prevTemplate, prevActivePath, prevOpenPaths, prevCustomSetup],
      ) => {
        /**
         * Watch the changes on the initMode prop
         */
        if (prevInitMode !== newInitMode && newInitMode) {
          state.initMode = newInitMode;
          initializeSandpackIframe();
        }

        /**
         * Custom setup derived from props
         */
        const stateFromProps = getSandpackStateFromProps(props);

        /**
         * What the changes on the customSetup props
         */
        if (
          prevTemplate !== newTemplate ||
          prevActivePath !== newActivePath ||
          !isEqual(prevOpenPaths, newOpenPaths) ||
          !isEqual(prevCustomSetup, newCustomSetup)
        ) {
          state.activePath = stateFromProps.activePath;
          state.openPaths = stateFromProps.openPaths;
          state.files = stateFromProps.files;
          state.environment = stateFromProps.environment;

          if (state.status !== 'running') {
            return;
          }

          Object.values(clients).forEach((client) => client.updatePreview({
            files,
            template: stateFromProps.environment,
          }));
        }

        /**
         * Watch the changes on editorState
        */
        const newEditorState = isEqual(files, state.files) ? 'pristine' : 'dirty';
        if (newEditorState !== state.editorState) {
          state.editorState = newEditorState;
        }
      },
      { immediate: true },
    );

    onMounted(() => {
      initializeSandpackIframe();
    });

    onUnmounted(() => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }

      if (timeoutHook) {
        clearTimeout(timeoutHook);
      }

      if (debounceHook) {
        clearTimeout(debounceHook);
      }

      if (initializeSandpackIframeHook) {
        clearTimeout(initializeSandpackIframeHook);
      }

      if (intersectionObserver) {
        intersectionObserver?.disconnect();
      }
    });

    return () => slots.default ? slots.default() : null;
  },
}) as DefineComponent<SandpackProviderProps>;

/**
 * useSandpack
 */
function useSandpack(): UseSandpackReturnType {
  const sandpack = useContext<SandpackContext>(SandpackStateContext, undefined);

  if (!sandpack) {
    throw new Error(
      'useSandpack can only be used inside components wrapped by \'SandpackProvider\'',
    );
  }

  return {
    sandpack,
    dispatch: sandpack.dispatch,
    listen: sandpack.listen,
  };
}

export { SandpackStateContext, useSandpack, SandpackProvider };
