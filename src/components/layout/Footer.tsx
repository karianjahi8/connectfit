import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-accent/15 bg-background/80">
      <div className="gradient-divider absolute top-0 left-0 right-0" />
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/fitconnect-icon.png" alt="FitConnect" className="w-9 h-9 rounded-xl" />
              <div className="absolute inset-0 rounded-xl shadow-glow opacity-60 pointer-events-none" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="eyebrow">FITCONNECT</span>
              <span className="text-xs text-muted-foreground">Borderless fitness · Powered by USDC</span>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
            <a href="mailto:support@fitconnect.app" className="hover:text-accent transition-colors">Contact</a>
          </nav>
          <div className="text-xs text-muted-foreground">
            connectfit.lovable.app · © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
