import * as icons from 'codesandbox-sandpack-vue3/icons';
import { storiesOf } from '@storybook/vue3';

const stories = storiesOf('Components/Icons', module);

Object.keys(icons).forEach((iconName) => stories.add(iconName, () => {
  // @ts-ignore
  const Component = icons[iconName];

  return <Component />;
}));
