import type { NativeElements, ReservedProps, VNode } from 'vue';

declare global {
  namespace JSX {
    export type Element = VNode;
    export interface ElementClass {
      $props: {}
    }
    export interface ElementAttributesProperty {
      $props: {}
    }
    export interface IntrinsicElements extends NativeElements {
      // allow arbitrary elements
      // @ts-ignore suppress ts:2374 = Duplicate string index signature.
      [name: string]: any
    }
    export type IntrinsicAttributes = ReservedProps;
  }
}

declare const __UNSTYLED_COMPONENTS__: boolean;
