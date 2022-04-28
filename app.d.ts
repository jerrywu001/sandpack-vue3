declare module 'esbuild-plugin-babel' {
  export default function babel(build?: any): any;
}

declare module 'shelljs' {
  export function mv(permission: string, source: string, dest: string): void;
}
