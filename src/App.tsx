import { useEffect, useMemo, useState } from 'react';
import { Check, Leaf, Lock, Rabbit, Search, Star, Truck } from 'lucide-react';
import {
  HERO_IMAGE,
  PRODUCTS,
  SECTIONS,
  WELCOME_IMAGE,
  type Product,
  type RayonId,
} from './data/products';
import { Header } from './components/Header';
import { SafeImage } from './components/SafeImage';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, type CartItem } from './components/CartDrawer';
import { DiagnosticView } from './components/DiagnosticView';

const STORAGE_KEY = 'lumiere_darche_cart_v1';

export default function App() {
  const [activeView, setActiveView] = useState<'shop' | 'diagnostic'>('shop');
  const [activeRayonFilter, setActiveRayonFilter] = useState<RayonId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [welcomeCopied, setWelcomeCopied] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved) as {
        productId: string;
        variantId: string;
        quantity: number;
      }[];
      return parsed
        .map((entry) => {
          const product = PRODUCTS.find((p) => p.id === entry.productId);
          if (!product) return null;
          const variant =
            product.variants.find((v) => v.id === entry.variantId) ?? product.variants[0];
          return {
            product,
            variantId: variant?.id ?? 'default',
            variantLabel: variant?.label ?? product.volume,
            unitPrice: variant?.price ?? product.price,
            quantity: Math.max(1, entry.quantity),
          };
        })
        .filter((x): x is CartItem => x !== null);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const serializable = cartItems.map((item) => ({
        productId: item.product.id,
        variantId: item.variantId,
        quantity: item.quantity,
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignore storage write errors in restricted environments
    }
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product, variantId?: string, quantity = 1) => {
    const variant =
      product.variants.find((v) => v.id === variantId) ?? product.variants[0];
    const resolvedVariantId = variant?.id ?? 'default';
    const resolvedLabel = variant?.label ?? product.volume;
    const resolvedPrice = variant?.price ?? product.price;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.variantId === resolvedVariantId
      );
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          variantId: resolvedVariantId,
          variantLabel: resolvedLabel,
          unitPrice: resolvedPrice,
          quantity,
        },
      ];
    });
  };

  const handleAddRoutineToCart = (products: Product[]) => {
    products.forEach((p) => handleAddToCart(p, p.variants[0]?.id, 1));
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (
    productId: string,
    variantId: string,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variantId === variantId)
      )
    );
  };

  const handleNavigateView = (view: 'shop' | 'diagnostic', sectionId?: RayonId) => {
    setActiveView(view);
    if (view === 'diagnostic') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId) {
      setActiveRayonFilter('all');
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    }
  };

  const handleApplyWelcomeOffer = () => {
    setPromoApplied(true);
    setWelcomeCopied(true);
    window.setTimeout(() => setWelcomeCopied(false), 2200);
    if (cartItems.length > 0) {
      setIsCartOpen(true);
    } else {
      const el = document.getElementById('visage');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesRayon =
        activeRayonFilter === 'all' || product.rayon === activeRayonFilter;
      const matchesQuery =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.subtitle.toLowerCase().includes(q) ||
        product.productType.toLowerCase().includes(q);
      return matchesRayon && matchesQuery;
    });
  }, [activeRayonFilter, searchQuery]);

  const visibleSections = SECTIONS.filter(
    (sec) => activeRayonFilter === 'all' || sec.id === activeRayonFilter
  );

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Header
        cartCount={cartCount}
        activeView={activeView}
        onNavigateView={handleNavigateView}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {activeView === 'diagnostic' ? (
        <main>
          <DiagnosticView
            onBackToShop={() => handleNavigateView('shop')}
            onAddRoutineToCart={handleAddRoutineToCart}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        </main>
      ) : (
        <main>
          {/* Hero architectural boutique */}
          <section className="relative overflow-hidden">
            <SafeImage
              src={HERO_IMAGE}
              alt="Intérieur de la boutique Lumière d'Arche, rue Saint-Honoré à Paris"
              width={1600}
              height={1008}
              loading="eager"
              className="h-[74vh] min-h-[500px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1418]/85 via-[#1E1418]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-12 px-6 text-center md:bottom-16">
              <p className="text-xs uppercase tracking-[0.4em] text-[#F3EAE6]">
                Paris · Saint-Honoré
              </p>
              <h1 className="mt-3 font-display text-5xl font-medium text-white md:text-7xl lg:text-8xl text-balance">
                Lumière d&apos;Arche
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#F7F1EE]/90 md:text-base">
                Des soins qui font briller la peau, choisis avec amour sous nos arches
                roses.
              </p>
              <a
                href="#visage"
                className="mt-8 inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-colors duration-200 hover:bg-[#8c3147]"
              >
                Découvrir la collection
              </a>
            </div>
          </section>

          {/* Reassurance strip */}
          <section className="border-y border-border bg-card">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
              {[
                {
                  Icon: Leaf,
                  title: 'Ingrédients clean',
                  desc: 'Doux pour votre peau',
                },
                {
                  Icon: Rabbit,
                  title: 'Cruelty free',
                  desc: 'Jamais testé sur les animaux',
                },
                {
                  Icon: Lock,
                  title: 'Paiement sécurisé',
                  desc: '100 % protégé',
                },
                {
                  Icon: Truck,
                  title: 'Livraison offerte',
                  desc: "Dès 50 € d'achat",
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3.5">
                  <Icon className="h-5 w-5 shrink-0 stroke-[1.5] text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Nos rayons */}
          <section className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center font-display text-4xl font-medium text-foreground md:text-5xl">
              Nos rayons
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveRayonFilter('all');
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <div className="arch-frame aspect-[3/4] overflow-hidden bg-secondary">
                    <SafeImage
                      src={sec.img}
                      alt={sec.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 font-display text-2xl font-medium text-foreground">
                    {sec.title}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-primary">
                    Découvrir →
                  </p>
                </a>
              ))}
            </div>
          </section>

          {/* Filter & Search Bar */}
          <section className="border-t border-border bg-card/60">
            <div className="mx-auto flex max-w-6xl flex-col items-stretch justify-between gap-4 px-6 py-5 md:flex-row md:items-center">
              <div
                role="tablist"
                aria-label="Filtrer par rayon"
                className="flex flex-wrap items-center gap-1.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeRayonFilter === 'all'}
                  onClick={() => setActiveRayonFilter('all')}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeRayonFilter === 'all'
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  Tous les soins
                </button>
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    role="tab"
                    aria-selected={activeRayonFilter === sec.id}
                    onClick={() => setActiveRayonFilter(sec.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeRayonFilter === sec.id
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un soin..."
                  aria-label="Rechercher un soin"
                  className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Product Sections */}
          {filteredProducts.length === 0 ? (
            <div className="mx-auto my-20 max-w-sm px-6 text-center">
              <div className="arch-frame border border-border bg-card px-8 py-16">
                <p className="font-display text-2xl text-foreground">
                  Aucun soin trouvé
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Essayez un autre mot-clé ou réinitialisez le filtre.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveRayonFilter('all');
                  }}
                  className="mt-6 rounded-full border border-primary px-6 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Voir toute la collection
                </button>
              </div>
            </div>
          ) : (
            visibleSections.map((sec, idx) => {
              const list = filteredProducts.filter((p) =>
                sec.types.includes(p.productType)
              );
              if (list.length === 0) return null;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className={`scroll-mt-20 py-20 ${
                    idx % 2 === 1 ? 'bg-secondary/50' : ''
                  }`}
                >
                  <div className="mx-auto max-w-6xl px-6">
                    <p className="text-center text-xs uppercase tracking-[0.4em] text-muted-foreground">
                      {sec.kicker}
                    </p>
                    <h2 className="neon-text mt-2 text-center font-display text-4xl font-medium text-foreground md:text-5xl">
                      {sec.title}
                    </h2>
                    <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
                      {list.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={(p) => setSelectedProduct(p)}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              );
            })
          )}

          {/* Offre de bienvenue */}
          <section className="bg-secondary">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Offre de bienvenue
                </p>
                <h2 className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl text-balance">
                  -15 % sur votre première commande
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                  Des formules douces, des teintes poudrées, une peau qui rayonne comme
                  un matin de printemps.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleApplyWelcomeOffer}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#8c3147] cursor-pointer"
                  >
                    {welcomeCopied && <Check className="h-4 w-4" />}
                    <span>
                      {welcomeCopied || promoApplied
                        ? 'Code ARCHE15 activé (-15 %)'
                        : "J'en profite · Code ARCHE15"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="arch-frame aspect-square overflow-hidden bg-background">
                <SafeImage
                  src={WELCOME_IMAGE}
                  alt="Parfum Lumière d'Arche"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Témoignages de nos clientes */}
          <section className="border-b border-border bg-background py-20">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-center text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Avis vérifiés
              </p>
              <h2 className="mt-2 text-center font-display text-4xl font-medium text-foreground md:text-5xl">
                Témoignages de nos clientes
              </h2>

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {[
                  {
                    name: 'Claire Moreau',
                    location: 'Paris 8e',
                    product: "Sérum L'Éclat Rose",
                    rating: 5,
                    quote:
                      '« Mon teint était terne après l’hiver ; en trois semaines d’application matin et soir, ma peau a retrouvé une vraie luminosité sans aucune rougeur. »',
                  },
                  {
                    name: 'Inès Delacroix',
                    location: 'Lyon',
                    product: 'Crème Éclat de Matin',
                    rating: 5,
                    quote:
                      '« Une texture fouettée qui fond instantanément avant le maquillage. Elle hydrate toute la journée sans jamais laisser de fini brillant. »',
                  },
                  {
                    name: 'Margaux Lefèvre',
                    location: 'Paris 4e',
                    product: 'Eau de Parfum Rose Champagne',
                    rating: 5,
                    quote:
                      '« Un sillage floral et poudré d’une grande finesse. On me demande régulièrement le nom de mon parfum dès le matin rue Saint-Honoré. »',
                  },
                ].map((review) => (
                  <article
                    key={review.name}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-7"
                  >
                    <div>
                      <div
                        className="flex items-center gap-1 text-primary"
                        role="img"
                        aria-label={`Note : ${review.rating} sur 5`}
                      >
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <Star
                            key={idx}
                            className="h-4 w-4 fill-current"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="mt-5 text-sm leading-relaxed text-foreground">
                        {review.quote}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-border pt-4">
                      <p className="font-display text-xl font-medium text-foreground">
                        {review.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {review.product} · {review.location}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Diagnostic CTA */}
          <section className="mx-auto max-w-3xl px-6 py-24 text-center">
            <h2 className="font-display text-4xl font-medium text-foreground md:text-5xl">
              Votre routine personnalisée
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Pas sûre de quoi choisir ? Faites le diagnostic et recevez votre routine
              sur mesure.
            </p>
            <button
              type="button"
              onClick={() => handleNavigateView('diagnostic')}
              className="mt-7 inline-block rounded-full border border-primary px-8 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              Faire mon diagnostic
            </button>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-medium text-foreground">
              Lumière d&apos;Arche
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              248 Rue Saint-Honoré, 75001 Paris
              <br />
              Mardi – Samedi · 10 h 30 – 19 h 30
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p className="font-medium uppercase tracking-wider text-foreground">
              Rayons
            </p>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleNavigateView('shop', sec.id)}
                className="w-fit text-left transition-colors hover:text-foreground cursor-pointer"
              >
                {sec.title}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p className="font-medium uppercase tracking-wider text-foreground">
              Atelier &amp; Conseils
            </p>
            <button
              type="button"
              onClick={() => handleNavigateView('diagnostic')}
              className="w-fit text-left transition-colors hover:text-foreground cursor-pointer"
            >
              Diagnostic beauté personnalisé
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-fit text-left transition-colors hover:text-foreground cursor-pointer"
            >
              Mon panier ({cartCount})
            </button>
          </div>
        </div>

        <div className="border-t border-border px-6 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Lumière d&apos;Arche · Paris
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        promoApplied={promoApplied}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onTogglePromo={setPromoApplied}
      />
    </div>
  );
}
