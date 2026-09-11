export default function Toast({ show, message, type = "success" }) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-24 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-sm px-4 sm:px-6 py-3 rounded-lg shadow-lg text-white text-sm sm:text-base font-medium z-[80] transition-all duration-300 transform translate-y-0 opacity-100 ${
        type === "success" ? "bg-[#8CC63F]" : "bg-red-500"
      }`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {message}
      </div>
    </div>
  );
}
