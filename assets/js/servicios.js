const DATA_SERVICIOS = [
  {
    titulo: "Sesión individual",
    audiencia: ["paciente"],
    duracion: "60 min",
    formato: "Online/Presencial",
    descripcion: "Espacio de escucha y acompañamiento para trabajar objetivos personales.",
    url: "#contact",
    brochure: null
  },
  {
    titulo: "Círculo de mujeres",
    audiencia: ["paciente"],
    duracion: "4 encuentros",
    formato: "Grupo",
    descripcion: "Proceso grupal de reflexión y acción para transformar tu realidad.",
    url: "#contact",
    brochure: null
  },
  {
    titulo: "Taller Bienestar laboral",
    audiencia: ["empresa"],
    duracion: "2 hs",
    formato: "In-company",
    descripcion: "Herramientas de cuidado emocional y prevención del burnout para equipos.",
    url: "#contact",
    brochure: null
  },
  {
    titulo: "Programa Cultura SGM+",
    audiencia: ["empresa"],
    duracion: "8 semanas",
    formato: "In-company",
    descripcion: "Diagnóstico + workshops + seguimiento para construir ambientes más sanos e inclusivos.",
    url: "#contact",
    brochure: null
  },
  {
    titulo: "Formación en facilitación de grupos",
    audiencia: ["profesional"],
    duracion: "8 módulos",
    formato: "Online",
    descripcion: "Metodologías, diseño de dinámicas y ética del cuidado para coordinar grupos.",
    url: "#contact",
    brochure: null
  },
  {
    titulo: "Clínica de casos (supervisión)",
    audiencia: ["profesional"],
    duracion: "Mensual",
    formato: "Grupal",
    descripcion: "Espacio de supervisión y aprendizaje entre pares con enfoque SGM+.",
    url: "#contact",
    brochure: null
  }
];

const grid = document.getElementById("servicios-grid");
const buttons = document.querySelectorAll(".audiencia-btn");
const ctaBtn = document.getElementById("servicios-cta-btn");

/** Render básico */
function render(aud) {
  // estado visual
  buttons.forEach(b => {
    const active = b.dataset.audiencia === aud;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-selected", active ? "true" : "false");
  });

  // tarjetas
  grid.innerHTML = "";
  const items = DATA_SERVICIOS.filter(s => s.audiencia.includes(aud));
  items.forEach(s => {
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
        ${s.brochure ? `<a class="btn-outline" href="${s.brochure}" target="_blank" rel="noopener">Ver programa</a>` : ""}
      </div>
    `;
    grid.appendChild(card);
  });

  // actualizar CTA para tracking / deep-link
  ctaBtn.href = `#contact`;
  history.replaceState(null, "", `${location.pathname}${location.search ? "" : ""}#audiencia=${aud}`);
}

/** Eventos */
buttons.forEach(b => b.addEventListener("click", () => render(b.dataset.audiencia)));

/** URL awareness (?audiencia=… o #audiencia=…) */
// function getAudFromURL(){
//   const hashAud = (location.hash.match(/audiencia=([a-z]+)/i)||[])[1];
//   const searchAud = new URLSearchParams(location.search).get("audiencia");
//   return (hashAud || searchAud || "paciente").toLowerCase();
// }

// render(getAudFromURL());