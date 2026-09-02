export default function Topbar() {
  return (
    <header className="sticky top-0 w-full h-16 bg-surface border-b border-outline-variant z-10 flex justify-between items-center px-gutter">
      <div className="flex items-center gap-4 flex-1">
        
        <div className="relative w-full max-w-md hidden md:block focus-within:ring-2 focus-within:ring-primary/10 rounded">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors text-on-surface"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}
