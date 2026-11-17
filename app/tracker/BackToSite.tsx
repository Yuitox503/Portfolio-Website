/* eslint-disable @next/next/no-img-element */
// The portfolio at "/" is a static page outside the app router, so this is a
// plain <a> (full page load) rather than next/link.

type Props = { label?: string; className?: string; showLogo?: boolean };

export function BackToSite({ label = "Main site", className = "", showLogo = true }: Props) {
  return (
    <a
      href="/"
      title="Back to ferdinandtaslim.tech"
      aria-label={label || "Back to main site"}
      className={`inline-flex items-center gap-2 rounded-full py-1.5 pr-3 text-sm text-muted transition hover:text-text2 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {showLogo && <img src="/assets/images/logo.png" alt="" width={20} height={20} className="size-5 object-contain" />}
      {label && <span>{label}</span>}
    </a>
  );
}
