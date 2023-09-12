import { dequal as deepEqual } from 'dequal';
import { ClassNamesProvider } from './classNames';
import { convertedFilesToBundlerFiles, getSandpackStateFromProps } from '../utils/sandpackUtils';
import { generateRandomId } from '../utils/stringUtils';
import {
  BundlerState,
  extractErrorDetails,
  ListenerFunction,
  loadSandpackClient,
  normalizePath,
  ReactDevToolsMode,
  SandpackClient,
  SandpackError,
  SandpackMessage,
  UnsubscribeFunction,
} from '@codesandbox/sandpack-client';
import { type SandpackFiles, useContext, SandpackThemeProvider } from '..';
import {
  DefineComponent,
  defineComponent,
  InjectionKey,
  reactive,
  provide,
  PropType,
  onMounted,
  UnwrapNestedRefs,
  StyleValue,
  watch,
  ref,
  nextTick,
  toRaw,
} from 'vue';
import type {
  SandpackContext,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackState,
  SandpackProviderProps,
  SandpackThemeProp,
  SandpackClientListen,
  SandpackClientDispatch,
} from '../types';

export interface ClientPropsOverride {
  startRoute?: string;
}

export interface UseSandpack {
  sandpack: SandpackState;
  dispatch: SandpackClientDispatch;
  listen: SandpackClientListen;
}

const BUNDLER_TIMEOUT = 30000; // 30 seconds timeout for the bundler to respond.
const SandpackStateContext: InjectionKey<UnwrapNestedRefs<SandpackState>> = Symbol('sandpackStateContext');

/**
 * SandpackProvider
 * Main context provider that should wraps your entire component.
 * Use * [`useSandpack`](/api/react/#usesandpack) hook, which gives you the entire context object to play with.
 */
