// Bruto-netto berekening op basis van de Nederlandse belastingregels voor 2026
// (box 1, werknemer onder de AOW-leeftijd).

const TARIEVEN_2026 = {
  jaar: 2026,
  // Tarieven inclusief premies volksverzekeringen.
  schijven: [
    { tot: 38883, tarief: 0.3575 },
    { tot: 78426, tarief: 0.3756 },
    { tot: Infinity, tarief: 0.495 },
  ],
  algemeneHeffingskorting: {
    maximum: 3115,
    afbouwVanaf: 29736,
    afbouwPercentage: 0.06398,
  },
  // Elke stap: vanaf `vanaf` geldt `basis + percentage * (inkomen - vanaf)`.
  arbeidskorting: [
    { vanaf: 0, basis: 0, percentage: 0.08324 },
    { vanaf: 11965, basis: 996, percentage: 0.31009 },
    { vanaf: 25845, basis: 5300, percentage: 0.0195 },
    { vanaf: 45592, basis: 5685, percentage: -0.0651 },
  ],
};

function berekenInkomstenbelasting(inkomen, schijven) {
  let belasting = 0;
  let ondergrens = 0;
  const perSchijf = [];
  for (const schijf of schijven) {
    const deel = Math.max(0, Math.min(inkomen, schijf.tot) - ondergrens);
    const bedrag = deel * schijf.tarief;
    perSchijf.push({ van: ondergrens, tot: schijf.tot, tarief: schijf.tarief, deel, bedrag });
    belasting += bedrag;
    ondergrens = schijf.tot;
  }
  return { totaal: belasting, perSchijf };
}

function berekenAlgemeneHeffingskorting(inkomen, ahk) {
  const afbouw = Math.max(0, inkomen - ahk.afbouwVanaf) * ahk.afbouwPercentage;
  return Math.max(0, ahk.maximum - afbouw);
}

function berekenArbeidskorting(arbeidsinkomen, stappen) {
  if (arbeidsinkomen <= 0) return 0;
  let stap = stappen[0];
  for (const s of stappen) {
    if (arbeidsinkomen > s.vanaf) stap = s;
  }
  return Math.max(0, stap.basis + stap.percentage * (arbeidsinkomen - stap.vanaf));
}

/**
 * @param {number} brutoJaar  Totaal bruto jaarinkomen (incl. eventueel vakantiegeld).
 * @param {object} opties     { heffingskorting: boolean }
 */
function berekenNetto(brutoJaar, opties = {}, tarieven = TARIEVEN_2026) {
  const inkomen = Math.max(0, brutoJaar || 0);
  const heffingskorting = opties.heffingskorting !== false;

  const belasting = berekenInkomstenbelasting(inkomen, tarieven.schijven);
  const ahk = heffingskorting ? berekenAlgemeneHeffingskorting(inkomen, tarieven.algemeneHeffingskorting) : 0;
  const ak = heffingskorting ? berekenArbeidskorting(inkomen, tarieven.arbeidskorting) : 0;

  // Heffingskortingen kunnen de belasting niet negatief maken.
  const kortingen = Math.min(belasting.totaal, ahk + ak);
  const teBetalen = belasting.totaal - kortingen;

  return {
    bruto: inkomen,
    belastingVoorKortingen: belasting.totaal,
    perSchijf: belasting.perSchijf,
    algemeneHeffingskorting: ahk,
    arbeidskorting: ak,
    toegepasteKortingen: kortingen,
    loonheffing: teBetalen,
    netto: inkomen - teBetalen,
    gemiddeldTarief: inkomen > 0 ? teBetalen / inkomen : 0,
  };
}

if (typeof module !== "undefined") {
  module.exports = { TARIEVEN_2026, berekenNetto, berekenArbeidskorting, berekenAlgemeneHeffingskorting };
}
