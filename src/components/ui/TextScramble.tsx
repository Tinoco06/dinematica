import { useRef, useState, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

interface TextScrambleProps {
  text: string
  className?: string
  style?: React.CSSProperties
  /** Velocidad del scramble en ms por paso */
  speed?: number
}

/**
 * Efecto "hacker/decrypt" al hacer hover:
 * los caracteres se aleatorizan y se resuelven uno por uno.
 */
export function TextScramble({
  text,
  className = '',
  style,
  speed = 30,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text)
  const isAnimating = useRef(false)
  const frameRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const scramble = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true

    let iteration = 0
    clearInterval(frameRef.current)

    frameRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            // Caracteres ya resueltos
            if (i < iteration) return text[i]
            // Espacios y caracteres especiales no se aleatorizan
            if (char === ' ' || char === '@' || char === '.' || char === '+') return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(''),
      )

      iteration += 1 / 2

      if (iteration >= text.length) {
        clearInterval(frameRef.current)
        setDisplay(text)
        isAnimating.current = false
      }
    }, speed)
  }, [text, speed])

  return (
    <span
      className={className}
      style={style}
      onMouseEnter={scramble}
    >
      {display}
    </span>
  )
}
