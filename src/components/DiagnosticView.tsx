import { useMemo, useState } from 'react';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { PRODUCTS, formatEuro, type Product } from '../data/products';
import { SafeImage } from './SafeImage';

interface DiagnosticViewProps {
  onBackToShop: () => void;
  onAddRoutineToCart: (products: Product[]) => void;
  onSelectProduct: (product: Product) => void;
}

interface Answers {
  skinType: 'seche' | 'mixte' | 'sensible' | 'normale';
  concern: 'eclat' | 'hydratation' | 'lissage' | 'apaisement';
  lipMood: 'mat' | 'baume';
  scent: 'rose' | 'iris';
}

export function DiagnosticView({
  onBackToShop,
  onAddRoutineToCart,
  onSelectProduct,
}: DiagnosticViewProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    skinType: 'mixte',
    concern: 'eclat',
    lipMood: 'baume',
    scent: 'rose',
  });
  const [addedRoutine, setAddedRoutine] = useState(false);

  const questions = [
    {
      title: 'Comment décririez-vous votre peau au réveil ?',
      subtitle: 'Étape 1 sur 4 · Équilibre cutané',
      key: 'skinType' as const,
      options: [
        { value: 'seche', label: 'Sèche & en manque de confort', detail: 'Tiraillements légers après le nettoyage' },
        { value: 'mixte', label: 'Mixte à tendance lumineuse', detail: 'Zone T plus active, joues normales' },
        { value: 'sensible', label: 'Délicate & réactive', detail: 'Rougeurs passagères face au froid' },
        { value: 'normale', label: 'Équilibrée', detail: 'Grain régulier, besoin de maintien' },
      ],
    },
    {
      title: 'Quel est votre objectif prioritaire ce mois-ci ?',
      subtitle: 'Étape 2 sur 4 · Ciblage actif',
      key: 'concern' as const,
      options: [
        { value: 'eclat', label: 'Raviver l’éclat & unifier le teint', detail: 'Vitamine C stabilisée et rose' },
        { value: 'hydratation', label: 'Repulper & nourrir en profondeur', detail: 'Céramides et huiles fines' },
        { value: 'lissage', label: 'Lisser le grain pendant la nuit', detail: 'Bakuchiol doux et squalane' },
        { value: 'apaisement', label: 'Apaiser & rafraîchir à tout moment', detail: 'Hydrolats floraux de Grasse' },
      ],
    },
    {
      title: 'Pour vos lèvres, quel fini préférez-vous ?',
      subtitle: 'Étape 3 sur 4 · Touche couleur',
      key: 'lipMood' as const,
      options: [
        { value: 'baume', label: 'Voile nacré & soin repulpant', detail: 'Brillance discrète, confort immédiat' },
        { value: 'mat', label: 'Velours poudré longue tenue', detail: 'Couleur bois de rose affirmée' },
      ],
    },
    {
      title: 'Quelle signature olfactive accompagne votre rituel ?',
      subtitle: 'Étape 4 sur 4 · Sillage Saint-Honoré',
      key: 'scent' as const,
      options: [
        { value: 'rose', label: 'Rose fraîche & poire blanche', detail: 'Lumineux, pétillant et floral' },
        { value: 'iris', label: 'Iris poudré & vanille sèche', detail: 'Feutré, velouté et enveloppant' },
      ],
    },
  ];

  const routine = useMemo(() => {
    const faceSerum =
      answers.concern === 'lissage'
        ? PRODUCTS.find((p) => p.id === 'serum-nuit-velours')!
        : PRODUCTS.find((p) => p.id === 'serum-eclat-rose')!;

    const faceSecond =
      answers.concern === 'apaisement' || answers.skinType === 'mixte'
        ? PRODUCTS.find((p) => p.id === 'brume-aura-rose')!
        : PRODUCTS.find((p) => p.id === 'creme-nutritive-matin')!;

    const lipPick =
      answers.lipMood === 'mat'
        ? PRODUCTS.find((p) => p.id === 'rouge-velours-rosewood')!
        : PRODUCTS.find((p) => p.id === 'baume-teinte-n03')!;

    const scentPick =
      answers.scent === 'iris'
        ? PRODUCTS.find((p) => p.id === 'parfum-arche-iris')!
        : PRODUCTS.find((p) => p.id === 'parfum-rose-champagne')!;

    return [faceSerum, faceSecond, lipPick, scentPick];
  }, [answers]);

  const routineTotal = routine.reduce((acc, item) => acc + item.price, 0);
  const currentQuestion = questions[step];
  const isResult = step >= questions.length;

  const handleSelectOption = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-14 md:py-20">
      <button
        type="button"
        onClick={onBackToShop}
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Retour à la boutique</span>
      </button>

      {!isResult ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {currentQuestion.subtitle}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium text-foreground md:text-5xl text-balance">
            {currentQuestion.title}
          </h1>

          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectOption(currentQuestion.key, option.value)}
                className="flex flex-col items-start rounded-xl border border-border bg-background p-5 text-left transition-all duration-200 hover:border-primary hover:bg-secondary/60 cursor-pointer"
              >
                <span className="font-display text-2xl font-medium text-foreground">
                  {option.label}
                </span>
                <span className="mt-1.5 text-xs text-muted-foreground">
                  {option.detail}
                </span>
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="mt-8 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ← Question précédente
            </button>
          )}
        </div>
      ) : (
        <div className="mt-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Votre ordonnance beauté
            </p>
            <h1 className="neon-text mt-3 font-display text-5xl font-medium text-foreground">
              Votre routine sur mesure
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Sélectionnée pour une peau{' '}
              <strong className="font-medium text-foreground">
                {answers.skinType === 'seche'
                  ? 'sèche'
                  : answers.skinType === 'mixte'
                    ? 'mixte'
                    : answers.skinType === 'sensible'
                      ? 'délicate'
                      : 'équilibrée'}
              </strong>{' '}
              avec une priorité{' '}
              <strong className="font-medium text-foreground">
                {answers.concern === 'eclat'
                  ? 'éclat du teint'
                  : answers.concern === 'hydratation'
                    ? 'nutrition profonde'
                    : answers.concern === 'lissage'
                      ? 'renouvellement nocturne'
                      : 'apaisement botanique'}
              </strong>
              .
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {routine.map((product, index) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer"
              >
                <div className="arch-frame aspect-[3/4] overflow-hidden bg-secondary">
                  <SafeImage
                    src={product.image}
                    alt={product.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-xs text-primary">
                  Étape 0{index + 1} · {product.productType}
                </p>
                <h2 className="mt-1 font-display text-2xl font-medium text-foreground">
                  {product.title}
                </h2>
                <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                  {formatEuro(product.price)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/60 p-6 sm:flex-row">
            <div>
              <p className="font-display text-2xl text-foreground">
                Coffret complet (4 soins)
              </p>
              <p className="text-xs text-muted-foreground">
                Total {formatEuro(routineTotal)} · Éligible au code ARCHE15 (-15 %)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setAddedRoutine(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-medium text-foreground hover:border-primary cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Refaire le diagnostic</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddRoutineToCart(routine);
                  setAddedRoutine(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-medium text-primary-foreground hover:bg-[#8c3147] cursor-pointer"
              >
                {addedRoutine && <Check className="h-3.5 w-3.5" />}
                <span>
                  {addedRoutine ? 'Routine ajoutée au panier' : 'Ajouter la routine au panier'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
