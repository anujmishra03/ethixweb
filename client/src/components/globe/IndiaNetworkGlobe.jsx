import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { INDIA_BOUNDARY, WORLD_LAND } from '../../data/geoData.js';
import { HUBS, GLOBAL_HUBS, INDIA_ROUTES, GLOBAL_ROUTES, GLOBE_COLORS } from './constants.js';
import { latLonToVector3, createArc, generateLandDots, getFocusRotation } from './math.js';
import GlobeFallback from './GlobeFallback.jsx';
import { Play, Pause, RotateCcw, Activity, ShieldCheck, Zap } from 'lucide-react';
import './globe.css';

/**
 * Creates a soft radial glow texture on a 2D canvas for Three.js points & pulses
 */
function createRadialGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function IndiaNetworkGlobe({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Status and user interaction state
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [activeHub, setActiveHub] = useState(null);
  const [hoveredHub, setHoveredHub] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [readoutCoords, setReadoutCoords] = useState('28°36\' N · 77°12\' E');

  // References for Three.js animation and interaction
  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    globeGroup: null,
    hubHitSpheres: [],
    arcCurves: [],
    pulseMeshes: [],
    waveRings: [],
    satelliteMeshes: [],
    currentRotX: 0.22,
    currentRotY: -2.932,
    targetRotX: 0.22,
    targetRotY: -2.932,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    lastInteractionTime: Date.now(),
    mouseParallax: { x: 0, y: 0 },
    animationFrameId: null,
    isTabVisible: true,
    isInViewport: true
  });

  // Check WebGL support & reduced-motion preference on mount
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const supported = Boolean(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
      if (!supported) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Hub map lookup by ID
  const hubsMap = useMemo(() => {
    const map = new Map();
    HUBS.forEach(h => map.set(h.id, h));
    GLOBAL_HUBS.forEach(h => map.set(h.id, h));
    return map;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!webGLSupported || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const s = stateRef.current;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 480;
    const isMobile = width < 600;
    const isLowPower = isMobile || (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    s.scene = scene;

    const camera = new THREE.PerspectiveCamera(44, width / height, 1, 1000);
    camera.position.set(0, 0, isMobile ? 275 : 255);
    s.camera = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    const maxDpr = isMobile ? 1.0 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    s.renderer = renderer;

    // 3. Root Globe Group
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = s.currentRotX;
    globeGroup.rotation.y = s.currentRotY;
    scene.add(globeGroup);
    s.globeGroup = globeGroup;

    // 4. Lighting (Restrained and architectural)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ee, 1.4);
    dirLight.position.set(120, 160, 140);
    scene.add(dirLight);

    const redRimLight = new THREE.DirectionalLight(0xd94332, 0.85);
    redRimLight.position.set(-140, 60, -80);
    scene.add(redRimLight);

    // 5. Shared radial glow texture
    const glowTexture = createRadialGlowTexture();

    // 6. Base Sphere Body (Paper tone, occludes rear features)
    const baseSphereGeo = new THREE.SphereGeometry(98.8, 64, 48);
    const baseSphereMat = new THREE.MeshStandardMaterial({
      color: 0xeee7db,
      roughness: 0.85,
      metalness: 0.05,
      transparent: true,
      opacity: 0.94,
      depthWrite: true
    });
    const baseSphere = new THREE.Mesh(baseSphereGeo, baseSphereMat);
    globeGroup.add(baseSphere);

    // 7. Subtle Atmospheric Fresnel Glow Outer Shell
    const haloGeo = new THREE.SphereGeometry(102.5, 36, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xe8ded0,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // 8. India Boundary Line (High-fidelity vector outline in brand red)
    const indiaPoints3D = INDIA_BOUNDARY.map(([lon, lat]) => latLonToVector3(lat, lon, 100.8));
    const indiaLineGeo = new THREE.BufferGeometry().setFromPoints(indiaPoints3D);
    const indiaLineMat = new THREE.LineBasicMaterial({
      color: 0xd94332,
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    });
    const indiaLine = new THREE.LineLoop(indiaLineGeo, indiaLineMat);
    globeGroup.add(indiaLine);

    // 9. World Continents Coastlines (Subtle muted stone grey)
    WORLD_LAND.forEach(ring => {
      const ring3D = ring.map(([lon, lat]) => latLonToVector3(lat, lon, 100.2));
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ring3D);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xbcb5a8,
        transparent: true,
        opacity: 0.45
      });
      const ringLine = new THREE.LineLoop(ringGeo, ringMat);
      globeGroup.add(ringLine);
    });

    // 10. Land Dot Matrix (Dense brand red for India; muted charcoal for world land)
    const { indiaPoints, worldPoints } = generateLandDots(100, isLowPower);

    // India dot mesh
    const indiaGeo = new THREE.BufferGeometry().setFromPoints(indiaPoints);
    const indiaMat = new THREE.PointsMaterial({
      color: 0xd94332,
      size: isMobile ? 2.4 : 2.8,
      map: glowTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    const indiaDots = new THREE.Points(indiaGeo, indiaMat);
    globeGroup.add(indiaDots);

    // World continents dot mesh
    const worldGeo = new THREE.BufferGeometry().setFromPoints(worldPoints);
    const worldMat = new THREE.PointsMaterial({
      color: 0x757167,
      size: isMobile ? 1.6 : 1.9,
      map: glowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const worldDots = new THREE.Points(worldGeo, worldMat);
    globeGroup.add(worldDots);

    // 11. Hub Markers, Beacons, and Pulsing Rings
    s.hubHitSpheres = [];
    s.waveRings = [];

    HUBS.forEach(hub => {
      const surfacePos = latLonToVector3(hub.lat, hub.lon, 100);
      const elevatedPos = latLonToVector3(hub.lat, hub.lon, 106);

      // A. Surface anchor disc
      const anchorGeo = new THREE.SphereGeometry(1.2, 12, 12);
      const anchorMat = new THREE.MeshBasicMaterial({ color: 0xd94332 });
      const anchor = new THREE.Mesh(anchorGeo, anchorMat);
      anchor.position.copy(surfacePos);
      globeGroup.add(anchor);

      // B. Beacon stalk
      const stalkPoints = [surfacePos, elevatedPos];
      const stalkGeo = new THREE.BufferGeometry().setFromPoints(stalkPoints);
      const stalkMat = new THREE.LineBasicMaterial({
        color: 0xd94332,
        transparent: true,
        opacity: 0.85
      });
      const stalk = new THREE.Line(stalkGeo, stalkMat);
      globeGroup.add(stalk);

      // C. Elevated Glowing Beacon Node
      const nodeGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xff4b36 });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(elevatedPos);
      globeGroup.add(nodeMesh);

      // D. Concentric Pulsing Wave Rings on the surface
      const ringGeo = new THREE.RingGeometry(0.8, 1.4, 28);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd94332,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(surfacePos.clone().multiplyScalar(1.002));
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), surfacePos.clone().normalize());
      globeGroup.add(ringMesh);

      s.waveRings.push({
        mesh: ringMesh,
        hubId: hub.id,
        baseScale: 1,
        timeOffset: Math.random() * 2
      });

      // E. Invisible Hit Sphere for pointer interaction
      const hitGeo = new THREE.SphereGeometry(4.5, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitSphere = new THREE.Mesh(hitGeo, hitMat);
      hitSphere.position.copy(elevatedPos);
      hitSphere.userData = { hub };
      globeGroup.add(hitSphere);
      s.hubHitSpheres.push(hitSphere);
    });

    // 12. Global Gateway Hub Markers
    GLOBAL_HUBS.forEach(ghub => {
      const pos = latLonToVector3(ghub.lat, ghub.lon, 100);
      const gGeo = new THREE.SphereGeometry(1.0, 10, 10);
      const gMat = new THREE.MeshBasicMaterial({ color: 0x91897c });
      const gMesh = new THREE.Mesh(gGeo, gMat);
      gMesh.position.copy(pos);
      globeGroup.add(gMesh);
    });

    // 13. Strategic Network Arcs (Great Circle Bezier Curves)
    s.arcCurves = [];
    s.pulseMeshes = [];

    // Helper to add an arc
    const addRouteArc = (h1, h2, colorHex, opacity, peakAlt, speed) => {
      if (!h1 || !h2) return;
      const v1 = latLonToVector3(h1.lat, h1.lon, 100);
      const v2 = latLonToVector3(h2.lat, h2.lon, 100);
      const { points, curve } = createArc(v1, v2, 100, peakAlt, isMobile ? 36 : 54);

      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
        depthWrite: false
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);

      // Animated glowing signal photon
      const pulseGeo = new THREE.SphereGeometry(1.3, 10, 10);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: colorHex === 0xd94332 ? 0xff4b36 : 0xd8cbbe,
        transparent: true,
        opacity: 0.95
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      globeGroup.add(pulseMesh);

      s.pulseMeshes.push({
        mesh: pulseMesh,
        curve,
        speed,
        progress: Math.random()
      });
    };

    // Internal Indian routes
    INDIA_ROUTES.forEach(([id1, id2], index) => {
      const h1 = hubsMap.get(id1);
      const h2 = hubsMap.get(id2);
      addRouteArc(h1, h2, 0xd94332, 0.72, 14, 0.0035 + (index % 3) * 0.001);
    });

    // Global partner routes (spider-web mesh)
    GLOBAL_ROUTES.forEach(([id1, id2], index) => {
      const h1 = hubsMap.get(id1);
      const h2 = hubsMap.get(id2);
      addRouteArc(h1, h2, 0xbaa894, 0.38, 26, 0.0025 + (index % 2) * 0.0008);
    });

    // 14. Celestial Orbit Rings with Satellite Data Nodes
    const createOrbitRing = (radius, tiltX, tiltZ, speed) => {
      const segments = isMobile ? 48 : 84;
      const ringPts = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xcec6b8,
        transparent: true,
        opacity: 0.32
      });
      const ringLine = new THREE.Line(ringGeo, ringMat);
      ringLine.rotation.x = tiltX;
      ringLine.rotation.z = tiltZ;
      globeGroup.add(ringLine);

      // Satellite node
      const satGeo = new THREE.SphereGeometry(1.4, 8, 8);
      const satMat = new THREE.MeshBasicMaterial({ color: 0xd94332 });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      ringLine.add(satMesh);

      s.satelliteMeshes.push({
        mesh: satMesh,
        radius,
        speed,
        angle: Math.random() * Math.PI * 2
      });
    };

    createOrbitRing(122, 0.41, 0.25, 0.008);
    createOrbitRing(136, -0.65, -0.35, -0.006);

    // 15. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !s.renderer || !s.camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      s.camera.aspect = w / h;
      s.camera.position.z = w < 600 ? 275 : 255;
      s.camera.updateProjectionMatrix();
      s.renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 16. Visibility & Viewport Intersection (Stop rendering when tab is hidden or hero is scrolled offscreen)
    const handleVisibilityChange = () => {
      s.isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const viewportObserver = new IntersectionObserver(([entry]) => {
      s.isInViewport = entry.isIntersecting;
    }, { threshold: 0.05 });
    viewportObserver.observe(container);

    // 17. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      s.animationFrameId = requestAnimationFrame(animate);

      // Save 100% GPU/CPU when tab is hidden or hero is off-screen
      if (!s.isTabVisible || !s.isInViewport) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth auto-rotation when not dragging
      const idleTime = Date.now() - s.lastInteractionTime;
      const shouldAutoRotate = isRotating && !isReducedMotion && !s.isDragging && idleTime > 1800;

      if (shouldAutoRotate) {
        s.targetRotY += 0.0016; // Elegant slow drift
      }

      // Smooth inertial interpolation towards target rotation
      const lerpFactor = s.isDragging ? 0.22 : 0.08;
      s.currentRotX += (s.targetRotX - s.currentRotX) * lerpFactor;
      s.currentRotY += (s.targetRotY - s.currentRotY) * lerpFactor;

      // Subtle desktop mouse parallax
      const targetParallaxX = s.mouseParallax.x * 0.06;
      const targetParallaxY = s.mouseParallax.y * 0.04;

      if (globeGroup) {
        globeGroup.rotation.x = s.currentRotX + targetParallaxY;
        globeGroup.rotation.y = s.currentRotY + targetParallaxX;
      }

      // Live coordinate readout calculation based on Y rotation
      const lonDeg = (((-s.currentRotY - 2.932) * (180 / Math.PI)) % 360 + 360) % 360;
      const activeLon = Math.round((lonDeg > 180 ? lonDeg - 360 : lonDeg) * 10) / 10;
      setReadoutCoords(`28°36' N · ${Math.abs(activeLon)}° ${activeLon >= 0 ? 'E' : 'W'}`);

      // Animate flowing pulses along arcs
      if (!isReducedMotion) {
        s.pulseMeshes.forEach(item => {
          item.progress = (item.progress + item.speed) % 1;
          const pos = item.curve.getPoint(item.progress);
          item.mesh.position.copy(pos);
        });

        // Animate pulsing wave rings around tech hubs
        s.waveRings.forEach(item => {
          const t = (time + item.timeOffset) % 2.0;
          const scale = 1.0 + t * 2.8;
          item.mesh.scale.set(scale, scale, 1);
          item.mesh.material.opacity = Math.max(0, 0.85 * (1 - t / 2.0));
        });

        // Animate orbit satellites
        s.satelliteMeshes.forEach(sat => {
          sat.angle += sat.speed;
          sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
          sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 18. Cleanup on unmount
    return () => {
      if (s.animationFrameId) {
        cancelAnimationFrame(s.animationFrameId);
      }
      resizeObserver.disconnect();
      viewportObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Deep disposal of geometries & materials
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      glowTexture.dispose();
      renderer.dispose();
    };
  }, [webGLSupported, isRotating, isReducedMotion, hubsMap]);

  // Pointer Drag Interaction
  const handlePointerDown = (e) => {
    const s = stateRef.current;
    s.isDragging = true;
    s.dragStart = { x: e.clientX, y: e.clientY };
    s.lastInteractionTime = Date.now();
  };

  const handlePointerMove = (e) => {
    const s = stateRef.current;

    // Desktop parallax tracking
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      s.mouseParallax = { x: normX, y: normY };

      // Raycasting for city hover
      if (s.camera && s.hubHitSpheres.length > 0 && !s.isDragging) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(normX, normY), s.camera);
        const intersects = raycaster.intersectObjects(s.hubHitSpheres);

        if (intersects.length > 0) {
          const hit = intersects[0].object.userData.hub;
          setHoveredHub(hit);
          // Calculate screen position for tooltip
          const worldPos = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPos);
          worldPos.project(s.camera);
          const screenX = ((worldPos.x + 1) * rect.width) / 2;
          const screenY = ((-worldPos.y + 1) * rect.height) / 2;
          setTooltipPos({ x: screenX, y: screenY });
        } else {
          setHoveredHub(null);
          setTooltipPos(null);
        }
      }
    }

    if (!s.isDragging) return;

    const deltaX = e.clientX - s.dragStart.x;
    const deltaY = e.clientY - s.dragStart.y;
    s.dragStart = { x: e.clientX, y: e.clientY };
    s.lastInteractionTime = Date.now();

    s.targetRotY += deltaX * 0.006;
    s.targetRotX = Math.max(-0.6, Math.min(0.6, s.targetRotX + deltaY * 0.006));
  };

  const handlePointerUp = () => {
    const s = stateRef.current;
    s.isDragging = false;
    s.lastInteractionTime = Date.now();
  };

  // Focus City on Click
  const focusHub = useCallback((hub) => {
    setActiveHub(hub);
    setHoveredHub(null);
    setTooltipPos(null);
    const s = stateRef.current;
    s.lastInteractionTime = Date.now();

    if (!hub) {
      // Reset to India default
      s.targetRotX = 0.22;
      s.targetRotY = -2.932;
      return;
    }

    const { rotX, rotY } = getFocusRotation(hub.lat, hub.lon);
    s.targetRotX = rotX;
    s.targetRotY = rotY;
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const s = stateRef.current;
    s.lastInteractionTime = Date.now();
    if (e.key === 'ArrowLeft') s.targetRotY -= 0.1;
    if (e.key === 'ArrowRight') s.targetRotY += 0.1;
    if (e.key === 'ArrowUp') s.targetRotX = Math.min(0.6, s.targetRotX + 0.1);
    if (e.key === 'ArrowDown') s.targetRotX = Math.max(-0.6, s.targetRotX - 0.1);
    if (e.key === ' ') {
      e.preventDefault();
      setIsRotating(r => !r);
    }
  };

  if (!webGLSupported) {
    return (
      <div className={`globe-hero-container ${className}`}>
        <GlobeFallback reason="unsupported" />
      </div>
    );
  }

  const selectedDisplayHub = hoveredHub || activeHub;

  return (
    <div
      className={`globe-hero-container ${className}`}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Interactive 3D India Network Globe"
    >
      {/* Top HUD Status Bar */}
      <div className="globe-hud-top">
        <div className="hud-badge">
          <span className="hud-dot live" />
          <span className="hud-title">ETHIXWEB INDIA · DISTRIBUTED NETWORK</span>
        </div>
        <div className="hud-controls">
          <button
            type="button"
            className="hud-btn"
            onClick={(e) => {
              e.stopPropagation();
              focusHub(null);
            }}
            title="Center on India"
            aria-label="Center on India"
          >
            <RotateCcw size={13} />
            <span>FOCUS INDIA</span>
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsRotating(r => !r);
            }}
            title={isRotating ? 'Pause rotation' : 'Start rotation'}
            aria-label={isRotating ? 'Pause rotation' : 'Start rotation'}
          >
            {isRotating ? <Pause size={13} /> : <Play size={13} />}
            <span>{isRotating ? 'PAUSE' : 'ROTATE'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="globe-canvas" />

      {/* Floating City Inspection Tooltip */}
      {hoveredHub && tooltipPos && (
        <div
          className="globe-tooltip"
          style={{
            transform: `translate(${tooltipPos.x}px, ${tooltipPos.y - 12}px)`
          }}
          role="status"
          aria-live="polite"
        >
          <div className="tooltip-head">
            <span className="tooltip-code">{hoveredHub.code}</span>
            <strong className="tooltip-name">{hoveredHub.name}</strong>
          </div>
          <div className="tooltip-role">{hoveredHub.role}</div>
          <div className="tooltip-meta">
            <span><Zap size={11} /> {hoveredHub.ping}</span>
            <span><ShieldCheck size={11} /> {hoveredHub.nodes} NODES</span>
          </div>
        </div>
      )}

      {/* Active Hub Telemetry Card (Shown when a hub is clicked or active) */}
      {selectedDisplayHub && (
        <div className="globe-active-card">
          <div className="card-top">
            <span className="card-code">{selectedDisplayHub.code}</span>
            <span className="card-status">{selectedDisplayHub.status}</span>
          </div>
          <div className="card-title">{selectedDisplayHub.name}</div>
          <p className="card-desc">{selectedDisplayHub.role}</p>
          <div className="card-stats">
            <div>
              <span className="stat-label">LATENCY</span>
              <span className="stat-val">{selectedDisplayHub.ping}</span>
            </div>
            <div>
              <span className="stat-label">NETWORK NODES</span>
              <span className="stat-val">{selectedDisplayHub.nodes} Active</span>
            </div>
            <div>
              <span className="stat-label">LOCATION</span>
              <span className="stat-val">{selectedDisplayHub.lat.toFixed(2)}°N, {selectedDisplayHub.lon.toFixed(2)}°E</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom HUD: City Selector Pills & Live Geocoord readout */}
      <div className="globe-hud-bottom">
        <div className="hud-pills">
          <button
            type="button"
            className={`hud-pill ${!activeHub ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              focusHub(null);
            }}
          >
            ALL HUBS
          </button>
          {HUBS.map(hub => (
            <button
              key={hub.id}
              type="button"
              className={`hud-pill ${activeHub?.id === hub.id ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                focusHub(hub);
              }}
            >
              {hub.name}
            </button>
          ))}
        </div>
        <div className="hud-readout">
          <Activity size={12} className="pulse-icon" />
          <span>{readoutCoords}</span>
        </div>
      </div>
    </div>
  );
}
