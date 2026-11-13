import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { formatEuro, type Product } from '../data/products';
import { SafeImage } from './SafeImage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variantId: string, quantity: number) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariantId(product.variants[0]?.id ?? '');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const activePrice = activeVariant ? activeVariant.price : product.price;

  const handleSubmit = () => {
    onAddToCart(product, activeVariant?.id ?? product.variants[0]?.id ?? 'default', quantity);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fiche produit"
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid items-stretch gap-8 md:grid-cols-2 md:gap-10">
          <div className="arch-frame aspect-[3/4] overflow-hidden bg-secondary">
            <SafeImage
              src={product.image}
              alt={product.alt}
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{product.productType}</span>
                <span aria-hidden="true">·</span>
                <span>Formulé à Paris</span>
                {product.tag && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-primary">{product.tag}</span>
                  </>
                )}
              </div>

              <h2
                id="pdp-title"
                className="mt-2 font-display text-4xl font-medium leading-tight text-foreground"
              >
                {product.title}
              </h2>

              <p className="mt-2 text-lg font-semibold tabular-nums text-foreground">
                {formatEuro(activePrice)}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Format &amp; nuance
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === activeVariant?.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`rounded-full px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-foreground text-background'
                            : 'border border-border bg-card text-foreground hover:border-primary'
                        }`}
                      >
                        {variant.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actifs clés
                  </p>
                  <p className="mt-1 text-foreground">
                    {product.keyIngredients.join(' · ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Gestuelle d&apos;application
                  </p>
                  <p className="mt-1 text-muted-foreground">{product.ritualStep}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
              <div className="inline-flex items-center rounded-full border border-border bg-card px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuer la quantité"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Augmenter la quantité"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#8c3147] whitespace-nowrap cursor-pointer"
              >
                Ajouter au panier · {formatEuro(activePrice * quantity)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
