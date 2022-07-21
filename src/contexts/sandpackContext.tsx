/* eslint-disable @typescript-eslint/no-unused-expressions */
import isEqual from 'lodash.isequal';
import { ClasserProvider } from 'code-hike-classer-vue3';
import { convertedFilesToBundlerFiles, getSandpackStateFromProps } from '../utils/sandpackUtils';
import { extractErrorDetails, SandpackClient } from '@codesandbox/sandpack-client';
import { generateRandomId } from '../utils/stringUtils';
import { type SandpackFiles, useContext, SandpackThemeProvider } from '..';
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
  UnwrapNestedRefs,
  nextTick,
} from 'vue';
import type {
  BundlerState,
  ListenerFunction,
  SandpackError,
  SandpackMessage,
  UnsubscribeFunction,
  ReactDevToolsMode,
} from '@codesandbox/sandpack-client';
import type {
  SandpackContext,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackClientListen,
  SandpackState,
  SandpackClientDispatch,
  SandpackProviderProps,
  SandpackInitMode,
  SandpackThemeProp,
} from '../types';

const BUNDLER_TIMEOUT = 30000; // 30 seconds timeout for the bundler to respond.

export interface UseSandpack {
  sandpack: SandpackState;
  dispatch: SandpackClientDispatch;
  listen: SandpackClientListen;
}

const SandpackStateContext: InjectionKey<UnwrapNestedRefs<SandpackState>> = Symbol('sandpackStateContext');

/**
 * SandpackProvider
 * Main context provider that should wraps your entire component.
 * Use * [`useSandpack`](/api/react/#usesandpack) hook, which gives you the entire context object to play with.
 */
