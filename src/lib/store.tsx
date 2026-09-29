import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoUser, type MerchColor, type MerchSize, type Review, seedReviews } from "./copper-data";

export type TabId = "home" | "cats" | "shop" | "learn" | "profile";

export type Screen =
  | { name: "splash" }
  | { name: "onboarding" }
  | { name: "login" }
  | { name: "reset" }
  | { name: "register" }
  | { name: "welcome" }
  | { name: "main"; tab: TabId }
  | { name: "cat"; id: string }
  | { name: "kitten"; id: string }
  | { name: "product"; id: string }
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "orderConfirm"; orderId: string }
  | { name: "orders" }
  | { name: "order"; id: string }
  | { name: "wishlist" }
  | { name: "breeding" }
  | { name: "pedigree"; id: string }
  | { name: "article"; id: string }
  | { name: "guide"; id: "checklist" | "feeding" }
  | { name: "apply" }
  | { name: "applyDone"; ref: string }
  | { name: "contact" }
  | { name: "applications" }
  | { name: "application"; id: string }
  | { name: "journey" }
  | { name: "favorites" }
  | { name: "messages" }
  | { name: "gallery" }
  | { name: "testimonials" }
  | { name: "about" }
  | { name: "faqs" }
  | { name: "notifications" }
  | { name: "notifSettings" }
  | { name: "settings" }
  | { name: "editProfile" }
  | { name: "password" }
  | { name: "help" }
  | { name: "legal"; doc: "terms" | "privacy" }
  | { name: "search" };

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  zip: string;
  hear?: string;
  adopting?: string;
  updates?: boolean;
  guest?: boolean;
};

export type CartLine = {
  key: string;
  productId: string;
  color: MerchColor;
  size: MerchSize;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: "Processing" | "Shipped" | "Delivered";
  lines: CartLine[];
  total: number;
  address: string;
  method: string;
};

export type Application = {
  id: string;
  createdAt: string;
  status: "Submitted" | "Under Review" | "Approved" | "Waitlisted" | "Draft";
  data: Record<string, string>;
  timeline: { label: string; detail: string; done: boolean }[];
};

export type ChatMessage = {
  id: string;
  from: "cattery" | "me";
  text: string;
  time: string;
  image?: string;
};

export type Toast = { id: number; title: string };

type Persisted = {
  user: User | null;
  onboarded: boolean;
  theme: "light" | "dark";
  language: "English" | "Español";
  cart: CartLine[];
  wishlist: string[];
  favCats: string[];
  favKittens: string[];
  orders: Order[];
  applications: Application[];
  reviews: Review[];
  messages: ChatMessage[];
  notif: { litters: boolean; kittens: boolean; orders: boolean };
  waitlist: string[];
  draft: Record<string, string> | null;
};

const KEY = "copper-road-v1";

const seedMessages: ChatMessage[] = [
  {
    id: "m1",
    from: "cattery",
    text: "Welcome to Copper Road. We're glad you're here. Ask us anything about our kittens, the breeding plan, or go-home day.",
    time: "Yesterday",
  },
];

const seedOrder: Order = {
  id: "CR-M-1042",
  createdAt: "August 12, 2026",
  status: "Delivered",
  lines: [{ key: "classic-tee-Navy-M", productId: "classic-tee", color: "Navy", size: "M", qty: 1 }],
  total: 40.08,
  address: "Jordan Hale, Sioux Falls, SD 57104",
  method: "Standard",
};

function load(): Partial<Persisted> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

