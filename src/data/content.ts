// Contenido placeholder — sustituir por contenido real de la asociación antes de publicar.
// Ver README.md para el detalle de qué debe reemplazarse.

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/#sobre", label: "Sobre nosotros" },
  { href: "/#videos", label: "Vídeos" },
  { href: "/#pide-un-encuentro", label: "Pide un encuentro" },
  { href: "/eventos", label: "Eventos" },
  { href: "/noticias", label: "Noticias" },
  { href: "/#unete", label: "Únete" },
  { href: "/apoya", label: "Apoya" },
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
  image: string;
  alt: string;
}

export const howWeDoIt = {
  kicker: "Cómo es un encuentro",
  title: "Un espacio sencillo, humano y profundo",
  intro:
    "No alquilamos un auditorio: abrimos las puertas de una casa e invitamos a unos amigos. Hubo música, un testimonio, un vídeo, un coloquio. Compartimos la cena. Y ocurrió algo que no esperábamos: las personas comenzaron a decirnos «esto tiene que verlo más gente».",
  traits: [
    {
      title: "Música",
      text: "Abrimos el corazón.",
      image: "/images/encuentro/musica.jpg",
      alt: "Momento musical en un encuentro de Encuentros Siloé",
    },
    {
      title: "Testimonio",
      text: "Como apareció Dios en mi vida.",
      image: "/images/encuentro/reflexion.jpg",
      alt: "Momento de testimonio en un encuentro de Encuentros Siloé",
    },
    {
      title: "Vídeo",
      text: "La verdad que ilumina la vida.",
      image: "/images/encuentro/video.jpg",
      alt: "Proyección de un vídeo durante un encuentro de Encuentros Siloé",
    },
    {
      title: "Coloquio",
      text: "Compartimos, preguntamos y dialogamos juntos.",
      image: "/images/encuentro/coloquio.jpg",
      alt: "Coloquio entre asistentes a un encuentro de Encuentros Siloé",
    },
    {
      title: "Cena",
      text: "Compartimos la cena.",
      image: "/images/encuentro/amistad.jpg",
      alt: "Asistentes compartiendo la cena en un encuentro de Encuentros Siloé",
    },
  ] satisfies EventTrait[],
  closing: "Un encuentro que deja huella.",
};

export interface ParticipationWay {
  title: string;
  text: string;
  highlighted?: boolean;
}

// Mensaje central: volver a vivir la fe como los primeros cristianos, en los hogares.
// Sin consumidor activo en la home tras la fusión de secciones (evita repetir el mismo mensaje
// 3 veces); disponible para reutilizar en /eventos o donde encaje mejor.
export const homesNetwork = {
  kicker: "Volver a lo esencial",
  title: "Como los cristianos del siglo I: la fe vuelve a vivirse en los hogares",
  text: "Antes de los grandes templos, la Iglesia nació y creció en las casas. Queremos que los encuentros con Jesús vuelvan a suceder ahí donde todo comenzó: en los hogares, donde hay menos barreras, más confianza y más apertura para escuchar y buscar la verdad. Si tienes un hogar y quieres abrir sus puertas, nosotros te acompañamos en todo el camino.",
};

export const participation = {
  kicker: "Crearlo juntos",
  title: "¿Cómo puedes formar parte?",
  intro:
    "Esta misión no la hace una sola persona. Cada talento, por pequeño que sea, hace posible que más personas se encuentren con Jesucristo.",
  ways: [
    {
      title: "Abre tu hogar",
      text: "Ofrece tu casa para acoger un encuentro. Te acompañamos con el contenido, la logística y la presencia de nuestro equipo.",
      highlighted: true,
    },
    { title: "Organizar encuentros", text: "Ayuda a crear espacios donde todo comienza." },
    { title: "Música", text: "Prepara el corazón y acompaña cada encuentro." },
    { title: "Comunicación", text: "Da a conocer la misión y lleva la luz más lejos." },
    { title: "Oración", text: "Sostiene espiritualmente cada paso de la misión." },
    { title: "Recursos económicos", text: "Tu generosidad hace posible que esta misión continúe y llegue más lejos." },
  ] satisfies ParticipationWay[],
};

export const eventRequest = {
  label: "Solicitar un encuentro",
  subject: "Quiero solicitar un encuentro",
  body: "Hola, me gustaría organizar un encuentro de Encuentros Siloé. Cuéntame cómo sería el siguiente paso.",
};

export interface EventType {
  key: "dios" | "jesucristo";
  kicker: string;
  title: string;
  text: string;
  youtubeId?: string;
  videoSrc?: string;
  placeholder?: boolean;
  requestSubject: string;
  requestBody: string;
}

// Plantilla rellenable para el cuerpo del mailto de solicitud de encuentro: sin backend propio,
// el email ya trae los campos que necesitamos para organizar el encuentro (nombre, ciudad, tipo
// de espacio, nº de personas y fechas), y la persona solo tiene que completarlos antes de enviar.
function requestBodyTemplate(encounterTitle: string) {
  return `Hola, me gustaría organizar un encuentro de Encuentros Siloé: ${encounterTitle}.

Nombre:
Teléfono o email de contacto:
Ciudad:
Tipo de espacio (hogar, parroquia, otro):
Número aproximado de personas:
Fechas que os vendrían bien:

Cuéntame cómo sería el siguiente paso.`;
}

