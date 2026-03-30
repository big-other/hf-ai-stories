export default function Footer() {
  return (
    <footer className="border-t border-stone/60 bg-linen/50 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-dark-warm rounded-md flex items-center justify-center">
              <span className="text-paper text-[10px] font-bold tracking-tight font-sans">
                HF
              </span>
            </div>
            <span className="font-serif text-lg text-dark-warm">
              Humans First
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a
              href="https://humansfirst.com"
              className="text-muted underline underline-offset-2 decoration-stone hover:decoration-dark-warm transition-colors duration-200"
            >
              humansfirst.com
            </a>
          </nav>
        </div>

        <div className="w-12 h-px bg-stone mx-auto my-6" />

        <p className="text-center text-xs text-muted">
          A nonpartisan project of{" "}
          <a
            href="https://humansfirst.com"
            className="underline underline-offset-2 decoration-stone hover:decoration-dark-warm"
          >
            Humans First
          </a>
          . Stories shared here are the personal experiences of contributors.
        </p>
      </div>
    </footer>
  );
}
