import * as icons from 'codesandbox-sandpack-vue3/icons';

export default {
  title: 'components/Icons',
};

export const all = () => (
  <div style={{ color: 'black' }}>
    {Object.keys(icons).map((iconName) => {
      const Component = icons[iconName];

      return <Component key={iconName} />;
    })}
  </div>
);