type Store = {
  screen: Screen;
  stack: Screen[];
  push: (s: Screen) => void;
  back: () => void;
  reset: (s: Screen) => void;
  goTab: (tab: TabId) => void;
  user: User | null;
  onboarded: boolean;
  theme: "light" | "dark";
  language: "English" | "Español";
  cart: CartLine[];
  wishlist: string[];
  favCats: string[];
  favKittens: string[];
  orders: Order[];
  applications: Application[];
  reviews: Review[];
  messages: ChatMessage[];
  notif: { litters: boolean; kittens: boolean; orders: boolean };
  waitlist: string[];
  draft: Record<string, string> | null;
  toasts: Toast[];
  toast: (title: string) => void;
  finishSplash: () => void;
  finishOnboarding: (dest: "login" | "home-guest") => void;
  login: (email: string, password: string) => boolean;
  loginSocial: () => void;
  continueGuest: () => void;
  register: (user: User) => void;
  logout: () => void;
  deleteAccount: () => void;
  updateUser: (patch: Partial<User>) => void;
  toggleTheme: () => void;
  setLanguage: (language: "English" | "Español") => void;
  addToCart: (productId: string, color: MerchColor, size: MerchSize, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  toggleWish: (productId: string) => void;
  toggleFavCat: (id: string) => void;
  toggleFavKitten: (id: string) => void;
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => string;
  saveDraft: (data: Record<string, string>) => void;
  submitApplication: (data: Record<string, string>) => string;
  addReview: (review: Omit<Review, "id">) => void;
  sendMessage: (text: string, image?: string) => void;
  toggleNotif: (key: "litters" | "kittens" | "orders") => void;
  joinWaitlist: (litterId: string) => void;
  cartCount: number;
  unread: number;
};

const Ctx = createContext<Store | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = useMemo(() => load(), []);
  const [stack, setStack] = useState<Screen[]>([{ name: "splash" }]);
  const [user, setUser] = useState<User | null>(saved.user ?? null);
  const [onboarded, setOnboarded] = useState(!!saved.onboarded);
  const [theme, setTheme] = useState<"light" | "dark">(saved.theme ?? "light");
  const [language, setLanguage] = useState<"English" | "Español">(saved.language ?? "English");
  const [cart, setCart] = useState<CartLine[]>(saved.cart ?? []);
  const [wishlist, setWishlist] = useState<string[]>(saved.wishlist ?? []);
  const [favCats, setFavCats] = useState<string[]>(saved.favCats ?? ["olive"]);
  const [favKittens, setFavKittens] = useState<string[]>(saved.favKittens ?? ["seraphina"]);
  const [orders, setOrders] = useState<Order[]>(saved.orders ?? [seedOrder]);
  const [applications, setApplications] = useState<Application[]>(
    saved.applications ?? [
      {
        id: "CR-2026-1842",
        createdAt: "September 2, 2026",
        status: "Under Review",
        data: {
          firstName: "Jordan",
          lastName: "Hale",
          kitten: "Any",
          timeline: "1–3 months",
          why: "We want a gentle giant who will grow up with our family.",
        },
        timeline: [
          { label: "Submitted", detail: "We received your application.", done: true },
          { label: "Under Review", detail: "Tami is reading through your home details.", done: true },
          { label: "Approved", detail: "We'll write when a kitten matches.", done: false },
          { label: "Waitlisted", detail: "A deposit holds your place when you are ready.", done: false },
        ],
      },
    ],
  );
  const [reviews, setReviews] = useState<Review[]>(saved.reviews ?? seedReviews);
  const [messages, setMessages] = useState<ChatMessage[]>(saved.messages ?? seedMessages);
  const [notif, setNotif] = useState(saved.notif ?? { litters: true, kittens: true, orders: true });
  const [waitlist, setWaitlist] = useState<string[]>(saved.waitlist ?? []);
  const [draft, setDraft] = useState<Record<string, string> | null>(saved.draft ?? null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const data: Persisted = {
      user,
      onboarded,
      theme,
      language,
      cart,
      wishlist,
      favCats,
      favKittens,
      orders,
      applications,
      reviews,
      messages,
      notif,
      waitlist,
      draft,
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [user, onboarded, theme, language, cart, wishlist, favCats, favKittens, orders, applications, reviews, messages, notif, waitlist, draft]);

  const toast = (title: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  };

  const push = (s: Screen) => setStack((st) => [...st, s]);
  const back = () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  const reset = (s: Screen) => setStack([s]);
  const goTab = (tab: TabId) => setStack([{ name: "main", tab }]);

  const finishSplash = () => {
    reset({ name: "onboarding" });
  };

  const finishOnboarding = (dest: "login" | "home-guest") => {
    setOnboarded(true);
    if (dest === "home-guest") {
      setUser({ ...demoUser, firstName: "Guest", lastName: "Family", guest: true, password: "" });
      reset({ name: "main", tab: "home" });
    } else reset({ name: "login" });
  };

  const login = (email: string, password: string) => {
    const known = email.trim().toLowerCase() === demoUser.email;
    setUser({
      ...demoUser,
      email: email.trim() || demoUser.email,
      password,
      guest: false,
      firstName: known ? demoUser.firstName : email.trim() ? "Alex" : demoUser.firstName,
      lastName: known ? demoUser.lastName : email.trim() ? "Family" : demoUser.lastName,
    });
    reset({ name: "main", tab: "home" });
    return true;
  };

  const loginSocial = () => {
    setUser({ ...demoUser, guest: false });
    reset({ name: "main", tab: "home" });
  };

  const continueGuest = () => {
    setOnboarded(true);
    setUser({ ...demoUser, firstName: "Guest", lastName: "Family", guest: true, password: "" });
    reset({ name: "main", tab: "home" });
  };

  const register = (next: User) => {
    setUser({ ...next, guest: false });
    reset({ name: "welcome" });
  };

  const logout = () => {
    setUser(null);
    reset({ name: "login" });
  };

  const deleteAccount = () => {
    setUser(null);
    setApplications([]);
    setCart([]);
    toast("Account removed from this device");
    reset({ name: "login" });
  };

  const updateUser = (patch: Partial<User>) => setUser((u) => (u ? { ...u, ...patch } : u));

  const addToCart = (productId: string, color: MerchColor, size: MerchSize, qty = 1) => {
    const key = `${productId}-${color}-${size}`;
    setCart((lines) => {
      const found = lines.find((l) => l.key === key);
      if (found) return lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...lines, { key, productId, color, size, qty }];
    });
    toast("Added to cart");
  };

  const setQty = (key: string, qty: number) => {
    setCart((lines) => (qty <= 0 ? lines.filter((l) => l.key !== key) : lines.map((l) => (l.key === key ? { ...l, qty } : l))));
  };

  const removeLine = (key: string) => setCart((lines) => lines.filter((l) => l.key !== key));

  const toggleWish = (productId: string) => {
    setWishlist((ids) => (ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId]));
  };

  const toggleFavCat = (id: string) => setFavCats((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const toggleFavKitten = (id: string) => setFavKittens((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const placeOrder = (order: Omit<Order, "id" | "createdAt" | "status">) => {
    const id = `CR-M-${Math.floor(1000 + Math.random() * 9000)}`;
    const next: Order = { ...order, id, createdAt: "September 30, 2026", status: "Processing" };
    setOrders((o) => [next, ...o]);
    setCart([]);
    return id;
  };

  const saveDraft = (data: Record<string, string>) => {
    setDraft(data);
    toast("Draft saved");
  };

  const submitApplication = (data: Record<string, string>) => {
    const id = `CR-2026-${Math.floor(2000 + Math.random() * 7000)}`;
    const app: Application = {
      id,
      createdAt: "September 30, 2026",
      status: "Submitted",
      data,
      timeline: [
        { label: "Submitted", detail: "We have your application.", done: true },
        { label: "Under Review", detail: "We'll be in touch soon.", done: false },
        { label: "Approved", detail: "A match, when the timing is right.", done: false },
        { label: "Waitlisted", detail: "A deposit holds your place.", done: false },
      ],
    };
    setApplications((list) => [app, ...list]);
    setDraft(null);
    return id;
  };

  const addReview = (review: Omit<Review, "id">) => {
    setReviews((list) => [{ ...review, id: `rev-${Date.now()}` }, ...list]);
    toast("Thank you for sharing your experience");
  };

  const sendMessage = (text: string, image?: string) => {
    const mine: ChatMessage = { id: `c-${Date.now()}`, from: "me", text, time: "Now", image };
    const reply: ChatMessage = {
      id: `c-${Date.now() + 1}`,
      from: "cattery",
      text: "Thank you for writing. We'll reply personally as soon as we can — usually within a day.",
      time: "Now",
    };
    setMessages((m) => [...m, mine, reply]);
  };

  const toggleNotif = (key: "litters" | "kittens" | "orders") => setNotif((n) => ({ ...n, [key]: !n[key] }));

  const joinWaitlist = (litterId: string) => {
    setWaitlist((ids) => (ids.includes(litterId) ? ids : [...ids, litterId]));
    toast("You're on the waitlist");
  };

  const screen = stack[stack.length - 1] ?? { name: "splash" as const };
  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const unread = 2;

  const value: Store = {
    screen,
    stack,
    push,
    back,
    reset,
    goTab,
    user,
    onboarded,
    theme,
    language,
    cart,
    wishlist,
    favCats,
    favKittens,
    orders,
    applications,
    reviews,
    messages,
    notif,
    waitlist,
    draft,
    toasts,
    toast,
    finishSplash,
    finishOnboarding,
    login,
    loginSocial,
    continueGuest,
    register,
    logout,
    deleteAccount,
    updateUser,
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    setLanguage,
    addToCart,
    setQty,
    removeLine,
    toggleWish,
    toggleFavCat,
    toggleFavKitten,
    placeOrder,
    saveDraft,
    submitApplication,
    addReview,
    sendMessage,
    toggleNotif,
    joinWaitlist,
    cartCount,
    unread,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
