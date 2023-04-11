import { roundedButtonClassName, buttonClassName, iconStandaloneClassName } from '../../styles/shared';
import { defineComponent } from 'vue';
import { ExportIcon } from '../../icons';
import { UnstyledOpenInCodeSandboxButton } from './UnstyledOpenInCodeSandboxButton';
import { useClassNames } from '../..';

export const OpenInCodeSandboxButton = defineComponent({
  name: 'OpenInCodeSandboxButton',
  setup() {
    const classNames = useClassNames();

    return () => (
      <UnstyledOpenInCodeSandboxButton
        class={classNames(
          'button',
          [
            classNames('icon-standalone'),
            buttonClassName,
            iconStandaloneClassName,
            roundedButtonClassName,
          ],
        )}
      >
        <ExportIcon />
        <span>Open Sandbox</span>
      </UnstyledOpenInCodeSandboxButton>
    );
  },
});
