import type { DefineComponent } from 'vue';
import { defineComponent, h, onMounted, ref } from 'vue';
import { SandpackProps } from '.';

/**
 * The proxy component wrapper for the Starport.
 */
const Sandpack = defineComponent({
  name: 'Sandpack',
  inheritAttrs: true,
  setup(props, ctx) {
    const isMounted = ref(false);
    const count = ref(1);

    const add = () => {
      count.value++;
    };

    onMounted(() => {
      const a = null;
      const myPromise = new Promise(() => {});
      myPromise.then();
      myPromise.catch();
      myPromise.finally();
      console.log(a ?? 'hello', '00'.padStart(0), [].map);
      isMounted.value = true;
    });

    return () => (
      <div>
        <div>mounted: {JSON.stringify(isMounted.value)}</div>
        <div>{count.value}</div>
        <div>
          <button onClick={add}>add</button>
        </div>
      </div>
    );
  },
}) as DefineComponent<SandpackProps>;

export { Sandpack };
