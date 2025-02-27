// Hide application sidebar when in developer portal mode
export function hideSidebar() {
  if (typeof window === 'undefined') return () => {}
  
  // Select all sidebar/navigation elements
  const sidebarElements = document.querySelectorAll(
    '[class*="sidebar"], [class*="Sidebar"], nav, aside, [class*="Navigation"], [class*="navigation"]'
  )
  
  // Save original display values and hide all matched elements
  const originalDisplays: Map<Element, string> = new Map()
  
  sidebarElements.forEach(el => {
    // Skip if element is within the developer portal
    if (el.closest('[data-developer-portal="true"]')) return
    
    // Store original display value
    const htmlEl = el as HTMLElement
    originalDisplays.set(el, htmlEl.style.display)
    
    // Hide element
    htmlEl.style.display = 'none'
    htmlEl.classList.add('hide-sidebar')
  })
  
  // Return cleanup function
  return () => {
    sidebarElements.forEach(el => {
      // Skip if element is within the developer portal
      if (el.closest('[data-developer-portal="true"]')) return
      
      // Restore original display value
      const htmlEl = el as HTMLElement
      const originalDisplay = originalDisplays.get(el)
      
      if (originalDisplay !== undefined) {
        htmlEl.style.display = originalDisplay
      } else {
        htmlEl.style.display = ''
      }
      
      htmlEl.classList.remove('hide-sidebar')
    })
  }
}

// Create observer for dynamically added navigation elements
export function createSidebarObserver() {
  if (typeof window === 'undefined') return null
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        // Check for newly added navigation elements
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            // Check if it's a navigation element
            const isNavElement = 
              node.tagName.toLowerCase() === 'nav' || 
              node.tagName.toLowerCase() === 'aside' ||
              node.className.toLowerCase().includes('sidebar') ||
              node.className.toLowerCase().includes('navigation')
            
            // Skip if element is within the developer portal
            if (isNavElement && !node.closest('[data-developer-portal="true"]')) {
              // Hide the element
              node.style.display = 'none'
              node.classList.add('hide-sidebar')
            }
          }
        })
      }
    })
  })
  
  // Observe document for changes
  observer.observe(document.body, { childList: true, subtree: true })
  
  return observer
} 