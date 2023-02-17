import { roundedButtonClassName, buttonClassName, iconStandaloneClassName } from '../../styles/shared';
import { classNames } from '../../utils/classNames';
import { defineComponent } from 'vue';
import { ExportIcon } from '../../icons';
import { UnstyledOpenInCodeSandboxButton } from './UnstyledOpenInCodeSandboxButton';
import { useClasser } from 'code-hike-classer-vue3';
import { THEME_PREFIX } from '../../styles';

export const OpenInCodeSandboxButton = defineComponent({
  name: 'OpenInCodeSandboxButton',
  setup() {
    const c = useClasser(THEME_PREFIX);

    return () => (
      <UnstyledOpenInCodeSandboxButton
        class={classNames(
          c('button', 'icon-standalone'),
          buttonClassName,
          iconStandaloneClassName,
          roundedButtonClassName,
        )}
      >
        <ExportIcon />
        <span>Open Sandbox</span>
      </UnstyledOpenInCodeSandboxButton>
    );
  },
});
