const SERVICES = [
  'DOCUMENTALES',
  'CORTOMETRAJES',
  'SPOTS PUBLICITARIOS',
  'CONSULTORÍA CREATIVA',
  'PRODUCCIÓN AUDIOVISUAL',
]

const BRAND_WORDS = [
  'INNOVACIÓN',
  'CONEXIÓN',
  'DISRUPCIÓN',
  'EXCELENCIA',
  'MINIMALISMO',
  'EMOCIÓN',
]

const SEPARATOR = ' ★ '

function MarqueeBand({
  items,
  bg,
  color,
  reverse = false,
}: {
  items: string[]
  bg: string
  color: string
  reverse?: boolean
}) {
  const text = items.join(SEPARATOR) + SEPARATOR

  return (
    <div
      className="marquee-band overflow-hidden whitespace-nowrap"
      style={{ backgroundColor: bg, padding: 'clamp(10px, 2vw, 16px) 0' }}
    >
      <div
        className="marquee-track inline-flex"
        style={{
          animation: `marquee${reverse ? 'Reverse' : ''} 20s linear infinite`,
        }}
      >
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className="inline-block font-bold uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(13px, 2vw, 24px)',
              color,
              letterSpacing: '0.05em',
              paddingRight: '0.5em',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Marquee() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <MarqueeBand
        items={SERVICES}
        bg="var(--blaze-orange)"
        color="var(--night-black)"
      />
      <MarqueeBand
        items={BRAND_WORDS}
        bg="var(--highlight-green)"
        color="var(--night-black)"
        reverse
      />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .marquee-track { animation-duration: 30s !important; }
        }
      `}</style>
    </div>
  )
}
