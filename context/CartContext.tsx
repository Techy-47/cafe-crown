"use client";
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { MenuItem } from "@/lib/menuData";

// ── TYPES ────────────────────────────────────────────────────────
export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: MenuItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "CLOSE_CART" };

interface CartContextType extends CartState {
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

// ── REDUCER ──────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    case "UPDATE_QTY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

// ── CONTEXT ──────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem:    (item) => dispatch({ type: "ADD_ITEM", payload: item }),
        removeItem: (id)   => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQty:  (id, quantity) => dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
        clearCart:  ()     => dispatch({ type: "CLEAR_CART" }),
        toggleCart: ()     => dispatch({ type: "TOGGLE_CART" }),
        closeCart:  ()     => dispatch({ type: "CLOSE_CART" }),
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
