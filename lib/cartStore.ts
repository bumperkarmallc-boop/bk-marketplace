// One shared cart format for the whole site (product page, cart, checkout, nav).
// Prices here are for display only; the real total is calculated by the
// database function place_order at checkout.
export type CartItem = {
  product_id: string
  seller_id?: string | null
  title: string
  price: number
  quantity: number
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []

  const cart = localStorage.getItem("cart")

  if (!cart) return []

  try {
    const parsed = JSON.parse(cart)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart))
}

export function addToCart(item: Omit<CartItem, "quantity">): CartItem[] {
  const cart = getCart()

  const existing = cart.find(p => p.product_id === item.product_id)

  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }

  saveCart(cart)

  return cart
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter(item => item.product_id !== productId)

  saveCart(cart)

  return cart
}
