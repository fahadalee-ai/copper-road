const base = "http://localhost:8081";
const home = await (await fetch(base + "/")).text();
const hrefs = [...home.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log("HREFS\n" + hrefs.join("\n"));
const cssHref = hrefs.find((h) => h.includes("styles"));
if (cssHref) {
  const url = cssHref.startsWith("http") ? cssHref : base + cssHref;
  const r = await fetch(url);
  const t = await r.text();
  console.log("\nCSS", r.status, r.headers.get("content-type"), url);
  console.log(t.slice(0, 180));
}
const edge = process.env.EDGE;
console.log("\nbody has splash", home.includes("Breeding Healthy"));
