const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

export const createFocusTrap = (element) => {
  let previouslyFocused = document.activeElement

  const getFocusableElements = () => {
    return Array.from(element.querySelectorAll(FOCUSABLE_ELEMENTS))
      .filter(el => el.offsetParent !== null) // Visíveis apenas
  }

  const handleTab = (e) => {
    const focusables = getFocusableElements()
    if (focusables.length === 0) return

    const firstFocusable = focusables[0]
    const lastFocusable = focusables[focusables.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable.focus()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable.focus()
      }
    }
  }

  const keydownHandler = (e) => {
    if (e.key === 'Tab') {
      handleTab(e)
    }
  }

  element.addEventListener('keydown', keydownHandler)

  const focusables = getFocusableElements()
  if (focusables.length > 0) {
    focusables[0].focus()
  }

  const release = () => {
    element.removeEventListener('keydown', keydownHandler)
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus()
    }
  }

  return { release }
}
