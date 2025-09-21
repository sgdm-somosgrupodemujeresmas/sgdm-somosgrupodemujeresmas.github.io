// assets/js/media.js
// Sección "En los medios" - SGM+
// Data-driven, con helpers, render, filtros y JSON-LD dinámico.

(function () {
  // =========================
  // 1) DATA: editar/agregar acá
  // =========================
  const mediaItems = [
    {
      type: "articulo",
      title:
        "Lorena Laserre lidera la cuenta Somos Grupo de Mujeres +",
      source: "Agenhoy",
      url: "https://agenhoy.com.ar/lorena-laserre-psicologa-lidera-la-cuenta-somos-grupos-de-mujeres-3/",
      date: "2025-05-01",
      cover: "assets/img/media/agenhoy.png"
    },
    {
      type: "articulo",
      title: "Cobertura relacionada: Para Ti - etiqueta 'Chicos'",
      source: "Para Ti",
      url: "https://www.parati.com.ar/lifestyle/infertilidad-y-tratamientos-de-reproduccion-asistida-como-manejar-su-impacto-en-el-vinculo-de-pareja/",
      date: "2025-05-10",
      cover: "assets/img/media/parati.png"
    },
    {
      type: "audio",
      title: "Entrevista: Programa Máquina (Radio Delta)",
      source: "RadioCut / Radio Delta",
      url: "https://ar.radiocut.fm/audiocut/lorena-laserre-licenciada-en-psicologia-programa-maquina-radio-delta/",
      date: "2024-11-20",
      cover: "assets/img/media/radiocut.png"
    },
    {
      type: "video",
      title: "Entrevista en YouTube",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=PeIl2mJt60A",
      date: "2023-09-01",
      cover: null
    }
  ];

  // =========================
  // 2) HELPERS
  // =========================
  const typeIcon = {
    articulo: "bi-newspaper",
    audio: "bi-mic",
    video: "bi-play-btn"
  };

  function domainFromUrl(u) {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }

  function getYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    } catch {}
    return null;
  }

  function guessThumb(item) {
    if (item.cover) return item.cover;
    if (item.type === "video") {
      const id = getYouTubeId(item.url);
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    if (item.type === "audio") return "assets/img/misc/thumb-audio.jpg";
    if (item.type === "article") return "assets/img/misc/thumb-article.jpg";
    return "assets/img/misc/thumb-generic.jpg";
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("es-AR", { year: "numeric", month: "short" });
  }

  // =========================
  // 3) RENDER + JSON-LD
  // =========================
  function renderMedia(filter = "all") {
    const grid = document.getElementById("media-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const items = mediaItems
      .filter((it) => (filter === "all" ? true : it.type === filter))
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    items.forEach((item) => {
      const thumb = guessThumb(item);
      const icon = typeIcon[item.type] || "bi-link-45deg";
      const source = item.source || domainFromUrl(item.url);
      const titleEsc = (item.title || "").replace(/"/g, "&quot;");

      const card = document.createElement("article");
      card.className = "media-card";
      card.setAttribute("data-type", item.type);
      card.setAttribute("tabindex", "0");
      card.innerHTML = `
        <div class="media-thumb">
          <img src="${thumb}" alt="${titleEsc}" loading="lazy" decoding="async">
          <span class="media-badge"><i class="bi ${icon}"></i> ${ucfirst(item.type)}</span>
          <span class="media-source">${source}</span>
        </div>
        <div class="media-body">
          <div class="media-title">${item.title}</div>
          <div class="media-meta">
            ${source ? `<span><i class="bi bi-building"></i> ${source}</span>` : ""}
            ${item.date ? `<span><i class="bi bi-calendar3"></i> ${formatDate(item.date)}</span>` : ""}
          </div>
          <div class="media-actions">
            <a href="${item.url}" target="_blank" rel="noopener">
              <i class="bi bi-box-arrow-up-right"></i> Ver
            </a>
            ${
              item.type === "video" && getYouTubeId(item.url)
                ? `<a href="${item.url}" target="_blank" rel="noopener"><i class="bi bi-youtube"></i> Reproducir</a>`
                : ""
            }
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    if (!grid.children.length) {
      grid.innerHTML = `<p class="text-muted">No hay menciones para este filtro aún.</p>`;
    }

    injectJSONLD(items);
  }

  function injectJSONLD(items) {
    // Limpia JSON-LD anterior (si hubiera)
    const old = document.getElementById("medios-jsonld");
    if (old) old.remove();

    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Menciones en medios de SGM+",
      itemListElement: items.map((it, idx) => {
        const base =
          it.type === "video"
            ? { "@type": "VideoObject", name: it.title, url: it.url }
            : it.type === "audio"
            ? { "@type": "AudioObject", name: it.title, url: it.url }
            : { "@type": "NewsArticle", headline: it.title, url: it.url };

        return {
          "@type": "ListItem",
          position: idx + 1,
          item: base
        };
      })
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "medios-jsonld";
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  function ucfirst(s) {
    return (s || "").charAt(0).toUpperCase() + (s || "").slice(1);
  }

  // =========================
  // 4) EVENTOS (filtros) + INIT
  // =========================
  function wireFilters() {
    const container = document.querySelector(".media-filters");
    if (!container) return;

    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-chip");
      if (!btn) return;
      const all = [...container.querySelectorAll(".btn-chip")];
      all.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderMedia(btn.dataset.filter || "all");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Render inicial
    renderMedia("all");
    // Filtros
    wireFilters();
  });

  // =========================
  // 5) API mínima por si querés manipular desde consola
  // =========================
  window.SGMMedia = {
    add(item) {
      mediaItems.push(item);
      renderMedia(document.querySelector(".btn-chip.is-active")?.dataset.filter || "all");
    },
    list() {
      return [...mediaItems];
    },
    render(filter = "all") {
      renderMedia(filter);
    }
  };
})();
