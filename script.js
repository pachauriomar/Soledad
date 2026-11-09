const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const heartsBox = document.getElementById("hearts");

/* El botón NO escapa: nunca se puede presionar */
function escape(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  /* Mover el botón al <body> para que "fixed" use la pantalla y no la tarjeta */
  if (noBtn.parentElement !== document.body) {
    const r = noBtn.getBoundingClientRect();
    noBtn.style.left = r.left + "px";
    noBtn.style.top = r.top + "px";
    document.body.appendChild(noBtn);
  }
  noBtn.classList.add("escaping");

  const margin = 12;
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(margin, vw - w - margin);
  const maxY = Math.max(margin, vh - h - margin);

  const yesRect = yesBtn.getBoundingClientRect();
  let x, y, tries = 0;
  do {
    x = margin + Math.random() * (maxX - margin);
    y = margin + Math.random() * (maxY - margin);
    tries++;
  } while (
    tries < 30 &&
    x < yesRect.right + 10 && x + w > yesRect.left - 10 &&
    y < yesRect.bottom + 10 && y + h > yesRect.top - 10
  );

  x = Math.min(Math.max(margin, x), maxX);
  y = Math.min(Math.max(margin, y), maxY);
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

["mouseover", "pointerenter", "pointerdown", "touchstart", "mousedown", "focus", "click"].forEach(evt =>
  noBtn.addEventListener(evt, escape, { passive: false })
);

window.addEventListener("resize", () => {
  if (noBtn.classList.contains("escaping")) escape();
});

/* El botón SÍ abre el modal */
yesBtn.addEventListener("click", () => {
  modal.hidden = false;
  burst();
});
closeBtn.addEventListener("click", () => (modal.hidden = true));
modal.addEventListener("click", e => { if (e.target === modal) modal.hidden = true; });
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.hidden = true; });

/* Corazones flotantes */
const icons = ["❤️", "💖", "💉", "🩺", "💕", "➕"];
function spawnHeart(big) {
  const el = document.createElement("span");
  el.className = "heart";
  el.textContent = icons[Math.floor(Math.random() * icons.length)];
  el.style.left = Math.random() * 100 + "%";
  el.style.fontSize = (big ? 24 + Math.random() * 28 : 16 + Math.random() * 22) + "px";
  el.style.animationDuration = (big ? 3 + Math.random() * 3 : 6 + Math.random() * 6) + "s";
  heartsBox.appendChild(el);
  setTimeout(() => el.remove(), 13000);
}
setInterval(() => spawnHeart(false), 700);
for (let i = 0; i < 8; i++) spawnHeart(false);

function burst() {
  for (let i = 0; i < 30; i++) setTimeout(() => spawnHeart(true), i * 60);
}