const SandpackProvider = defineComponent({
  name: 'SandpackProvider',
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
  setup(props: SandpackProviderProps, { attrs, slots }) {
    /** merge above states */
    const { activeFile, visibleFiles = [], files, environment } = getSandpackStateFromProps(props);
    const initModeFromProps = props.options?.initMode || 'lazy';
    // const data = reactive({ reactDevTools: undefined } as any);

    const intersectionObserver = ref<IntersectionObserver | null>(null);
    const initializeSandpackIframeHook = ref<NodeJS.Timer | null>(null);
    const registeredIframes = ref<Record<
    string,
    { iframe: HTMLIFrameElement; clientPropsOverride?: ClientPropsOverride }
    >>({});
    const timeoutHook = ref<NodeJS.Timer | null>(null);
    const unsubscribe = ref<() => void | undefined>();
    const debounceHook = ref<number | undefined>();

    const state = reactive({
      /** file state */
      visibleFiles,
      activeFile,
      files,
      environment,
      visibleFilesFromProps: visibleFiles,
      shouldUpdatePreview: true,
      editorState: 'pristine',
      teamId: props.teamId,
      openFile,
      resetFile,
      resetAllFiles,
      setActiveFile,
      updateFile,
      updateCurrentFile,
      addFile: updateFile,
      closeFile,
      deleteFile,

      /** clients state */
      autoReload: props.options?.autoReload ?? true,
      reactDevTools: undefined as ReactDevToolsMode | undefined,
      startRoute: props.options?.startRoute,
      initMode: props.options?.initMode || 'lazy',
      bundlerState: { entry: '', transpiledModules: {} } as BundlerState,
      error: { message: '' } as SandpackError | null,
      status: props.options?.autorun ?? true ? 'initial' : 'idle',
      clients: {} as Record<string, SandpackClient>,
      lazyAnchorRef: null as HTMLDivElement | null,
      unsubscribeClientListenersRef: {} as Record<string, Record<string, UnsubscribeFunction>>,
      queuedListenersRef: { global: {} } as Record<string, Record<string, ListenerFunction>>,
      initializeSandpackIframe,
      runSandpack,
      registerBundler,
      unregisterBundler,
      registerReactDevTools,
      addListener,
      dispatchMessage,
      listen: addListener,
      dispatch: dispatchMessage,
    });

    function registerReactDevTools(value: ReactDevToolsMode) {
      state.reactDevTools = value;
    }

    function openFile(path: string) {
      const { visibleFiles: prevVisibleFiles } = state;
      const newPaths = prevVisibleFiles.includes(path) ? prevVisibleFiles : [...prevVisibleFiles, path];
      state.activeFile = path;
      state.visibleFiles = newPaths;
    }

    function resetFile(path: string) {
      const { files: newFiles } = getSandpackStateFromProps(props);
      state.files = { ...toRaw(state.files), [path]: newFiles[path] };
    }

    function resetAllFiles() {
      const { files: newFiles } = getSandpackStateFromProps(props);
      state.files = newFiles;
    }

    function setActiveFile(theActiveFile: string) {
      if (state && state.files[theActiveFile]) {
        state.activeFile = theActiveFile;
      }
    }

    function updateFile(
      pathOrFiles: string | SandpackFiles,
      code?: string,
      shouldUpdatePreview = true,
    ) {
      if (typeof pathOrFiles === 'string' && typeof code === 'string') {
        state.files = { ...toRaw(state.files), [pathOrFiles]: { code } };
      } else if (typeof pathOrFiles === 'object') {
        state.files = normalizePath({ ...toRaw(state.files), ...convertedFilesToBundlerFiles(pathOrFiles) });
      }
      state.shouldUpdatePreview = shouldUpdatePreview;
    }

    function updateCurrentFile(code: string, shouldUpdatePreview = true) {
      updateFile(state.activeFile, code, shouldUpdatePreview);
    }

    function closeFile(path: string) {
      if (state.visibleFiles.length === 1) {
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

    function deleteFile(path: string, shouldUpdatePreview = true) {
      const { visibleFiles: prevVisibleFiles, files: prevFiles, activeFile: prevActiveFile } = state;
      const newFiles = { ...prevFiles };
      delete newFiles[path];

      const remainingVisibleFiles = prevVisibleFiles.filter((openPath) => openPath !== path);
      const deletedLastVisibleFile = remainingVisibleFiles.length === 0;

      if (deletedLastVisibleFile) {
        const nextFile = Object.keys(prevFiles)[Object.keys(prevFiles).length - 1];
        state.visibleFiles = [nextFile];
        state.activeFile = nextFile;
      } else {
        state.visibleFiles = remainingVisibleFiles;
        state.activeFile = path === prevActiveFile
          ? remainingVisibleFiles[remainingVisibleFiles.length - 1]
          : prevActiveFile;
      }
      state.files = toRaw(newFiles);
      state.shouldUpdatePreview = shouldUpdatePreview;
    }

    function dispatchMessage(
      message: SandpackMessage,
      clientId?: string,
    ) {
      if (state.status !== 'running') {
        console.warn(
          '[sandpack-react]: dispatch cannot be called while in idle mode',
        );
        return;
      }

      if (clientId) {
        toRaw(state.clients[clientId]).dispatch(message);
      } else {
        Object.values(state.clients).forEach((client) => {
          toRaw(client).dispatch(message);
        });
      }
    }

    function addListener(
      listener: ListenerFunction,
      clientId?: string,
    ) {
      if (clientId) {
        if (state.clients[clientId]) {
          const unsubscribeListener = toRaw(state.clients[clientId]).listen(listener);

          return unsubscribeListener;
        } else {
          /**
           * When listeners are added before the client is instantiated, they are stored with an unique id
           * When the client is eventually instantiated, the listeners are registered on the spot
           * Their unsubscribe functions are stored in unsubscribeClientListeners for future cleanup
           */
          const listenerId = generateRandomId();
          state.queuedListenersRef[clientId] =
            state.queuedListenersRef[clientId] || {};
          state.unsubscribeClientListenersRef[clientId] =
            state.unsubscribeClientListenersRef[clientId] || {};

          state.queuedListenersRef[clientId][listenerId] = listener;

          const unsubscribeListener = (): void => {
            if (state.queuedListenersRef[clientId][listenerId]) {
              /**
               * Unsubscribe was called before the client was instantiated
               * common example - a component with autorun=false that unmounted
               */
              delete state.queuedListenersRef[clientId][listenerId];
            } else if (state.unsubscribeClientListenersRef[clientId][listenerId]) {
              /**
               * unsubscribe was called for a listener that got added before the client was instantiated
               * call the unsubscribe function and remove it from memory
               */
              state.unsubscribeClientListenersRef[clientId][listenerId]();
              delete state.unsubscribeClientListenersRef[clientId][listenerId];
            }
          };

          return unsubscribeListener;
        }
      } else {
        // Push to the **global** queue
        const listenerId = generateRandomId();
        state.queuedListenersRef.global[listenerId] = listener;

        // Add to the current clients
        const clientsList = Object.values(state.clients);
        const currentClientUnsubscribeListeners = clientsList.map((client) => toRaw(client).listen(listener));

        const unsubscribeListener = (): void => {
          // Unsubscribing from the clients already created
          currentClientUnsubscribeListeners.forEach((unsubscribeFunc) => unsubscribeFunc());

          delete state.queuedListenersRef.global[listenerId];

          // Unsubscribe in case it was added later from `global`
          Object.values(state.unsubscribeClientListenersRef).forEach((client) => {
            client?.[listenerId]?.();
          });
        };

        return unsubscribeListener;
      }
    }

    async function registerBundler(
      iframe: HTMLIFrameElement,
      clientId: string,
      clientPropsOverride?: ClientPropsOverride,
    ) {
      // Store the iframe info so it can be
      // used later to manually run sandpack
      registeredIframes.value[clientId] = {
        iframe,
        clientPropsOverride,
      };
      if (state.status === 'running') {
        await createClient(iframe, clientId, clientPropsOverride);
      }
    }

    function unregisterBundler(clientId: string) {
      const client = toRaw(state.clients[clientId]);
      if (client) {
        client.destroy();
        client.iframe.contentWindow?.location.replace('about:blank');
        client.iframe.removeAttribute('src');
        delete state.clients[clientId];
      }

      delete registeredIframes.value[clientId];

      if (timeoutHook.value) {
        clearTimeout(timeoutHook.value as any);
      }

      const unsubscribeQueuedClients = Object.values(
        state.unsubscribeClientListenersRef[clientId] ?? {},
      );

      // Unsubscribing all listener registered
      unsubscribeQueuedClients.forEach((listenerOfClient) => {
        const listenerFunctions = Object.values(listenerOfClient);
        listenerFunctions.forEach((unsubscribeFunc) => unsubscribeFunc());
      });

      // Keep running if it still have clients
      const status = Object.keys(state.clients).length > 0 ? 'running' : 'idle';

      state.status = status;
    }

    function handleMessage(msg: SandpackMessage) {
      if (msg.type === 'start') {
        state.error = null;
      } else if (msg.type === 'state') {
        state.bundlerState = msg.state;
      } else if ((msg.type === 'done' && !msg.compilatonError) || msg.type === 'connected') {
        if (timeoutHook.value) {
          clearTimeout(timeoutHook.value as any);
        }
        state.error = null;
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

    async function createClient(
      iframe: HTMLIFrameElement,
      clientId: string,
      clientPropsOverride?: ClientPropsOverride,
    ): Promise<void> {
      // Clean up any existing clients that
      // have been created with the given id
      if (state.clients[clientId]) {
        state.clients[clientId].destroy();
      }

      const customSetup = props?.customSetup ?? { npmRegistries: [] };
      const timeOut = props?.options?.bundlerTimeOut ?? BUNDLER_TIMEOUT;

      if (timeoutHook.value) {
        clearTimeout(timeoutHook.value as any);
      }

      /**
       * Subscribe inside the context with the first client that gets instantiated.
       * This subscription is for global states like error and timeout, so no need for a per client listen
       * Also, set the timeout timer only when the first client is instantiated
       */
      const shouldSetTimeout = typeof unsubscribe.value !== 'function';

      if (shouldSetTimeout) {
        timeoutHook.value = setTimeout(() => {
          unregisterAllClients();
          state.status = 'timeout';
        }, timeOut);
      }

      const client = await loadSandpackClient(
        iframe,
        {
          files: toRaw(state.files),
          template: toRaw(state.environment),
        },
        {
          externalResources: props.options?.externalResources,
          bundlerURL: props.options?.bundlerURL,
          startRoute: clientPropsOverride?.startRoute ?? props.options?.startRoute,
          fileResolver: props.options?.fileResolver,
          skipEval: props.options?.skipEval ?? false,
          logLevel: props.options?.logLevel,
          showOpenInCodeSandbox: false,
          showErrorScreen: true,
          showLoadingScreen: true,
          reactDevTools: state.reactDevTools,
          customNpmRegistries: customSetup?.npmRegistries,
          teamId: props.teamId,
        },
      );

      if (typeof unsubscribe.value !== 'function') {
        unsubscribe.value = client.listen(handleMessage);
      }

      state.unsubscribeClientListenersRef[clientId] =
        state.unsubscribeClientListenersRef[clientId] || {};

      /**
       * Register any potential listeners that subscribed before sandpack ran
       */
      if (state.queuedListenersRef[clientId]) {
        Object.keys(state.queuedListenersRef[clientId]).forEach((listenerId) => {
          const listener = state.queuedListenersRef[clientId][listenerId];
          const unsubscribeFunc = client.listen(listener) as () => void;
          state.unsubscribeClientListenersRef[clientId][listenerId] = unsubscribeFunc;
        });

        // Clear the queued listeners after they were registered
        state.queuedListenersRef[clientId] = {};
      }

      /**
       * Register global listeners
       */
      const globalListeners = Object.entries(state.queuedListenersRef.global);
      globalListeners.forEach(([listenerId, listener]) => {
        const unsubscribeFunc = client.listen(listener) as () => void;
        state.unsubscribeClientListenersRef[clientId][listenerId] = unsubscribeFunc;

        /**
         * Important: Do not clean the global queue
         * Instead of cleaning the queue, keep it there for the
         * following clients that might be created
         */
      });

      state.clients[clientId] = client;
    }

    function unregisterAllClients() {
      Object.keys(state.clients).map(unregisterBundler);

      if (typeof unsubscribe.value === 'function') {
        unsubscribe.value();
        unsubscribe.value = undefined;
      }
    }

    async function runSandpack() {
      await Promise.all(
        Object.entries(registeredIframes.value).map(
          async ([clientId, { iframe, clientPropsOverride = {} }]) => {
            await createClient(iframe, clientId, clientPropsOverride);
          },
        ),
      );

      state.error = null;
      state.status = 'running';
    }

    function initializeSandpackIframe() {
      const autorun = props.options?.autorun ?? true;

      if (!autorun) {
        return;
      }

      const observerOptions = props.options?.initModeObserverOptions ?? {
        rootMargin: '1000px 0px',
      };

      if (intersectionObserver.value && state.lazyAnchorRef) {
        intersectionObserver.value?.unobserve(state.lazyAnchorRef);
      }

      if (state.lazyAnchorRef && state.initMode === 'lazy') {
        // If any component registered a lazy anchor ref component, use that for the intersection observer
        intersectionObserver.value = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
            initializeSandpackIframeHook.value = setTimeout(() => {
              runSandpack();
            }, 50);

            if (state.lazyAnchorRef) {
              intersectionObserver.value?.unobserve(state.lazyAnchorRef);
            }
          }
        }, observerOptions);

        intersectionObserver.value.observe(state.lazyAnchorRef);
      } else if (state.lazyAnchorRef && state.initMode === 'user-visible') {
        intersectionObserver.value = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
            initializeSandpackIframeHook.value = setTimeout(() => {
              runSandpack();
            }, 50);
          } else {
            if (initializeSandpackIframeHook.value) {
              clearTimeout(initializeSandpackIframeHook.value as any);
            }

            Object.keys(state.clients).map(unregisterBundler);
            unregisterAllClients();
          }
        }, observerOptions);

        intersectionObserver.value.observe(state.lazyAnchorRef);
      } else {
        // else run the sandpack on mount, with a slight delay to allow all subcomponents to mount/register components
        initializeSandpackIframeHook.value = setTimeout(
          () => runSandpack(),
          50,
        );
      }
    }

    // TODO
    // @ts-ignore
    provide(SandpackStateContext, state);

    watch(
      [
        () => state.files,
        () => state.environment,
        () => state.shouldUpdatePreview,
        () => state.reactDevTools,
        () => state.status,
        () => props.options?.recompileMode,
        () => props.options?.recompileDelay,
      ],
      () => {
        const { environment: prevEnvironment } = getSandpackStateFromProps(props);
        const recompileMode = props.options?.recompileMode ?? 'delayed';
        const recompileDelay = props.options?.recompileDelay ?? 500;
        if (state.status !== 'running' || !state.shouldUpdatePreview) {
          return;
        }

        /**
         * When the environment changes, Sandpack needs to make sure
         * to create a new client and the proper bundler
         */
        if (prevEnvironment !== state.environment) {
          state.environment = prevEnvironment;

          Object.entries(state.clients).forEach(([key, client]) => {
            registerBundler(toRaw(client).iframe, key);
          });
        }

        if (recompileMode === 'immediate') {
          Object.values(state.clients).forEach((client) => {
            /**
             * Avoid concurrency
             */
            if (client.status === 'done') {
              toRaw(client).updateSandbox({
                files: { ...toRaw(state.files) },
                template: toRaw(state.environment),
              });
            }
          });
        }

        if (recompileMode === 'delayed') {
          if (typeof window === 'undefined') return;

          window.clearTimeout(debounceHook.value);
          debounceHook.value = window.setTimeout(() => {
            Object.values(state.clients).forEach((client) => {
              /**
               * Avoid concurrency
               */
              if (client.status === 'done') {
                toRaw(client).updateSandbox({
                  files: { ...toRaw(state.files) },
                  template: toRaw(state.environment),
                });
              }
            });
          }, recompileDelay);
        }
      },
      { immediate: true, deep: true },
    );

    watch(
      [
        () => props.options?.initMode,
        () => state.initMode,
        () => props.options?.autorun,
        () => props.options?.initModeObserverOptions,
        () => state.environment,
        () => state.files,
        () => state.reactDevTools,
      ],
      () => {
        if (initModeFromProps !== state.initMode) {
          state.initMode = initModeFromProps;

          initializeSandpackIframe();
        }
      },
      { immediate: true, deep: true },
    );

    watch(
      [
        () => props.options,
        () => props.template,
        () => props?.files,
        () => props.customSetup,
      ],
      () => {
        /**
         * Custom setup derived from props
         */
        const stateFromProps = getSandpackStateFromProps(props);
        state.activeFile = stateFromProps.activeFile;
        state.visibleFiles = stateFromProps.visibleFiles;
        state.visibleFilesFromProps = stateFromProps.visibleFiles;
        state.files = stateFromProps.files;
        state.environment = stateFromProps.environment;

        /**
         * Watch the changes on editorState
        */
        const newEditorState = deepEqual(stateFromProps.files, toRaw(state.files)) ? 'pristine' : 'dirty';
        if (newEditorState !== state.editorState) {
          state.editorState = newEditorState;
        }
      },
      { deep: true }, // TODOW
    );

    onMounted(() => {
      if (typeof unsubscribe.value === 'function') {
        unsubscribe.value();
      }

      if (timeoutHook.value) {
        clearTimeout(timeoutHook.value as any);
      }

      if (debounceHook.value) {
        clearTimeout(debounceHook.value);
      }

      if (initializeSandpackIframeHook.value) {
        clearTimeout(initializeSandpackIframeHook.value as any);
      }

      if (intersectionObserver.value) {
        intersectionObserver.value.disconnect();
      }

      nextTick(() => {
        initializeSandpackIframe();
      });
    });

    return () => (
      <ClassNamesProvider classes={props.options?.classes}>
        <SandpackThemeProvider
          style={(attrs?.style || {}) as StyleValue}
          class={attrs?.class || ''}
          theme={props.theme as SandpackThemeProp}
        >
          { slots.default ? slots.default() : null }
        </SandpackThemeProvider>
      </ClassNamesProvider>
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
