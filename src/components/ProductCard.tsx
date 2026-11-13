import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { formatEuro, type Product } from '../data/products';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
}

export function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, product.variants[0]?.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(product)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(product);
          }
        }}
        className="relative cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="arch-frame aspect-[3/4] overflow-hidden bg-secondary transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
          <SafeImage
            src={product.image}
            alt={product.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{product.productType}</span>
            <span aria-hidden="true">·</span>
            <span>{product.volume}</span>
            {product.tag && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-primary">{product.tag}</span>
              </>
            )}
          </div>

          <h3 className="mt-1.5 font-display text-2xl font-medium leading-snug text-foreground">
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="text-left transition-colors hover:text-primary cursor-pointer"
            >
              {product.title}
            </button>
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {product.subtitle}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {formatEuro(product.price)}
          </span>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              justAdded
                ? 'bg-foreground text-background'
                : 'border border-border bg-card text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Ajouté</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Ajouter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