// Los dos tipos de encuentro que se pueden solicitar.
export const eventTypes: EventType[] = [
  {
    key: "dios",
    kicker: "Encuentro I",
    title: "La existencia de Dios",
    text: "Un recorrido por las razones y evidencias que sostienen que creer en Dios es razonable, a través de testimonios, ciencia y filosofía.",
    videoSrc: "/videos/dios-trailer.mp4",
    requestSubject: "Quiero solicitar un encuentro: La existencia de Dios",
    requestBody: requestBodyTemplate("La existencia de Dios"),
  },
  {
    key: "jesucristo",
    kicker: "Encuentro II",
    title: "La existencia de Jesucristo",
    text: "Un acercamiento a la evidencia histórica y al testimonio vivo de que Jesucristo existió, murió y resucitó, y de que su vida cambia vidas hoy.",
    videoSrc: "/videos/jesus-trailer.mp4",
    requestSubject: "Quiero solicitar un encuentro: La existencia de Jesucristo",
    requestBody: requestBodyTemplate("La existencia de Jesucristo"),
  },
];

export interface Video {
  title: string;
  duration: string;
  thumbnail: string;
  src: string;
}

// Clips reales grabados en encuentros anteriores.
export const videos: Video[] = [
  {
    title: "Un momento de nuestros encuentros",
    duration: "0:15",
    thumbnail: "/images/encuentro-videos/encuentro-01.jpg",
    src: "/videos/encuentro-01.mp4",
  },
  {
    title: "Un momento de nuestros encuentros",
    duration: "0:19",
    thumbnail: "/images/encuentro-videos/encuentro-02.jpg",
    src: "/videos/encuentro-02.mp4",
  },
  {
    title: "Momento musical en un encuentro",
    duration: "0:16",
    thumbnail: "/images/encuentro-videos/encuentro-03.jpg",
    src: "/videos/encuentro-03.mp4",
  },
  {
    title: "Momento musical en un encuentro",
    duration: "1:20",
    thumbnail: "/images/encuentro-videos/encuentro-04.jpg",
    src: "/videos/encuentro-04.mp4",
  },
  {
    title: "Un momento de nuestros encuentros",
    duration: "0:27",
    thumbnail: "/images/encuentro-videos/encuentro-07.jpg",
    src: "/videos/encuentro-07.mp4",
  },
];

export interface EventItem {
  month: string;
  day: string;
  title: string;
  location: string;
  spots: string;
  image?: string;
  link?: string;
}

export const events: EventItem[] = [
  {
    month: "Oct",
    day: "17",
    title: "Jesús de Nazaret",
    location: "Teatro Fernández Baldor, Torrelodones · 18:00h",
    spots: "Estreno del vídeo, música en directo y presentación de Encuentros Siloé",
    image: "/images/events/jesus-de-nazaret.jpg",
    link: "https://www.giglon.com/todos?idEvent=jesus-de-nazaret",
  },
];

export const showEventSpots = true;

export interface PastEvent {
  title: string;
  location: string;
  date: string;
  photos: string[];
}

// Fotos y datos de encuentros ya celebrados. Añadir uno nuevo por cada evento pasado.
export const pastEvents: PastEvent[] = [
  {
    title: "Encuentro en parroquias",
    location: "Parroquia San Lorenzo, Burgos",
    date: "2 de febrero de 2026",
    photos: [
      "/images/eventos-pasados/burgos-san-lorenzo/burgos-01.jpg",
      "/images/eventos-pasados/burgos-san-lorenzo/burgos-02.jpg",
      "/images/eventos-pasados/burgos-san-lorenzo/burgos-03.jpg",
      "/images/eventos-pasados/burgos-san-lorenzo/burgos-04.jpg",
    ],
  },
];

export interface NewsItem {
  date: string;
  title: string;
  href: string;
}

// Sin noticias reales todavía. Añadir aquí cada noticia cuando exista su artículo/destino real.
export const news: NewsItem[] = [];

export interface Social {
  initial: string;
  label: string;
  href: string;
}

// Sin enlaces reales todavía: se ocultan (ver Footer.astro / JoinSection.astro) hasta añadirlos aquí.
export const socials: Social[] = [];

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
  email: "info@encuentrossiloe.org",
};

// El origen bíblico del nombre de la asociación (Juan 9,7).
export const siloeStory = {
  kicker: "El origen del nombre",
  title: "Siloé: «Ve a lavarte»",
  verse: "Juan 9,7",
  steps: [
    { number: 1, title: "Jesús lo encuentra", text: "Hace barro y se lo pone sobre los ojos." },
    { number: 2, title: "Lo envía a Siloé", text: "«Ve a lavarte a la piscina de Siloé»." },
    { number: 3, title: "Se lava… y vuelve viendo", text: "Sus ojos se abren. Su vida cambia." },
  ],
  closing: "Un encuentro con Jesús cambió su manera de ver.",
  bridge: {
    before: { title: "Jesús los trae", text: "Personas que todavía no pueden verle." },
    during: { title: "Encuentros Siloé", text: "Creamos el espacio. El Espíritu Santo actúa." },
    after: { title: "Salen viendo", text: "Quizá por primera vez descubren que Dios estaba allí." },
  },
  bridgeClosing: "Nosotros creamos el encuentro. El Espíritu Santo abre los ojos.",
};

// Qué ofrece la asociación después del primer encuentro.
export const afterEncounter = {
  kicker: "Continuidad",
  title: "¿Y después qué?",
  intro: "El encuentro no termina. Es el comienzo de un camino.",
  ways: [
    { title: "Reuniones por Zoom", text: "Cada 15 días. Seguimos conectados, compartimos y oramos." },
    { title: "Lecturas y formación", text: "Profundizamos juntos en la verdad que transforma." },
    { title: "Oración e intercesión", text: "Nos sostenemos unos a otros en la oración." },
    { title: "Comunidad", text: "Creamos lazos verdaderos que acompañan la vida." },
    { title: "Acompañamiento", text: "Caminamos juntos en los momentos importantes." },
    { title: "Crecimiento", text: "Buscamos vivir lo que descubrimos en el día a día." },
  ],
};
