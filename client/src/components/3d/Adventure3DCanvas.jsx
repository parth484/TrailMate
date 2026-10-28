import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, Mountain, Sparkles, Move3d } from 'lucide-react';

/**
 * Adventure3DCanvas — Interactive 3D WebGL experience featuring:
 * 1. 3D Glowing Earth Globe with Indian expedition pins & arc trails
 * 2. 3D Sahyadri & Himalayan Mountain terrain wireframe with animated peak waves
 * 3. 3D Constellation galaxy starfield
 * Full mouse parallax and interactive drag-to-rotate.
 */
const Adventure3DCanvas = () => {
  const mountRef = useRef(null);
  const [activeScene, setActiveScene] = useState('globe'); // 'globe' | 'mountains'
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const globeGroupRef = useRef(null);
  const mountainGroupRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x10b981, 1.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const tealLight = new THREE.PointLight(0x06b6d4, 2, 50);
    tealLight.position.set(-5, -3, 3);
    scene.add(tealLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 1.5, 30);
    amberLight.position.set(3, -4, 2);
    scene.add(amberLight);

    // Group containers for the modes
    const globeGroup = new THREE.Group();
    const mountainGroup = new THREE.Group();
    const starsGroup = new THREE.Group();

    globeGroupRef.current = globeGroup;
    mountainGroupRef.current = mountainGroup;

    scene.add(globeGroup);
    scene.add(mountainGroup);
    scene.add(starsGroup);

    // Default visibility
    mountainGroup.visible = false;

    // ─── A. BUILD 3D GLOBE WITH INDIAN EXPEDITION PINS ───
    // Inner Sphere
    const sphereGeo = new THREE.SphereGeometry(2.3, 40, 40);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x064e3b,
      emissive: 0x022c22,
      specular: 0x10b981,
      shininess: 40,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Outer Wireframe Grid
    const wireGeo = new THREE.SphereGeometry(2.34, 28, 28);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Atmosphere Halo Ring
    const ringGeo = new THREE.RingGeometry(2.6, 2.75, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    globeGroup.add(ringMesh);

    // Second Orbit Ring
    const ringGeo2 = new THREE.RingGeometry(2.9, 2.95, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 3;
    ringMesh2.rotation.y = Math.PI / 5;
    globeGroup.add(ringMesh2);

    // Indian Adventure Hotspot Pins (Lat/Long converted to 3D Sphere coordinates)
    const latLongToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const PINS = [
      { name: 'Pune & Sahyadris', lat: 18.52, lon: 73.85, color: 0x10b981 },
      { name: 'Rishikesh Rafting', lat: 30.08, lon: 78.26, color: 0x38bdf8 },
      { name: 'Manali Snow', lat: 32.24, lon: 77.18, color: 0xa78bfa },
      { name: 'Ladakh Chadar Trek', lat: 34.15, lon: 77.57, color: 0xf43f5e },
      { name: 'Goa Scuba', lat: 15.29, lon: 74.12, color: 0xf59e0b },
    ];

    const pinPoints = [];
    PINS.forEach((pin) => {
      const pos = latLongToVector3(pin.lat, pin.lon, 2.36);
      pinPoints.push(pos);

      // Pin core sphere
      const pinGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: pin.color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      // Pulsing outer beacon ring
      const beaconGeo = new THREE.RingGeometry(0.12, 0.18, 24);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: pin.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(pos);
      beacon.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(beacon);
    });

    // Expedition Arcs connecting Indian adventure hubs
    if (pinPoints.length >= 2) {
      for (let i = 0; i < pinPoints.length - 1; i++) {
        const p1 = pinPoints[i];
        const p2 = pinPoints[i + 1];

        // Midpoint elevated above surface for 3D curved trajectory
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(2.75);

        const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
        const curveGeo = new THREE.TubeGeometry(curve, 32, 0.02, 8, false);
        const curveMat = new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.8,
        });
        const arcMesh = new THREE.Mesh(curveGeo, curveMat);
        globeGroup.add(arcMesh);
      }
    }

    // ─── B. BUILD 3D MOUNTAIN TERRAIN MESH ───
    const planeWidth = 7;
    const planeHeight = 7;
    const segments = 45;
    const mountainGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, segments, segments);

    // Generate rugged peaks elevation
    const posAttr = mountainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i);
      const v = posAttr.getY(i);
      const z =
        Math.sin(u * 1.5) * Math.cos(v * 1.5) * 0.8 +
        Math.sin(u * 3 + v * 2) * 0.35 +
        Math.cos(u * 0.8) * 0.4;
      posAttr.setZ(i, z);
    }
    mountainGeo.computeVertexNormals();

    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      roughness: 0.4,
      metalness: 0.3,
      wireframe: true,
    });
    const mountainMesh = new THREE.Mesh(mountainGeo, mountainMat);
    mountainMesh.rotation.x = -Math.PI / 2.5;
    mountainMesh.position.y = -0.5;
    mountainGroup.add(mountainMesh);

    // ─── C. BUILD 3D STARFIELD & CONSTELLATION ───
    const starsCount = 1200;
    const starsGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 24;
      starCoords[i + 1] = (Math.random() - 0.5) * 24;
      starCoords[i + 2] = (Math.random() - 0.5) * 24;

      // Color variation between cyan, emerald and gold
      const palette = Math.random();
      if (palette < 0.5) {
        starColors[i] = 0.06; starColors[i + 1] = 0.72; starColors[i + 2] = 0.51; // Emerald
      } else if (palette < 0.8) {
        starColors[i] = 0.02; starColors[i + 1] = 0.71; starColors[i + 2] = 0.83; // Cyan
      } else {
        starColors[i] = 0.96; starColors[i + 1] = 0.62; starColors[i + 2] = 0.04; // Amber
      }
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    starsGroup.add(starField);

    // ─── 4. INTERACTIVE MOUSE PARALLAX & DRAG ROTATION ───
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.45;
      mouseRef.current.targetY = y * 0.45;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;
        globeGroup.rotation.y += deltaX * 0.007;
        globeGroup.rotation.x += deltaY * 0.007;
        mountainGroup.rotation.z += deltaX * 0.005;
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // ─── 5. RESIZE LISTENER ───
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── 6. ANIMATION RENDER LOOP ───
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Rotate Globe smoothly
      if (!isDraggingRef.current) {
        globeGroup.rotation.y += 0.004;
      }
      ringMesh.rotation.z += 0.006;
      ringMesh2.rotation.z -= 0.005;

      // Animate mountain terrain wave
      const positions = mountainGeo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const u = positions.getX(i);
        const v = positions.getY(i);
        const z =
          Math.sin(u * 1.5 + elapsedTime * 1.2) * Math.cos(v * 1.5 + elapsedTime) * 0.8 +
          Math.sin(u * 3 + v * 2 + elapsedTime * 1.5) * 0.35 +
          Math.cos(u * 0.8) * 0.4;
        positions.setZ(i, z);
      }
      mountainGeo.computeVertexNormals();
      mountainGeo.attributes.position.needsUpdate = true;

      if (!isDraggingRef.current) {
        mountainGroup.rotation.z += 0.002;
      }

      // Drift starfield
      starsGroup.rotation.y = elapsedTime * 0.02;
      starsGroup.rotation.x = elapsedTime * 0.01;

      // Parallax camera sway
      camera.position.x = mouseRef.current.x * 1.2;
      camera.position.y = mouseRef.current.y * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update visible 3D mode on state change
  useEffect(() => {
    if (globeGroupRef.current && mountainGroupRef.current) {
      if (activeScene === 'globe') {
        globeGroupRef.current.visible = true;
        mountainGroupRef.current.visible = false;
      } else if (activeScene === 'mountains') {
        globeGroupRef.current.visible = false;
        mountainGroupRef.current.visible = true;
      }
    }
  }, [activeScene]);

  return (
    <div className="relative w-full h-[460px] lg:h-[520px] rounded-3xl overflow-hidden glass-panel border border-emerald-500/30 shadow-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating 3D Mode Selector Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 px-2 py-1 flex items-center gap-1.5">
          <Move3d className="w-3.5 h-3.5" /> 3D Viewport
        </span>
        <button
          onClick={() => setActiveScene('globe')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeScene === 'globe'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Earth & India Pins
        </button>
        <button
          onClick={() => setActiveScene('mountains')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeScene === 'mountains'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" /> 3D Mountains
        </button>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none text-slate-400 text-[11px] font-semibold bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 shadow">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse-slow" />
        Interactive WebGL 3D • Drag to Spin
      </div>

      {/* Subtle glowing vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
    </div>
  );
};

export default Adventure3DCanvas;
