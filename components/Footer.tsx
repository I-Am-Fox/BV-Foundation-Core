
export default function Footer() {
  return (
    <footer className="bg-black border-t border-green-500 text-green-300 text-xs font-mono px-6 py-4 mt-10">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <p className="opacity-80">© {new Date().getFullYear()} BLACK VEIL OPERATIONS</p>
        <a
          href="/privacy"
          className="underline hover:text-green-100 transition-colors"
        >
          Privacy Protocols →
        </a>
      </div>
    </footer>
  );
}
