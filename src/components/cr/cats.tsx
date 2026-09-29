import { useMemo, useState } from "react";
import { MessageCircle, Share2 } from "lucide-react";
import {
  cats,
  faqs,
  galleryPhotos,
  kittenById,
  kittens,
  kittensOf,
  litters,
  pedigreeFor,
  pillars,
  type Cat,
} from "@/lib/copper-data";
import { useApp } from "@/lib/store";
import { BackBar, Badge, Btn, Chip, Divider, Eyebrow, HeartBtn, Photo, PullHint, Viewer, shareText, statusTone } from "./ui";

export function CatsScreen() {
  const { push } = useApp();
  const [seg, setSeg] = useState<"Kittens" | "Queens" | "Kings" | "Family">("Kittens");
  const [status, setStatus] = useState("All");
  const list = kittens.filter((k) => status === "All" || k.status === status);
  return (
    <PullHint>
      <div className="bg-[#00264C] px-5 pb-5 pt-6 text-white">
        <Eyebrow light>THE COPPER ROAD FAMILY</Eyebrow>
        <h1 className="font-display text-4xl">Our Cats</h1>
        <button className="mt-2 text-sm font-semibold text-[#BD915F]" onClick={() => push({ name: "breeding" })}>
          View Breeding Plan
        </button>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {(["Kittens", "Queens", "Kings", "Family"] as const).map((s) => (
          <Chip key={s} active={seg === s} onClick={() => setSeg(s)}>
            {s}
          </Chip>
        ))}
      </div>
      {seg === "Kittens" && (
        <div className="px-4">
          <div className="mb-3 flex gap-2">
            {["All", "Available", "Reserved", "Sold"].map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                {s}
              </Chip>
            ))}
          </div>
          <div className="grid gap-3 pb-28">
            {list.map((k) => (
              <button key={k.id} onClick={() => push({ name: "kitten", id: k.id })} className="flex gap-3 rounded-3xl bg-white p-2 text-left shadow-sm">
                <Photo src={k.photo} alt={`${k.name}, ${k.coat}`} className="h-28 w-28 rounded-2xl" />
                <div className="py-1">
                  <Badge tone={statusTone(k.status)}>{k.status}</Badge>
                  <h2 className="mt-1 font-display text-2xl">{k.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {k.coat} · {k.sex}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#BD915F]">{k.price}</p>
                </div>
              </button>
            ))}
            {!list.length && <p className="py-8 text-center text-sm text-muted-foreground">No kittens in this status right now.</p>}
          </div>
        </div>
      )}
      {seg !== "Kittens" && (
        <div className="grid grid-cols-2 gap-3 px-4 pb-28">
          {cats
            .filter((c) => (seg === "Queens" ? c.role === "queen" : seg === "Kings" ? c.role === "king" : c.role === "family" || c.role === "memorial"))
            .map((c) => (
              <button key={c.id} onClick={() => push({ name: "cat", id: c.id })} className="overflow-hidden rounded-3xl bg-white text-left shadow-sm">
                <Photo src={c.photo} alt={`${c.name}, ${c.tagline}`} className="aspect-[3/4] w-full" />
                <div className="p-3">
                  <h2 className="font-display text-xl leading-none">{c.short}</h2>
                  <p className="mt-1 text-[11px] text-muted-foreground">{c.tagline}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </PullHint>
  );
}

export function CatProfile({ id }: { id: string }) {
  const cat = cats.find((c) => c.id === id);
  const { push, back, favCats, toggleFavCat, toast } = useApp();
  const [i, setI] = useState(0);
  const [view, setView] = useState(false);
  if (!cat) return <Missing />;
  const babies = kittensOf(cat.id);
  const photos = cat.gallery.map((src) => ({ src, alt: `${cat.name} — ${cat.tagline}` }));
  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="relative">
        <Photo src={photos[i]?.src || cat.photo} alt={photos[i]?.alt || cat.name} className="h-80 w-full" eager />
        <button aria-label="Go back" onClick={back} className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90">
          ←
        </button>
        <div className="absolute right-3 top-3">
          <HeartBtn on={favCats.includes(cat.id)} label={`Save ${cat.name}`} onClick={() => toggleFavCat(cat.id)} />
        </div>
        <div className="absolute bottom-3 flex w-full justify-center gap-1">
          {photos.map((_, n) => (
            <button key={n} aria-label={`Photo ${n + 1}`} onClick={() => setI(n)} className={n === i ? "h-2 w-5 rounded-full bg-[#BD915F]" : "h-2 w-2 rounded-full bg-white/70"} />
          ))}
        </div>
        <button className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold" onClick={() => setView(true)}>
          View
        </button>
      </div>
      <div className="px-5 py-4">
        <Eyebrow>{cat.role === "memorial" ? "IN LOVING MEMORY" : cat.role === "queen" ? "QUEEN" : cat.role === "king" ? "KING" : "FAMILY"}</Eyebrow>
        <h1 className="font-display text-4xl">{cat.name}</h1>
        <p className="text-[#BD915F]">{cat.tagline}</p>
        <p className="mt-3 text-[15px] leading-relaxed">{cat.bio}</p>
        <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-sm">
          {[
            ["Coat / Color", cat.coat],
            ["Sex", cat.sex],
            ["Registry", "TICA"],
            ["Pedigree", cat.role === "memorial" || cat.role === "family" ? cat.pedigreeNote : "5-generation"],
            ["Health Testing", cat.health],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-[#E1EFF9] px-4 py-3 text-sm last:border-0">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-right font-medium">{v}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm font-semibold text-[#BD915F]" onClick={() => push({ name: "pedigree", id: cat.id })}>
          View 5-generation pedigree
        </button>
        {babies.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display text-2xl">Their Kittens</h2>
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {babies.map((k) => (
                <button key={k.id} onClick={() => push({ name: "kitten", id: k.id })} className="w-36 shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-sm">
                  <Photo src={k.photo} alt={k.name} className="h-28 w-full" />
                  <p className="p-2 font-display text-lg">{k.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex gap-2">
          <Btn full onClick={() => push({ name: "apply" })}>
            Inquire About Kittens
          </Btn>
          <button aria-label="Share" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white shadow-sm" onClick={() => shareText(`${cat.name} — ${cat.tagline} at Copper Road`, toast)}>
            <Share2 size={18} />
          </button>
        </div>
      </div>
      {view && <Viewer photos={photos} index={i} onClose={() => setView(false)} onIndex={setI} />}
    </div>
  );
}

export function KittenDetail({ id }: { id: string }) {
  const kitten = kittenById(id);
  const { push, favKittens, toggleFavKitten, toast } = useApp();
  const [i, setI] = useState(0);
  const [view, setView] = useState(false);
  if (!kitten) return <Missing />;
  const photos = kitten.gallery.map((src) => ({ src, alt: `${kitten.name}, ${kitten.coat} Maine Coon kitten` }));
  const parents = kitten.parents.map((pid) => cats.find((c) => c.id === pid)).filter(Boolean) as Cat[];
  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="relative">
        <div
          className="flex h-80 w-full snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setI(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {photos.map((p) => (
            <Photo key={p.src} src={p.src} alt={p.alt} className="h-80 w-full shrink-0 snap-center" />
          ))}
        </div>
        <BackFloat />
        <div className="absolute right-3 top-3">
          <HeartBtn on={favKittens.includes(kitten.id)} label={`Favorite ${kitten.name}`} onClick={() => toggleFavKitten(kitten.id)} />
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <Badge tone={statusTone(kitten.status)}>{kitten.status}</Badge>
          <button className="text-xs font-semibold" onClick={() => setView(true)}>
            Open gallery
          </button>
        </div>
        <h1 className="mt-2 font-display text-4xl">{kitten.name}</h1>
        <p className="text-sm text-muted-foreground">
          {kitten.coat} · {kitten.sex}
        </p>
        <p className="mt-2 font-display text-2xl text-[#BD915F]">{kitten.price}</p>
        <p className="mt-3 text-[15px] leading-relaxed">{kitten.personality}</p>
        <div className="mt-4 overflow-hidden rounded-3xl bg-white text-sm shadow-sm">
          <Row k="Date of birth" v={kitten.dob} />
          <Row k="Health guarantee" v="Parents screened for HCM, SMA, and PK Def. Records travel with your kitten." />
        </div>
        <h2 className="mt-5 font-display text-2xl">Parents</h2>
        <div className="mt-2 flex gap-2">
          {parents.map((p) => (
            <button key={p.id} onClick={() => push({ name: "cat", id: p.id })} className="flex flex-1 items-center gap-2 rounded-2xl bg-white p-2 text-left shadow-sm">
              <Photo src={p.photo} alt={p.name} className="h-14 w-14 rounded-xl" />
              <span className="font-display text-lg leading-none">{p.short}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-2">
          <Btn full disabled={kitten.status === "Sold"} onClick={() => push({ name: "apply" })}>
            {kitten.status === "Sold" ? "Placed With A Family" : "Reserve / Submit Application"}
          </Btn>
          <Btn variant="outline" full onClick={() => push({ name: "contact" })}>
            <MessageCircle size={16} /> Ask a Question
          </Btn>
          <button className="h-11 text-sm font-semibold" onClick={() => shareText(`${kitten.name} at Copper Road Maine Coons`, toast)}>
            Share {kitten.name}
          </button>
        </div>
      </div>
      {view && <Viewer photos={photos} index={i} onClose={() => setView(false)} onIndex={setI} />}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-b border-[#E1EFF9] px-4 py-3 last:border-0">
      <p className="text-xs text-muted-foreground">{k}</p>
      <p>{v}</p>
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

function Missing() {
  const { back } = useApp();
  return (
    <div className="p-6">
      <p>We couldn't find that page.</p>
      <Btn className="mt-4" onClick={back}>
        Go back
      </Btn>
    </div>
  );
}

export function Breeding() {
  const { push, joinWaitlist, waitlist } = useApp();
  const [open, setOpen] = useState<string | null>(faqs[1].q);
  return (
    <div className="h-full overflow-y-auto pb-10">
      <BackBar title="Breeding Plan" />
      <div className="px-5">
        <Eyebrow>RESPONSIBLE BREEDING</Eyebrow>
        <h2 className="font-display text-4xl">Beauty Begins With Health.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Our breeding program is built around thoughtful planning, responsible care, and a commitment to the health and well-being of our Maine Coons. We carefully consider pedigrees, lineage, temperament, and health when planning our breeding program.
        </p>
        <div className="mt-4 grid gap-3">
          {pillars.map((p) => (
            <article key={p.id} className="rounded-3xl bg-white p-4 shadow-sm">
              <h3 className="font-display text-2xl">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>
        <h2 className="mt-8 font-display text-3xl">Planned Litters</h2>
        <div className="mt-3 space-y-4 border-l-2 border-[#BD915F]/50 pl-4">
          {litters.map((l) => {
            const q = cats.find((c) => c.id === l.queen)!;
            const k = cats.find((c) => c.id === l.king)!;
            return (
              <article key={l.id} className="rounded-3xl bg-white p-4 shadow-sm">
                <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                <div className="mt-3 flex gap-2">
                  {[q, k].map((c) => (
                    <button key={c.id} onClick={() => push({ name: "cat", id: c.id })} className="flex-1 text-left">
                      <Photo src={c.photo} alt={c.name} className="h-24 w-full rounded-2xl" />
                      <p className="mt-1 text-sm font-semibold">{c.short}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm">Expected coats: {l.colors}</p>
                <p className="text-sm text-muted-foreground">Birth window: {l.birth}</p>
                <p className="text-sm text-muted-foreground">Go-home window: {l.goHome}</p>
                <Btn variant="outline" full className="mt-3" onClick={() => joinWaitlist(l.id)}>
                  {waitlist.includes(l.id) ? "On The Waitlist" : "Join Waitlist"}
                </Btn>
              </article>
            );
          })}
        </div>
        <h2 className="mt-8 font-display text-3xl">FAQ</h2>
        <div className="mt-2">
          {faqs.slice(0, 4).map((f) => (
            <button key={f.q} onClick={() => setOpen(open === f.q ? null : f.q)} className="block w-full border-b border-[#00264C]/10 py-3 text-left">
              <span className="font-semibold">{f.q}</span>
              {open === f.q && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
            </button>
          ))}
        </div>
        <Btn full className="mt-6" onClick={() => push({ name: "apply" })}>
          Submit An Application
        </Btn>
      </div>
    </div>
  );
}

export function Pedigree({ id }: { id: string }) {
  const cat = cats.find((c) => c.id === id);
  const tree = useMemo(() => (cat ? pedigreeFor(cat) : null), [cat]);
  if (!cat || !tree) return <Missing />;
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Pedigree" subtitle={cat.name} />
      <p className="px-5 text-sm text-muted-foreground">
        A simple five-generation view for the mockup. Official pedigrees are provided with each kitten.
      </p>
      <div className="space-y-4 px-5 py-4">
        {tree.gens.map((gen, gi) => (
          <div key={gi}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#BD915F]">Generation {gi + 1}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {gen.map((n, i) => (
                <div key={i} className={`rounded-2xl bg-white p-3 shadow-sm ${gi === 0 ? "col-span-2" : ""}`}>
                  <p className="font-display text-xl leading-none">{n.name}</p>
                  <p className="text-xs text-muted-foreground">{n.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Divider />
    </div>
  );
}

export function GalleryScreen() {
  const [i, setI] = useState<number | null>(null);
  return (
    <div className="h-full overflow-y-auto">
      <BackBar title="Gallery" subtitle="Life At Copper Road" />
      <div className="grid grid-cols-2 gap-2 px-3 pb-8">
        {galleryPhotos.map((p, n) => (
          <button key={p.src + n} onClick={() => setI(n)}>
            <Photo src={p.src} alt={p.alt} className="aspect-square w-full rounded-2xl" />
          </button>
        ))}
      </div>
      {i != null && <Viewer photos={galleryPhotos} index={i} onClose={() => setI(null)} onIndex={setI} />}
    </div>
  );
}
