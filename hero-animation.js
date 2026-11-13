import * as THREE from 'three';

// The canvas is decoration only: the accessible portrait stays in the HTML.
export function createHeroAnimation(hero, canvas) {
  if (!hero || !canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x0a2540, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 9;
  const group = new THREE.Group();
  scene.add(group);

  // Two elliptical wireframe rings give the hero a dimensional, orbital motion.
  const ringGeometry = new THREE.TorusGeometry(2.9, 0.008, 5, 160);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x139dff, transparent: true, opacity: 0.45 });
  const ringA = new THREE.Mesh(ringGeometry, ringMaterial);
  const ringB = new THREE.Mesh(ringGeometry, ringMaterial);
  ringA.rotation.set(0.85, 0.25, 0.4);
  ringB.rotation.set(-0.6, 0.9, -0.2);
  group.add(ringA, ringB);

  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2.7 + Math.random() * 3.1;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.7;
  }
  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({ color: 0x8ef0f5, size: 0.035, transparent: true, opacity: 0.65, depthWrite: false });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  group.add(particles);

  let frame = 0;
  let visible = true;
  let pointerX = 0;
  let pointerY = 0;
  let previousTime;
  function resize() {
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 700 ? 12 : 9;
    camera.updateProjectionMatrix();
  }
  function render(time) {
    frame = 0;
    if (!visible || document.hidden) { previousTime = undefined; return; }
    const delta = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    ringA.rotation.z += delta * 0.09;
    ringB.rotation.z -= delta * 0.07;
    particles.rotation.y += delta * 0.025;
    group.rotation.y += (pointerX * 0.13 - group.rotation.y) * 0.025;
    group.rotation.x += (pointerY * 0.1 - group.rotation.x) * 0.025;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }
  function start() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render); }
  function onPointerMove(event) {
    const bounds = hero.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
  }
  function resetPointer() { pointerX = 0; pointerY = 0; }
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) start();
  });
  intersection.observe(hero);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(hero);
  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', resetPointer);
  document.addEventListener('visibilitychange', start);
  resize();
  start();
  return () => {
    cancelAnimationFrame(frame);
    intersection.disconnect();
    resizeObserver.disconnect();
    hero.removeEventListener('pointermove', onPointerMove);
    hero.removeEventListener('pointerleave', resetPointer);
    document.removeEventListener('visibilitychange', start);
    ringGeometry.dispose(); ringMaterial.dispose(); particlesGeometry.dispose(); particlesMaterial.dispose();
    renderer.dispose();
    renderer.clear();
  };
}
