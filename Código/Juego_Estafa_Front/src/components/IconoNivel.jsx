import { useId } from 'react';

export default function IconoNivel({
  tipo = 'escudo',
  clase = '',
}) {
  const identificador = useId();

  return (
    <svg
      className={`icono-nivel ${clase}`}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={identificador} x2="1" y2="1">
          <stop stopColor="#72ceff" />
          <stop offset="1" stopColor="#3154f8" />
        </linearGradient>
      </defs>

      {tipo === 'estrella' ? (
        <path
          d="m60 9 15 30 33 5-24 24 6 33-30-16-30 16 6-33L12 44l33-5Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      ) : tipo === 'ESTUDIANTE' ? (
        <>
          <rect
            x="8" y="27" width="100" height="72" rx="13"
            fill={`url(#${identificador})`}
          />
          <path
            d="m12 33 46 36 46-36M12 94l30-26m62 26L76 68"
            fill="none"
            stroke="#bce5ff"
            strokeWidth="3"
          />
          <circle cx="94" cy="88" r="23" fill="#ff7865" />
          <path
            d="M94 76v13m0 9v1"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      ) : tipo === 'PERSONAL_ADMINISTRATIVO' ? (
        <>
          <rect
            x="15" y="20" width="90" height="73" rx="8"
            fill="#8ca7d5"
          />
          <rect
            x="22" y="27" width="76" height="59" rx="4"
            fill="#253e6d"
          />
          <path d="M15 93h90l12 15H3Z" fill="#b5cbed" />
          <path
            d="m60 38 25 39H35Z"
            fill="#ff8069"
            stroke="#ff8069"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M60 50v12m0 9v1"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {tipo === 'ADULTO_MAYOR' && (
            <rect
              x="5" y="30" width="100" height="68" rx="12"
              fill="#528dff"
            />
          )}
          <path
            d="m60 11 39 15v29c0 26-17 44-39 55-22-11-39-29-39-55V26Z"
            fill={`url(#${identificador})`}
          />
          <path
            d="m60 32 21 8v18c0 14-9 26-21 33-12-7-21-19-21-33V40Z"
            fill="#a2edff"
          />
          <path
            d="m49 58 8 8 16-19"
            fill="none"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}