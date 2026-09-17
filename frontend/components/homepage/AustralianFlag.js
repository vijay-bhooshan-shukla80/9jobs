export default function AustralianFlag({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 30" role="img" aria-label="Australian flag">
      <defs><clipPath id="hero-flag-canton"><path d="M0 0h30v15H0z" /></clipPath><g id="hero-flag-star"><path d="m0-3 .65 1.65 1.7-.52-.88 1.54 1.47 1-1.77.26.14 1.77L0 .75l-1.31 1.45.14-1.77-1.77-.26 1.47-1-.88-1.54 1.7.52Z" fill="#fff" /></g></defs>
      <path fill="#012169" d="M0 0h60v30H0z" />
      <g clipPath="url(#hero-flag-canton)"><path d="m0 0 30 15M30 0 0 15" stroke="#fff" strokeWidth="5" /><path d="m0 0 30 15M30 0 0 15" stroke="#c8102e" strokeWidth="2" /><path d="M15 0v15M0 7.5h30" stroke="#fff" strokeWidth="8" /><path d="M15 0v15M0 7.5h30" stroke="#c8102e" strokeWidth="4" /></g>
      <use href="#hero-flag-star" transform="translate(15 23) scale(1.35)" /><use href="#hero-flag-star" transform="translate(45 5) scale(.65)" /><use href="#hero-flag-star" transform="translate(37 13) scale(.65)" /><use href="#hero-flag-star" transform="translate(52 11) scale(.65)" /><use href="#hero-flag-star" transform="translate(45 25) scale(.65)" /><path fill="#fff" d="m48 16 .6 1.2 1.3.2-.95.9.25 1.3-1.2-.6-1.2.6.25-1.3-.95-.9 1.3-.2Z" />
    </svg>
  );
}
