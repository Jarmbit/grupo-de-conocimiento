// Contenido placeholder — sustituir por contenido real de la asociación antes de publicar.
// Ver README.md para el detalle de qué debe reemplazarse.

// Modo mantenimiento: si es true, la home solo muestra el splash fijo (sin botón de
// continuar, sin scroll al resto de la web) — capa extra de refuerzo además de la
// protección de acceso configurada en Vercel. Cambiar a false para abrir el sitio.
export const maintenanceMode = false;

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/#sobre", label: "Sobre nosotros" },
  { href: "/#videos", label: "Vídeos" },
  { href: "/#pide-un-encuentro", label: "Pide un encuentro" },
  { href: "/#encuentros", label: "Encuentros" },
  { href: "/noticias", label: "Noticias" },
  { href: "/#unete", label: "Únete" },
  { href: "/continuidad", label: "Continuidad" },
  { href: "/habla-con-nosotros", label: "Habla con nosotros" },
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
    "Nos mueve mostrar la razonabilidad de la existencia de Dios y la extraordinaria figura de Jesucristo a quienes no lo conocen, mediante encuentros que muestran verdad y belleza, donde de una forma amigable puedan hacerse preguntas y proseguir su búsqueda.",
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
      text: "Queremos que, a través de nuestros encuentros, las personas puedan hacer preguntas, encontrar respuestas y abrir su corazón a la búsqueda de la verdad, para que puedan encontrarse con Jesús y descubrir que Él puede transformar su vida.",
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
  poster?: string;
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
    poster: "dios-poster.jpg",
    requestSubject: "Quiero solicitar un encuentro: La existencia de Dios",
    requestBody: requestBodyTemplate("La existencia de Dios"),
  },
  {
    key: "jesucristo",
    kicker: "Encuentro II",
    title: "La existencia de Jesucristo",
    text: "Un acercamiento a la evidencia histórica y al testimonio vivo de que Jesucristo existió, murió y resucitó, y de que su vida cambia vidas hoy.",
    videoSrc: "/videos/jesus-trailer.mp4",
    poster: "jesus-poster.jpg",
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
  {
    title: "Un momento de nuestros encuentros",
    duration: "0:13",
    thumbnail: "/images/encuentro-videos/encuentro-08.jpg",
    src: "/videos/encuentro-08.mp4",
  },
];

export interface EventItem {
  month: string;
  day: string;
  title: string;
  location: string;
  spots?: string;
  image?: string;
  link?: string;
}

