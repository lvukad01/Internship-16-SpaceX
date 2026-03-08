import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';

interface ThemeState {
  isDark: boolean;
}

type ThemeAction = { type: 'TOGGLE_THEME' };

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { isDark: !state.isDark };
    default:
      return state;
  }
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    isDark: localStorage.getItem('theme') !== 'light'
  });

  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  useEffect(() => {
    const themeValue = state.isDark ? 'dark' : 'light';
    localStorage.setItem('theme', themeValue);
    
    if (state.isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [state.isDark]);

  return (
    <ThemeContext.Provider value={{ isDark: state.isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};