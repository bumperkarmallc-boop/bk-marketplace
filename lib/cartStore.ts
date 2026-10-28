import { useSyncExternalStore } from "react"

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

const CART_KEY = "cart"
const EMPTY_CART: CartItem[] = []

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return EMPTY_CART
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : EMPTY_CART
  } catch {
    return EMPTY_CART
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  // Return a fresh copy so callers can change it safely before saving.
  return [...parseCart(localStorage.getItem(CART_KEY))]
}

// --- Live cart for React pages -------------------------------------------
// Pages read the cart with useCart(). When the cart is saved (here or in
// another tab), every page showing it updates automatically.

const listeners = new Set<() => void>()
let cachedRaw: string | null | undefined
let cachedCart: CartItem[] = EMPTY_CART

function readCartSnapshot(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedCart = parseCart(raw)
  }
  return cachedCart
}

function subscribeToCart(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function useCart(): CartItem[] {
  // On the server (and during the first render) the cart is empty;
  // the saved cart appears as soon as the page is running in the browser.
  return useSyncExternalStore(subscribeToCart, readCartSnapshot, () => EMPTY_CART)
}

// --- Changing the cart ------------------------------------------------------

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  listeners.forEach(listener => listener())
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
  listeners.forEach(listener => listener())
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
