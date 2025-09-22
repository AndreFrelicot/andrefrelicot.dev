"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeCube({ width, height }: { width?: number; height?: number } = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 400, height: 260 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentMouseRotationRef = useRef({ x: 0, y: 0 });
  const scrollRotationRef = useRef({ x: 0, y: 0 });
  const targetScrollRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const baseRotationRef = useRef({ x: 0, y: 0 });
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const faceAnimationsRef = useRef<Array<{ opacity: number; startTime: number; active: boolean; looping: boolean }>>(
    Array.from({ length: 6 }, () => ({ opacity: 0, startTime: 0, active: false, looping: false }))
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Array<{ oscillator: OscillatorNode | null; gainNode: GainNode | null }>>(
    Array.from({ length: 6 }, () => ({ oscillator: null, gainNode: null }))
  );
  const lastFrameTimeRef = useRef(Date.now());
  const confettiRef = useRef<Array<{
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    angularVelocity: THREE.Vector3;
    startTime: number;
  }>>([]);
  const confettiActiveRef = useRef(false);
  const htmlConfettiRef = useRef<HTMLDivElement[]>([]);
  const spotlightsRef = useRef<Array<{
    light: THREE.SpotLight;
    helper?: THREE.SpotLightHelper;
    angle: number;
    speed: number;
    radius: number;
    height: number;
  }>>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate responsive dimensions
    const getResponsiveDimensions = () => {
      if (width && height) {
        return { width, height };
      }

      const containerWidth = container.clientWidth || container.offsetWidth;
      const maxWidth = Math.min(containerWidth, 600); // Max width of 600px
      const aspectRatio = 400 / 260; // Default aspect ratio

      return {
        width: maxWidth,
        height: maxWidth / aspectRatio
      };
    };

    const updateDimensions = () => {
      const newDimensions = getResponsiveDimensions();
      dimensionsRef.current = newDimensions;
      return newDimensions;
    };

    const initialDimensions = updateDimensions();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, initialDimensions.width / initialDimensions.height, 0.1, 100);
    camera.position.z = 2.3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(initialDimensions.width, initialDimensions.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/af16bits.jpg", () => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy?.() ?? 1;

    // Create individual materials for each face
    const materials = Array.from({ length: 6 }, () =>
      new THREE.MeshStandardMaterial({ map: texture })
    );
    materialsRef.current = materials;

    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true;
    cube.receiveShadow = true;

    // Add subtle edge outlines so the cube silhouette remains visible in low light
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
    });
    const edgeOverlay = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edgeOverlay.raycast = () => {
      // Ignore the outline for interaction so clicks continue targeting cube faces
    };
    cube.add(edgeOverlay);

    // Initialize raycaster
    raycasterRef.current = new THREE.Raycaster();
    scene.add(cube);

    // Face base frequencies (musical notes: C4, D4, E4, F4, G4, A4)
    const baseFrequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];

    const ensureAudioContext = async (): Promise<AudioContext | null> => {
      if (typeof window === "undefined") return null;

      const anyWindow = window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      };
      const AudioContextCtor = window.AudioContext ?? anyWindow.webkitAudioContext;

      if (!AudioContextCtor) {
        console.warn("WebAudio not supported in this browser.");
        return null;
      }

      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new AudioContextCtor();
        } catch (error) {
          console.warn("WebAudio not supported:", error);
          return null;
        }
      }

      const context = audioContextRef.current;

      if (context.state === "suspended") {
        try {
          await context.resume();
        } catch (error) {
          console.warn("Failed to resume AudioContext:", error);
          return null;
        }
      }

      return context;
    };

    const createOscillator = (faceIndex: number, context: AudioContext) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(baseFrequencies[faceIndex], context.currentTime);

      gainNode.gain.setValueAtTime(0.1, context.currentTime); // Low volume

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start();

      oscillatorsRef.current[faceIndex] = { oscillator, gainNode };
    };

    const stopOscillator = (faceIndex: number) => {
      const { oscillator, gainNode } = oscillatorsRef.current[faceIndex];
      if (oscillator && gainNode) {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
        oscillatorsRef.current[faceIndex] = { oscillator: null, gainNode: null };
      }
    };

    const checkAllFacesActive = () => {
      return faceAnimationsRef.current.every(animation => animation.looping);
    };

    const createConfetti = () => {
      if (confettiActiveRef.current) return;

      confettiActiveRef.current = true;
      const confettiColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7, 0xa29bfe];
      const particleCount = 100;

      for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.PlaneGeometry(0.08, 0.08);
        const material = new THREE.MeshBasicMaterial({
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          side: THREE.DoubleSide
        });
        const particle = new THREE.Mesh(geometry, material);

        // Start from cube center with random spread
        particle.position.set(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        );

        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.015 + 0.01,
          (Math.random() - 0.5) * 0.02
        );

        const angularVelocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        );

        confettiRef.current.push({
          mesh: particle,
          velocity,
          angularVelocity,
          startTime: Date.now()
        });

        scene.add(particle);
      }

      // Auto-cleanup after 4 seconds
      setTimeout(() => {
        confettiActiveRef.current = false;
      }, 4000);
    };

    const createHtmlConfetti = () => {
      const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          width: 8px;
          height: 8px;
          background-color: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
          pointer-events: none;
          z-index: 1000;
          border-radius: 2px;
          animation: confetti-fall ${2 + Math.random() * 2}s ease-out forwards;
        `;

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        particle.style.left = `${centerX + (Math.random() - 0.5) * 50}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--random-x', `${(Math.random() - 0.5) * 600}px`);
        particle.style.setProperty('--random-y', `${-200 - Math.random() * 300}px`);
        particle.style.setProperty('--random-rotation', `${Math.random() * 1080}deg`);

        document.body.appendChild(particle);
        htmlConfettiRef.current.push(particle);

        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
          const index = htmlConfettiRef.current.indexOf(particle);
          if (index > -1) {
            htmlConfettiRef.current.splice(index, 1);
          }
        }, 4000);
      }
    };

    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    const directional = new THREE.DirectionalLight(0xffffff, 0.1);
    directional.position.set(2, 2, 3);
    scene.add(ambient);
    scene.add(directional);

    // Create 3 orbital spotlights
    for (let i = 0; i < 3; i++) {
      const spotlight = new THREE.SpotLight(
        0xffffff,      // White color
        2.0,           // intensity
        15,             // distance
        Math.PI / 2,   // angle (wider cone)
        0.3,           // penumbra (softer edges)
        1              // decay
      );

      // Enable shadows
      spotlight.castShadow = true;
      spotlight.shadow.mapSize.width = 1024;
      spotlight.shadow.mapSize.height = 1024;
      spotlight.shadow.camera.near = 0.5;
      spotlight.shadow.camera.far = 10;

      // Set target to cube center
      spotlight.target.position.set(0, 0, 0);

      // Random orbital parameters
      const orbitData = {
        light: spotlight,
        angle: (i / 3) * Math.PI * 2 + Math.random() * Math.PI, // Start at different angles
        speed: 0.01 + Math.random() * 0.05, // Random speed between 0.008-0.020
        radius: 2.0 + Math.random() * 1.0, // Random radius between 2.0-3.0
        height: -0.5 + Math.random() * 1.0, // Random height between -0.5 and 0.5
      };

      spotlightsRef.current.push(orbitData);
      scene.add(spotlight);
      scene.add(spotlight.target); // Important: add the target to the scene
    }

    const resize = () => {
      if (!containerRef.current) return;
      const newDimensions = updateDimensions();
      camera.aspect = newDimensions.width / newDimensions.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newDimensions.width, newDimensions.height);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentDimensions = dimensionsRef.current;
      mouseRef.current.x = ((event.clientX - rect.left) / currentDimensions.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / currentDimensions.height) * 2 + 1;

      targetRotationRef.current.x = mouseRef.current.y * 0.3;
      targetRotationRef.current.y = mouseRef.current.x * 0.3;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const normalizedScroll = maxScroll > 0 ? scrollY / maxScroll : 0;

      targetScrollRef.current = normalizedScroll;
    };

    const handlePointerDown = () => {
      void ensureAudioContext();
    };

    const handleTouchStart = () => {
      void ensureAudioContext();
    };

    const handleClick = async (event: MouseEvent) => {
      if (!raycasterRef.current) return;

      const rect = container.getBoundingClientRect();
      const currentDimensions = dimensionsRef.current;
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / currentDimensions.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / currentDimensions.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouse, camera);
      const intersects = raycasterRef.current.intersectObject(cube, true);
      const faceHit = intersects.find((intersection) => intersection.face);

      if (faceHit && faceHit.face) {
        const faceIndex = faceHit.face.materialIndex;
        const animation = faceAnimationsRef.current[faceIndex];

        if (animation.looping) {
          // Stop looping and fade to 0%
          animation.looping = false;
          animation.active = true;
          animation.startTime = Date.now();
          animation.opacity = animation.opacity; // Keep current opacity as starting point

          // Stop audio
          stopOscillator(faceIndex);
        } else {
          // Start looping animation
          animation.looping = true;
          animation.active = true;
          animation.startTime = Date.now();
          animation.opacity = 1.0;

          // Start audio
          const context = await ensureAudioContext();
          if (context) {
            createOscillator(faceIndex, context);
          }
        }
      }
    };

    const animate = () => {
      const currentTime = Date.now();
      const delta = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;

      // Update base rotation continuously
      baseRotationRef.current.x += delta * 0.8;
      baseRotationRef.current.y += delta * 1.2;

      // Smoothly interpolate mouse rotation to prevent jumps
      currentMouseRotationRef.current.x += (targetRotationRef.current.x - currentMouseRotationRef.current.x) * 0.1;
      currentMouseRotationRef.current.y += (targetRotationRef.current.y - currentMouseRotationRef.current.y) * 0.1;

      // Smoothly interpolate scroll rotation
      smoothScrollRef.current += (targetScrollRef.current - smoothScrollRef.current) * 0.08;

      // Calculate scroll rotation from smooth value
      scrollRotationRef.current.x = smoothScrollRef.current * Math.PI * 2;
      scrollRotationRef.current.y = smoothScrollRef.current * Math.PI * 1.5;

      // Update orbital spotlights
      spotlightsRef.current.forEach((spotData) => {
        spotData.angle += spotData.speed;

        // Calculate orbital position
        const x = Math.cos(spotData.angle) * spotData.radius;
        const z = Math.sin(spotData.angle) * spotData.radius;
        const y = spotData.height + Math.sin(spotData.angle * 2) * 0.3; // Add some vertical motion

        spotData.light.position.set(x, y, z);
      });

      // Check for confetti trigger
      if (checkAllFacesActive() && !confettiActiveRef.current) {
        createConfetti();
        createHtmlConfetti();
      }

      // Update confetti particles
      confettiRef.current = confettiRef.current.filter(particle => {
        const elapsed = (currentTime - particle.startTime) / 1000;

        if (elapsed > 4) {
          scene.remove(particle.mesh);
          particle.mesh.geometry.dispose();
          (particle.mesh.material as THREE.Material).dispose();
          return false;
        }

        // Apply gravity and update position
        particle.velocity.y -= 0.0008; // gravity
        particle.mesh.position.add(particle.velocity);

        // Apply rotation
        particle.mesh.rotation.x += particle.angularVelocity.x;
        particle.mesh.rotation.y += particle.angularVelocity.y;
        particle.mesh.rotation.z += particle.angularVelocity.z;

        return true;
      });

      // Update face tint animations
      faceAnimationsRef.current.forEach((animation, index) => {
        if (animation.active) {
          const elapsed = currentTime - animation.startTime;
          const duration = 500; // 0.5 seconds in milliseconds

          if (animation.looping) {
            // Looping animation: cycle from 100% to 0% repeatedly
            const progress = (elapsed % duration) / duration;
            animation.opacity = 1.0 - progress;
          } else {
            // Single fade to 0% animation
            if (elapsed >= duration) {
              // Animation complete - stop at 0%
              animation.active = false;
              animation.opacity = 0;
            } else {
              // Calculate current opacity (current to 0.0 over 0.5 seconds)
              const startOpacity = animation.opacity;
              animation.opacity = startOpacity * (1.0 - (elapsed / duration));
            }
          }

          // Apply red tint with calculated opacity
          const tintAmount = animation.opacity;
          materials[index].color.setRGB(1, 1 - tintAmount, 1 - tintAmount);
          materials[index].needsUpdate = true;

          // Update audio frequency based on opacity
          const oscillatorData = oscillatorsRef.current[index];
          if (oscillatorData.oscillator && audioContextRef.current) {
            // Map opacity (0-1) to frequency range (base frequency to base + 200Hz)
            const baseFreq = baseFrequencies[index];
            const frequency = baseFreq + (animation.opacity * 200);
            oscillatorData.oscillator.frequency.setValueAtTime(
              frequency,
              audioContextRef.current.currentTime
            );
          }
        } else if (!animation.looping) {
          // Ensure material is reset when not animating
          materials[index].color.setRGB(1, 1, 1);
        }
      });

      // Combine base rotation with smooth mouse influence and scroll rotation
      cube.rotation.x = baseRotationRef.current.x + currentMouseRotationRef.current.x + scrollRotationRef.current.x;
      cube.rotation.y = baseRotationRef.current.y + currentMouseRotationRef.current.y + scrollRotationRef.current.y;

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Set up ResizeObserver for better responsive handling
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("click", handleClick);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("click", handleClick);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      // Clean up audio - capture current ref values
      const oscillatorsSnapshot = oscillatorsRef.current.map((entry) => ({
        oscillator: entry.oscillator,
        gainNode: entry.gainNode,
      }));
      const currentAudioContext = audioContextRef.current;
      oscillatorsSnapshot.forEach((oscillatorData, index) => {
        const { oscillator, gainNode } = oscillatorData;
        if (oscillator && gainNode) {
          oscillator.stop();
          oscillator.disconnect();
          gainNode.disconnect();
        }
        oscillatorsSnapshot[index] = { oscillator: null, gainNode: null };
      });
      oscillatorsRef.current = oscillatorsSnapshot;
      if (currentAudioContext) {
        currentAudioContext.close();
      }

      // Clean up confetti
      confettiRef.current.forEach(particle => {
        scene.remove(particle.mesh);
        particle.mesh.geometry.dispose();
        (particle.mesh.material as THREE.Material).dispose();
      });
      confettiRef.current = [];

      // Clean up HTML confetti
      htmlConfettiRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      htmlConfettiRef.current = [];

      // Clean up spotlights
      spotlightsRef.current.forEach(spotData => {
        scene.remove(spotData.light);
        scene.remove(spotData.light.target);
        spotData.light.dispose();
      });
      spotlightsRef.current = [];

      renderer.dispose();
      geometry.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      // Dispose of all individual materials
      materialsRef.current.forEach(material => material.dispose());
      texture.dispose();
      if (container?.firstChild) container.removeChild(container.firstChild as Node);
    };
  }, [width, height]);

  return (
    <>
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(var(--random-y)) translateX(calc(var(--random-x) * 0.7)) rotate(calc(var(--random-rotation) * 0.5));
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--random-x)) rotate(var(--random-rotation));
            opacity: 0;
          }
        }
      `}</style>
      <div ref={containerRef} className="mx-auto w-full max-w-[600px]" />
    </>
  );
}

export default ThreeCube;
