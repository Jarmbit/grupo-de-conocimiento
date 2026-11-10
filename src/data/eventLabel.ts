const MONTHS: Record<string, string> = {
  Ene: "enero", Feb: "febrero", Mar: "marzo", Abr: "abril", May: "mayo", Jun: "junio",
  Jul: "julio", Ago: "agosto", Sep: "septiembre", Oct: "octubre", Nov: "noviembre", Dic: "diciembre",
};

// El encuentro viaja siempre con su fecha ("Encuentro adultos · 21 de noviembre") para que cada
// reserva quede identificada sin ambigüedad cuando hay varios encuentros del mismo tipo.
export function eventLabel(ev: { title: string; day: string; month: string }): string {
  return `${ev.title} · ${ev.day} de ${MONTHS[ev.month] ?? ev.month}`;
}
