const euro = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });
const procent = new Intl.NumberFormat("nl-NL", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 2 });

const el = (id) => document.getElementById(id);

function rij(label, bedrag, klasse = "") {
  return `<tr class="${klasse}"><td>${label}</td><td>${euro.format(bedrag)}</td></tr>`;
}

function update() {
  const invoer = parseFloat(el("bruto").value) || 0;
  const perJaar = el("periode").value === "jaar";
  const metVakantiegeld = el("vakantiegeld").checked;

  const salarisJaar = perJaar ? invoer : invoer * 12;
  const vakantiegeld = metVakantiegeld ? salarisJaar * 0.08 : 0;
  const r = berekenNetto(salarisJaar + vakantiegeld, { heffingskorting: el("heffingskorting").checked });

  // Netto per maand exclusief vakantiegeld; vakantiegeld wordt meestal in mei uitbetaald.
  const nettoMaand = (r.netto * (salarisJaar / (r.bruto || 1))) / 12;

  el("nettoMaand").textContent = euro.format(nettoMaand);
  el("nettoJaar").textContent = euro.format(r.netto);
  el("toelichting").textContent =
    `Gemiddeld belastingtarief: ${procent.format(r.gemiddeldTarief)}` +
    (metVakantiegeld ? " · netto per maand exclusief vakantiegeld" : "");

  let html = rij("Bruto salaris per jaar", salarisJaar);
  if (metVakantiegeld) html += rij("Vakantiegeld (8%)", vakantiegeld);
  html += rij("Totaal bruto", r.bruto, "sum");

  r.perSchijf.forEach((s, i) => {
    if (s.deel <= 0) return;
    const grens = s.tot === Infinity ? `vanaf ${euro.format(s.van)}` : `${euro.format(s.van)} – ${euro.format(s.tot)}`;
    html += rij(`Schijf ${i + 1} (${procent.format(s.tarief)}, ${grens})`, -s.bedrag);
  });
  html += rij("Algemene heffingskorting", r.algemeneHeffingskorting, "korting");
  html += rij("Arbeidskorting", r.arbeidskorting, "korting");
  html += rij("Loonheffing totaal", -r.loonheffing, "sum");
  html += rij("Netto per jaar", r.netto, "sum strong");

  el("details").innerHTML = html;
}

el("form").addEventListener("input", update);
el("form").addEventListener("submit", (e) => e.preventDefault());
update();
