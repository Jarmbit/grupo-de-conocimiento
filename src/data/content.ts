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

export const identity = {
  kicker: "Nuestra misión",
  title: "Fe y razón caminan juntas",
  tagline: "Creando espacios donde las personas puedan encontrarse con Jesucristo",
  intro:
    "Creemos que la evidencia histórica, el testimonio personal y el encuentro comunitario son caminos complementarios hacia Dios. Nuestro trabajo acompaña, con serenidad y respeto a las enseñanzas de la Iglesia, a quienes buscan una fe fundamentada.",
  mission:
    "Acercar a las personas a Jesucristo mediante experiencias de belleza, verdad, amistad y acompañamiento para que puedan descubrir que Él puede transformar su vida.",
  quote:
    "No creemos que podamos cambiar la vida de nadie. Pero creemos que podemos crear un espacio donde una persona pueda encontrarse con Aquel que sí puede cambiarla.",
};

export const objective = {
  title: "Acompañar a cada persona en su camino hacia Jesús, a través de encuentros que transforman vidas.",
  audiences: [
    {
      title: "Para quienes no conocen a Jesús",
      text: "Queremos que, a través de nuestros eventos, las personas puedan hacer preguntas, encontrar respuestas y abrir su corazón a la búsqueda de la verdad, para que puedan encontrarse con Jesús y descubrir que Él puede transformar su vida.",
    },
    {
      title: "Para quienes ya conocen a Jesús y tienen fe",
      text: "Queremos que nuestros encuentros enciendan su ardor, renueven su amor por Él y fortalezcan su compromiso para dar mayores frutos en su vida, en su familia y en el mundo.",
    },
  ],
};

export const pillars: Pillar[] = [
  { title: "Belleza", text: "La belleza que habla al corazón." },
  { title: "Verdad", text: "La verdad que da sentido a la vida." },
  { title: "Amistad", text: "La amistad que nos hace crecer juntos." },
  { title: "Acompañamiento", text: "El acompañamiento que camina a tu lado." },
  { title: "Transformación", text: "El encuentro con Él que transforma tu vida." },
];

export interface EventTrait {
  title: string;
  text: string;
}

export const howWeDoIt = {
  kicker: "Cómo es un encuentro",
  title: "Un espacio sencillo, humano y profundo",
  intro:
    "No alquilamos un auditorio: abrimos las puertas de una casa e invitamos a unos amigos. Hubo música, un testimonio, un vídeo, un coloquio. Compartimos la cena. Y ocurrió algo que no esperábamos: las personas comenzaron a decirnos «esto tiene que verlo más gente».",
  traits: [
    { title: "Música", text: "Abrimos el corazón." },
    { title: "Vídeo", text: "La verdad que ilumina la vida." },
    { title: "Reflexión", text: "Ideas que ayudan a comprender y mirar más allá." },
    { title: "Coloquio", text: "Compartimos, preguntamos y dialogamos juntos." },
    { title: "Oración", text: "Nos encontramos con Dios." },
    { title: "Amistad", text: "Nacen lazos verdaderos." },
    { title: "Continuidad", text: "Seguimos el camino juntos." },
  ] satisfies EventTrait[],
  closing: "Un encuentro que deja huella.",
};

export interface ParticipationWay {
  title: string;
  text: string;
}

export const participation = {
  kicker: "Crearlo juntos",
  title: "¿Cómo puedes formar parte?",
  intro:
    "Esta misión no la hace una sola persona. Cada talento, por pequeño que sea, hace posible que más personas se encuentren con Jesucristo.",
  ways: [
    { title: "Organizar encuentros", text: "Ayuda a crear espacios donde todo comienza." },
    { title: "Música", text: "Prepara el corazón y acompaña cada encuentro." },
    { title: "Comunicación", text: "Da a conocer la misión y lleva la luz más lejos." },
    { title: "Acogida", text: "Haz que cada persona se sienta bienvenida y en casa." },
    { title: "Oración", text: "Sostiene espiritualmente cada paso de la misión." },
    { title: "Recursos económicos", text: "Tu generosidad hace posible que esta misión continúe y llegue más lejos." },
  ] satisfies ParticipationWay[],
};

export interface Video {
  title: string;
  duration: string;
}

export const videos: Video[] = [
  { title: "La evidencia histórica de la Resurrección", duration: "18:24" },
  { title: "Testimonio: de la duda a la fe", duration: "11:07" },
  { title: "¿Existió realmente Jesús de Nazaret?", duration: "22:40" },
  { title: "Ciencia y fe: ¿son incompatibles?", duration: "15:32" },
  { title: "Vídeo de nuestros encuentros", duration: "03:12" },
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
  { date: "5 jun 2026", title: "Encuentros Siloé estrena boletín mensual" },
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
  email: "hola@encuentrossiloe.org",
  phone: "+34 900 000 000",
};