export const events: EventItem[] = [
  {
    month: "Nov",
    day: "14",
    title: "Encuentro en Málaga",
    location: "El Cielo, Avenida de Manuel Torres, 3, Málaga · 18:00h",
    spots: "Vídeo de Jesús de Nazaret y música en directo",
    image: "/images/events/encuentro-malaga.jpg",
  },
  {
    month: "Nov",
    day: "20",
    title: "Encuentro jóvenes",
    location: "Las Rozas · 20:00h · Dirección por privado",
    spots: "Película Jesús de Nazaret, música en directo, testimonio y diálogo",
    image: "/images/events/encuentro-jovenes.jpg",
  },
  {
    month: "Nov",
    day: "21",
    title: "Encuentro adultos",
    location: "Las Rozas · 20:00h · Dirección por invitación",
    spots: "Música, película, testimonio y diálogo",
    image: "/images/events/encuentro-adultos.jpg",
  },
  {
    month: "Nov",
    day: "28",
    title: "Encuentro en Burgos",
    location: "Auditorio Círculo Católico, C/ Concepción s/n, Burgos · 18:00h",
    spots: "Película Jesús de Nazaret y música en directo",
    image: "/images/events/encuentro-burgos.jpg",
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
    title: "Jesús de Nazaret",
    location: "Teatro Fernández Baldor, Torrelodones",
    date: "17 de octubre de 2026",
    // TODO: pendiente de fotos del evento. Al subirlas a
    // public/images/eventos-pasados/jesus-de-nazaret/ añadir aquí sus rutas.
    photos: [],
  },
  {
    title: "Encuentro en Burgos",
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
  /** Medio que publica la noticia, si es un enlace externo. */
  source?: string;
}

// Añadir aquí cada noticia cuando exista su artículo/destino real (más reciente primero).
export const news: NewsItem[] = [
  {
    date: "22 de octubre de 2026",
    title: "Como los primeros cristianos: testimonios, música y fe compartida en los Encuentros de Siloé",
    href: "https://www.religionenlibertad.com/espana/261022/primeros-cristianos-testimonios-musica-fe-compartida-encuentros-siloe_120550.html",
    source: "Religión en Libertad",
  },
  {
    date: "20 de octubre de 2026",
    title: "¿Qué es Encuentros Siloé?",
    href: "https://alfayomega.es/que-es-encuentros-siloe/",
    source: "Alfa y Omega",
  },
  {
    date: "20 de octubre de 2026",
    title: "New apostolate to atheists and agnostics takes off in Spain",
    href: "https://www.catholicworldreport.com/2026/10/20/new-apostolate-to-atheists-and-agnostics-takes-off-in-spain/",
    source: "Catholic World Report (inglés)",
  },
  {
    date: "20 de octubre de 2026",
    title: "Új, ateistákat és agnosztikusokat megszólító apostoli kezdeményezés indult Spanyolországban",
    href: "https://www.ewtn.hu/hirek/uj-ateistakat-es-agnosztikusokat-megszolito-apostoli-kezdemenyezes-indult-spanyolorszagban--69881a60-7501-53f7-a0fb-ade4bf9c4ae1",
    source: "EWTN Hungría (húngaro)",
  },
  {
    date: "20 de octubre de 2026",
    title: "Nace Encuentros Siloé, una iniciativa para acercar la fe cristiana a los alejados de la Iglesia desde hogares familiares",
    href: "https://www.elconfidencialdigital.com/articulo/catolicos/nace-encuentros-siloe-iniciativa-acercar-fe-cristiana-alejados-iglesia-hogares-familiares/202610200500001495173.html",
    source: "El Confidencial Digital",
  },
  {
    date: "20 de octubre de 2026",
    title: "New apostolate to atheists and agnostics takes off in Spain",
    href: "https://www.ewtnnews.com/world/europe/new-apostolate-to-atheists-and-agnostics-taking-off-in-spain",
    source: "EWTN News (inglés)",
  },
  {
    date: "19 de octubre de 2026",
    title: "Un nuevo movimiento en España busca acercar la fe a ateos y agnósticos desde los hogares",
    href: "https://desdelasredes.com/un-nuevo-movimiento-en-espana-busca-acercar-la-fe-a-ateos-y-agnosticos-desde-los-hogares/",
    source: "Desde las redes",
  },
  {
    date: "19 de octubre de 2026",
    title: "Nace en España Encuentros Siloé, un nuevo apostolado dirigido a ateos y agnósticos",
    href: "https://www.ewtnnews.com/es/mundo/espana/espana-encuentros-siloe-apostolado-ateos-agnosticos",
    source: "EWTN News",
  },
  {
    date: "19 de octubre de 2026",
    title: "Cuando el salón de casa se convierte en el motor de una nueva fe: nace «Encuentros Siloé»",
    href: "https://exaudi.org/es/cuando-el-salon-de-casa-se-convierte-en-el-motor-de-una-nueva-fe-nace-encuentros-siloe/",
    source: "Exaudi",
  },
];

export interface Social {
  initial: string;
  label: string;
  href: string;
}

export const socials: Social[] = [
  { initial: "IG", label: "Instagram", href: "https://www.instagram.com/encuentrossiloe" },
];

export interface DonationModel {
  key: "socio" | "puntual" | "patrocinio" | "voluntariado";
  title: string;
  detail: string;
  text: string;
  cta: string;
}

export const donationModels: DonationModel[] = [
  // Socio mensual (suscripción) pendiente hasta tener el CRM de Bewe: se reactivará entonces.
  {
    key: "puntual",
    title: "Donación puntual",
    detail: "La cantidad que quieras",
    text: "Colabora una sola vez con la cantidad que decidas.",
    cta: "Donar ahora",
  },
  {
    key: "patrocinio",
    title: "Patrocina un encuentro",
    detail: "Aportación única",
    text: "Haz posible un encuentro completo, de principio a fin.",
    cta: "Quiero patrocinar",
  },
  {
    key: "voluntariado",
    title: "Voluntariado",
    detail: "Tu tiempo y talento",
    text: "Súmate al equipo que hace realidad cada encuentro y vídeo.",
    cta: "Quiero ayudar",
  },
];

// Modelo de aportación resaltado como recomendado.
export const highlightDonation: DonationModel["key"] = "puntual";

// Cuenta para aportaciones por transferencia.
export const bankAccount = {
  holder: "Asociación Encuentros Siloé",
  iban: "ES46 2100 3893 1502 0085 0638",
  concept: "Donación Encuentros Siloé",
};

export const contact = {
  email: "info@encuentrossiloe.org",
};

export interface FeedbackType {
  key: string;
  label: string;
  prompt: string;
}

// Tipos de mensaje del formulario "Habla con nosotros": la persona elige uno y escribe
// libremente; el envío se construye como un mailto (el sitio no tiene backend propio).
export const feedbackTypes: FeedbackType[] = [
  {
    key: "evento",
    label: "Qué te pareció el encuentro",
    prompt: "Cuéntanos qué te pareció el encuentro y qué sentiste.",
  },
  {
    key: "pregunta",
    label: "Pregunta o sugerencia",
    prompt: "Escríbenos tu pregunta o sugerencia.",
  },
  {
    key: "testimonio",
    label: "Qué ha hecho Dios en tu vida",
    prompt: "Cuéntanos qué ha hecho Dios en tu vida.",
  },
];

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
    { title: "Comunidad", text: "Creamos lazos verdaderos que acompañan la vida." },
    { title: "Acompañamiento", text: "Caminamos juntos en los momentos importantes." },
    { title: "Crecimiento", text: "Buscamos vivir lo que descubrimos en el día a día." },
    { title: "Acción de gracias", text: "Damos gracias a Dios por lo vivido y por cada persona que ha llegado." },
  ],
};

