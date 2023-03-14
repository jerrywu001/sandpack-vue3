import {
  Sandpack,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from 'sandpack-vue3';
import { ref } from 'vue';

export default {
  title: 'components/Console',
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-explicit-any */
const files = (full: boolean): any => ({
  '/App.js': `export default function App() {

    return (
      <>
        <p>Primitives</p>
        <button onClick={() => console.log("Lorem ipsum")}>string</button>
        <button onClick={() => console.log(123)}>number</button>
        <button onClick={() => console.log(true)}>boolean</button>
        <button onClick={() => console.log(undefined)}>undefined</button>
        <button onClick={() => console.log(null)}>null</button>

        ${
  full
    ? `<p>Others</p>
        <button onClick={() => console.log(new Date())}>Date</button>
        <button onClick={() => console.log(NaN)}>NaN</button>
        <button onClick={() => console.log(new RegExp("//"))}>Regex</button>
        <button onClick={() => console.log(new Error("Foo"))}>Error</button>
        <button onClick={() => console.log(document.querySelector("button"))}>Log a node</button>
        <button onClick={() => console.log(document.querySelectorAll("button"))}>Log nodes</button>
        <button onClick={() => console.log(document.querySelector("body"))}>Log body</button>
        <button onClick={() => console.log(()=>{}, function foo(){})}>Log function</button>
        <button onClick={() => console.log(window)}>Log window</button>
        <button onClick={() => console.log({ foo: [] })}>Log object</button>
        <button onClick={() => console.log({foo: [], baz: () => {}})}>Log object II</button>
        <button onClick={() => console.log(["foo", 123, [], ["foo2"], () => {}])}>Multiples types</button>
        <button onClick={() => {
          console.log("foo", "baz")
          console.error("foo", "baz")
        }}>
          Multiples logs
        </button>
        <button onClick={() => console.error({ foo: [] })}>Log error</button>
        <button onClick={() => console.warn({ foo: [] })}>Log warning</button>
        <button onClick={() => console.info({ foo: [] })}>Log info</button>
        <button onClick={() => console.clear()}>Console.clear</button>`
    : ''
  }
      </>
    );
  }
  `,
});

export const Main = () => {
  const showHeader = ref(true);
  const showSyntaxErrors = ref(true);

  return () => (
    <SandpackProvider files={files(true)} template="react">
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackPreview />
      </SandpackLayout>

      <SandpackLayout style={{ marginTop: 12 }}>
        <SandpackConsole
          showHeader={showHeader.value}
          showSyntaxError={showSyntaxErrors.value}
        />
      </SandpackLayout>

      <br />

      <label>
        <input
          checked={showHeader.value}
          onChange={({ target }) => { showHeader.value = (target as any)?.checked ?? false; }}
          type="checkbox"
        />
        Show header
      </label>

      <label>
        <input
          checked={showSyntaxErrors.value}
          onChange={({ target }) => { showSyntaxErrors.value = (target as any)?.checked ?? false; }}
          type="checkbox"
        />
        Show syntax errors
      </label>
    </SandpackProvider>
  );
};

export const Preset = () => (
  <div style={{ width: 'auto' }}>
    <h3><pre>showConsoleButton: false, showConsole: false</pre></h3>
    <Sandpack template="react" />

    <br />

    <h3><pre>showConsoleButton: true, showConsole: true</pre></h3>
    <Sandpack
      files={files(false)}
      options={{ showConsoleButton: true, showConsole: true }}
      template="react"
    />

    <br />

    <h3><pre>showConsoleButton: false, showConsole: true</pre></h3>
    <Sandpack
      files={files(false)}
      options={{ showConsoleButton: false, showConsole: true }}
      template="react"
    />

    <br />

    <h3><pre>showConsoleButton: true, showConsole: false</pre></h3>
    <Sandpack
      files={files(false)}
      options={{ showConsoleButton: true, showConsole: false }}
      template="react"
    />
  </div>
);

export const ImperativeReset = () => {
  const consoleRef = ref();

  const resetLogs = () => {
    consoleRef.value?.reset();
  };

  return () => (
    <SandpackProvider
      files={{
        '/index.js': `import "./styles.css";

console.log(111);
document.getElementById("app").innerHTML = \`
<h1>Hello world</h1>
\`;
`,
      }}
    >
      <SandpackCodeEditor showTabs />
      <SandpackPreview />
      <button onClick={resetLogs}>Reset logs</button>
      <SandpackConsole resetOnPreviewRestart={true} ref={consoleRef} />
    </SandpackProvider>
  );
};

export const StandaloneMode = () => (
  <SandpackProvider
    files={{
      '/.eslintrc.js': `module.exports = {
  rules: {
    "no-unused-vars": "error",
    "no-console": "error",
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
}`,
      '/index.js': `const helloWorld = "";
console.log("foo");`,

      '/package.json': JSON.stringify({
        devDependencies: {
          eslint: '^8.0.1',
        },
        scripts: { start: 'eslint index.js' },
      }),
    }}
    options={{ visibleFiles: ['/index.js', '/.eslintrc.js'] }}
    template="node"
  >
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackConsole standalone />
    </SandpackLayout>
  </SandpackProvider>
);

export const EslintBasic = () => (
  <Sandpack
    files={{
      '/.eslintrc.js': `module.exports = {
  rules: {
    "no-unused-vars": "error",
    "no-console": "error",
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
}`,
      '/index.js': `const helloWorld = "";
console.log("foo");`,

      '/package.json': JSON.stringify({
        devDependencies: {
          eslint: '^8.0.1',
        },
        scripts: { start: 'eslint index.js' },
      }),
    }}
    options={{
      visibleFiles: ['/index.js', '/.eslintrc.js'],
      showConsole: true,
    }}
    template="node"
  />
);
