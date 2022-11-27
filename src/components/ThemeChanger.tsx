import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, themes } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div>The current theme is: on server</div>;

  return (
    <div>
      The current theme is: {theme}
      {JSON.stringify(themes)}
      {themes.map((item) => (
        <button key={item} onClick={() => setTheme(item)}>
          {item} Mode
        </button>
      ))}
    </div>
  );
};
