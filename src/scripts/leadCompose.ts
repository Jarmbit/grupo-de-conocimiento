// Lógica común de los formularios con datos obligatorios (reservas, pedir un encuentro):
//  - bloquea el formulario de Bewe hasta que los datos de la página estén completos;
//  - escribe esos datos como cabecera del campo "Comentario" (con el evento de input que Bewe espera);
//  - repone la cabecera si la persona la borra o la estropea, conservando lo que haya escrito;
//  - si el formulario de Bewe no aparece o cambia, no bloquea a nadie (fail-open a los 20 s).

interface Options {
  host: HTMLElement | null;
  /** ¿Están completos los datos obligatorios de la página? */
  ready: () => boolean;
  /** Cabecera completa que debe llevar el comentario (debe terminar en un espacio). */
  header: () => string;
  /** Reconoce una cabecera anterior completa al principio del texto, para quitarla. */
  stripFull: RegExp;
  /** Se llama en cada cambio para que la página actualice sus mensajes. */
  onState: (state: { ready: boolean; failOpen: boolean }) => void;
}

type Lockable = HTMLElement & { inert: boolean };

export function setupLeadCompose(o: Options) {
  const { host } = o;
  let applied = "";
  let failOpen = false;

  const getArea = () => host?.shadowRoot?.querySelector<HTMLTextAreaElement>("textarea") ?? null;

  // Escribe el valor de forma que el formulario de Bewe lo registre como si lo hubiera tecleado.
  const setValue = (area: HTMLTextAreaElement, value: string) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(area, value);
    area.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const compose = (): boolean => {
    const area = getArea();
    if (!area || !o.ready()) return false;
    const h = o.header();
    let rest = area.value;
    if (applied && rest.startsWith(applied)) {
      rest = rest.slice(applied.length);
    } else {
      // La cabecera ha sido editada o borrada a medias: se quita lo que quede de ella.
      const full = rest.replace(o.stripFull, "");
      if (full !== rest) {
        rest = full;
      } else {
        let n = 0;
        while (n < rest.length && n < applied.length && rest[n] === applied[n]) n++;
        if (n >= 10) rest = rest.slice(n);
      }
    }
    const next = h + rest;
    if (area.value !== next) setValue(area, next);
    applied = h;
    return true;
  };

  const refresh = () => {
    const ok = o.ready();
    const open = ok || failOpen;
    host?.classList.toggle("lead-locked", !open);
    if (host) (host as Lockable).inert = !open;
    o.onState({ ready: ok, failOpen });
    if (ok) compose();
  };

  refresh();

  // Esperar al formulario de Bewe (se carga desde su CDN).
  let tries = 0;
  const waiter = setInterval(() => {
    if (getArea()) {
      clearInterval(waiter);
      compose();
      const root = host?.shadowRoot;
      // Antes de enviar (clic en "Enviar" o envío del formulario) se vuelve a asegurar la cabecera.
      root?.addEventListener("click", () => compose(), true);
      root?.addEventListener("submit", () => compose(), true);
      root?.addEventListener("focusout", () => compose(), true);
      // Si el formulario se vuelve a pintar y pierde el texto, se repone sin molestar mientras se escribe.
      setInterval(() => {
        const area = getArea();
        if (area && o.ready() && root?.activeElement !== area && !area.value.startsWith(applied)) compose();
      }, 1000);
    } else if (++tries > 80) {
      clearInterval(waiter);
      failOpen = true;
      refresh();
    }
  }, 250);

  return { refresh };
}
