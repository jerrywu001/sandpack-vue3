import { Sandpack, SANDPACK_THEMES } from 'codesandbox-sandpack-vue3';
import { storiesOf } from '@storybook/vue3';

const stories = storiesOf('presets/Themes', module);

Object.keys(SANDPACK_THEMES).forEach((themeName) => stories.add(themeName, () => (
  <Sandpack
    options={{
      showLineNumbers: true,
      showInlineErrors: true,
      showNavigator: true,
      showTabs: true,
    }}
    theme={themeName as keyof typeof SANDPACK_THEMES}
  />
)));
