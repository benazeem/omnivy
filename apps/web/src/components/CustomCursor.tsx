'use client'

import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (reduceMotion || !finePointer) {
      setEnabled(false)
      return
    }

    setEnabled(true)

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return

      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive") ||
        target.closest(".interactive")
      ) {
        setHovered(true)
      } else {
        setHovered(false)
      }
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseover", handleMouseOver)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  useEffect(() => {
    const element = cursorRef.current
    if (!element || !enabled) return

    element.style.transform = `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${hovered ? 1.8 : clicked ? 0.7 : 1})`
    element.style.borderColor = hovered
      ? 'rgba(139, 92, 246, 0.6)'
      : 'rgba(139, 92, 246, 0.3)'
    element.style.backgroundColor = hovered
      ? 'rgba(139, 92, 246, 0.15)'
      : 'rgba(139, 92, 246, 0.02)'
  }, [position, hovered, clicked, enabled])

  if (!mounted || !enabled) return null

  return (
    <> 
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border pointer-events-none z-[99999] flex items-center justify-center mix-blend-difference"
        aria-hidden="true"
      >
        {hovered && (
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-sm pointer-events-none" />
        )}
      </div>
    </>
  )
}
