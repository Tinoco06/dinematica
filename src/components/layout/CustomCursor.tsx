import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

type CursorState = 'default' | 'pointer' | 'project'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const [state, setState] = useState<CursorState>('default')
  const [visible, setVisible] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Detectar desktop vs touch
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')

    function check() {
      setIsDesktop(mq.matches)
    }

    check()
    mq.addEventListener('change', check)
    return () => mq.removeEventListener('change', check)
  }, [])

  // Ocultar cursor nativo en desktop
  useEffect(() => {
    if (!isDesktop) {
      document.body.style.cursor = ''
      return
    }

    document.body.style.cursor = 'none'
    return () => {
      document.body.style.cursor = ''
    }
  }, [isDesktop])

  // Event listeners del mouse
  useEffect(() => {
    if (!isDesktop) return

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (!visible) setVisible(true)
    }

    function onMouseLeave() {
      setVisible(false)
    }

    function onMouseEnter() {
      setVisible(true)
    }

    // Hover detection con event delegation
    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement
      const projectEl = target.closest('[data-cursor="project"]')
      const interactiveEl = target.closest('a, button, [data-cursor="pointer"]')

      if (projectEl) {
        setState('project')
      } else if (interactiveEl) {
        setState('pointer')
      }
    }

    function onMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement | null
      const interactiveEl = target.closest(
        'a, button, [data-cursor="pointer"], [data-cursor="project"]',
      )

      if (interactiveEl && !interactiveEl.contains(relatedTarget)) {
        setState('default')
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [isDesktop, visible])

  // GSAP ticker para interpolación suave — gsap.set() por frame, no gsap.to()
  useGSAP(() => {
    if (!isDesktop || !cursorRef.current) return

    const speed = 0.15

    function tick() {
      pos.current.x += (mouse.current.x - pos.current.x) * speed
      pos.current.y += (mouse.current.y - pos.current.y) * speed

      gsap.set(cursorRef.current, {
        x: pos.current.x,
        y: pos.current.y,
      })
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
    }
  }, { dependencies: [isDesktop] })

  if (!isDesktop) return null

  const size =
    state === 'project' ? 80 : state === 'pointer' ? 64 : 32

  const borderColor =
    state === 'pointer' ? 'var(--blaze-orange)' : 'var(--flash-white)'

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        mixBlendMode: 'difference',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          border: `1px solid ${borderColor}`,
          background: 'none',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
        }}
      >
        <span
          ref={textRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            color: 'var(--flash-white)',
            letterSpacing: '0.1em',
            opacity: state === 'project' ? 1 : 0,
            transform: state === 'project' ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          VER
        </span>
      </div>
    </div>
  )
}
