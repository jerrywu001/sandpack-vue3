export interface SandpackSyntaxStyle {
  color?: string;
  fontStyle?: 'normal' | 'italic';
  fontWeight?:
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';
  textDecoration?:
  | 'none'
  | 'underline'
  | 'line-through'
  | 'underline line-through';
}

export type EditorState = 'pristine' | 'dirty';

export interface SandpackTheme {
  palette: {
    activeText: string;
    defaultText: string;
    inactiveText: string;
    activeBackground: string;
    defaultBackground: string;
    inputBackground: string;
    accent: string;
    errorBackground: string;
    errorForeground: string;
  };
  syntax: {
    plain: string | SandpackSyntaxStyle;
    comment: string | SandpackSyntaxStyle;
    keyword: string | SandpackSyntaxStyle;
    definition: string | SandpackSyntaxStyle;
    punctuation: string | SandpackSyntaxStyle;
    property: string | SandpackSyntaxStyle;
    tag: string | SandpackSyntaxStyle;
    static: string | SandpackSyntaxStyle;
    string?: string | SandpackSyntaxStyle; // use static as fallback
  };
  typography: {
    bodyFont: string;
    monoFont: string;
    fontSize: string;
    lineHeight: string;
  };
}

export type SandpackPartialTheme = DeepPartial<SandpackTheme>;

export type SandpackThemeProp =
  | SandpackPredefinedTheme
  | SandpackPartialTheme
  | 'auto';

export interface SandpackFile {
  code: string;
  hidden?: boolean;
  active?: boolean;
  readOnly?: boolean;
}

export type SandpackFiles = Record<string, string | SandpackFile>;
export interface SandpackSetup {
  /**
   * Examples:
   * ```js
   * {
   *  "react": "latest",
   *  "@material-ui/core": "4.12.3",
   * }
   * ```
   */
  dependencies?: Record<string, string>;

  /**
   * Examples:
   * ```js
   * {
   *  "@types/react": "latest",
   * }
   * ```
   */
  devDependencies?: Record<string, string>;

  /**
   * The entry file is the starting point of the bundle process.
   *
   * If you change the path of the entry file, make sure you control all the files that go into the bundle process,
   *  - as prexisting settings in the template might not work anymore.
   */
  entry?: string;
  main?: string;
  files?: SandpackFiles;
  environment?: SandboxEnvironment;
}

export type SandboxEnvironment =
  | 'angular-cli'
  | 'create-react-app'
  | 'create-react-app-typescript'
  | 'svelte'
  | 'parcel'
  | 'vue-cli'
  | 'static'
  | 'solid';

export type SandpackPredefinedTemplate =
  | 'angular'
  | 'react'
  | 'react-ts'
  | 'vanilla'
  | 'vanilla-ts'
  | 'vue'
  | 'vue3'
  | 'svelte'
  | 'solid-beta';

export type SandpackPredefinedTheme =
  | 'light'
  | 'dark'
  | 'sandpack-dark'
  | 'night-owl'
  | 'aqua-blue'
  | 'github-light'
  | 'monokai-pro';

export interface SandboxTemplate {
  files: Record<string, SandpackFile>;
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  entry: string;
  main: string;
  environment: SandboxEnvironment;
}

/**
 * @hidden
 */
export type DeepPartial<Type> = {
  [Property in keyof Type]?: DeepPartial<Type[Property]>;
};

export interface FileResolver {
  isFile: (path: string) => Promise<boolean>;
  readFile: (path: string) => Promise<string>;
}
