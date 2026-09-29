import { useMemo, useState } from "react";
import { Check, SlidersHorizontal } from "lucide-react";
import { COLORS, SIZES, logoSrc, money, productById, products, type MerchColor, type MerchSize, type Product } from "@/lib/copper-data";
import { useApp, type CartLine } from "@/lib/store";
import { BackBar, Badge, Btn, Chip, Empty, Field, HeartBtn, Photo, SelectField, Sheet, Stars, TextField, statusTone } from "./ui";

export function ShopScreen() {
  const { push, wishlist, toggleWish, addToCart } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [filter, setFilter] = useState(false);
  const [size, setSize] = useState("Any");
  const [color, setColor] = useState("Any");
  const [max, setMax] = useState(60);

  const list = useMemo(() => {
    let rows = products.filter((p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()) && p.price <= max);
    if (sort === "Price Low–High") rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === "High–Low") rows = [...rows].sort((a, b) => b.price - a.price);
    if (sort === "Newest") rows = [...rows].reverse();
    return rows;
  }, [q, cat, sort, max]);

  return (
    <div className="h-full overflow-y-auto pb-28">
      <div className="bg-[#00264C] px-5 pb-5 pt-6 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#BD915F]">COPPER ROAD MERCH</p>
        <h1 className="font-display text-4xl leading-none">COPPER ROAD MERCH</h1>
        <p className="mt-2 text-sm text-white/75">Showcase branded merchandise for Maine Coon lovers and Copper Road families.</p>
      </div>
      <div className="space-y-3 px-4 py-3">
        <TextField value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tees and hoodies" />
        <div className="flex gap-2">
          {["All", "T-Shirts", "Hoodies"].map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
          <button onClick={() => setFilter(true)} className="grid h-9 w-11 place-items-center rounded-full bg-white shadow-sm" aria-label="Filter">
            <SlidersHorizontal size={16} />
          </button>
        </div>
        <SelectField value={sort} onChange={setSort} options={["Featured", "Price Low–High", "High–Low", "Newest"]} />
        <div className="overflow-hidden rounded-3xl bg-[#00264C] text-white">
          <Photo src={products[0].images.Copper} alt="Featured Copper Road classic t-shirt" className="h-36 w-full" />
          <div className="p-4">
            <p className="text-xs uppercase tracking-widest text-[#BD915F]">Featured</p>
            <p className="font-display text-2xl">Classic tee, copper clay</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {list.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <button className="relative block w-full text-left" onClick={() => push({ name: "product", id: p.id })}>
                <ProductShot product={p} color="Copper" />
                <div className="absolute right-2 top-2">
                  <HeartBtn on={wishlist.includes(p.id)} label="Save" onClick={() => toggleWish(p.id)} />
                </div>
              </button>
              <div className="p-3">
                <h2 className="font-display text-lg leading-tight">{p.name}</h2>
                <p className="text-sm font-semibold text-[#BD915F]">{money(p.price)}</p>
                <p className="text-xs">
                  <Stars value={Math.round(p.rating)} /> <span className="text-muted-foreground">({p.reviews})</span>
                </p>
                <button
                  className="mt-2 h-10 w-full rounded-xl bg-[#BD915F] text-xs font-semibold text-[#00264C]"
                  onClick={() => addToCart(p.id, color === "Any" ? "Copper" : (color as MerchColor), size === "Any" ? "M" : (size as MerchSize))}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Sheet open={filter} title="Filter" onClose={() => setFilter(false)}>
        <Field label="Size">
          <div className="flex flex-wrap gap-2">
            {["Any", ...SIZES].map((s) => (
              <Chip key={s} active={size === s} onClick={() => setSize(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Color">
          <div className="mt-2 flex flex-wrap gap-2">
            {["Any", ...COLORS].map((c) => (
              <Chip key={c} active={color === c} onClick={() => setColor(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label={`Price up to ${money(max)}`}>
          <input type="range" min={28} max={60} value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full accent-[#BD915F]" />
        </Field>
      </Sheet>
    </div>
  );
}

function ProductShot({ product, color }: { product: Product; color: MerchColor }) {
  return (
    <div className="relative">
      <Photo src={product.images[color]} alt={`${product.name} in ${color}`} className="aspect-square w-full" />
      <img src={logoSrc} alt="" className="absolute bottom-2 left-2 h-8 w-auto object-contain drop-shadow" />
    </div>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const product = productById(id);
  const { addToCart, push, wishlist, toggleWish } = useApp();
  const [color, setColor] = useState<MerchColor>("Copper");
  const [size, setSize] = useState<MerchSize>("M");
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [ship, setShip] = useState(false);
  if (!product) return null;
  const also = products.filter((p) => p.id !== product.id).slice(0, 4);
  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="relative">
        <button className="block w-full" onClick={() => setZoom(true)}>
          <ProductShot product={product} color={color} />
        </button>
        <BackFloat />
        <div className="absolute right-3 top-3">
          <HeartBtn on={wishlist.includes(product.id)} label="Wishlist" onClick={() => toggleWish(product.id)} />
        </div>
      </div>
      <div className="space-y-3 px-5 py-4">
        <h1 className="font-display text-3xl">{product.name}</h1>
        <p className="font-display text-2xl text-[#BD915F]">{money(product.price)}</p>
        <p className="text-sm">
          <Stars value={Math.round(product.rating)} /> {product.rating} · {product.reviews} reviews
        </p>
        <p className="text-sm leading-relaxed">{product.description}</p>
        <p className="text-sm font-semibold">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} className={`h-11 rounded-full px-3 text-sm ${color === c ? "bg-[#00264C] text-white" : "bg-white"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Size</p>
          <button className="text-sm font-semibold text-[#BD915F]" onClick={() => setGuide(true)}>
            Size guide
          </button>
        </div>
        <div className="flex gap-2">
          {SIZES.map((s) => (
            <button key={s} onClick={() => setSize(s)} className={`h-11 flex-1 rounded-xl text-sm font-semibold ${size === s ? "bg-[#BD915F] text-[#00264C]" : "bg-white"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="h-11 w-11 rounded-xl bg-white" onClick={() => setQty(Math.max(1, qty - 1))}>
            −
          </button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button className="h-11 w-11 rounded-xl bg-white" onClick={() => setQty(qty + 1)}>
            +
          </button>
        </div>
        <Btn full onClick={() => addToCart(product.id, color, size, qty)}>
          Add to Cart
        </Btn>
        <Btn
          variant="navy"
          full
          onClick={() => {
            addToCart(product.id, color, size, qty);
            push({ name: "checkout" });
          }}
        >
          Buy Now
        </Btn>
        <button className="w-full rounded-2xl bg-white p-4 text-left text-sm shadow-sm" onClick={() => setShip(!ship)}>
          <span className="font-semibold">Shipping and returns</span>
          {ship && (
            <p className="mt-2 text-muted-foreground">
              Eco-friendly packaging to ensure safe delivery. Full size exchanges and returns within 30 days. Proceeds support cattery genetic health testing. Decorated with care for Copper Road families.
            </p>
          )}
        </button>
        <h2 className="font-display text-2xl">You May Also Like</h2>
        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5">
          {also.map((p) => (
            <button key={p.id} onClick={() => push({ name: "product", id: p.id })} className="w-36 shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-sm">
              <Photo src={p.images.Navy} alt={p.name} className="h-28 w-full" />
              <p className="p-2 text-sm">{p.name}</p>
            </button>
          ))}
        </div>
      </div>
      <Sheet open={guide} title="Size guide" onClose={() => setGuide(false)}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-2">Size</th>
              <th>Chest</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["S", "36–38", "27"],
              ["M", "39–41", "28"],
              ["L", "42–44", "29"],
              ["XL", "45–48", "30"],
              ["XXL", "49–52", "31"],
            ].map((r) => (
              <tr key={r[0]} className="border-t border-[#E1EFF9]">
                {r.map((c) => (
                  <td key={c} className="py-2">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">Measurements in inches. Unisex cut. When in doubt, size up for a Maine Coon on the lap.</p>
      </Sheet>
      {zoom && (
        <button className="absolute inset-0 z-50 bg-[#00264C]" onClick={() => setZoom(false)}>
          <img src={product.images[color]} alt={`${product.name} zoomed`} className="h-full w-full object-contain" />
        </button>
      )}
    </div>
  );
}

function BackFloat() {
  const { back } = useApp();
  return (
    <button aria-label="Go back" onClick={back} className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90">
      ←
    </button>
  );
}

export function CartScreen() {
  const { cart, setQty, removeLine, push, goTab } = useApp();
  const [code, setCode] = useState("");
  const [off, setOff] = useState(0);
  const [err, setErr] = useState("");
  const sub = cart.reduce((n, l) => n + (productById(l.productId)?.price || 0) * l.qty, 0);
  const ship = sub === 0 || sub >= 75 ? 0 : 8;
  const tax = (sub - off) * 0.065;
  const total = Math.max(0, sub - off) + ship + tax;
  if (!cart.length) {
    return (
      <div>
        <BackBar title="Cart" />
        <Empty title="Your cart is quiet" body="The tees and hoodies are waiting." action={<Btn full onClick={() => goTab("shop")}>Continue Shopping</Btn>} />
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Cart" />
      <div className="space-y-3 px-4">
        {cart.map((l) => (
          <CartRow key={l.key} line={l} onQty={(q) => setQty(l.key, q)} onRemove={() => removeLine(l.key)} />
        ))}
        <div className="flex gap-2">
          <TextField value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" />
          <Btn
            onClick={() => {
              if (code.trim().toUpperCase() === "FAMILY10") {
                setOff(sub * 0.1);
                setErr("");
              } else setErr("Try FAMILY10");
            }}
          >
            Apply
          </Btn>
        </div>
        {err && <p className="text-xs text-[#b42318]">{err}</p>}
        {off > 0 && <p className="text-sm text-[#2f7d5a]">Family discount applied</p>}
        <div className="rounded-3xl bg-white p-4 text-sm shadow-sm">
          <Sum k="Subtotal" v={money(sub)} />
          <Sum k="Shipping" v={ship === 0 ? "Free" : money(ship)} />
          <Sum k="Tax" v={money(tax)} />
          <Sum k="Total" v={money(total)} strong />
        </div>
        <Btn full onClick={() => push({ name: "checkout" })}>
          Proceed to Checkout
        </Btn>
      </div>
    </div>
  );
}

function Sum({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${strong ? "font-display text-xl" : ""}`}>
      <span>{k}</span>
      <span className={strong ? "text-[#BD915F]" : ""}>{v}</span>
    </div>
  );
}

function CartRow({ line, onQty, onRemove }: { line: CartLine; onQty: (n: number) => void; onRemove: () => void }) {
  const p = productById(line.productId);
  const [x, setX] = useState(0);
  if (!p) return null;
  return (
    <div
      className="flex gap-3 rounded-3xl bg-white p-2 shadow-sm"
      onTouchStart={(e) => setX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (x - e.changedTouches[0].clientX > 70) onRemove();
      }}
    >
      <Photo src={p.images[line.color]} alt={p.name} className="h-20 w-20 rounded-2xl" />
      <div className="flex-1">
        <p className="font-semibold leading-tight">{p.name}</p>
        <p className="text-xs text-muted-foreground">
          {line.color} · {line.size}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <button className="h-9 w-9 rounded-lg bg-[#E1EFF9]" onClick={() => onQty(line.qty - 1)}>
            −
          </button>
          <span>{line.qty}</span>
          <button className="h-9 w-9 rounded-lg bg-[#E1EFF9]" onClick={() => onQty(line.qty + 1)}>
            +
          </button>
          <button className="ml-auto text-xs text-[#b42318]" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

const steps = ["Shipping", "Delivery", "Payment", "Review"];

export function Checkout() {
  const { cart, placeOrder, push, user } = useApp();
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: user && !user.guest ? `${user.firstName} ${user.lastName}` : "",
    email: user?.guest ? "" : user?.email || "",
    phone: user?.guest ? "" : user?.phone || "",
    line1: "",
    line2: "",
    city: user?.city || "",
    state: user?.state || "SD",
    zip: user?.zip || "",
    country: "United States",
    save: true,
    method: "Standard",
    pay: "Card",
    card: "",
    cardName: "",
    exp: "",
    cvv: "",
    same: true,
    terms: false,
  });
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const sub = cart.reduce((n, l) => n + (productById(l.productId)?.price || 0) * l.qty, 0);
  const ship = form.method === "Express" ? 18 : sub >= 75 ? 0 : 8;
  const total = sub + ship + sub * 0.065;

  const next = () => {
    if (step === 0 && (!form.name || !form.email.includes("@") || !form.line1 || !form.city || !form.zip)) {
      setErr("Please complete the shipping address.");
      return;
    }
    if (step === 2 && form.pay === "Card" && (form.card.replace(/\s/g, "").length < 12 || !form.exp || form.cvv.length < 3)) {
      setErr("Check the card details.");
      return;
    }
    if (step === 3) {
      if (!form.terms) return setErr("Please agree to the terms.");
      const id = placeOrder({
        lines: cart,
        total,
        address: `${form.name}, ${form.line1}, ${form.city}, ${form.state} ${form.zip}`,
        method: form.method,
      });
      push({ name: "orderConfirm", orderId: id });
      return;
    }
    setErr("");
    setStep(step + 1);
  };

  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Checkout" subtitle={`Step ${step + 1} of 4 · ${steps[step]}`} />
      <div className="flex gap-1 px-4">
        {steps.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#BD915F]" : "bg-[#00264C]/10"}`} />
        ))}
      </div>
      <div className="space-y-3 px-4 py-4">
        {step === 0 && (
          <>
            <Field label="Full Name">
              <TextField value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Email">
              <TextField value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Phone">
              <TextField value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Address Line 1">
              <TextField value={form.line1} onChange={(e) => set("line1", e.target.value)} />
            </Field>
            <Field label="Address Line 2">
              <TextField value={form.line2} onChange={(e) => set("line2", e.target.value)} />
            </Field>
            <Field label="City">
              <TextField value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="State">
                <TextField value={form.state} onChange={(e) => set("state", e.target.value)} />
              </Field>
              <Field label="Zip">
                <TextField value={form.zip} onChange={(e) => set("zip", e.target.value)} />
              </Field>
            </div>
            <Field label="Country">
              <TextField value={form.country} onChange={(e) => set("country", e.target.value)} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.save} onChange={(e) => set("save", e.target.checked)} className="accent-[#BD915F]" /> Save address
            </label>
          </>
        )}
        {step === 1 && (
          <div className="grid gap-2">
            {[
              ["Standard", sub >= 75 ? "Free" : "$8.00", "5–7 business days"],
              ["Express", "$18.00", "2–3 business days"],
            ].map(([name, price, eta]) => (
              <button key={name} onClick={() => set("method", name)} className={`rounded-3xl bg-white p-4 text-left shadow-sm ${form.method === name ? "ring-2 ring-[#BD915F]" : ""}`}>
                <p className="font-semibold">
                  {name} · {price}
                </p>
                <p className="text-sm text-muted-foreground">{eta}</p>
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <>
            <div className="flex flex-wrap gap-2">
              {["Card", "Apple Pay", "Google Pay", "PayPal"].map((p) => (
                <Chip key={p} active={form.pay === p} onClick={() => set("pay", p)}>
                  {p}
                </Chip>
              ))}
            </div>
            {form.pay === "Card" ? (
              <>
                <Field label="Card Number">
                  <TextField value={form.card} onChange={(e) => set("card", e.target.value)} placeholder="4242 4242 4242 4242" />
                </Field>
                <Field label="Name on Card">
                  <TextField value={form.cardName} onChange={(e) => set("cardName", e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Expiry">
                    <TextField value={form.exp} onChange={(e) => set("exp", e.target.value)} placeholder="MM/YY" />
                  </Field>
                  <Field label="CVV">
                    <TextField value={form.cvv} onChange={(e) => set("cvv", e.target.value)} placeholder="123" />
                  </Field>
                </div>
              </>
            ) : (
              <p className="rounded-3xl bg-white p-4 text-sm shadow-sm">{form.pay} will confirm on the next step in this preview. No charge is placed.</p>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.same} onChange={(e) => set("same", e.target.checked)} className="accent-[#BD915F]" /> Billing same as shipping
            </label>
          </>
        )}
        {step === 3 && (
          <div className="space-y-3 text-sm">
            {cart.map((l) => {
              const p = productById(l.productId);
              return (
                <p key={l.key}>
                  {p?.name} · {l.color} / {l.size} × {l.qty}
                </p>
              );
            })}
            <p>
              {form.name}, {form.line1}, {form.city} {form.state} {form.zip}
            </p>
            <p>
              {form.method} · {form.pay}
            </p>
            <p className="font-display text-2xl text-[#BD915F]">{money(total)}</p>
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={form.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-1 accent-[#BD915F]" />
              I agree to the Terms & Conditions
            </label>
          </div>
        )}
        {err && <p className="text-sm text-[#b42318]">{err}</p>}
        <div className="flex gap-2">
          {step > 0 && (
            <Btn variant="outline" full onClick={() => setStep(step - 1)}>
              Back
            </Btn>
          )}
          <Btn full onClick={next}>
            {step === 3 ? "Place Order" : "Next"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function OrderConfirm({ orderId }: { orderId: string }) {
  const { orders, push, goTab } = useApp();
  const order = orders.find((o) => o.id === orderId);
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[#e5f6ee] text-[#1f7a4d] pop">
        <Check size={36} />
      </div>
      <p className="mt-3 text-2xl">🐾 🐾</p>
      <h1 className="font-display text-4xl">Order placed</h1>
      <p className="mt-1 text-sm text-muted-foreground">{orderId}</p>
      {order && <p className="mt-2 text-sm">{money(order.total)} · {order.method}</p>}
      <div className="mt-6 w-full space-y-2">
        <Btn full onClick={() => push({ name: "order", id: orderId })}>
          Track Order
        </Btn>
        <Btn variant="outline" full onClick={() => goTab("shop")}>
          Continue Shopping
        </Btn>
      </div>
    </div>
  );
}

export function OrdersScreen() {
  const { orders, push } = useApp();
  return (
    <div className="h-full overflow-y-auto">
      <BackBar title="My Orders" />
      <div className="space-y-3 px-4 pb-8">
        {orders.map((o) => (
          <button key={o.id} onClick={() => push({ name: "order", id: o.id })} className="block w-full rounded-3xl bg-white p-4 text-left shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{o.id}</span>
              <Badge tone={statusTone(o.status)}>{o.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{o.createdAt}</p>
            <p className="text-[#BD915F]">{money(o.total)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function OrderDetail({ id }: { id: string }) {
  const { orders, addToCart, toast, push } = useApp();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  const timeline = ["Processing", "Shipped", "Delivered"];
  const at = timeline.indexOf(order.status);
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title={order.id} subtitle={order.status} />
      <div className="px-5">
        <ol className="space-y-3 border-l-2 border-[#BD915F] pl-4">
          {timeline.map((s, i) => (
            <li key={s} className={i <= at ? "font-semibold" : "text-muted-foreground"}>
              {s}
              <p className="text-xs font-normal text-muted-foreground">{i <= at ? order.createdAt : "Upcoming"}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm">{order.address}</p>
        <p className="text-sm text-muted-foreground">{order.method}</p>
        <div className="mt-3 space-y-2">
          {order.lines.map((l) => (
            <p key={l.key} className="text-sm">
              {productById(l.productId)?.name} · {l.color} / {l.size} × {l.qty}
            </p>
          ))}
        </div>
        <p className="mt-2 font-display text-2xl text-[#BD915F]">{money(order.total)}</p>
        <Btn
          full
          className="mt-4"
          onClick={() => {
            order.lines.forEach((l) => addToCart(l.productId, l.color, l.size, l.qty));
            toast("Items added back to your cart");
            push({ name: "cart" });
          }}
        >
          Reorder
        </Btn>
      </div>
    </div>
  );
}

export function Wishlist() {
  const { wishlist, push, goTab } = useApp();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="h-full overflow-y-auto">
      <BackBar title="Wishlist" />
      {!items.length ? (
        <Empty title="Nothing saved yet" body="Tap the heart on a tee or hoodie." action={<Btn full onClick={() => goTab("shop")}>Browse merch</Btn>} />
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pb-8">
          {items.map((p) => (
            <button key={p.id} onClick={() => push({ name: "product", id: p.id })} className="overflow-hidden rounded-3xl bg-white text-left shadow-sm">
              <Photo src={p.images.Copper} alt={p.name} className="aspect-square w-full" />
              <p className="p-3 font-display text-lg leading-tight">{p.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
