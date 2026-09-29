import { useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import {
  CONTACT,
  US_STATES,
  articleCategories,
  articles,
  checklist,
  feedingRows,
  hearAbout,
  kittens,
  videos,
} from "@/lib/copper-data";
import { useApp } from "@/lib/store";
import { Area, BackBar, Btn, Chip, Eyebrow, Field, Photo, SelectField, TextField, shareText } from "./ui";

export function LearnScreen() {
  const { push } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = articles.filter((a) => (cat === "All" || a.category === cat) && a.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="h-full overflow-y-auto pb-28">
      <div className="bg-[#00264C] px-5 pb-5 pt-6 text-white">
        <h1 className="font-display text-[34px] leading-none">Essential Kitten & Maine Coon Education</h1>
        <p className="mt-2 text-xs text-white/70">Sample content for the client to review and approve before launch.</p>
      </div>
      <div className="space-y-3 px-4 py-3">
        <TextField value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search care guides" />
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {articleCategories.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c.replace("Meet The Maine Coon", "The Breed").replace("Understanding Pedigrees & TICA", "Pedigrees")}
            </Chip>
          ))}
        </div>
        {list.map((a) => (
          <button key={a.id} onClick={() => push({ name: "article", id: a.id })} className="flex w-full gap-3 rounded-3xl bg-white p-2 text-left shadow-sm">
            <Photo src={a.image} alt={a.alt} className="h-24 w-24 rounded-2xl" />
            <div className="py-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#BD915F]">{a.category}</p>
              <h2 className="font-display text-2xl leading-none">{a.title}</h2>
              <p className="text-xs text-muted-foreground">{a.minutes} min read</p>
            </div>
          </button>
        ))}
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="outline" onClick={() => push({ name: "guide", id: "checklist" })}>
            New Kitten Checklist
          </Btn>
          <Btn variant="outline" onClick={() => push({ name: "guide", id: "feeding" })}>
            Feeding Guide
          </Btn>
        </div>
        <h2 className="font-display text-2xl">Video tutorials</h2>
        {videos.map((v) => (
          <button key={v.id} onClick={() => push({ name: "article", id: "grooming" })} className="relative block w-full overflow-hidden rounded-3xl text-left">
            <Photo src={v.image} alt={v.alt} className="h-36 w-full" />
            <div className="absolute inset-0 bg-[#00264C]/35" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs">▶ {v.length} · placeholder</p>
              <p className="font-display text-2xl">{v.title}</p>
            </div>
          </button>
        ))}
        <Btn full onClick={() => push({ name: "contact" })}>
          Ask Our Breeder
        </Btn>
      </div>
    </div>
  );
}

