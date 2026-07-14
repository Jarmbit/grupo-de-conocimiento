// Contenido placeholder — sustituir por contenido real de la asociación antes de publicar.
// Ver README.md para el detalle de qué debe reemplazarse.

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "#sobre", label: "Sobre nosotros" },
  { href: "#videos", label: "Vídeos" },
  { href: "#eventos", label: "Eventos" },
  { href: "#noticias", label: "Noticias" },
  { href: "#unete", label: "Únete" },
  { href: "#apoya", label: "Apoya" },
];

export interface Pillar {
  title: string;
  text: string;
}

export const pillars: Pillar[] = [
  {
    title: "Evidencia",
    text: "Argumentos históricos, filosóficos y científicos que sostienen la fe con razón.",
  },
  {
    title: "Testimonio",
    text: "Historias reales de personas cuya vida ha sido transformada por el encuentro con Dios.",
  },
  {
    title: "Comunidad",
    text: "Encuentros presenciales que acompañan el camino de fe de cada persona.",
  },
];

export interface Video {
  title: string;
  duration: string;
}

export const videos: Video[] = [
  { title: "La evidencia histórica de la Resurrección", duration: "18:24" },
  { title: "Testimonio: de la duda a la fe", duration: "11:07" },
  { title: "¿Existió realmente Jesús de Nazaret?", duration: "22:40" },
  { title: "Ciencia y fe: ¿son incompatibles?", duration: "15:32" },
];

export interface EventItem {
  month: string;
  day: string;
  title: string;
  location: string;
  spots: string;
}

export const events: EventItem[] = [
  {
    month: "SEP",
    day: "12",
    title: "Noche de testimonios: Encuentro con Dios",
    location: "Madrid · Parroquia San Judas",
    spots: "Quedan 40 plazas",
  },
  {
    month: "OCT",
    day: "03",
    title: "Conferencia: Evidencias de la Resurrección",
    location: "Barcelona · Auditori Diocesà",
    spots: "Quedan 25 plazas",
  },
  {
    month: "OCT",
    day: "24",
    title: "Retiro de un día: Silencio y encuentro",
    location: "Sevilla · Casa de Espiritualidad",
    spots: "Quedan 15 plazas",
  },
];

export const showEventSpots = true;

export interface NewsItem {
  date: string;
  title: string;
}

export const news: NewsItem[] = [
  { date: "2 jul 2026", title: "Más de 300 personas en nuestro último encuentro en Valencia" },
  { date: "18 jun 2026", title: "Nueva serie de vídeos sobre los milagros eucarísticos" },
  { date: "5 jun 2026", title: "Grupo de Conocimiento estrena boletín mensual" },
];

export interface Social {
  initial: string;
  label: string;
  href: string;
}

export const socials: Social[] = [
  { initial: "IG", label: "Instagram", href: "#" },
  { initial: "YT", label: "YouTube", href: "#" },
  { initial: "FB", label: "Facebook", href: "#" },
  { initial: "X", label: "X (Twitter)", href: "#" },
];

export interface DonationModel {
  key: "socio" | "puntual" | "patrocinio" | "voluntariado";
  title: string;
  detail: string;
  text: string;
  cta: string;
}

export const donationModels: DonationModel[] = [
  {
    key: "socio",
    title: "Socio mensual",
    detail: "Desde 10€/mes",
    text: "Un compromiso estable que sostiene nuestro trabajo cada mes.",
    cta: "Hazte socio",
  },
  {
    key: "puntual",
    title: "Donación puntual",
    detail: "La cantidad que quieras",
    text: "Colabora una sola vez con la cantidad que decidas.",
    cta: "Donar ahora",
  },
  {
    key: "patrocinio",
    title: "Patrocina un evento",
    detail: "Aportación única",
    text: "Haz posible un encuentro completo, de principio a fin.",
    cta: "Quiero patrocinar",
  },
  {
    key: "voluntariado",
    title: "Voluntariado",
    detail: "Tu tiempo y talento",
    text: "Súmate al equipo que hace realidad cada evento y vídeo.",
    cta: "Quiero ayudar",
  },
];

// Modelo de aportación resaltado como recomendado.
export const highlightDonation: DonationModel["key"] = "socio";

export const contact = {
  email: "hola@grupodeconocimiento.org",
  phone: "+34 900 000 000",
};
