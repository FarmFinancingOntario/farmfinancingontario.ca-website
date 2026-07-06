import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ServiceCard from "./components/ServiceCard";

const valueItems = [
  {
    title: "Farm Purchases",
    description:
      "Financing guidance for working farms, acreages, and rural homes where income, land use, and property value all matter.",
  },
  {
    title: "Rural Property Refinancing",
    description:
      "Review current mortgage terms, equity, debt structure, and practical options for lowering pressure or freeing capital.",
  },
  {
    title: "Private Lending Options",
    description:
      "Access lender alternatives for unique rural files, transition periods, credit challenges, or time-sensitive purchases.",
  },
  {
    title: "Land and Construction Financing",
    description:
      "Support for vacant land, farm expansion, outbuildings, rural construction, and staged financing conversations.",
  },
];

const steps = [
  {
    title: "Share your financing needs",
    description:
      "Tell us about the property, timing, amount required, and what you want the financing to accomplish.",
  },
  {
    title: "Review available options",
    description:
      "We compare lender fit, terms, documentation needs, and practical tradeoffs for your rural financing scenario.",
  },
  {
    title: "Move forward with the right lender",
    description:
      "Once there is a clear direction, you get help preparing the file and moving toward approval with confidence.",
  },
];

const services = [
  {
    title: "Farm Mortgage Financing",
    description:
      "Mortgage planning for farm purchases, mixed rural properties, and agricultural operations.",
  },
  {
    title: "Land Acquisition Financing",
    description:
      "Options for vacant land, expansion parcels, and strategic rural property purchases.",
  },
  {
    title: "Rural Property Refinancing",
    description:
      "Refinance support for rural homes, acreages, farm properties, and equity-based restructuring.",
  },
  {
    title: "Construction and Expansion Financing",
    description:
      "Financing conversations for new builds, barns, shops, outbuildings, and operational expansion.",
  },
  {
    title: "Private Mortgage Solutions",
    description:
      "Alternative lender pathways when traditional bank criteria do not match the property or borrower profile.",
  },
  {
    title: "Debt Consolidation for Rural Property Owners",
    description:
      "Use property equity to simplify payments and create a more manageable financing structure.",
  },
];

const reasons = [
  "Specialized rural financing guidance",
  "Clear process from first review to lender conversation",
  "Fast follow-up when timing matters",
  "Practical lender matching for farm and rural files",
];

function App() {
  return (
    <div className="min-h-screen bg-cream text-stone-900">
      <Header />
      <main>
        <Hero />

        <section id="value" className="bg-cream py-16 sm:py-20">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-clay">
                Rural financing support
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-moss sm:text-4xl">
                Mortgage options built around real rural property needs.
              </h2>
              <p className="mt-4 text-lg leading-8 text-stone-700">
                Farm Financing Ontario helps turn complicated property, income,
                and lender requirements into a clear path forward.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {valueItems.map((item) => (
                <ServiceCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  tone="light"
                />
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-white py-16 sm:py-20">
          <div className="section-shell">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-clay">
                  How it works
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-moss sm:text-4xl">
                  A straightforward process for complex rural lending.
                </h2>
                <p className="mt-4 text-lg leading-8 text-stone-700">
                  Get a practical financing review before you commit time,
                  money, or energy to the wrong lender path.
                </p>
              </div>
              <ol className="grid gap-5">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-lg border border-oat bg-cream p-6 shadow-sm"
                  >
                    <div className="flex gap-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-field text-base font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-moss">
                          {step.title}
                        </h3>
                        <p className="mt-2 leading-7 text-stone-700">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="services" className="bg-[#F2E9D8] py-16 sm:py-20">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-clay">
                  Services
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-moss sm:text-4xl">
                  Financing guidance for farms, land, rural homes, and growth.
                </h2>
              </div>
              <a
                href="#contact"
                className="focus-ring inline-flex w-fit items-center justify-center rounded-md bg-moss px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-field"
              >
                Request a Review
              </a>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  tone="white"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-moss py-16 text-white sm:py-20">
          <div className="section-shell">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-wheat">
                  Why choose Farm Financing Ontario
                </p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                  Rural files need lender matching that respects the property.
                </h2>
                <p className="mt-4 text-lg leading-8 text-stone-100">
                  Farm and acreage financing can involve unique appraisal,
                  income, zoning, and property considerations. The right
                  conversation early can save weeks of friction.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {reasons.map((reason) => (
                  <div
                    key={reason}
                    className="rounded-lg border border-white/15 bg-white/10 p-5"
                  >
                    <div
                      className="mb-4 h-1 w-12 rounded-full bg-wheat"
                      aria-hidden="true"
                    />
                    <p className="text-lg font-semibold leading-7">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-cream py-16 sm:py-20">
          <div className="section-shell">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-clay">
                  Request a financing review
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-moss sm:text-4xl">
                  Tell us what you are trying to finance.
                </h2>
                <p className="mt-4 text-lg leading-8 text-stone-700">
                  Send a few details and Farm Financing Ontario will follow up
                  to discuss the property, amount, timing, and lender options
                  that may fit.
                </p>
                <div className="mt-8 rounded-lg border border-oat bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wide text-field">
                    Contact
                  </p>
                  <a
                    href="mailto:advitiyagirdhar@gopineapple.com"
                    className="mt-3 block text-lg font-semibold text-stone-900 transition hover:text-field"
                  >
                    advitiyagirdhar@gopineapple.com
                  </a>
                  <a
                    href="tel:+17059057765"
                    className="mt-1 block text-stone-700 transition hover:text-field"
                  >
                    705-905-7765
                  </a>
                  <p className="mt-3 text-sm font-medium text-stone-600">
                    Lic. ON-M25002012
                  </p>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
