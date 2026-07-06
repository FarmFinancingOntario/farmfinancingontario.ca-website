import logo from "../../logo.png";
import pineappleLogo from "../../pineapple.png";

function Footer() {
  return (
    <footer className="border-t border-oat bg-white py-10">
      <div className="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <img
            src={logo}
            alt="Farm Financing Ontario logo"
            className="h-16 w-16 object-contain"
          />
          <div>
            <p className="text-lg font-semibold text-moss">
              Farm Financing Ontario
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Mortgage and financing information is provided for general
              guidance only. Financing availability, rates, terms, and approvals
              depend on lender criteria, property details, borrower profile, and
              documentation.
            </p>
            <p className="mt-3 text-sm font-semibold text-stone-700">
              Lic. ON-M25002012
            </p>
          </div>
        </div>
        <div className="text-sm leading-6 text-stone-600 md:text-right">
          <a
            href="mailto:advitiyagirdhar@gopineapple.com"
            className="block transition hover:text-field"
          >
            advitiyagirdhar@gopineapple.com
          </a>
          <a
            href="tel:+17059057765"
            className="block transition hover:text-field"
          >
            705-905-7765
          </a>
          <div className="mt-5 flex flex-col gap-2 md:items-end">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Powered by Pineapple
            </p>
            <img
              src={pineappleLogo}
              alt="Pineapple brokerage logo"
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