const SandpackProvider = defineComponent({
  name: 'SandpackProvider',
  inheritAttrs: true,
  props: {
    files: {
      type: Object as PropType<SandpackFiles>,
      required: false,
      default: undefined,
    },
    template: {
      type: String as PropType<SandpackPredefinedTemplate>,
      required: false,
      default: undefined,
    },
    customSetup: {
      type: Object as PropType<SandpackSetup>,
      required: false,
      default: undefined,
    },
    theme: {
      type: [String, Object] as PropType<SandpackThemeProp>,
      required: false,
      default: undefined,
    },
    options: {
      type: Object,
      required: false,
      default: undefined,
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
    const unsubscribeClientListeners: Record<string, Record<string, UnsubscribeFunction>> = {};
    const queuedListeners: Record<string, Record<string, ListenerFunction>> = { global: {} };

    let unsubscribe: UnsubscribeFunction | undefined;

    const { activeFile, visibleFiles = [], files, environment } = getSandpackStateFromProps(props);

    const data = reactive({
      reactDevTools: undefined,
    } as any);

    const state: UnwrapNestedRefs<SandpackState> = reactive({
      files,
      environment,
      visibleFiles,
      visibleFilesFromProps: visibleFiles,
      activeFile,
      startRoute: props.options?.startRoute,
      error: { message: '' } as SandpackError,
      bundlerState: { entry: '', transpiledModules: {} } as BundlerState,
      autorun: props.options?.autorun ?? true,
      status: props.options?.autorun ?? true ? 'initial' : 'idle',
      editorState: 'pristine',
      initMode: props.options?.initMode || 'lazy',
      clients,
      closeFile,
      deleteFile,
      addFile: updateFile,
      dispatch: dispatchMessage,
      openInCSBRegisteredRef: false,
      errorScreenRegisteredRef: false,
      loadingScreenRegisteredRef: false,
      lazyAnchorRef: ref<HTMLDivElement>() as Ref<HTMLDivElement>,
      // lazyAnchorRef: lazyAnchorRef as Ref<HTMLDivElement>,
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
    } as SandpackState);

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
      updateFile(state.activeFile, code);
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
      const recompileMode = props.options?.recompileMode ?? 'delayed';
      const recompileDelay = props.options?.recompileDelay ?? 500;

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
      const autorun = props.options?.autorun ?? true;
      if (!autorun) {
        return;
      }

      const observerOptions = props.options?.initModeObserverOptions ?? {
        rootMargin: '1000px 0px',
      };

      if (intersectionObserver && state.lazyAnchorRef) {
        intersectionObserver?.unobserve(state.lazyAnchorRef);
      }

      if (state.lazyAnchorRef && state.initMode === 'lazy') {
        // If any component registerd a lazy anchor ref component, use that for the intersection observer
        intersectionObserver = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
            initializeSandpackIframeHook = setTimeout(() => {
              runSandpack();
            }, 50);

            if (state.lazyAnchorRef) {
              intersectionObserver?.unobserve(state.lazyAnchorRef);
            }
          }
        }, observerOptions);

        intersectionObserver?.observe(state.lazyAnchorRef);
      } else if (
        state.lazyAnchorRef &&
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

        intersectionObserver?.observe(state.lazyAnchorRef);
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
          externalResources: props.options?.externalResources,
          bundlerURL: props.options?.bundlerURL,
          logLevel: props.options?.logLevel,
          startRoute: props.options?.startRoute,
          fileResolver: props.options?.fileResolver,
          skipEval: props.options?.skipEval,
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
          unsubscribeClientListeners[clientId][listenerId] = unsubscribe_a;
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
        unsubscribeClientListeners[clientId][listenerId] = unsubscribe_a;

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

      state.autorun = false;
      state.status = 'idle';
    }

    function unregisterAllClients() {
      Object.keys(clients).map(unregisterBundler);

      if (typeof unsubscribe === 'function') {
        unsubscribe();
        unsubscribe = undefined;
      }
    }

    function setActiveFile(theActiveFile: string) {
      if (state) {
        state.activeFile = theActiveFile;
      }
    }

    function openFile(path: string) {
      const { visibleFiles: prevVisibleFiles } = state;
      const newPaths = prevVisibleFiles.includes(path) ? prevVisibleFiles : [...prevVisibleFiles, path];
      state.activeFile = path;
      state.visibleFiles = newPaths;
    }

    function closeFile(path: string) {
      if (state.visibleFiles.length === 1 || !state) {
        return;
      }

      const indexOfRemovedPath = state.visibleFiles.indexOf(path);
      const newPaths = state.visibleFiles.filter((openPath: any) => openPath !== path);
      state.activeFile =
          path === state.activeFile
            ? indexOfRemovedPath === 0
              ? state.visibleFiles[1]
              : state.visibleFiles[indexOfRemovedPath - 1]
            : state.activeFile;
      state.visibleFiles = newPaths;
    }

    function deleteFile(path: string) {
      const { visibleFiles: prevVisibleFiles, files: prevFiles } = state;

      const newFiles = { ...prevFiles };
      delete newFiles[path];

      state.visibleFiles = prevVisibleFiles.filter((openPath) => openPath !== path);
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
          // Their unsubscribe functions are stored in unsubscribeClientListeners for future cleanup
          const listenerId = generateRandomId();
          queuedListeners[clientId] = queuedListeners[clientId] || {};
          unsubscribeClientListeners[clientId] = unsubscribeClientListeners[clientId] || {};

          queuedListeners[clientId][listenerId] = listener;

          const unsubscribeListener = () => {
            if (queuedListeners[clientId][listenerId]) {
              /**
               * Unsubscribe was called before the client was instantiated
               * common example - a component with autorun=false that unmounted
               */
              delete queuedListeners[clientId][listenerId];
            } else if (unsubscribeClientListeners[clientId][listenerId]) {
              /**
               * unsubscribe was called for a listener that got added before the client was instantiated
               * call the unsubscribe function and remove it from memory
               */
              unsubscribeClientListeners[clientId][listenerId]();
              delete unsubscribeClientListeners[clientId][listenerId];
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
        () => props.options,
        () => props.template,
        () => props?.files,
        () => props.customSetup,
      ],
      (
        [newOptions],
        [prevOptions],
      ) => {
        /**
         * Watch the changes on the initMode prop
         */
        if (prevOptions?.initMode !== newOptions?.initMode && newOptions?.initMode) {
          state.initMode = newOptions?.initMode as SandpackInitMode;
          initializeSandpackIframe();
        }

        /**
         * Custom setup derived from props
         */
        const stateFromProps = getSandpackStateFromProps(props);

        state.activeFile = stateFromProps.activeFile;
        state.visibleFiles = stateFromProps.visibleFiles;
        state.visibleFilesFromProps = stateFromProps.visibleFiles;
        state.files = stateFromProps.files;
        state.environment = stateFromProps.environment;

        if (state.status !== 'running') {
          return;
        }

        Object.values(clients).forEach((client) => {
          client.updatePreview({
            files: stateFromProps.files,
            template: stateFromProps.environment,
          });
        });

        /**
         * Watch the changes on editorState
        */
        const newEditorState = isEqual(stateFromProps.files, state.files) ? 'pristine' : 'dirty';
        if (newEditorState !== state.editorState) {
          state.editorState = newEditorState;
        }
      },
      { immediate: true, deep: true },
    );

    onMounted(() => {
      nextTick(() => {
        initializeSandpackIframe();
      });
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

    return () => (
      <ClasserProvider classes={props.options?.classes}>
        <SandpackThemeProvider
          style={props.style}
          className={props.className}
          theme={props.theme as SandpackThemeProp}
        >
          { slots.default ? slots.default() : null }
        </SandpackThemeProvider>
      </ClasserProvider>
    );
  },
}) as DefineComponent<SandpackProviderProps>;

/**
 * useSandpack
 */
function useSandpack(): UseSandpack {
  let sandpack = useContext<SandpackContext>(SandpackStateContext, undefined);

  if (!sandpack) {
    // @ts-ignore
    sandpack = { files: {}, dispatch: () => {}, listen: () => {} };
    console.error(
      '[sandpack-vue3]: "useSandpack" must be wrapped by a "SandpackProvider"',
    );
  }

  return {
    sandpack,
    dispatch: sandpack.dispatch,
    listen: sandpack.listen,
  };
}

export { SandpackStateContext, useSandpack, SandpackProvider };
