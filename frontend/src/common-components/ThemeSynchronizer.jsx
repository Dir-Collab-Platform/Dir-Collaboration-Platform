import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext/AuthContext';

export default function ThemeSynchronizer() {
    const { user } = useAuth();

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = (themeName) => {
            if (themeName === 'light') {
                root.setAttribute('data-theme', 'light');
                root.classList.remove('dark');
                root.classList.add('light');
            } else if (themeName === 'dark') {
                root.setAttribute('data-theme', 'dark');
                root.classList.remove('light');
                root.classList.add('dark');
            } else {
                // system
                const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                applyTheme(isLight ? 'light' : 'dark');
            }
        };

        const update = () => {
            const localTheme = localStorage.getItem('theme');
            const userTheme = user?.preferences?.theme;
            const theme = localTheme || userTheme || 'system';
            applyTheme(theme);
        };

        // Initial apply
        update();

        // Listen for manual theme changes in the same tab
        window.addEventListener('theme-change', update);

        // Listen for changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme' || !e.key) update();
        });

        // Listen for system theme changes
        const mql = window.matchMedia('(prefers-color-scheme: light)');
        const handleSystemChange = () => {
            const currentTheme = localStorage.getItem('theme') || user?.preferences?.theme || 'system';
            if (currentTheme === 'system') update();
        };
        mql.addEventListener('change', handleSystemChange);

        return () => {
            window.removeEventListener('theme-change', update);
            window.removeEventListener('storage', update);
            mql.removeEventListener('change', handleSystemChange);
        };
    }, [user?.preferences?.theme]);

    return null;
}
