/* eslint-disable symbol-description */
import {
  DefineComponent,
  defineComponent,
  inject,
  InjectionKey,
  provide,
  reactive,
  readonly,
  SetupContext,
  UnwrapRef,
  VNode,
} from 'vue';

export type ContextType<T> = any;

export interface CreateContext<T> {
  Provider: DefineComponent<{}, () => VNode | VNode[] | undefined, any>;
  state: UnwrapRef<T> | T;
}

export const createContext = <T extends Record<string, any>>(
  context: ContextType<T>,
  contextInjectKey: InjectionKey<ContextType<T>> = Symbol(),
): CreateContext<T> => {
  if (!context || typeof context !== 'object') {
    throw new Error('context can only be object: Record<string, any>');
  }

  const state = reactive<ContextType<T>>({ ...context });

  const ContextProvider = defineComponent({
    name: 'ContextProvider',
    inheritAttrs: false,
    setup(_, { slots }: SetupContext) {
      provide(contextInjectKey, readonly(state));
      return () => slots.default?.();
    },
  });

  return {
    state,
    Provider: ContextProvider,
  };
};

export const useContext = <T>(
  contextInjectKey: InjectionKey<ContextType<T>> = Symbol(),
  defaultValue?: ContextType<T>,
): T => {
  const ctx = inject<ContextType<T>>(contextInjectKey, defaultValue);
  const isNull = ctx === null || ctx === undefined;
  return (!isNull ? readonly(ctx) : defaultValue) as T;
};
