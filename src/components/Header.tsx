import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import type { RayonId } from '../data/products';

interface HeaderProps {
  cartCount: number;
  activeView: 'shop' | 'diagnostic';
  onNavigateView: (view: 'shop' | 'diagnostic', sectionId?: RayonId) => void;
  onOpenCart: () => void;
}

export function Header({
  cartCount,
  activeView,
  onNavigateView,
  onOpenCart,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; target: RayonId | 'diagnostic' }[] = [
    { label: 'Soins visage', target: 'visage' },
    { label: 'Lèvres', target: 'levres' },
    { label: 'Corps & bain', target: 'corps' },
    { label: 'Parfums', target: 'parfums' },
    { label: 'Diagnostic', target: 'diagnostic' },
  ];

  const handleNavClick = (target: RayonId | 'diagnostic') => {
    setMobileMenuOpen(false);
    if (target === 'diagnostic') {
      onNavigateView('diagnostic');
    } else {
      onNavigateView('shop', target);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-2xl font-medium tracking-tight text-foreground whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Lumière d&apos;Arche
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden md:flex items-center gap-7 text-sm text-muted-foreground"
        >
          {navItems.map((item) => {
            const isActive = item.target === 'diagnostic' && activeView === 'diagnostic';
            return (
              <button
                key={item.target}
                type="button"
                onClick={() => handleNavClick(item.target)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary cursor-pointer ${
                  isActive ? 'font-medium text-foreground' : ''
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px bg-primary transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Ouvrir le panier (${cartCount} article${cartCount > 1 ? 's' : ''})`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-medium tracking-wide text-primary-foreground transition-colors duration-200 hover:bg-[#8c3147] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Panier</span>
            <span className="tabular-nums">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Menu mobile"
          className="border-t border-border bg-background px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.target}
                type="button"
                onClick={() => handleNavClick(item.target)}
                className="py-2 text-left text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
