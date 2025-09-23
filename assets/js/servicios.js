const DATA_SERVICIOS = [
  // ——— Pacientes ———
  {
    titulo: "Sesión individual",
    audiencia: ["paciente"],
    duracion: "35 min",
    formato: "Online / Presencial",
    descripcion:
      "Acompañamiento clínico para procesar emociones, tomar decisiones y trabajar objetivos personales.",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSfsVvvuaqPRgL_TAy0IXY1ZfDlZETRir6nJiA2iwX7NNhO_2A/viewform",
    brochure: null
  },
  {
    titulo: "Círculo de mujeres (grupos de apoyo)",
    audiencia: ["paciente"],
    duracion: "2×90 min",
    formato: "Grupo",
    descripcion:
      "Espacio íntimo coordinado por psicólogas: validación, pertenencia y recursos para transitar tratamientos.",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSfsVvvuaqPRgL_TAy0IXY1ZfDlZETRir6nJiA2iwX7NNhO_2A/viewform",
    brochure: null
  },

  // ——— Empresas ———
  {
    titulo: "Taller Bienestar laboral & fertilidad",
    audiencia: ["empresa"],
    duracion: "120 min",
    formato: "In-company / Online",
    descripcion:
      "Concientización sin estigma y herramientas prácticas para líderes y equipos. Prevención de burnout y presentismo.",
    url: "#contacto",
    brochure: null
  },
  {
    titulo: "Programa Cultura SGM+ (empresa)",
    audiencia: ["empresa"],
    duracion: "8 sem",
    formato: "Programa",
    descripcion:
      "Implementación de políticas ad-hoc, comunicación interna y tercerización del apoyo emocional (grupal e individual).",
    url: "#contacto",
    brochure: null
  },
  {
    titulo: "Pack comunicación sin estigma",
    audiencia: ["empresa"],
    duracion: "2–4 sem",
    formato: "In-company / Remoto",
    descripcion:
      "Campañas y comunicación interna/externa para visibilizar fertilidad sin prejuicios. Piezas, guías y activaciones.",
    url: "#contacto",
    brochure: null
  },
  {
    titulo: "Políticas y permisos de fertilidad",
    audiencia: ["empresa"],
    duracion: "4–6 sem",
    formato: "Consultoría",
    descripcion:
      "Diseño/adaptación de políticas laborales, lineamientos para RR.HH. y líderes, y protocolo de confidencialidad.",
    url: "#contacto",
    brochure: null
  },

  // ——— Profesionales ———
  {
    titulo: "Formación en salud mental reproductiva",
    audiencia: ["profesional"],
    duracion: "8 módulos",
    formato: "Online",
    descripcion:
      "Psicología perinatal, coordinación de grupos, ética del cuidado y diseño de intervenciones basadas en evidencia.",
    url: "#contacto",
    brochure: null
  },
  {
    titulo: "Clínica de casos (supervisión)",
    audiencia: ["profesional"],
    duracion: "Mensual",
    formato: "Grupal / Individual",
    descripcion:
      "Supervisión clínica con enfoque SGM+ para casos de infertilidad, duelos reproductivos y trabajo con grupos.",
    url: "#contacto",
    brochure: null
  },
  {
    titulo: "Kits y guías de intervención",
    audiencia: ["profesional"],
    duracion: "On-demand",
    formato: "Descargables",
    descripcion:
      "Guías para coordinación de grupos, hojas de trabajo, escalas y protocolos de derivación con enfoque SGM+.",
    url: "#contacto",
    brochure: null
  }
];
const grid = document.getElementById("servicios-grid");
const buttons = document.querySelectorAll(".audiencia-btn");
const ctaBtn = document.getElementById("servicios-cta-btn");

/** Utilidades URL (sin provocar scroll) */
function getAudFromURL() {
  const url = new URL(location.href);

  // Soporte legacy: migrar #audiencia=... a ?audiencia=...
  if (url.hash.startsWith("#audiencia=")) {
    const aud = url.hash.split("=")[1];
    url.hash = ""; // quitar hash para evitar salto
    url.searchParams.set("audiencia", aud);
    history.replaceState(null, "", url);
    return (aud || "paciente").toLowerCase();
  }

  const q = url.searchParams.get("audiencia");
  return (q || "paciente").toLowerCase();
}

function setAudInURL(aud) {
  const url = new URL(location.href);
  url.searchParams.set("audiencia", aud);
  url.hash = ""; // garantizamos sin hash
  history.replaceState(null, "", url);
}

/** Render básico */
function render(aud) {
  // estado visual
  buttons.forEach((b) => {
    const active = b.dataset.audiencia === aud;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-selected", active ? "true" : "false");
  });

  // tarjetas
  grid.innerHTML = "";
  const items = DATA_SERVICIOS.filter((s) => s.audiencia.includes(aud));
  items.forEach((s) => {
    const card = document.createElement("article");
    card.className = "servicio-card";
    card.setAttribute("data-audiencia", s.audiencia.join(","));
    card.innerHTML = `
      <h3>${s.titulo}</h3>
      <div class="servicio-meta">
        <span>${s.formato}</span>
        <span>•</span>
        <span>${s.duracion}</span>
      </div>
      <p class="servicio-desc">${s.descripcion}</p>
      <div class="servicio-actions">
        <a class="btn-primary" href="${s.url}">Quiero más info</a>
        ${
          s.brochure
            ? `<a class="btn-outline" href="${s.brochure}" target="_blank" rel="noopener">Ver programa</a>`
            : ""
        }
      </div>
    `;
    grid.appendChild(card);
  });

  // CTA + URL sin hash (evita scroll)
  ctaBtn.href = "#contact";
  setAudInURL(aud);
}

/** Eventos */
buttons.forEach((b) =>
  b.addEventListener("click", () => render(b.dataset.audiencia))
);

/** Init (URL awareness) */
render(getAudFromURL());
