import { useState } from "react";
import { Instagram, Facebook } from "lucide-react";
import {
  CONTACT,
  cats,
  galleryPhotos,
  kittens,
  pillars,
  products,
  siteImg,
  trustBadges,
} from "@/lib/copper-data";
import { useApp } from "@/lib/store";
import { Area, Badge, Btn, Divider, Eyebrow, Field, HeartBtn, HomeHeader, Photo, PullHint, StarPicker, Stars, TextField, Viewer, statusTone } from "./ui";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M14.7 10.3 22 2h-2.2l-6.3 7.2L8.2 2H2l7.7 11L2 22h2.2l6.8-7.8L15.2 22H22l-7.3-11.7Zm-2.4 2.8-.8-1.1L5 3.5h2.7l5 7.2.8 1.1 6.6 9.2h-2.7l-5.1-7.9Z" />
    </svg>
  );
}
function InIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M4.7 3.3A2.2 2.2 0 1 0 4.7 7.7 2.2 2.2 0 0 0 4.7 3.3ZM3 9h3.4v12H3V9Zm6.2 0H12.5v1.6h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V21H16v-6.3c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H9.2V9Z" />
    </svg>
  );
}

export function SocialRow() {
  const items = [
    { label: "Instagram", node: <Instagram size={16} /> },
    { label: "Facebook", node: <Facebook size={16} /> },
    { label: "X", node: <XIcon /> },
    { label: "LinkedIn", node: <InIcon /> },
  ];
  return (
    <div className="flex gap-2">
      {items.map((s) => (
        <a
          key={s.label}
          href={CONTACT.emailHref}
          aria-label={s.label}
          className="grid h-11 w-11 place-items-center rounded-full bg-[#00264C] text-white"
        >
          {s.node}
        </a>
      ))}
    </div>
  );
}

