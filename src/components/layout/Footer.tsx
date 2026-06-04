import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/fitconnect-icon.png" alt="FitConnect" className="w-6 h-6 rounded-md" />
            <span>© {new Date().getFullYear()} FitConnect. All rights reserved.</span>
          </div>
          <nav className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <a href="mailto:support@fitconnect.app" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
