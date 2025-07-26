// ✅ Disable on mobile/touch screens using matchMedia
const isTouchDevice = () => {
  return window.matchMedia("(pointer: coarse), (max-width: 768px)").matches;
};

if (!isTouchDevice()) {
  const numDots = 12;
  const dots = [];
  let mouse = { x: 0, y: 0 };

  // ✅ Create dots and set scale (head big, tail small)
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement("div");
    dot.className = "trail-dot";

    const scale = 1 - (numDots - i - 1) * 0.05;
    dot.style.transform = `scale(${scale})`;

    document.body.appendChild(dot);
    dots.push({ element: dot, x: 0, y: 0 });
  }

  // ✅ Track mouse
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // ✅ Animate dots to follow mouse with spacing
  function animateTrail() {
    let x = mouse.x;
    let y = mouse.y;

    dots.forEach((dot, index) => {
      const next = dots[index + 1] || { x: x, y: y };

      dot.x += (next.x - dot.x) * 0.25;
      dot.y += (next.y - dot.y) * 0.25;

      dot.element.style.left = dot.x + "px";
      dot.element.style.top = dot.y + "px";
    });

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
} else {
  console.log("Snake trail cursor disabled on mobile/touch devices.");
}
