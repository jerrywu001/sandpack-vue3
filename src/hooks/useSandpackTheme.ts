import { defaultLight } from '../themes';
import { SandpackThemeContext, SandpackThemeProviderContext } from '../contexts/themeContext';
import { useContext } from './context';

/**
 * useSandpackTheme
 */
export const useSandpackTheme = (): SandpackThemeProviderContext => useContext(SandpackThemeContext, {
  theme: defaultLight,
  id: 'light',
  mode: 'light',
});
