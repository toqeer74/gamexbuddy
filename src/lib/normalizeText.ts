const pairs: [RegExp, string][] = [
  [/\u2018|\u2019|\u2032/g, "'"],      // ‘ ’ ′ -> '
  [/\u201C|\u201D|\u2033/g, '"'],     // “ ” ″ -> "
  [/\u00A0/g, " "],                  // nbsp -> space
  [/\u2013|\u2014/g, "-"],            // – — -> -
  [/\u2026/g, "..."]                  // … -> ...
];

export default function normalizeText(s: string){
  return pairs.reduce((acc,[re,rep])=> acc.replace(re, rep), s);
}

