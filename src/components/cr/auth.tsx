import { useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, EyeOff, Mail, Lock, Phone, User } from "lucide-react";
import { logoSrc, aiImg, siteImg, US_STATES, hearAbout } from "@/lib/copper-data";
import { useApp } from "@/lib/store";
import { Area, Btn, Eyebrow, Field, Photo, SelectField, TextField } from "./ui";

export function Splash() {
  const { finishSplash } = useApp();
  const finishRef = useRef(finishSplash);
  finishRef.current = finishSplash;
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = setTimeout(() => finishRef.current(), 400);
      return () => clearTimeout(t);
    }
    const marks = [600, 1600, 2200, 2800];
    const timers = marks.map((ms, i) => setTimeout(() => setPhase(i + 1), ms));
    const done = setTimeout(() => finishRef.current(), 3000);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, []);

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#00264C] text-white"
      style={{ opacity: phase >= 0 ? 1 : 0, transition: "opacity .6s ease" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #fff 1.2px, transparent 1.4px), radial-gradient(circle at 70% 60%, #fff 1.2px, transparent 1.4px)", backgroundSize: "48px 48px" }} />
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-[#BD915F]/25 blur-3xl" />
      <div className="relative z-10 flex flex-col items-center px-8">
        <div
          className="relative"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1)" : "scale(0.7)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          <img src={logoSrc} alt="Copper Road Maine Coon Cattery logo" className="h-40 w-auto object-contain" />
          {phase === 1 && (
            <span className="logo-shimmer pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent" style={{ animation: "shimmer 1s ease forwards" }} />
            </span>
          )}
        </div>
        <div className="relative mt-8 h-14 w-64" style={{ opacity: phase >= 2 ? 1 : 0 }}>
          <svg viewBox="0 0 260 56" className="h-full w-full">
            <path id="road" d="M8 40 Q 80 8 130 30 T 252 22" fill="none" stroke="#BD915F" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="paw-step absolute top-0 text-sm"
              style={{
                offsetPath: "path('M8 40 Q 80 8 130 30 T 252 22')",
                animation: phase >= 2 ? `paw-walk .7s ease ${i * 0.12}s both` : "none",
                color: "#BD915F",
              }}
            >
              🐾
            </span>
          ))}
        </div>
        <p
          className="mt-2 text-center font-display text-[22px] italic text-white/90"
          style={{ opacity: phase >= 3 ? 1 : 0, transition: "opacity .6s ease" }}
        >
          Breeding Healthy, Happy Maine Coon Cats
        </p>
      </div>
      <div className="absolute inset-x-10 bottom-10 h-[3px] overflow-hidden rounded-full bg-white/15">
        <div className="h-full bg-[#BD915F]" style={{ animation: "splash-bar 3s linear forwards" }} />
      </div>
    </div>
  );
}

const slides = [
  {
    img: siteImg("Rectangle-6.png"),
    alt: "Majestic Maine Coon portrait",
    eyebrow: "WELCOME TO COPPER ROAD",
    title: "More Than A Cattery. We're A Family.",
    text: "At Copper Road Maine Coons, we're dedicated to raising healthy, happy, and sociable kittens, giving families a loving, gentle companion and a forever friend to cherish for years to come.",
  },
  {
    img: siteImg("Rectangle-6-1.png"),
    alt: "Queens and Kings of Copper Road",
    eyebrow: "MEET OUR MAINE COONS",
    title: "The Heart Of Copper Road",
    text: "All of our Queens and Kings are purebred Maine Coons, each with a certified 5-generation pedigree, proudly registered with TICA (The International Cat Association).",
  },
  {
    img: aiImg("family-kitten.jpg"),
    alt: "A family holding a Maine Coon kitten",
    eyebrow: "RESPONSIBLE BREEDING",
    title: "Beauty Begins With Health.",
    text: "Our breeding program is built around thoughtful planning, responsible care, and the health and well-being of every Maine Coon. Apply for a kitten, follow our breeding plan, and shop Copper Road merch, all in one place.",
  },
];

