export function getCart() {
  if (typeof window === "undefined") return []

  const cart = localStorage.getItem("cart")

  if (!cart) return []

  return JSON.parse(cart)
}

export function saveCart(cart) {
localStorage.setItem("cart", JSON.stringify(cart))
}

export function addToCart(item) {
  const cart = getCart()

  const existing = cart.find(p => p.id === item.id)

  if (existing) {
    existing.qty += 1
  } else {
    cart.push({ ...item, qty: 1 })
  }

  saveCart(cart)

  return cart
}

export function removeFromCart(id) {
  let cart = getCart()

  cart = cart.filter(item => item.id !== id)

  saveCart(cart)

  return cart
}
