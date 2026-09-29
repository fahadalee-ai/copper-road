import { useEffect, useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ArrowLeft, Heart, Search, ShoppingBag, Bell, Home, PawPrint, ShoppingBag as Bag, BookOpen, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoSrc } from "@/lib/copper-data";
import { useApp, type TabId } from "@/lib/store";

export function Photo({
  src,
  alt,
  className,
  imgClassName,
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-[#d5e6f2]", className)}>
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#d5e6f2] to-[#f7fbfe]" />}
      {failed ? (
        <div className="absolute inset-0 grid place-items-center text-[#00264C]/40">
          <PawPrint size={28} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", light ? "text-[#BD915F]" : "text-[#00264C]")}>
      {children}
    </p>
  );
}

export function Btn({
  children,
  variant = "primary",
  full,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "navy" | "ghost" | "light"; full?: boolean }) {
  const styles = {
    primary: "bg-[#BD915F] text-[#00264C] shadow-sm",
    outline: "border border-[#00264C]/30 bg-transparent text-[#00264C]",
    navy: "bg-[#00264C] text-white",
    ghost: "bg-transparent text-[#00264C] underline-offset-4 hover:underline",
    light: "border border-white/70 bg-white/10 text-white",
  }[variant];
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-12 min-h-11 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold transition active:scale-[0.98] disabled:opacity-60",
        styles,
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-[#b42318]">{error}</span>}
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-2xl border border-[#00264C]/20 bg-white px-4 text-[15px] text-[#00264C] outline-none transition focus:border-[#BD915F] focus:ring-2 focus:ring-[#BD915F]/30 placeholder:text-[#5c738a]";

export function TextField({
  icon,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#BD915F]">{icon}</span>}
      <input {...props} className={cn(inputClass, icon && "pl-10", className)} />
    </div>
  );
}

export function Area({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "h-auto min-h-28 resize-none py-3", className)} />;
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition active:scale-95",
        active ? "bg-[#00264C] text-white" : "bg-white text-[#00264C] shadow-sm",
      )}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "copper",
}: {
  children: ReactNode;
  tone?: "copper" | "navy" | "green" | "red" | "muted";
}) {
  const map = {
    copper: "bg-[#BD915F]/20 text-[#7a5a2c]",
    navy: "bg-[#00264C] text-white",
    green: "bg-[#e5f6ee] text-[#1f7a4d]",
    red: "bg-[#fde8e6] text-[#9f2c24]",
    muted: "bg-[#E1EFF9] text-[#3e5670]",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold", map)}>{children}</span>;
}

export function statusTone(status: string): "green" | "copper" | "red" | "navy" | "muted" {
  if (status === "Available" || status === "Delivered" || status === "Approved" || status === "Born") return "green";
  if (status === "Reserved" || status === "Expecting" || status === "Shipped" || status === "Under Review" || status === "Processing")
    return "copper";
  if (status === "Sold" || status === "Sold Out") return "red";
  if (status === "Planned" || status === "Waitlisted" || status === "Submitted") return "navy";
  return "muted";
}

export function BackBar({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  const { back } = useApp();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 bg-background/90 px-3 py-3 backdrop-blur-md">
      <button aria-label="Go back" onClick={back} className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-sm">
        <ArrowLeft size={18} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-[26px] leading-none text-foreground">{title}</h1>
        {subtitle && <p className="truncate text-[12px] text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function HeartBtn({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#00264C] shadow-sm"
    >
      <Heart size={18} className={on ? "fill-[#BD915F] text-[#BD915F]" : ""} />
    </button>
  );
}

export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-[#00264C]/50" onClick={onClose}>
      <div
        className="max-h-[85%] w-full overflow-y-auto rounded-t-3xl bg-card p-5 pb-8 shadow-2xl rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#BD915F]/50" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">{title}</h2>
          <button onClick={onClose} className="h-11 px-2 text-sm font-semibold text-[#BD915F]">
            Done
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Modal({
  open,
  title,
  body,
  confirm,
  onConfirm,
  onClose,
  danger,
}: {
  open: boolean;
  title: string;
  body: string;
  confirm: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-[#00264C]/50 px-6" onClick={onClose}>
      <div className="w-full rounded-3xl bg-card p-5 shadow-xl pop" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
        <div className="mt-5 flex gap-2">
          <Btn variant="outline" full onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant={danger ? "navy" : "primary"} full onClick={onConfirm}>
            {confirm}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function Toasts() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className="rounded-full bg-[#00264C] px-4 py-2 text-sm text-white shadow-lg fade-in">
          {t.title}
        </div>
      ))}
    </div>
  );
}

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "cats", label: "Cats", icon: PawPrint },
  { id: "shop", label: "Shop", icon: Bag },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "profile", label: "Profile", icon: UserRound },
];

export function BottomNav() {
  const { screen, goTab } = useApp();
  const active = screen.name === "main" ? screen.tab : null;
  return (
    <nav className="absolute inset-x-0 bottom-0 z-40 grid h-[76px] grid-cols-5 items-start bg-[#00264C] px-1 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] text-white">
      {tabs.map((t) => {
        const on = active === t.id;
        const Icon = t.icon;
        return (
          <button key={t.id} onClick={() => goTab(t.id)} className="flex h-12 flex-col items-center justify-center gap-0.5">
            <Icon size={20} className={on ? "text-[#BD915F]" : "text-white/70"} />
            <span className={cn("text-[10px] font-medium", on ? "text-[#BD915F]" : "text-white/70")}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function ApplyFab() {
  const { push } = useApp();
  return (
    <button
      onClick={() => push({ name: "apply" })}
      className="absolute bottom-[88px] right-4 z-40 h-12 rounded-full bg-[#BD915F] px-4 text-sm font-semibold text-[#00264C] shadow-lg active:scale-95"
    >
      Apply
    </button>
  );
}

export function IconBtn({ label, children, onClick, badge }: { label: string; children: ReactNode; onClick: () => void; badge?: number }) {
  return (
    <button aria-label={label} onClick={onClick} className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-white">
      {children}
      {!!badge && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#BD915F] px-1 text-[10px] font-bold text-[#00264C]">
          {badge}
        </span>
      )}
    </button>
  );
}

export function HomeHeader() {
  const { push, cartCount, unread } = useApp();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 bg-[#00264C] px-4 py-3">
      <img src={logoSrc} alt="Copper Road Maine Coon Cattery" className="h-11 w-auto object-contain" />
      <div className="flex-1" />
      <IconBtn label="Search" onClick={() => push({ name: "search" })}>
        <Search size={18} />
      </IconBtn>
      <IconBtn label="Cart" badge={cartCount} onClick={() => push({ name: "cart" })}>
        <ShoppingBag size={18} />
      </IconBtn>
      <IconBtn label="Notifications" badge={unread} onClick={() => push({ name: "notifications" })}>
        <Bell size={18} />
      </IconBtn>
    </header>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="text-[#BD915F]" aria-label={`${value} stars`}>
      {"★★★★★".slice(0, value)}
      <span className="text-[#BD915F]/30">{"★★★★★".slice(value)}</span>
    </span>
  );
}

export function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" aria-label={`${n} stars`} onClick={() => onChange(n)} className="h-11 w-11 text-2xl text-[#BD915F]">
          {n <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

export function Viewer({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onIndex: (n: number) => void;
}) {
  const [scale, setScale] = useState(1);
  const [startX, setStartX] = useState<number | null>(null);
  useEffect(() => setScale(1), [index]);
  const photo = photos[index];
  if (!photo) return null;
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#00264C] text-white">
      <div className="flex items-center justify-between px-3 py-3">
        <button onClick={onClose} className="h-11 px-3 text-sm">
          Close
        </button>
        <span className="text-sm">
          {index + 1} / {photos.length}
        </span>
        <button onClick={() => setScale((s) => (s > 1 ? 1 : 2))} className="h-11 px-3 text-sm">
          {scale > 1 ? "Reset" : "Zoom"}
        </button>
      </div>
      <div
        className="relative flex-1 overflow-hidden"
        onTouchStart={(e) => {
          if (e.touches.length === 1) setStartX(e.touches[0].clientX);
        }}
        onTouchEnd={(e) => {
          if (startX == null) return;
          const dx = e.changedTouches[0].clientX - startX;
          if (dx > 50) onIndex((index - 1 + photos.length) % photos.length);
          if (dx < -50) onIndex((index + 1) % photos.length);
          setStartX(null);
        }}
        onDoubleClick={() => setScale((s) => (s > 1 ? 1 : 2))}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-contain transition-transform"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
      <div className="flex justify-between px-4 py-4">
        <button className="h-11 rounded-full bg-white/10 px-4" onClick={() => onIndex((index - 1 + photos.length) % photos.length)}>
          Prev
        </button>
        <button className="h-11 rounded-full bg-white/10 px-4" onClick={() => onIndex((index + 1) % photos.length)}>
          Next
        </button>
      </div>
    </div>
  );
}

export function PullHint({ children, onRefresh }: { children: ReactNode; onRefresh?: () => void }) {
  const { toast } = useApp();
  const [pull, setPull] = useState(0);
  const [start, setStart] = useState<number | null>(null);
  return (
    <div
      onTouchStart={(e) => {
        const el = e.currentTarget;
        if (el.scrollTop <= 0) setStart(e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        if (start == null) return;
        setPull(Math.max(0, Math.min(70, e.touches[0].clientY - start)));
      }}
      onTouchEnd={() => {
        if (pull > 56) {
          onRefresh?.();
          toast("Updated");
        }
        setPull(0);
        setStart(null);
      }}
      className="h-full overflow-y-auto"
    >
      {pull > 8 && <p className="py-2 text-center text-xs text-[#BD915F]">Release to refresh</p>}
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="mx-auto my-1 h-px w-12 bg-[#BD915F]" />;
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center px-8 py-16 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-[#BD915F] shadow-sm">
        <PawPrint size={32} />
      </div>
      <h2 className="mt-4 font-display text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      {action && <div className="mt-5 w-full">{action}</div>}
    </div>
  );
}

export function shareText(text: string, toast: (s: string) => void) {
  if (navigator.share) {
    navigator.share({ title: "Copper Road", text }).catch(() => undefined);
  } else {
    navigator.clipboard?.writeText(text).then(() => toast("Link copied"));
  }
}
