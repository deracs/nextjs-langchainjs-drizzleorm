import React, { useEffect, useState } from "react"

import { Input } from "./input"

export const AnimatedInput = ({
  placeholderArray = [],
  ...passedProps
}: {
  placeholderArray?: string[]
  [x: string]: any
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [placeholder, setPlaceholder] = useState("")

  useEffect(() => {
    const intr = setInterval(() => {
      if (charIndex + 1 > placeholderArray[placeholderIndex].length) {
        setCharIndex(0)
        setPlaceholderIndex((placeholderIndex + 1) % placeholderArray.length)
      } else {
        setPlaceholder(placeholderArray[placeholderIndex].slice(0, charIndex))
        setCharIndex(charIndex + 1)
      }
    }, 100)
    return () => {
      clearInterval(intr)
    }
  }, [placeholderIndex, charIndex, placeholderArray])

  return <Input {...passedProps} placeholder={placeholder} />
}
