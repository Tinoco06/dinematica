/**
 * TrueFocus — adaptado de ReactBits (DavidHDev/react-bits)
 * Efecto de enfoque que recorre palabras con blur y un marco animado.
 */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

interface TrueFocusProps {
  sentence?: string
  separator?: string
  manualMode?: boolean
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
  className?: string
  style?: React.CSSProperties
}

export function TrueFocus({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
  style,
}: TrueFocusProps) {
  const words = sentence.split(separator)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length)
        },
        (animationDuration + pauseBetweenAnimations) * 1000,
      )
      return () => clearInterval(interval)
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length])

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return
    if (!wordRefs.current[currentIndex] || !containerRef.current) return

    const parentRect = containerRef.current.getBoundingClientRect()
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect()

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    })
  }, [currentIndex, words.length])

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index)
      setCurrentIndex(index)
    }
  }

  const handleMouseLeave = () => {
    if (manualMode && lastActiveIndex !== null) {
      setCurrentIndex(lastActiveIndex)
    }
  }

  return (
    <div
      className={`true-focus-container ${className}`}
      ref={containerRef}
      style={style}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex
        return (
          <span
            key={index}
            ref={(el) => { wordRefs.current[index] = el }}
            className={`true-focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        )
      })}

      <motion.div
        className="true-focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
      >
        <span
          className="true-focus-corner top-left"
          style={{ borderColor, filter: `drop-shadow(0px 0px 4px ${glowColor})` }}
        />
        <span
          className="true-focus-corner top-right"
          style={{ borderColor, filter: `drop-shadow(0px 0px 4px ${glowColor})` }}
        />
        <span
          className="true-focus-corner bottom-left"
          style={{ borderColor, filter: `drop-shadow(0px 0px 4px ${glowColor})` }}
        />
        <span
          className="true-focus-corner bottom-right"
          style={{ borderColor, filter: `drop-shadow(0px 0px 4px ${glowColor})` }}
        />
      </motion.div>

      <style>{`
        .true-focus-container {
          position: relative;
          display: flex;
          gap: 0.4em;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          outline: none;
          user-select: none;
        }
        .true-focus-word {
          position: relative;
          cursor: pointer;
          transition: filter 0.3s ease, color 0.3s ease;
          outline: none;
          user-select: none;
        }
        .true-focus-word.active {
          filter: blur(0px);
        }
        .true-focus-frame {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          box-sizing: content-box;
          border: none;
        }
        .true-focus-corner {
          position: absolute;
          width: 1rem;
          height: 1rem;
          border: 3px solid currentColor;
          border-radius: 3px;
        }
        .true-focus-corner.top-left {
          top: -10px;
          left: -10px;
          border-right: none;
          border-bottom: none;
        }
        .true-focus-corner.top-right {
          top: -10px;
          right: -10px;
          border-left: none;
          border-bottom: none;
        }
        .true-focus-corner.bottom-left {
          bottom: -10px;
          left: -10px;
          border-right: none;
          border-top: none;
        }
        .true-focus-corner.bottom-right {
          bottom: -10px;
          right: -10px;
          border-left: none;
          border-top: none;
        }
      `}</style>
    </div>
  )
}
