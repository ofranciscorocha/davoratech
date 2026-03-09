import { ThemeProvider } from '@/context/ThemeContext';
import './leiloes.css';

export default function LeiloesLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div id="leiloes-root" className="antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
                {children}
            </div>
        </ThemeProvider>
    );
}