export interface ContinuitySession {
  title: string;
  text: string;
}

export interface ContinuityBlock {
  title: string;
  goal: string;
  sessions: ContinuitySession[];
}

// Itinerario de continuidad "Hijos en el Hijo" (guion facilitado por la asociación).
export const continuity = {
  kicker: "Continuidad",
  title: "Hijos en el Hijo",
  subtitle: "Un camino para descubrir la vida nueva en Jesús",
  intro: [
    "¿Y si Dios te está buscando? ¿Y si tu vida puede comenzar de nuevo?",
    "Encuentros Siloé te invita a recorrer un camino de encuentro con Jesucristo, para descubrir el amor del Padre, crecer en la fe y aprender a vivir como hijo amado de Dios.",
    "Un itinerario pensado para quienes han tenido un encuentro con Jesús y desean profundizar en su fe, conocer mejor la Iglesia y descubrir cómo vivir una vida nueva en el Espíritu Santo.",
  ],
  blocks: [
    {
      title: "Bloque 1. Identidad y fundamentos",
      goal: "Descubrir quién eres para Dios y aprender a vivir como hijo amado.",
      sessions: [
        { title: "Dios te está buscando", text: "El primer anuncio de la fe: el kerigma." },
        { title: "He vuelto a casa", text: "Descubrir nuestra identidad como hijos de Dios." },
        { title: "Vivir como hijos y no como esclavos", text: "La libertad de vivir en el amor del Padre." },
        { title: "Hablar con el Padre", text: "Aprender a orar y cultivar una relación personal con Dios." },
        { title: "La brújula del cristiano", text: "Descubrir la Palabra de Dios y aprender a vivirla." },
        { title: "El combate espiritual", text: "Afrontar las dificultades, las dudas y las tentaciones en la vida cristiana." },
      ],
    },
    {
      title: "Bloque 2. Jesucristo, vida sacramental y sanación",
      goal: "Profundizar en el encuentro con Jesús y descubrir la gracia que transforma nuestra vida.",
      sessions: [
        { title: "Jesucristo: Dios ha venido a buscarme", text: "Conocer más profundamente a Jesús y acoger su salvación." },
        { title: "Bautismo: nacer a una vida nueva", text: "Descubrir la gracia bautismal y nuestra nueva vida en Cristo." },
        { title: "El abrazo del Padre que perdona", text: "Comprender el pecado y descubrir la misericordia de Dios en la Confesión." },
        { title: "Taller práctico: cómo hacer una buena confesión", text: "Aprender a preparar y vivir este sacramento con confianza." },
        { title: "El banquete de los hijos de Dios", text: "Comprender y vivir la celebración de la Santa Misa." },
        { title: "El alimento del alma", text: "Descubrir la presencia real de Jesús en la Eucaristía." },
      ],
    },
    {
      title: "Bloque 3. Comunidad y misión",
      goal: "Crecer en la familia de la Iglesia y descubrir la alegría de compartir la fe.",
      sessions: [
        { title: "La familia de Jesús", text: "Descubrir qué es la Iglesia y nuestro lugar en ella." },
        { title: "María, nuestra Madre en la fe", text: "Conocer a María y aprender de su sí a Dios." },
        { title: "Los dones del Espíritu Santo", text: "Descubrir los dones recibidos y ponerlos al servicio de los demás." },
        { title: "Enviados al mundo", text: "Dar testimonio de Jesús y continuar el camino en la comunidad parroquial." },
      ],
    },
  ] satisfies ContinuityBlock[],
  open: {
    title: "Un camino que siempre está abierto",
    paragraphs: [
      "El recorrido es circular y puedes incorporarte en cualquier momento.",
      "No importa en qué punto del camino te encuentres: siempre hay una oportunidad para comenzar, volver a descubrir el amor de Dios y seguir creciendo en la fe.",
      "En Encuentros Siloé queremos acompañarte en este camino de encuentro, conversión y vida en el Espíritu, para que descubras cada día más quién eres en Cristo y aprendas a vivir como hijo en el Hijo.",
    ],
    closing: ["¿Te animas a seguir caminando con nosotros?", "Bienvenido a Encuentros Siloé."],
  },
  pdf: "/docs/hijos-en-el-hijo.pdf",
};
