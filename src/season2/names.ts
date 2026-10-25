/**
 * Season 2 – the names the head architect (Nora) gets to decide.
 *
 * These are WORKING NAMES. When season 2 is integrated, Nora answers the questions in
 * SEASON2-FRAGOR.md and her names go in here – every case uses these constants, so a
 * name only has to be changed in one place. Keep the grammar simple: the texts use the
 * name on its own ("${S2.seagull} flög förbi"), so a name should work as a subject.
 */
export const S2 = {
  /** The new part of town across the harbour, where season 2 takes place. */
  district: "Havsstaden",

  /** Nora's own parents, who pop up in season 2 (the parents said it's fine to use their first names). */
  dad: "Pappa Aron",
  mom: "Mamma Lisa",

  // Fall 7 – Hamnen
  fisher: "Kapten Kalle",
  keeper: "Fyrvakten Maja",
  seagull: "Glimma",
  seaMonster: "Bubbel",
  crab: "Krabbot",

  // Fall 8 – Skolan
  teacher: "Fröken Josefin",
  janitor: "Vaktis",
  sponge: "Skumpa",
  classPet: "Kaninen Louise",
  /** The class's second pet, a turtle in a terrarium (just for fun, no part in the mystery). */
  turtle: "Sköldpaddan Skalman",
  chalk: "Kritan",

  // Fall 9 – Växthuset
  gardener: "Trädgårdsmästare Rut",
  snail: "Sniglan",
  flytrap: "Fångfrida",

  // Fall 10 – Akvariet
  diver: "Dykar-Dina",
  octopus: "Åtta",
  seal: "Sälle",
  jellyfish: "Glim",

  // Fall 11 – Tivolit
  director: "Direktör Karusell",
  clown: "Plupp",
  mirrorGhost: "Spegel-Sigge",

  // Fall 12 – Museet
  painter: "Pia Palett",
  guard: "Vakten Ville",
  /** The little grey monster at the heart of season 2. */
  scribble: "Klick",
} as const;
