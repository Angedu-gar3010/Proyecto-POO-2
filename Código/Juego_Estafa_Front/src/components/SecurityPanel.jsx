export default function PanelSeguridad() {
  return (
    <aside
      className="visual-panel"
      aria-label="Consejo de seguridad digital"
    >
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />

      <svg
        className="security-illustration"
        viewBox="0 0 520 360"
        role="img"
        aria-label="Ilustración de un escudo que protege un gráfico"
      >
        <defs>
          <linearGradient id="screen" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#172554" />
            <stop offset="1" stopColor="#243b82" />
          </linearGradient>

          <linearGradient id="shield" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#4f6fff" />
            <stop offset="1" stopColor="#2947e8" />
          </linearGradient>

          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="14"
              floodColor="#17306f"
              floodOpacity=".2"
            />
          </filter>
        </defs>

        <ellipse
          cx="262"
          cy="323"
          rx="155"
          ry="18"
          fill="#b9c8ee"
          opacity=".55"
        />

        <g filter="url(#shadow)">
          <rect
            x="116"
            y="48"
            width="288"
            height="230"
            rx="22"
            fill="#fff"
          />
          <rect
            x="140"
            y="76"
            width="240"
            height="34"
            rx="10"
            fill="#edf2ff"
          />

          <circle cx="159" cy="93" r="5" fill="#ffb84d" />
          <circle cx="177" cy="93" r="5" fill="#7891ff" />
          <circle cx="195" cy="93" r="5" fill="#d3ddff" />

          <rect
            x="140"
            y="130"
            width="104"
            height="122"
            rx="15"
            fill="url(#screen)"
          />
          <rect
            x="263"
            y="130"
            width="117"
            height="16"
            rx="8"
            fill="#dfe7ff"
          />
          <rect
            x="263"
            y="159"
            width="92"
            height="12"
            rx="6"
            fill="#eaf0ff"
          />
          <rect
            x="263"
            y="185"
            width="117"
            height="12"
            rx="6"
            fill="#eaf0ff"
          />
          <rect
            x="263"
            y="211"
            width="72"
            height="12"
            rx="6"
            fill="#eaf0ff"
          />

          <path
            d="M160 222v-37M181 222v-57M202 222v-28M223 222v-74"
            stroke="#fff"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="m155 166 30-20 28 10 24-26"
            fill="none"
            stroke="#ffbd45"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <g transform="translate(300 205)" filter="url(#shadow)">
          <path
            d="M47 0 88 15v34c0 37-21 64-41 75C27 113 6 86 6 49V15L47 0Z"
            fill="url(#shield)"
          />
          <path
            d="m28 59 13 13 27-31"
            fill="none"
            stroke="#fff"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <g transform="translate(74 100)">
          <circle cx="24" cy="24" r="24" fill="#ffbd45" />
          <path
            d="M24 12v16M24 37h.1"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(392 84)">
          <circle cx="30" cy="30" r="30" fill="#fff" />
          <path
            d="M30 15v30M15 30h30"
            stroke="#3657f3"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div className="visual-copy">
        <span className="lesson-badge">Seguridad digital</span>
        <h2>Aprende a reconocer estafas</h2>
        <p>
          Analiza escenarios, identifica señales de alerta y toma mejores
          decisiones antes de hacer clic.
        </p>
      </div>

      <div className="slider-dots" aria-hidden="true">
        <span className="active" />
        <span />
        <span />
      </div>
    </aside>
  );
}