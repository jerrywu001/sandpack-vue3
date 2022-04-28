import { useClasser } from 'code-hike-classer-vue3';
import { defineComponent } from 'vue';
import { ExportIcon } from '../../icons';

import { UnstyledOpenInCodeSandboxButton } from './UnstyledOpenInCodeSandboxButton';

export const OpenInCodeSandboxButton = defineComponent({
  name: 'OpenInCodeSandboxButton',
  inheritAttrs: true,
  setup() {
    const c = useClasser('sp');

    return () => (
      <UnstyledOpenInCodeSandboxButton class={c('button', 'icon-standalone')}>
        <ExportIcon />
      </UnstyledOpenInCodeSandboxButton>
    );
  },
});
