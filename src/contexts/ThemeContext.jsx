import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('civicfix_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('civicfix_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const customTheme = {
    algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#f5222d',
      borderRadius: 10,
      fontFamily: "'Inter', sans-serif",
      colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
      colorBgLayout: isDarkMode ? '#141414' : '#f5f7fa',
    },
    components: {
      Card: {
        colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
        borderRadiusLG: 14,
      },
      Button: {
        borderRadius: 8,
        fontWeight: 600,
      },
      Table: {
        borderRadius: 12,
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={customTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
