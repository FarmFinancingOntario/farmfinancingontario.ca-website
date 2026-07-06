import logo from "../../logo.png";

function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-moss text-white sm:min-h-[760px] lg:min-h-[720px]">
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80"
        alt="Open farmland under a clear sky"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(31,49,31,0.92)_0%,rgba(47,81,56,0.78)_44%,rgba(47,81,56,0.36)_100%)]" />
      <div className="section-shell flex min-h-[calc(100vh-5rem)] items-center py-16 sm:min-h-[760px] lg:min-h-[720px]">
        <div className="max-w-3xl">
          <img
            src={logo}
            alt="Farm Financing Ontario"
            className="mb-8 h-36 w-auto object-contain drop-shadow-md sm:h-44 lg:h-52"
          />
          <p className="text-sm font-semibold uppercase tracking-wide text-wheat">
            Farm Financing Solution
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Farm and rural mortgage financing with practical lender guidance.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100 sm:text-xl">
            Farm Financing Ontario helps farmers, rural property buyers, and
            landowners find financing options for purchases, refinancing,
            construction, land acquisition, and private lending.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="focus-ring inline-flex items-center justify-center rounded-md bg-wheat px-6 py-3.5 text-base font-semibold text-stone-950 shadow-soft transition hover:bg-[#D6AA4F]"
            >
              Request a Financing Review
            </a>
            <a
              href="#how-it-works"
              className="focus-ring inline-flex items-center justify-center rounded-md border border-white/55 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
