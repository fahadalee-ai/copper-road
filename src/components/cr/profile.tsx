import { useState } from "react";
import { cats, faqs, kittenById, logoSrc } from "@/lib/copper-data";
import { useApp } from "@/lib/store";
import { SocialRow } from "./home";
import { CONTACT } from "@/lib/copper-data";
import { Area, BackBar, Badge, Btn, Empty, Field, Modal, Photo, TextField, statusTone } from "./ui";

const tiles = [
  ["applications", "My Applications"],
  ["journey", "My Kitten Journey"],
  ["favorites", "Favorites"],
  ["orders", "My Orders"],
  ["wishlist", "Wishlist"],
  ["messages", "Messages"],
  ["gallery", "Gallery"],
  ["testimonials", "Testimonials"],
  ["about", "About Us"],
  ["faqs", "FAQ's"],
  ["notifications", "Notifications"],
  ["notifSettings", "Notification Settings"],
  ["settings", "Settings"],
  ["help", "Help & Support"],
] as const;

export function ProfileScreen() {
  const { user, push, goTab } = useApp();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { logout } = useApp();
  const name = user ? `${user.firstName} ${user.lastName}` : "Guest";
  return (
    <div className="h-full overflow-y-auto pb-28">
      <div className="bg-[#00264C] px-5 pb-6 pt-8 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#BD915F] font-display text-2xl text-[#00264C]">
            {(user?.firstName || "G").slice(0, 1)}
            {(user?.lastName || "").slice(0, 1)}
          </div>
          <div>
            <h1 className="font-display text-3xl leading-none">{name}</h1>
            <span className="mt-1 inline-block rounded-full bg-[#BD915F] px-2 py-0.5 text-[11px] font-semibold text-[#00264C]">Family Member</span>
          </div>
        </div>
        {user?.guest && (
          <button className="mt-3 text-sm font-semibold text-[#BD915F]" onClick={() => push({ name: "register" })}>
            Create an account
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        {tiles.map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
              if (id === "orders") push({ name: "orders" });
              else if (id === "wishlist") push({ name: "wishlist" });
              else if (id === "gallery") push({ name: "gallery" });
              else if (id === "applications") push({ name: "applications" });
              else if (id === "testimonials") push({ name: "testimonials" });
              else if (id === "about") push({ name: "about" });
              else if (id === "faqs") push({ name: "faqs" });
              else if (id === "notifications") push({ name: "notifications" });
              else if (id === "notifSettings") push({ name: "notifSettings" });
              else if (id === "settings") push({ name: "settings" });
              else if (id === "help") push({ name: "help" });
              else if (id === "messages") push({ name: "messages" });
              else if (id === "journey") push({ name: "journey" });
              else if (id === "favorites") push({ name: "favorites" });
              else goTab("home");
            }}
            className="min-h-[88px] rounded-3xl bg-white p-4 text-left font-display text-xl leading-tight shadow-sm"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="px-4">
        <Btn variant="outline" full onClick={() => setLogoutOpen(true)}>
          Log Out
        </Btn>
      </div>
      <Modal
        open={logoutOpen}
        title="Log out?"
        body="You can sign back in anytime to see your applications and orders."
        confirm="Log Out"
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
        }}
      />
    </div>
  );
}

