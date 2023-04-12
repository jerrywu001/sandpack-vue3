import { Sandpack } from 'sandpack-vue3';

export default {
  title: 'Intro/PrivatePackage',
};

export const Basic = () => (
  <div style={{ width: 800, margin: 'auto' }}>
    <Sandpack
      options={{ bundlerURL: 'https://2-1-0-sandpack.codesandbox.stream/' }}
      teamId="6756547b-12fb-465e-82c8-b38a981f1f67"
      template="react"
    />
  </div>
);