export function ArticleScreen({ id }: { id: string }) {
  const { toast } = useApp();
  const article = articles.find((a) => a.id === id) ?? articles[0];
  const [saved, setSaved] = useState(false);
  return (
    <div className="h-full overflow-y-auto pb-8">
      <Photo src={article.image} alt={article.alt} className="h-56 w-full" eager />
      <BackBar title={article.title} subtitle={`${article.minutes} min · ${article.category}`} />
      <article className="space-y-3 px-5">
        {article.blocks.map((b, i) => {
          if (b.type === "h") return <h2 key={i} className="font-display text-2xl">{b.text}</h2>;
          if (b.type === "ul")
            return (
              <ul key={i} className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          if (b.type === "note") return <p key={i} className="rounded-2xl bg-[#BD915F]/15 p-3 text-xs leading-relaxed">{b.text}</p>;
          return <p key={i} className="text-[15px] leading-relaxed">{b.text}</p>;
        })}
        <div className="flex gap-2 pt-2">
          <Btn
            full
            variant="outline"
            onClick={() => {
              setSaved(true);
              toast(saved ? "Already saved" : "Guide saved");
            }}
          >
            {saved ? "Saved" : "Save"}
          </Btn>
          <Btn variant="navy" onClick={() => shareText(article.title, toast)} aria-label="Share">
            <Share2 size={16} /> Share
          </Btn>
        </div>
      </article>
    </div>
  );
}

export function GuideScreen({ id }: { id: "checklist" | "feeding" }) {
  const [checks, setChecks] = useState<string[]>([]);
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title={id === "checklist" ? "New Kitten Checklist" : "Feeding Guide"} />
      <div className="px-5">
        <p className="mb-3 text-xs text-muted-foreground">Sample content — review and approve before launch. Use Print to keep a copy.</p>
        {id === "checklist" ? (
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item}>
                <label className="flex items-start gap-3 rounded-2xl bg-white p-3 text-sm shadow-sm">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#BD915F]"
                    checked={checks.includes(item)}
                    onChange={() => setChecks((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]))}
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <table className="w-full overflow-hidden rounded-3xl bg-white text-left text-sm shadow-sm">
            <thead className="bg-[#00264C] text-white">
              <tr>
                <th className="p-3">Age</th>
                <th>Meals</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {feedingRows.map((r) => (
                <tr key={r.age} className="border-t border-[#E1EFF9]">
                  <td className="p-3">{r.age}</td>
                  <td>{r.meals}</td>
                  <td className="p-3">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Btn full className="mt-4" onClick={() => window.print()}>
          Print
        </Btn>
      </div>
    </div>
  );
}

const coatOptions = ["Black smoke", "Silver shaded", "Blue smoke tabby", "Red tabby", "Calico", "No preference"];

export function ApplyForm() {
  const { back, draft, saveDraft, submitApplication, push } = useApp();
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [form, setForm] = useState<Record<string, string>>({
    firstName: draft?.firstName || "",
    lastName: draft?.lastName || "",
    email: draft?.email || "",
    phone: draft?.phone || "",
    contact: draft?.contact || "Email",
    address: draft?.address || "",
    city: draft?.city || "",
    state: draft?.state || "SD",
    zip: draft?.zip || "",
    home: "House",
    own: "Own",
    landlord: "",
    adults: "2",
    children: "No",
    ages: "",
    pets: "",
    fence: "No",
    indoor: "Yes",
    kitten: "Any",
    sex: "No preference",
    coats: "",
    purpose: "Pet home",
    timeline: "Just researching",
    experience: "",
    why: "",
    vet: "",
    comments: "",
    hear: "",
    deposit: "",
    homeAgree: "",
    terms: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const coats = form.coats ? form.coats.split("|") : [];
  const toggleCoat = (c: string) => {
    const next = coats.includes(c) ? coats.filter((x) => x !== c) : [...coats, c];
    set("coats", next.join("|"));
  };

  const validate = () => {
    if (step === 0 && (!form.firstName || !form.lastName || !form.email.includes("@") || !form.phone || !form.city || !form.zip))
      return "Please complete your contact details.";
    if (step === 1 && form.own === "Rent" && !form.landlord) return "Let us know about landlord approval.";
    if (step === 2 && (!form.experience || !form.why)) return "Tell us a little about your experience and why a Maine Coon.";
    if (step === 3 && (form.deposit !== "yes" || form.homeAgree !== "yes" || form.terms !== "yes" || !form.hear))
      return "Please complete the agreements and how you heard about us.";
    return "";
  };

  const next = () => {
    const e = validate();
    if (e) return setErr(e);
    setErr("");
    if (step === 3) {
      const ref = submitApplication({ ...form, photo: photoName });
      push({ name: "applyDone", ref });
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Submit An Application" subtitle={`Step ${step + 1} of 4`} />
      <div className="px-4">
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#00264C]/10">
          <div className="h-full bg-[#BD915F]" style={{ width: `${((step + 1) / 4) * 100}%` }} />
        </div>
        {step === 0 && (
          <div className="space-y-3">
            <Eyebrow>ABOUT YOU</Eyebrow>
            <div className="grid grid-cols-2 gap-2">
              <Field label="First Name"><TextField value={form.firstName} onChange={(e) => set("firstName", e.target.value)} /></Field>
              <Field label="Last Name"><TextField value={form.lastName} onChange={(e) => set("lastName", e.target.value)} /></Field>
            </div>
            <Field label="Email"><TextField value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Phone"><TextField value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Preferred contact">
              <div className="flex gap-2">{["Email", "Phone", "Text"].map((c) => <Chip key={c} active={form.contact === c} onClick={() => set("contact", c)}>{c}</Chip>)}</div>
            </Field>
            <Field label="Address"><TextField value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
            <Field label="City"><TextField value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="State"><SelectField value={form.state} onChange={(v) => set("state", v)} options={US_STATES} /></Field>
              <Field label="Zip Code"><TextField value={form.zip} onChange={(e) => set("zip", e.target.value)} /></Field>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <Eyebrow>YOUR HOME</Eyebrow>
            <Field label="Home type"><div className="flex gap-2">{["House", "Apartment", "Other"].map((c) => <Chip key={c} active={form.home === c} onClick={() => set("home", c)}>{c}</Chip>)}</div></Field>
            <Field label="Own or rent"><div className="flex gap-2">{["Own", "Rent"].map((c) => <Chip key={c} active={form.own === c} onClick={() => set("own", c)}>{c}</Chip>)}</div></Field>
            {form.own === "Rent" && <Field label="Landlord approval"><TextField value={form.landlord} onChange={(e) => set("landlord", e.target.value)} placeholder="Yes, written approval" /></Field>}
            <Field label="Number of adults"><TextField value={form.adults} onChange={(e) => set("adults", e.target.value)} /></Field>
            <Field label="Children in home">
              <div className="flex gap-2">{["Yes", "No"].map((c) => <Chip key={c} active={form.children === c} onClick={() => set("children", c)}>{c}</Chip>)}</div>
            </Field>
            {form.children === "Yes" && <Field label="Ages"><TextField value={form.ages} onChange={(e) => set("ages", e.target.value)} /></Field>}
            <Field label="Other pets"><TextField value={form.pets} onChange={(e) => set("pets", e.target.value)} placeholder="Type and number" /></Field>
            <Field label="Fenced yard"><div className="flex gap-2">{["Yes", "No"].map((c) => <Chip key={c} active={form.fence === c} onClick={() => set("fence", c)}>{c}</Chip>)}</div></Field>
            <Field label="Will the kitten be indoor-only?"><div className="flex gap-2">{["Yes", "No"].map((c) => <Chip key={c} active={form.indoor === c} onClick={() => set("indoor", c)}>{c}</Chip>)}</div></Field>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <Eyebrow>YOUR KITTEN PREFERENCES</Eyebrow>
            <Field label="Interested kitten">
              <SelectField value={form.kitten} onChange={(v) => set("kitten", v)} options={["Any", ...kittens.map((k) => k.name)]} />
            </Field>
            <Field label="Preferred sex"><div className="flex flex-wrap gap-2">{["Male", "Female", "No preference"].map((c) => <Chip key={c} active={form.sex === c} onClick={() => set("sex", c)}>{c}</Chip>)}</div></Field>
            <Field label="Preferred coat color">
              <div className="flex flex-wrap gap-2">{coatOptions.map((c) => <Chip key={c} active={coats.includes(c)} onClick={() => toggleCoat(c)}>{c}</Chip>)}</div>
            </Field>
            <Field label="Interest"><div className="flex gap-2">{["Pet home", "Breeding interest"].map((c) => <Chip key={c} active={form.purpose === c} onClick={() => set("purpose", c)}>{c}</Chip>)}</div></Field>
            <Field label="Timeline">
              <SelectField value={form.timeline} onChange={(v) => set("timeline", v)} options={["Immediately", "1–3 months", "3–6 months", "Just researching"]} />
            </Field>
            <Field label="Previous cat experience"><Area value={form.experience} onChange={(e) => set("experience", e.target.value)} /></Field>
            <Field label="Why Maine Coon?"><Area value={form.why} onChange={(e) => set("why", e.target.value)} /></Field>
            <Field label="Veterinarian name and clinic (optional)"><TextField value={form.vet} onChange={(e) => set("vet", e.target.value)} /></Field>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <Eyebrow>REVIEW & SUBMIT</Eyebrow>
            <div className="rounded-3xl bg-white p-4 text-sm shadow-sm">
              <p className="font-semibold">{form.firstName} {form.lastName}</p>
              <p>{form.email} · {form.phone}</p>
              <p>{form.city}, {form.state} {form.zip}</p>
              <p className="mt-2">Kitten: {form.kitten} · {form.sex} · {form.timeline}</p>
            </div>
            <Field label="Additional questions"><Area value={form.comments} onChange={(e) => set("comments", e.target.value)} /></Field>
            <Field label="How did you hear about us?"><SelectField value={form.hear} onChange={(v) => set("hear", v)} options={hearAbout} placeholder="Choose one" /></Field>
            {[
              ["deposit", "I understand a deposit is required to reserve a kitten"],
              ["homeAgree", "I agree to provide a loving indoor home and regular vet care"],
              ["terms", "I agree to the Terms & Conditions and Privacy Policy"],
            ].map(([k, label]) => (
              <label key={k} className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1 accent-[#BD915F]" checked={form[k] === "yes"} onChange={(e) => set(k, e.target.checked ? "yes" : "")} />
                {label}
              </label>
            ))}
            <Field label="Photo of your home setup (optional)">
              <input
                type="file"
                accept="image/*"
                className="text-sm"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name || "")}
              />
              {photoName && <p className="text-xs text-muted-foreground">{photoName}</p>}
            </Field>
          </div>
        )}
        {err && <p className="mt-3 text-sm text-[#b42318]">{err}</p>}
        <div className="mt-4 flex gap-2">
          <Btn variant="outline" onClick={() => (step === 0 ? back() : setStep(step - 1))}>Back</Btn>
          <Btn variant="ghost" onClick={() => saveDraft(form)}>Save draft</Btn>
          <Btn full onClick={next}>{step === 3 ? "Submit Application" : "Next"}</Btn>
        </div>
      </div>
    </div>
  );
}

export function ApplyDone({ refId }: { refId: string }) {
  const { push } = useApp();
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[#e5f6ee] text-3xl pop">✓</div>
      <h1 className="mt-4 font-display text-4xl">Thank you! We'll be in touch soon.</h1>
      <p className="mt-2 text-sm text-muted-foreground">Application reference</p>
      <p className="font-semibold text-[#BD915F]">{refId}</p>
      <Btn className="mt-6" onClick={() => push({ name: "applications" })}>View My Applications</Btn>
    </div>
  );
}

export function ContactScreen() {
  const { toast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Kitten Inquiry", message: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const map = useMemo(() => CONTACT.mapEmbed, []);
  return (
    <div className="h-full overflow-y-auto pb-8">
      <BackBar title="Contact Us" />
      <div className="space-y-3 px-4">
        {sent ? (
          <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
            <p className="font-display text-3xl text-[#2f7d5a]">Message sent</p>
            <p className="mt-2 text-sm text-muted-foreground">We'll reply to {form.email}. This preview stays on your device.</p>
          </div>
        ) : (
          <>
            <Field label="Name"><TextField value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Email"><TextField value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Phone"><TextField value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Subject"><SelectField value={form.subject} onChange={(v) => set("subject", v)} options={["Kitten Inquiry", "Breeding Plan", "Merchandise", "Other"]} /></Field>
            <Field label="Message" error={err}><Area value={form.message} onChange={(e) => set("message", e.target.value)} /></Field>
            <Btn full onClick={() => {
              if (!form.name || !form.email.includes("@") || form.message.length < 4) return setErr("Name, email, and a message are required.");
              setErr("");
              setSent(true);
              toast("Message sent");
            }}>Send</Btn>
          </>
        )}
        <div className="rounded-3xl bg-white p-4 text-sm shadow-sm">
          <p>{CONTACT.address}</p>
          <a className="mt-1 block font-semibold text-[#BD915F]" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a className="block font-semibold text-[#BD915F]" href={CONTACT.emailHref}>{CONTACT.email}</a>
        </div>
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <iframe title="Map preview of 202 E 4th St, Fulton, South Dakota" src={map} className="h-48 w-full border-0" loading="lazy" />
          <a href={CONTACT.maps} className="block p-3 text-sm font-semibold text-[#BD915F]">Open in Maps</a>
        </div>
      </div>
    </div>
  );
}