export function HomeScreen() {
  const { push, goTab, toggleFavKitten, favKittens, addReview } = useApp();
  const queens = cats.filter((c) => ["aria", "olive", "kiki", "chimera"].includes(c.id));
  const kings = cats.filter((c) => ["roman", "royal", "butter", "armani"].includes(c.id));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quote, setQuote] = useState("");
  const [stars, setStars] = useState(5);
  const [err, setErr] = useState("");
  const [gallery, setGallery] = useState<number | null>(null);
  const kittenGallery = kittens.flatMap((k) =>
    k.gallery.map((src) => ({ src, alt: `${k.name}, ${k.coat} Maine Coon kitten`, id: k.id })),
  );

  return (
    <PullHint>
      <HomeHeader />
      <section className="relative h-[280px]">
        <Photo
          src={siteImg("Rectangle-6.png")}
          alt="Majestic Copper Road Maine Coon"
          eager
          className="h-full w-full"
          imgClassName="object-[70%_58%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00264C] via-[#00264C]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <Eyebrow light>Breeding Healthy, Happy Maine Coon Cats</Eyebrow>
          <h1 className="mt-2 font-display text-[40px] leading-[0.95]">COPPER ROAD MAINE COONS</h1>
          <div className="mt-4 flex gap-2">
            <Btn onClick={() => push({ name: "apply" })}>Submit An Application</Btn>
            <Btn variant="light" onClick={() => goTab("cats")}>
              Meet Our Parents
            </Btn>
          </div>
        </div>
      </section>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4">
        {trustBadges.map((b) => (
          <span key={b} className="shrink-0 rounded-full border border-[#BD915F]/40 bg-white px-3 py-2 text-[12px] font-semibold text-[#00264C]">
            {b}
          </span>
        ))}
      </div>

      <section className="px-4 pb-2">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-3xl">Available Kittens</h2>
          <button className="text-sm font-semibold text-[#BD915F]" onClick={() => goTab("cats")}>
            View All
          </button>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {kittens.map((k) => (
            <article
              key={k.id}
              role="link"
              tabIndex={0}
              onClick={() => push({ name: "kitten", id: k.id })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  push({ name: "kitten", id: k.id });
                }
              }}
              className="w-56 shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-white text-left shadow-sm"
            >
              <div className="relative">
                <Photo src={k.photo} alt={`${k.name}, ${k.coat} Maine Coon kitten`} className="h-44 w-full" />
                <div className="absolute left-2 top-2">
                  <Badge tone={statusTone(k.status)}>{k.status}</Badge>
                </div>
                <div className="absolute right-2 top-2">
                  <HeartBtn on={favKittens.includes(k.id)} label={`Save ${k.name}`} onClick={() => toggleFavKitten(k.id)} />
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-display text-2xl">{k.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {k.coat} · {k.sex}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#BD915F]">View Details</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="mb-2 font-display text-2xl">Gallery</h3>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {kittenGallery.map((p, n) => (
              <button key={`${p.id}-${p.src}-${n}`} onClick={() => setGallery(n)} className="w-28 shrink-0">
                <Photo src={p.src} alt={p.alt} className="aspect-square w-full rounded-2xl" />
              </button>
            ))}
          </div>
        </div>
        {gallery != null && (
          <Viewer photos={kittenGallery} index={gallery} onClose={() => setGallery(null)} onIndex={setGallery} />
        )}
      </section>

      <CatRow title="Meet The Queens Of Copper Road" list={queens} />
      <CatRow title="Meet The Kings Of Copper Road" list={kings} />

      <section className="px-4 py-4">
        <h2 className="font-display text-3xl">Forever Part Of Our Family</h2>
        <Divider />
        <div className="mt-3 grid gap-3">
          {["london", "rudi"].map((id) => {
            const c = cats.find((x) => x.id === id)!;
            return (
              <button key={id} onClick={() => push({ name: "cat", id })} className="flex gap-3 rounded-3xl bg-white p-3 text-left shadow-sm">
                <Photo src={c.photo} alt={c.name} className="h-24 w-24 rounded-2xl" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#BD915F]">
                    {c.role === "memorial" ? "In Loving Memory" : "Meet London"}
                  </p>
                  <h3 className="font-display text-2xl">{c.role === "memorial" ? "RUDI, The Heart Of Copper Road" : c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-2">
        <Eyebrow>RESPONSIBLE BREEDING</Eyebrow>
        <h2 className="font-display text-3xl">Beauty Begins With Health.</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {pillars.map((p) => (
            <button key={p.id} onClick={() => push({ name: "breeding" })} className="rounded-3xl bg-white p-4 text-left shadow-sm">
              <div className="mb-2 h-px w-8 bg-[#BD915F]" />
              <h3 className="font-display text-xl">{p.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-4">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-3xl">Life At Copper Road</h2>
          <button className="text-sm font-semibold text-[#BD915F]" onClick={() => push({ name: "gallery" })}>
            View Gallery
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {galleryPhotos.slice(0, 8).map((p, i) => (
            <button key={p.src} onClick={() => push({ name: "gallery" })} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              <Photo src={p.src} alt={p.alt} className="aspect-square w-full rounded-2xl" />
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-2">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-3xl">Loved By Copper Road Families</h2>
        </div>
        <TestimonialCard />
        <button className="mt-2 text-sm font-semibold text-[#BD915F]" onClick={() => push({ name: "testimonials" })}>
          Read All Testimonials
        </button>
      </section>

      <section className="mx-4 my-4 rounded-3xl bg-white p-4 shadow-sm">
        <h2 className="font-display text-3xl">Share Your Copper Road Experience</h2>
        <p className="mt-1 text-sm text-muted-foreground">Allow families to submit their own review directly through the app.</p>
        <div className="mt-3 space-y-3">
          <Field label="Name">
            <TextField value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Review" error={err}>
            <Area value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Tell us about your kitten…" />
          </Field>
          <StarPicker value={stars} onChange={setStars} />
          <Btn
            full
            onClick={() => {
              if (!name || !email.includes("@") || quote.length < 8) {
                setErr("Please add your name, email, and a short review.");
                return;
              }
              setErr("");
              addReview({ name, location: "Copper Road family", stars, quote });
              setName("");
              setEmail("");
              setQuote("");
            }}
          >
            Submit Review
          </Btn>
        </div>
      </section>

      <section className="mx-4 overflow-hidden rounded-3xl bg-[#00264C] text-white">
        <Photo src={products[1].image} alt="Cozy Cattery Hoodie" className="h-40 w-full" />
        <div className="p-5">
          <h2 className="font-display text-3xl">Take A Little Copper Road Home With You</h2>
          <p className="mt-1 text-sm text-white/75">Cattery merchandise for Maine Coon lovers and Copper Road families.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Apparel", "Mugs & Drinkware", "Accessories"].map((label) => (
              <button key={label} onClick={() => goTab("shop")} className="rounded-2xl bg-white/10 px-3 py-3 text-sm font-semibold">
                {label}
              </button>
            ))}
          </div>
          <Btn className="mt-3" onClick={() => goTab("shop")}>
            Shop Merchandise
          </Btn>
        </div>
      </section>

      <section className="px-5 py-8 text-center">
        <h2 className="font-display text-4xl">Some Connections Last A Lifetime.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          From our home to yours, we're proud to share our love of Maine Coons with families who understand that these aren't just pets—they're family.
        </p>
        <Btn className="mt-4" onClick={() => push({ name: "apply" })}>
          Submit An Application
        </Btn>
      </section>

      <footer className="bg-[#00264C] px-5 py-8 text-white">
        <img src={siteImg("footer-logo.png")} alt="Copper Road footer logo" className="h-16 w-auto object-contain" />
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          {CONTACT.street}
          <br />
          {CONTACT.city}
          <br />
          <a href={CONTACT.emailHref}>{CONTACT.email}</a>
          <br />
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        </p>
        <div className="mt-4">
          <SocialRow />
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <button onClick={() => push({ name: "legal", doc: "terms" })}>Terms & Conditions</button>
          <button onClick={() => push({ name: "legal", doc: "privacy" })}>Privacy Policy</button>
        </div>
        <p className="mt-4 text-xs text-white/60">Copyright 2026 – Copper Road Maine Coon Cattery</p>
      </footer>
      <div className="h-24" />
    </PullHint>
  );
}

function CatRow({ title, list }: { title: string; list: typeof cats }) {
  const { push } = useApp();
  return (
    <section className="px-4 py-3">
      <h2 className="mb-3 font-display text-3xl">{title}</h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
        {list.map((c) => (
          <button key={c.id} onClick={() => push({ name: "cat", id: c.id })} className="w-44 shrink-0 overflow-hidden rounded-3xl bg-white text-left shadow-sm">
            <Photo src={c.photo} alt={`${c.name}, ${c.tagline}`} className="h-48 w-full" />
            <div className="p-3">
              <h3 className="font-display text-2xl leading-none">{c.short}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{c.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function TestimonialCard() {
  const { reviews } = useApp();
  const [i, setI] = useState(0);
  const r = reviews[i % reviews.length];
  return (
    <button onClick={() => setI(i + 1)} className="w-full rounded-3xl bg-white p-4 text-left shadow-sm">
      <Stars value={r.stars} />
      <p className="mt-2 text-sm leading-relaxed">“{r.quote}”</p>
      <p className="mt-3 text-sm font-semibold">
        {r.name} – {r.location}
      </p>
      <p className="text-[11px] text-muted-foreground">Tap for the next story</p>
    </button>
  );
}