export function Applications() {
  const { applications, push } = useApp();
  return (
    <div className="h-full overflow-y-auto">
      <BackBar title="My Applications" />
      <div className="space-y-3 px-4 pb-8">
        {applications.map((a) => (
          <button key={a.id} onClick={() => push({ name: "application", id: a.id })} className="block w-full rounded-3xl bg-white p-4 text-left shadow-sm">
            <div className="flex justify-between">
              <span className="font-semibold">{a.id}</span>
              <Badge tone={statusTone(a.status)}>{a.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{a.createdAt}</p>
            <p className="text-sm">Kitten: {a.data.kitten || "Any"}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ApplicationDetail({ id }: { id: string }) {
  const app = useApp().applications.find((a) => a.id === id);
  const [note, setNote] = useState("");
  const { toast } = useApp();
  if (!app) return null;
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title={app.id} subtitle={app.status} />
      <div className="px-5">
        <ol className="space-y-3 border-l-2 border-[#BD915F] pl-4">
          {app.timeline.map((t) => (
            <li key={t.label}>
              <p className={t.done ? "font-semibold" : "text-muted-foreground"}>{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.detail}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-3xl bg-white p-4 text-sm shadow-sm">
          <p className="font-semibold">Messages</p>
          <p className="mt-2 text-muted-foreground">Copper Road: Thank you for applying. We'll write as soon as we've read through your home.</p>
          {note && <p className="mt-2">You: {note}</p>}
        </div>
        <Field label="Send a note">
          <Area value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <Btn className="mt-2" onClick={() => note && toast("Note sent to the cattery")}>
          Send
        </Btn>
      </div>
    </div>
  );
}

export function Journey() {
  const { applications, push } = useApp();
  const approved = applications.find((a) => a.status === "Approved");
  const kitten = kittenById("seraphina");
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="My Kitten Journey" />
      <div className="px-5">
        {approved && kitten ? (
          <JourneyCard />
        ) : (
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="font-display text-2xl">Your place is being held with care.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              After approval, this screen shows your reserved kitten, deposit, go-home date, and a checklist. Here's a preview of how that looks.
            </p>
          </div>
        )}
        {kitten && (
          <div className="mt-4">
            <JourneyCard />
            <button className="mt-3 text-sm font-semibold text-[#BD915F]" onClick={() => push({ name: "kitten", id: kitten.id })}>
              View {kitten.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function JourneyCard() {
  const kitten = kittenById("seraphina")!;
  const [done, setDone] = useState<string[]>(["Deposit conversation"]);
  const items = ["Deposit conversation", "Home visit or video call", "Carrier ready", "Veterinarian chosen", "Go-home day"];
  const pct = Math.round((done.length / items.length) * 100);
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <Photo src={kitten.photo} alt={kitten.name} className="h-40 w-full rounded-2xl" />
      <h2 className="mt-2 font-display text-3xl">{kitten.name}</h2>
      <p className="text-sm">Deposit: discussed, not yet placed</p>
      <p className="text-sm">Go-home window: January 2027</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E1EFF9]">
        <div className="h-full bg-[#BD915F]" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs">{pct}% of the go-home checklist</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-[#BD915F]"
                checked={done.includes(item)}
                onChange={() => setDone((d) => (d.includes(item) ? d.filter((x) => x !== item) : [...d, item]))}
              />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Favorites() {
  const { favCats, favKittens, push } = useApp();
  const kittenCards = favKittens.map((id) => kittenById(id)).filter(Boolean);
  const catCards = favCats.map((id) => cats.find((c) => c.id === id)).filter(Boolean);
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Favorites" />
      {!kittenCards.length && !catCards.length ? (
        <Empty title="No favorites yet" body="Hearts on kittens and cats live here." />
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {kittenCards.map((k) => k && (
            <button key={k.id} onClick={() => push({ name: "kitten", id: k.id })} className="overflow-hidden rounded-3xl bg-white text-left shadow-sm">
              <Photo src={k.photo} alt={k.name} className="aspect-square w-full" />
              <p className="p-2 font-display text-xl">{k.name}</p>
            </button>
          ))}
          {catCards.map((c) => c && (
            <button key={c.id} onClick={() => push({ name: "cat", id: c.id })} className="overflow-hidden rounded-3xl bg-white text-left shadow-sm">
              <Photo src={c.photo} alt={c.name} className="aspect-square w-full" />
              <p className="p-2 font-display text-xl">{c.short}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Messages() {
  const { messages, sendMessage } = useApp();
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string | undefined>();
  return (
    <div className="flex h-full flex-col">
      <BackBar title="Messages" subtitle="Copper Road" />
      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-3">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] rounded-3xl px-4 py-2 text-sm ${m.from === "me" ? "ml-auto bg-[#BD915F] text-[#00264C]" : "bg-white"}`}>
            {m.image && <img src={m.image} alt="Attachment" className="mb-2 max-h-40 rounded-2xl" />}
            <p>{m.text}</p>
            <p className="mt-1 text-[10px] opacity-70">{m.time}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-[#00264C]/10 p-3">
        <label className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl bg-white text-sm">
          +
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setPreview(String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </label>
        <TextField value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" />
        <Btn
          onClick={() => {
            if (!text && !preview) return;
            sendMessage(text || "Photo", preview);
            setText("");
            setPreview(undefined);
          }}
        >
          Send
        </Btn>
      </div>
      {preview && <p className="px-4 pb-2 text-xs text-muted-foreground">Photo ready to send</p>}
    </div>
  );
}

export function TestimonialsScreen() {
  const { reviews, goTab, toast } = useApp();
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Testimonials" />
      <div className="space-y-3 px-4">
        {reviews.map((r) => (
          <article key={r.id} className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-[#BD915F]">{"★".repeat(r.stars)}</p>
            <p className="mt-2 text-sm leading-relaxed">“{r.quote}”</p>
            <p className="mt-2 text-sm font-semibold">{r.name} – {r.location}</p>
          </article>
        ))}
        <Btn
          full
          onClick={() => {
            goTab("home");
            toast("The review form is on Home");
          }}
        >
          Write a Review
        </Btn>
      </div>
    </div>
  );
}

export function AboutScreen() {
  const { push } = useApp();
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="About Us" />
      <div className="space-y-4 px-5 text-[15px] leading-relaxed">
        <img src={logoSrc} alt="Copper Road Maine Coon Cattery" className="h-20 w-auto" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Founder & Matchmaker of Copper Road Maine Coons</p>
        <p>My name is Tami Krogman, and I was born and raised in South Dakota. I grew up on a small farm, where I developed a deep love and respect for animals—big and small. Much to my parents' dismay, I was always “finding” new pets to bring home.</p>
        <p>The Maine Coon breed always fascinated me. Years later, after a long search, dodging scammers, and saving up, I finally found my first Maine Coon kitten—RUDI.</p>
        <h2 className="font-display text-3xl">Raised Underfoot, Nurtured For Temperament</h2>
        <p>Our Maine Coon kittens are raised in a loving home environment where they receive constant care, play, and social interaction. When you adopt from Copper Road Maine Coons, you're not just welcoming a pet, you're welcoming a lifelong companion full of love and character.</p>
        <button onClick={() => push({ name: "cat", id: "rudi" })} className="w-full rounded-3xl bg-[#00264C] p-4 text-left text-white">
          <p className="text-xs uppercase tracking-widest text-[#BD915F]">In Loving Memory</p>
          <p className="font-display text-3xl">RUDI</p>
          <p className="text-sm text-white/80">The Heart Of Copper Road</p>
        </button>
      </div>
    </div>
  );
}

export function FaqsScreen() {
  const [open, setOpen] = useState<string | null>(faqs[0].q);
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="FAQ's" />
      <div className="px-4">
        {faqs.map((f) => (
          <button key={f.q} onClick={() => setOpen(open === f.q ? null : f.q)} className="block w-full border-b border-[#00264C]/10 py-4 text-left">
            <span className="font-semibold">{f.q}</span>
            {open === f.q && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NotificationsScreen() {
  const { push, notif } = useApp();
  const items = [
    notif.kittens && { title: "Seraphina is still available", body: "A silver tortoiseshell who loves a lap.", href: { name: "kitten" as const, id: "seraphina" } },
    notif.litters && { title: "Olive & Roman are expecting", body: "Join the waitlist for silver and calico kittens.", href: { name: "breeding" as const } },
    notif.orders && { title: "Order CR-M-1042 delivered", body: "Your classic tee arrived.", href: { name: "order" as const, id: "CR-M-1042" } },
  ].filter(Boolean) as { title: string; body: string; href: { name: "kitten"; id: string } | { name: "breeding" } | { name: "order"; id: string } }[];
  return (
    <div className="h-full overflow-y-auto">
      <BackBar title="Notifications" />
      <div className="space-y-2 px-4">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Notifications are paused in settings.</p>}
        {items.map((n) => (
          <button key={n.title} onClick={() => push(n.href)} className="block w-full rounded-3xl bg-white p-4 text-left shadow-sm">
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-muted-foreground">{n.body}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function NotifSettings() {
  const { notif, toggleNotif } = useApp();
  const rows = [
    ["litters", "New litters"],
    ["kittens", "Kitten availability"],
    ["orders", "Order updates"],
  ] as const;
  return (
    <div className="h-full overflow-y-auto">
      <BackBar title="Notifications" />
      <div className="space-y-2 px-4">
        {rows.map(([key, label]) => (
          <label key={key} className="flex items-center justify-between rounded-3xl bg-white px-4 py-4 shadow-sm">
            <span>{label}</span>
            <input type="checkbox" className="h-5 w-5 accent-[#BD915F]" checked={notif[key]} onChange={() => toggleNotif(key)} />
          </label>
        ))}
      </div>
    </div>
  );
}

export function SettingsScreen() {
  const { push, theme, toggleTheme, language, setLanguage, toast } = useApp();
  const [del, setDel] = useState(false);
  const { deleteAccount } = useApp();
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Settings" />
      <div className="space-y-2 px-4">
        {[
          ["Edit profile", () => push({ name: "editProfile" })],
          ["Change password", () => push({ name: "password" })],
        ].map(([label, fn]) => (
          <button key={String(label)} onClick={fn as () => void} className="flex h-14 w-full items-center rounded-3xl bg-white px-4 text-left shadow-sm">
            {label as string}
          </button>
        ))}
        <label className="flex h-14 items-center justify-between rounded-3xl bg-white px-4 shadow-sm">
          Dark mode
          <input type="checkbox" className="h-5 w-5 accent-[#BD915F]" checked={theme === "dark"} onChange={toggleTheme} />
        </label>
        <label className="block rounded-3xl bg-white p-4 shadow-sm">
          Language
          <select
            className="mt-2 h-11 w-full rounded-xl bg-[#E1EFF9] px-3"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as "English" | "Español");
              toast(`${e.target.value} selected`);
            }}
          >
            <option>English</option>
            <option>Español</option>
          </select>
        </label>
        <Btn variant="outline" full onClick={() => setDel(true)}>
          Delete account
        </Btn>
      </div>
      <Modal open={del} danger title="Delete account?" body="This removes your profile from this device preview." confirm="Delete" onClose={() => setDel(false)} onConfirm={deleteAccount} />
    </div>
  );
}

export function EditProfile() {
  const { user, updateUser, toast, back } = useApp();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    state: user?.state || "",
    zip: user?.zip || "",
  });
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Edit Profile" />
      <div className="space-y-3 px-4">
        {(Object.keys(form) as (keyof typeof form)[]).map((k) => (
          <Field key={k} label={k}>
            <TextField value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </Field>
        ))}
        <Btn
          full
          onClick={() => {
            updateUser(form);
            toast("Profile saved");
            back();
          }}
        >
          Save
        </Btn>
      </div>
    </div>
  );
}

export function PasswordScreen() {
  const { toast, back } = useApp();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="h-full overflow-y-auto">
      <BackBar title="Change Password" />
      <div className="space-y-3 px-4">
        <Field label="New password" error={err}><TextField type="password" value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="Confirm"><TextField type="password" value={b} onChange={(e) => setB(e.target.value)} /></Field>
        <Btn full onClick={() => {
          if (a.length < 6 || a !== b) return setErr("Use 6+ characters and match both fields.");
          toast("Password updated");
          back();
        }}>Update password</Btn>
      </div>
    </div>
  );
}

export function HelpScreen() {
  const { push } = useApp();
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Help & Support" />
      <div className="space-y-4 px-5 text-sm">
        <p>{CONTACT.address}</p>
        <a className="block font-semibold text-[#BD915F]" href={CONTACT.emailHref}>{CONTACT.email}</a>
        <a className="block font-semibold text-[#BD915F]" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        <SocialRow />
        <button className="block h-11 font-semibold" onClick={() => push({ name: "legal", doc: "terms" })}>Terms & Conditions</button>
        <button className="block h-11 font-semibold" onClick={() => push({ name: "legal", doc: "privacy" })}>Privacy Policy</button>
        <button className="block h-11 font-semibold" onClick={() => push({ name: "contact" })}>Contact Us</button>
        <p className="text-xs text-muted-foreground">App version 1.0.0 · Copper Road preview</p>
      </div>
    </div>
  );
}

export function Legal({ doc }: { doc: "terms" | "privacy" }) {
  const title = doc === "terms" ? "Terms & Conditions" : "Privacy Policy";
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title={title} />
      <div className="space-y-3 px-5 text-sm leading-relaxed">
        {doc === "terms" ? (
          <>
            <p>Copper Road Maine Coon Cattery places kittens in indoor homes that will provide regular veterinary care. A non-refundable deposit reserves a kitten. Pet kittens are companions: spay or neuter is required between 6 and 8 months, declawing is not permitted, and limited registration paperwork follows proof of altering.</p>
            <p>Merchandise may be exchanged for size within 30 days. Kitten placements are not shipping orders — we arrange pickup, a reasonable delivery, or a meet-up.</p>
            <p>This app is a client preview. Agreements here illustrate the experience and do not replace the written contract.</p>
          </>
        ) : (
          <>
            <p>We use the details you share — name, contact, home, and preferences — to respond to applications, waitlists, and orders. This preview stores that information on your device only.</p>
            <p>We do not sell personal information. Questions can come to {CONTACT.email} or {CONTACT.phone}.</p>
          </>
        )}
      </div>
    </div>
  );
}

export function SearchScreen() {
  const { push } = useApp();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const kittenHits = query ? kittensMatch(query) : [];
  const catHits = query ? cats.filter((c) => `${c.name} ${c.tagline} ${c.coat}`.toLowerCase().includes(query)) : [];
  return (
    <div className="h-full overflow-y-auto">
      <BackBar title="Search" />
      <div className="px-4">
        <TextField autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kittens, queens, care, merch" />
        <div className="mt-3 space-y-2">
          {kittenHits.map((k) => (
            <button key={k.id} className="block w-full rounded-2xl bg-white p-3 text-left" onClick={() => push({ name: "kitten", id: k.id })}>{k.name} · {k.coat}</button>
          ))}
          {catHits.map((c) => (
            <button key={c.id} className="block w-full rounded-2xl bg-white p-3 text-left" onClick={() => push({ name: "cat", id: c.id })}>{c.name}</button>
          ))}
          {query && <button className="block w-full rounded-2xl bg-white p-3 text-left" onClick={() => push({ name: "main", tab: "shop" })}>Search merch for “{q}”</button>}
          {query && <button className="block w-full rounded-2xl bg-white p-3 text-left" onClick={() => push({ name: "main", tab: "learn" })}>Search education</button>}
        </div>
      </div>
    </div>
  );
}

function kittensMatch(query: string) {
  return kittenByList().filter((k) => `${k.name} ${k.coat} ${k.sex}`.toLowerCase().includes(query));
}

function kittenByList() {
  return ["aurelius", "seraphina", "caspian", "mirabelle", "wren"].map((id) => kittenById(id)!);
}
