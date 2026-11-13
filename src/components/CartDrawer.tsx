import { useEffect, useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatEuro, type Product } from '../data/products';
import { SafeImage } from './SafeImage';

export interface CartItem {
  product: Product;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  promoApplied: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onClearCart: () => void;
  onTogglePromo: (applied: boolean) => void;
}

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.9;

export function CartDrawer({
  isOpen,
  items,
  promoApplied,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onTogglePromo,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('ARCHE15');
  const [promoError, setPromoError] = useState('');
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPostal, setCustomerPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    total: number;
    name: string;
    address: string;
    itemCount: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length > 0 && step === 'confirmed') {
      setStep('cart');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const freeShipping = afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0;
  const shippingCost = freeShipping ? 0 : SHIPPING_FEE;
  const total = afterDiscount + shippingCost;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'ARCHE15') {
      setPromoError('');
      onTogglePromo(true);
    } else {
      setPromoError('Code non reconnu. Utilisez ARCHE15 pour -15 %.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerAddress.trim() ||
      !customerPostal.trim()
    ) {
      setFormError('Merci de renseigner tous les champs de livraison.');
      return;
    }
    setFormError('');
    const orderNum = `LA-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    setConfirmedOrder({
      id: orderNum,
      total,
      name: customerName.trim(),
      address: `${customerAddress.trim()}, ${customerPostal.trim()}`,
      itemCount: totalCount,
    });
    onClearCart();
    setStep('confirmed');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Votre panier"
      className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-medium text-foreground">
              {step === 'cart' && 'Votre panier'}
              {step === 'checkout' && 'Livraison & règlement'}
              {step === 'confirmed' && 'Commande confirmée'}
            </h2>
            {step === 'cart' && items.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {freeShipping
                  ? 'Livraison parisienne offerte débloquée'
                  : `Plus que ${formatEuro(remainingForFreeShipping)} pour la livraison offerte`}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le panier"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:border-primary hover:text-primary cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === 'cart' && items.length > 0 && (
          <div className="px-6 pt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${Math.min(100, (afterDiscount / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Merci {confirmedOrder.name}
              </p>
              <h3 className="mt-2 font-display text-3xl text-foreground">
                Commande #{confirmedOrder.id}
              </h3>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Votre coffret de {confirmedOrder.itemCount} soin
                {confirmedOrder.itemCount > 1 ? 's' : ''} est en cours de préparation à
                notre atelier rue Saint-Honoré.
              </p>

              <div className="mt-6 w-full rounded-xl border border-border bg-card p-5 text-left text-sm">
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Adresse</span>
                  <span className="text-right font-medium text-foreground">
                    {confirmedOrder.address}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border py-1.5 pt-2.5">
                  <span className="text-muted-foreground">Montant réglé</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatEuro(confirmedOrder.total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-[#8c3147] cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="arch-frame flex h-24 w-20 items-center justify-center bg-secondary text-primary">
                <ShoppingBag className="h-7 w-7 stroke-[1.5]" />
              </div>
              <p className="mt-5 font-display text-2xl text-foreground">
                Votre panier est vide
              </p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Découvrez nos sérums, crèmes velours et parfums formulés sous nos arches
                parisiennes.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-full border border-primary px-6 py-2.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                Explorer la boutique
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variantId}`}
                  className="flex gap-4 border-b border-border pb-5"
                >
                  <div className="arch-frame h-24 w-20 shrink-0 overflow-hidden bg-secondary">
                    <SafeImage
                      src={item.product.image}
                      alt={item.product.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-medium text-foreground">
                          {item.product.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.variantLabel}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id, item.variantId)}
                        aria-label={`Retirer ${item.product.title}`}
                        className="text-muted-foreground hover:text-primary cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border bg-card">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.variantId, -1)
                          }
                          aria-label="Diminuer"
                          className="inline-flex h-7 w-7 items-center justify-center text-foreground hover:text-primary cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.variantId, 1)
                          }
                          aria-label="Augmenter"
                          className="inline-flex h-7 w-7 items-center justify-center text-foreground hover:text-primary cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {formatEuro(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <form onSubmit={handleApplyPromo} className="pt-2">
                <label
                  htmlFor="promo-code"
                  className="block text-xs font-medium text-muted-foreground"
                >
                  Code de bienvenue
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="ARCHE15"
                    className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:border-primary hover:text-primary cursor-pointer"
                  >
                    {promoApplied ? 'Appliqué (-15 %)' : 'Appliquer'}
                  </button>
                </div>
                {promoError && (
                  <p className="mt-1.5 text-xs text-primary">{promoError}</p>
                )}
              </form>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-medium text-foreground"
                >
                  Nom complet
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Camille Laurent"
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-medium text-foreground"
                >
                  Email de confirmation
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="camille@exemple.fr"
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-foreground"
                >
                  Adresse de livraison
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="14 Rue des Archives, Paris"
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-postal"
                  className="block text-xs font-medium text-foreground"
                >
                  Code postal
                </label>
                <input
                  id="checkout-postal"
                  type="text"
                  required
                  value={customerPostal}
                  onChange={(e) => setCustomerPostal(e.target.value)}
                  placeholder="75004"
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium text-foreground">Mode de règlement</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-secondary text-foreground'
                        : 'border-border bg-card text-muted-foreground'
                    }`}
                  >
                    Carte bancaire
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-secondary text-foreground'
                        : 'border-border bg-card text-muted-foreground'
                    }`}
                  >
                    À la livraison
                  </button>
                </div>
              </div>

              {formError && <p className="text-xs text-primary">{formError}</p>}
            </form>
          )}
        </div>

        {items.length > 0 && step !== 'confirmed' && (
          <div className="border-t border-border bg-card px-6 py-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span className="tabular-nums">{formatEuro(subtotal)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-primary">
                  <span>Offre bienvenue (-15 %)</span>
                  <span className="tabular-nums">-{formatEuro(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span className="tabular-nums">
                  {freeShipping ? 'Offerte' : formatEuro(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold text-foreground">
                <span>Total</span>
                <span className="tabular-nums">{formatEuro(total)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#8c3147] cursor-pointer"
              >
                Passer la commande
              </button>
            ) : (
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="rounded-full border border-border px-5 py-3 text-xs font-medium text-foreground hover:border-primary cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#8c3147] cursor-pointer"
                >
                  Confirmer · {formatEuro(total)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
