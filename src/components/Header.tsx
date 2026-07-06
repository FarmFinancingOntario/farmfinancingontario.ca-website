import logo from "../../logo.png";

const navItems = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-oat/70 bg-cream/95 backdrop-blur">
      <div className="section-shell flex min-h-20 items-center justify-between gap-4">
        <a href="#" className="focus-ring flex items-center gap-3 rounded-md">
          <img
            src={logo}
            alt="Farm Financing Ontario logo"
            className="h-12 w-12 object-contain"
          />
          <div className="leading-tight">
            <p className="text-base font-semibold text-moss">
              Farm Financing Ontario
            </p>
            <p className="hidden text-sm text-stone-600 sm:block">
              Farm Financing Solution
            </p>
          </div>
        </a>

        <nav
          className="hidden items-center gap-7 text-sm font-medium text-stone-700 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md transition hover:text-moss"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="focus-ring inline-flex shrink-0 items-center justify-center rounded-md bg-field px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-moss"
        >
          Request Review
        </a>
      </div>
    </header>
  );
}

export default Header;
