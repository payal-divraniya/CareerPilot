import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8DDE7] bg-[#FFF7F1]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#80558F] text-xl font-black text-white shadow-sm">
            C
          </span>
          <span>
            <span className="block text-lg font-extrabold tracking-tight">
              CareerPilot
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[.18em] text-[#5F5263]">
              Job Application Tracker
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="rounded-xl border border-[#E8DDE7] px-3 py-2 text-sm md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <div
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-4 border-b border-[#E8DDE7] bg-[#FFF7F1] px-5 py-5 md:static md:flex md:flex-row md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0`}
        >
          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-[#505348] hover:text-[#72547D]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-[#505348] hover:text-[#72547D]"
          >
            How it works
          </a>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold hover:text-[#72547D]"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl bg-[#80558F] px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#8F668F]"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
