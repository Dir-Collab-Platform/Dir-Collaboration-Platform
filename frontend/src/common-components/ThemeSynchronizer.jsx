import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext/AuthContext';

export default function ThemeSynchronizer() {
    const { user } = useAuth();

    useEffect(() => {
        const theme = user?.preferences?.theme || 'system';
        const root = document.documentElement;

        const applyTheme = (themeName) => {
            if (themeName === 'light') {
                root.setAttribute('data-theme', 'light');
                root.classList.remove('dark');
                root.classList.add('light');
            } else {
                root.setAttribute('data-theme', 'dark');
                root.classList.remove('light');
                root.classList.add('dark');
            }
        };

        if (theme === 'system') {
            const query = window.matchMedia('(prefers-color-scheme: light)');
            const systemTheme = query.matches ? 'light' : 'dark';
            applyTheme(systemTheme);

            const handler = (e) => applyTheme(e.matches ? 'light' : 'dark');
            query.addEventListener('change', handler);
            return () => query.removeEventListener('change', handler);
        } else {
            applyTheme(theme);
        }
    }, [user?.preferences?.theme]);

    return null;
}
