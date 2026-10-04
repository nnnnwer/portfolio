/** Shown until a real profile photo is uploaded to Supabase Storage. */
export default function PhotoPlaceholder({ className = '' }) {
  return (
    <div
      role="img"
      aria-label="Profile photo placeholder"
      className={`relative flex h-full w-full items-end justify-center overflow-hidden bg-[#2a4a3e] ${className}`}
    >
      <svg viewBox="0 0 120 150" className="h-[82%] w-auto" aria-hidden="true">
        <circle cx="60" cy="52" r="26" fill="#4d6f61" />
        <path d="M10 150c0-32 22-54 50-54s50 22 50 54z" fill="#4d6f61" />
      </svg>
      <span className="absolute inset-x-0 bottom-2 text-center font-mono text-[0.7rem] text-[#c9d8cf]">
        photo placeholder
      </span>
    </div>
  );
}
