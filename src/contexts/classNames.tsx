import { THEME_PREFIX } from '../styles';
import { useContext } from '../hooks';
import {
  defineComponent,
  InjectionKey,
  PropType,
  provide,
} from 'vue';

interface ClassNamesProviderContext {
  [key: string]: string;
}

/**
 * ```jsx
 * <ClassNamesContext
 *  classes={{
 *   'sp-wrapper: "custom-wrapper",
 *   'sp-layout: "custom-layout",
 *   'sp-tab-button: "custom-tab",
 *  }}
 * >
 *   ...
 * </ClassNamesContext>
 * ```
 */
const ClassNamesContext: InjectionKey<ClassNamesProviderContext> = Symbol('classNamesProvider');

const ClassNamesProvider = defineComponent({
  name: 'ClassNamesProvider',
  props: {
    classes: {
      type: Object as PropType<ClassNamesProviderContext>,
      required: false,
      default() {
        return {};
      },
    },
  },
  setup(props, { slots }) {
    provide(ClassNamesContext, props.classes);

    return () => (
      <>
        { slots.default ? slots.default() : null }
      </>
    );
  },
});

export const useClassNames = () => {
  const contextClassNames = useContext<ClassNamesProviderContext>(ClassNamesContext, {});

  return function sandpackClassNames(
    customClassName: string,
    allClassNames: any[] = [],
  ): string {
    const custom = `${THEME_PREFIX}-${customClassName}`;

    return joinClassNames(...allClassNames, custom, contextClassNames[custom]);
  };
};

export const joinClassNames = (...args: any[]): string => args.filter(Boolean).join(' ');

export { ClassNamesProvider, ClassNamesContext };

export type { ClassNamesProviderContext };
