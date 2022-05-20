import { ComponentPublicInstance, getCurrentScope, onScopeDispose, Ref, unref, watch } from 'vue';

/**
 * Maybe it's a ref, or not.
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
type MaybeRef<T> = T | Ref<T>;

type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>;
type VueInstance = ComponentPublicInstance;
type MaybeElement = HTMLElement | SVGElement | VueInstance | undefined | null;
type UnRefElementReturn<T extends MaybeElement = MaybeElement> =
  T extends VueInstance ? Exclude<MaybeElement, VueInstance> : T | undefined;

interface ConfigurableWindow {
  window?: Window;
}

export interface IntersectionObserverOptions extends ConfigurableWindow {
  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeElementRef

  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   */
  threshold?: number | number[]
}

/**
 * Any function
 */
 declare type Fn = () => void;

function tryOnScopeDispose(fn: Fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}

const isClient = typeof window !== 'undefined';
const defaultWindow = isClient ? window : void 0;

/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
function unrefElement<T extends MaybeElement>(elRef: MaybeElementRef<T>): UnRefElementReturn<T> {
  const plain = unref(elRef);
  return (plain as VueInstance)?.$el ?? plain;
}

const noop = () => {
};

/**
 * Detects that a target element's visibility.
 *
 * @param target
 * @param callback
 * @param options
 */
export default function useIntersectionObserver(
  target: MaybeElementRef,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverOptions = {},
) {
  const {
    root,
    rootMargin = '0px',
    threshold = 0.1,
    window = defaultWindow,
  } = options;

  const isSupported = window && 'IntersectionObserver' in window;

  let cleanup = noop;

  const stopWatch = isSupported
    ? watch(
      () => ({
        el: unrefElement(target),
        root: unrefElement(root),
      }),
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ({ el, root }) => {
        cleanup();

        if (!el) { return; }

        const observer = new IntersectionObserver(
          callback,
          {
            root,
            rootMargin,
            threshold,
          },
        );
        observer.observe(el);

        cleanup = () => {
          observer.disconnect();
          cleanup = noop;
        };
      },
      { immediate: true, flush: 'post' },
    )
    : noop;

  const stop = () => {
    cleanup();
    stopWatch();
  };

  tryOnScopeDispose(stop);

  return {
    isSupported,
    stop,
  };
}