export function Onboarding() {
  const { finishOnboarding } = useApp();
  const [i, setI] = useState(0);
  const startX = useRef(0);
  const slide = slides[i];
  const last = i === slides.length - 1;

  const go = (n: number) => setI(Math.max(0, Math.min(slides.length - 1, n)));

  return (
    <div
      className="relative h-full overflow-hidden bg-[#00264C]"
      onPointerDown={(e) => {
        startX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        const dx = e.clientX - startX.current;
        if (dx < -48) go(i + 1);
        else if (dx > 48) go(i - 1);
      }}
    >
      {slides.map((s, n) => (
        <Photo
          key={s.img}
          src={s.img}
          alt={s.alt}
          eager
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />
      ))}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-[#00162e]/75 to-transparent" />
      <button
        onClick={() => finishOnboarding("login")}
        className="absolute right-5 top-5 z-10 h-11 rounded-full bg-[#00162e]/55 px-4 text-sm font-medium text-white backdrop-blur-md"
      >
        Skip
      </button>
      <div
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col px-6 pb-8 pt-20"
        style={{
          background: "linear-gradient(to top, #00162e 0px, #00162e calc(100% - 64px), rgba(0,22,46,0) 100%)",
        }}
      >
        <Eyebrow light>{slide.eyebrow}</Eyebrow>
        <h1 className="mt-2 font-display text-[34px] leading-[1.08] text-white">{slide.title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/95">{slide.text}</p>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5" aria-label={`Slide ${i + 1} of ${slides.length}`}>
            {slides.map((_, n) => (
              <button
                key={n}
                aria-label={`Go to slide ${n + 1}`}
                onClick={() => go(n)}
                className={n === i ? "h-2 w-6 rounded-full bg-[#BD915F]" : "h-2 w-2 rounded-full bg-white/45"}
              />
            ))}
          </div>
          <Btn
            onClick={() => {
              if (last) finishOnboarding("login");
              else go(i + 1);
            }}
          >
            {last ? "Get Started" : "Next"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function AuthHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-b-[32px] bg-[#00264C] px-6 pb-8 pt-8 text-white">
      <img src={logoSrc} alt="Copper Road Maine Coon Cattery" className="mx-auto h-20 w-auto object-contain" />
      <h1 className="mt-4 text-center font-display text-4xl">{title}</h1>
      <p className="mt-1 text-center text-sm text-white/75">{sub}</p>
    </div>
  );
}

export function Login() {
  const { login, push, continueGuest, loginSocial } = useApp();
  const [email, setEmail] = useState("jordan@example.com");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <AuthHeader title="Welcome Back" sub="Log in to manage your applications and orders." />
      <div className="space-y-4 px-5 py-6">
        <Field label="Email Address">
          <TextField icon={<Mail size={16} />} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" />
        </Field>
        <Field label="Password">
          <div className="relative">
            <TextField
              icon={<Lock size={16} />}
              className="pr-12"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#00264C]"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#BD915F]" />
            Remember me
          </label>
          <button className="font-semibold text-[#BD915F]" onClick={() => push({ name: "reset" })}>
            Forgot Password?
          </button>
        </div>
        <Btn full onClick={submit} disabled={loading}>
          {loading ? "Signing in…" : "Log In"}
        </Btn>
        <p className="text-center text-xs text-muted-foreground">Demo family login: jordan@example.com · Copper1</p>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-[#BD915F]/40" />
          or continue with
          <span className="h-px flex-1 bg-[#BD915F]/40" />
        </div>
        <Btn variant="outline" full onClick={loginSocial}>
          Continue with Google
        </Btn>
        <Btn variant="navy" full onClick={loginSocial}>
          Continue with Apple
        </Btn>
        <p className="text-center text-sm">
          New to Copper Road?{" "}
          <button className="font-semibold text-[#BD915F]" onClick={() => push({ name: "register" })}>
            Create Account
          </button>
        </p>
        <button className="mx-auto block h-11 text-sm font-medium text-[#00264C] underline" onClick={continueGuest}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

export function ResetPassword() {
  const { back, toast } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="h-full overflow-y-auto bg-background">
      <AuthHeader title="Reset Password" sub="We'll email you a link to choose a new password." />
      <div className="space-y-4 px-5 py-6">
        {sent ? (
          <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl text-[#2f7d5a]">Check your inbox</p>
            <p className="mt-2 text-sm text-muted-foreground">A reset link is on its way to {email}. This is a preview — no email is actually sent.</p>
            <Btn full className="mt-5" onClick={back}>
              Back to Log In
            </Btn>
          </div>
        ) : (
          <>
            <Field label="Email Address" error={error}>
              <TextField icon={<Mail size={16} />} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </Field>
            <Btn
              full
              onClick={() => {
                if (!email.includes("@")) return setError("Enter the email on your account.");
                setError("");
                setSent(true);
                toast("Reset link sent");
              }}
            >
              Send Reset Link
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}

export function Register() {
  const { register, push } = useApp();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    code: "+1",
    phone: "",
    password: "",
    confirm: "",
    city: "",
    state: "SD",
    zip: "",
    hear: "",
    adopting: "Yes",
    terms: false,
    updates: true,
  });
  const [show, setShow] = useState(false);
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const strength = Math.min(4, [form.password.length >= 6, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), form.password.length >= 10].filter(Boolean).length);

  const submit = () => {
    register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: `${form.code} ${form.phone}`,
      password: form.password,
      city: form.city,
      state: form.state,
      zip: form.zip,
      hear: form.hear,
      adopting: form.adopting,
      updates: form.updates,
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <AuthHeader title="Join The Copper Road Family" sub="Create an account to apply, save favorites, and shop." />
      <div className="space-y-3 px-5 py-6">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name">
            <TextField icon={<User size={16} />} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          </Field>
          <Field label="Last Name">
            <TextField value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          </Field>
        </div>
        <Field label="Email Address">
          <TextField icon={<Mail size={16} />} value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone Number">
          <div className="flex gap-2">
            <div className="relative shrink-0">
              <select
                aria-label="Country code"
                value={form.code}
                onChange={(e) => set("code", e.target.value)}
                className="h-12 w-[7.25rem] appearance-none rounded-2xl border border-[#00264C]/20 bg-white pl-3 pr-8 text-[15px] font-medium text-[#00264C] outline-none focus:border-[#BD915F] focus:ring-2 focus:ring-[#BD915F]/30"
              >
                {[
                  ["+1", "US/CA +1"],
                  ["+44", "UK +44"],
                  ["+61", "AU +61"],
                  ["+52", "MX +52"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#BD915F]" />
            </div>
            <TextField icon={<Phone size={16} />} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="605 630 3008" />
          </div>
        </Field>
        <Field label="Password">
          <div className="relative">
            <TextField className="pr-12" type={show ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} />
            <button type="button" aria-label="Toggle password" className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-[#00264C]" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="mt-2 flex gap-1">
            {[0, 1, 2, 3].map((n) => (
              <span key={n} className={`h-1.5 flex-1 rounded-full ${n < strength ? "bg-[#BD915F]" : "bg-[#00264C]/10"}`} />
            ))}
          </div>
        </Field>
        <Field label="Confirm Password">
          <TextField type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
        </Field>
        <Field label="City">
          <TextField value={form.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="State">
            <SelectField value={form.state} onChange={(v) => set("state", v)} options={US_STATES} />
          </Field>
          <Field label="Zip Code">
            <TextField value={form.zip} onChange={(e) => set("zip", e.target.value)} />
          </Field>
        </div>
        <Field label="How did you hear about us?">
          <SelectField value={form.hear} onChange={(v) => set("hear", v)} options={hearAbout} placeholder="Choose one" />
        </Field>
        <Field label="Are you interested in adopting a kitten?">
          <div className="flex gap-2">
            {["Yes", "Maybe later"].map((opt) => (
              <button key={opt} type="button" onClick={() => set("adopting", opt)} className={`h-11 flex-1 rounded-2xl text-sm font-semibold ${form.adopting === opt ? "bg-[#00264C] text-white" : "bg-white"}`}>
                {opt}
              </button>
            ))}
          </div>
        </Field>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={form.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-1 accent-[#BD915F]" />
          <span>
            I agree to the{" "}
            <button type="button" className="font-semibold text-[#BD915F]" onClick={() => push({ name: "legal", doc: "terms" })}>
              Terms & Conditions
            </button>{" "}
            and{" "}
            <button type="button" className="font-semibold text-[#BD915F]" onClick={() => push({ name: "legal", doc: "privacy" })}>
              Privacy Policy
            </button>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={form.updates} onChange={(e) => set("updates", e.target.checked)} className="mt-1 accent-[#BD915F]" />
          Send me kitten availability updates
        </label>
        <Btn full onClick={submit}>
          Create Account
        </Btn>
        <p className="pb-6 text-center text-sm">
          Already have an account?{" "}
          <button className="font-semibold text-[#BD915F]" onClick={() => push({ name: "login" })}>
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

export function Welcome() {
  const { reset } = useApp();
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#E1EFF9] px-8 text-center">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute text-lg text-[#BD915F]"
          style={{ left: `${(i * 17) % 100}%`, top: -10, animation: `fall ${2.4 + (i % 4) * 0.3}s linear ${i * 0.12}s infinite` }}
        >
          🐾
        </span>
      ))}
      <img src={logoSrc} alt="Copper Road" className="h-24 w-auto pop" />
      <h1 className="mt-6 font-display text-4xl text-[#00264C]">Welcome to the family!</h1>
      <p className="mt-2 text-sm text-[#3e5670]">Your account is ready. The kittens are this way.</p>
      <Btn className="mt-8" onClick={() => reset({ name: "main", tab: "cats" })}>
        Explore Kittens
      </Btn>
    </div>
  );
}
