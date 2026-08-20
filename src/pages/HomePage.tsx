import { openChat } from "../lib/chat";
import StoreImage from "../components/StoreImage";
import ProductCard from "../components/ProductCard";
import {
  categories,
  products,
  heroImage,
  searchImage,
} from "../data/catalog";

const searchExamples = [
  "Summer dresses under €80",
  "Men's white sneakers",
  "Wedding guest outfit",
  "Winter coats under €150",
];

const steps = [
  {
    n: "01",
    title: "Open the chat",
    body: "Tap the chat bubble any time — our stylist is online 24/7.",
  },
  {
    n: "02",
    title: "Describe or ask",
    body: "Search by style, size, colour or budget. Not sure? Just describe the occasion.",
  },
  {
    n: "03",
    title: "Order live",
    body: "See real photos and prices, then check out without leaving the chat.",
  },
];

const HomePage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
            New season 2026
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold uppercase leading-[1.03] tracking-tight md:text-6xl">
            Dress the season, live
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Coats, dresses, shoes and bags — thousands of pieces. Tell our live
            stylist what you want and shop it right here in chat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openChat}
              className="bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brand-light"
            >
              Search clothes in chat
            </button>
            <a
              href="#new-in"
              className="border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Explore the edit
            </a>
          </div>
        </div>
      </section>

      {/* Search-by-chat band */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
              Shop by conversation
            </p>
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
              Search clothes through chat
            </h2>
            <p className="mt-4 max-w-md text-white/80">
              Describe what you're looking for — a colour, an occasion, a budget
              — and our live stylist finds it, shows you real photos and prices,
              and helps you order on the spot.
            </p>

            {/* Search-bar mockup that opens the live chat */}
            <button
              type="button"
              onClick={openChat}
              className="mt-6 flex w-full max-w-md items-center gap-3 border border-white/20 bg-white/5 px-4 py-3 text-left transition-colors hover:border-brand"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-white/60"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m20 20-3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-white/60">
                e.g. black wool coat under €200
              </span>
              <span className="ml-auto bg-brand px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink">
                Ask
              </span>
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="py-1.5 text-xs uppercase tracking-[0.15em] text-white/50">
                Try:
              </span>
              {searchExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={openChat}
                  className="border border-white/20 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-brand hover:text-white"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <StoreImage
              src={searchImage}
              alt="Rails of clothing ready to shop"
              label="Search the rails"
              className="aspect-[4/5] w-full"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink md:text-3xl">
              Shop by category
            </h2>
            <button
              type="button"
              onClick={openChat}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark hover:underline"
            >
              Ask a stylist →
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={openChat}
                className="group relative block text-left"
              >
                <StoreImage
                  src={category.image}
                  alt={category.name}
                  label={category.name}
                  className="aspect-[3/4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="text-lg font-bold uppercase tracking-wide text-white">
                    {category.name}
                  </span>
                  <span className="block text-xs uppercase tracking-[0.15em] text-white/80">
                    Shop live →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* New in */}
      <section id="new-in" className="scroll-mt-24 bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink md:text-3xl">
                New in
              </h2>
              <p className="mt-1 text-sm text-muted">
                Fresh drops, ready to order live.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={openChat}
              className="border border-ink bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Can't see it? Ask our stylist
            </button>
          </div>
        </div>
      </section>

      {/* How live shopping works */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink md:text-3xl">
            How live shopping works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="border-t-2 border-brand pt-4">
                <span className="text-sm font-bold text-brand-dark">
                  {step.n}
                </span>
                <h3 className="mt-2 text-lg font-bold uppercase tracking-wide text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink md:text-4xl">
            Can't find it? Just ask.
          </h2>
          <p className="max-w-xl text-ink/80">
            Our stylist is online now — start a conversation, search thousands of
            pieces, and shop live without leaving the page.
          </p>
          <button
            type="button"
            onClick={openChat}
            className="mt-2 bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
          >
            Start chatting
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
