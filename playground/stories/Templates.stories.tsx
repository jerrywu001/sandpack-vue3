import { Sandpack, SandpackPredefinedTemplate } from 'sandpack-vue3';
import { SANDBOX_TEMPLATES } from 'sandpack-vue3/templates';
import { storiesOf } from '@storybook/vue3';

const stories = storiesOf('presets/Template', module);

Object.keys(SANDBOX_TEMPLATES)
  .forEach((template) => stories.add(
    template,
    () => (<Sandpack template={template as SandpackPredefinedTemplate} />
    ),
  ));
