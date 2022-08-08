import * as allThemes from '@codesandbox/sandpack-themes';
import { storiesOf } from '@storybook/vue3';
import { Sandpack } from 'codesandbox-sandpack-vue3';

const stories = storiesOf('presets/Themes (external)', module);

Object.entries(allThemes).forEach(([themeName, value]) => stories.add(themeName, () => (
  <Sandpack
    options={{ showInlineErrors: true }}
    template="react"
    theme={value}
  />
)));
