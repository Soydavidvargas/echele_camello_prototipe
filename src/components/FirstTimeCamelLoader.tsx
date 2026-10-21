import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FirstTimeCamelLoaderProps {
  onFinish: () => void;
}

export const FirstTimeCamelLoader: React.FC<FirstTimeCamelLoaderProps> = ({ onFinish }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Ensillando el camello...');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x161617);
    scene.fog = new THREE.FogExp2(0x161617, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff1e6, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xff7a50, 1.6);
    sunLight.position.set(5, 8, 4);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(0xffa500, 2, 20);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // 3. Desert Ground
    const groundGeo = new THREE.PlaneGeometry(40, 40, 32, 32);
    // Add subtle dune ripples
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      pos.setZ(i, Math.sin(vx * 0.4) * 0.25 + Math.cos(vy * 0.4) * 0.25);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x222225,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 4. Procedural 3D Stylized Camel Model
    const camelGroup = new THREE.Group();

    // Material for camel (Warm Colombian Terracotta Sand)
    const camelMat = new THREE.MeshStandardMaterial({
      color: 0xf05023,
      roughness: 0.6,
      metalness: 0.15,
    });
    const detailMat = new THREE.MeshStandardMaterial({
      color: 0x1d1d1f,
      roughness: 0.8,
    });
    const clothMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      roughness: 0.4,
    });

    // Body
    const bodyGeo = new THREE.BoxGeometry(2.2, 1.2, 1.1);
    const body = new THREE.Mesh(bodyGeo, camelMat);
    body.position.y = 0.5;
    body.castShadow = true;
    camelGroup.add(body);

    // Humps
    const humpGeo = new THREE.ConeGeometry(0.5, 0.75, 16);
    const hump1 = new THREE.Mesh(humpGeo, camelMat);
    hump1.position.set(-0.45, 1.35, 0);
    camelGroup.add(hump1);

    const hump2 = new THREE.Mesh(humpGeo, camelMat);
    hump2.position.set(0.45, 1.35, 0);
    camelGroup.add(hump2);

    // Saddle / Colombian Manta
    const blanketGeo = new THREE.BoxGeometry(1.4, 0.1, 1.25);
    const blanket = new THREE.Mesh(blanketGeo, clothMat);
    blanket.position.set(0, 1.1, 0);
    camelGroup.add(blanket);

    // Long Neck
    const neckGeo = new THREE.BoxGeometry(0.45, 1.3, 0.45);
    const neck = new THREE.Mesh(neckGeo, camelMat);
    neck.position.set(1.1, 1.2, 0);
    neck.rotation.z = -0.4;
    camelGroup.add(neck);

    // Head
    const headGeo = new THREE.BoxGeometry(0.7, 0.45, 0.5);
    const head = new THREE.Mesh(headGeo, camelMat);
    head.position.set(1.65, 1.8, 0);
    camelGroup.add(head);

    // Muzzle / Snout
    const muzzleGeo = new THREE.BoxGeometry(0.4, 0.35, 0.4);
    const muzzle = new THREE.Mesh(muzzleGeo, detailMat);
    muzzle.position.set(2.0, 1.75, 0);
    camelGroup.add(muzzle);

    // Ears
    const earGeo = new THREE.ConeGeometry(0.1, 0.25, 8);
    const earL = new THREE.Mesh(earGeo, camelMat);
    earL.position.set(1.4, 2.05, 0.2);
    camelGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, camelMat);
    earR.position.set(1.4, 2.05, -0.2);
    camelGroup.add(earR);

    // Articulated Legs (Leg groups for walking animation)
    const legGeo = new THREE.BoxGeometry(0.22, 1.3, 0.22);

    const legFL = new THREE.Group();
    const meshFL = new THREE.Mesh(legGeo, camelMat);
    meshFL.position.y = -0.65;
    legFL.add(meshFL);
    legFL.position.set(0.7, 0.1, 0.45);
    camelGroup.add(legFL);

    const legFR = new THREE.Group();
    const meshFR = new THREE.Mesh(legGeo, camelMat);
    meshFR.position.y = -0.65;
    legFR.add(meshFR);
    legFR.position.set(0.7, 0.1, -0.45);
    camelGroup.add(legFR);

    const legBL = new THREE.Group();
    const meshBL = new THREE.Mesh(legGeo, camelMat);
    meshBL.position.y = -0.65;
    legBL.add(meshBL);
    legBL.position.set(-0.7, 0.1, 0.45);
    camelGroup.add(legBL);

    const legBR = new THREE.Group();
    const meshBR = new THREE.Mesh(legGeo, camelMat);
    meshBR.position.y = -0.65;
    legBR.add(meshBR);
    legBR.position.set(-0.7, 0.1, -0.45);
    camelGroup.add(legBR);

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.7);
    const tail = new THREE.Mesh(tailGeo, detailMat);
    tail.position.set(-1.15, 0.4, 0);
    tail.rotation.z = 0.5;
    camelGroup.add(tail);

    camelGroup.position.set(0, -0.1, 0);
    camelGroup.rotation.y = Math.PI / 4; // 3/4 isometric perspective
    scene.add(camelGroup);

    // 5. Animation Loop
    let animationFrameId: number;
    let startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;

      // Walking gait swing
      const walkSpeed = 5.5;

      legFL.rotation.z = Math.sin(t * walkSpeed) * 0.45;
      legBR.rotation.z = Math.sin(t * walkSpeed + 0.5) * 0.45;
      legFR.rotation.z = -Math.sin(t * walkSpeed) * 0.45;
      legBL.rotation.z = -Math.sin(t * walkSpeed + 0.5) * 0.45;

      // Natural camel bobbing
      body.position.y = 0.5 + Math.abs(Math.sin(t * walkSpeed * 2)) * 0.08;
      head.position.y = 1.8 + Math.sin(t * walkSpeed) * 0.06;
      tail.rotation.x = Math.sin(t * 4) * 0.2;

      // Gentle continuous rotation
      camelGroup.rotation.y = Math.PI / 4 + Math.sin(t * 0.5) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Simulated Loading Progress
    const phrases = [
      'Ensillando el camello...',
      'Conectando con la base de datos MySQL en XAMPP...',
      'Cotejando antecedentes ante la Policía Nacional...',
      'Verificando certificados SENA y pólizas colectivas...',
      '¡Todo listo para camellar con berraquera!',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 20;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 600);
          return 100;
        }
        currentStep = Math.min(Math.floor(next / 20), phrases.length - 1);
        setLoadingText(phrases[currentStep]);
        return next;
      });
    }, 600);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#161617] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden">
      {/* Top Bar Branding */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f05023] to-[#e03d10] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight font-display text-white block leading-none">
              Échele Camello
            </span>
            <span className="text-[10px] text-[#86868b] tracking-wider uppercase font-semibold">
              Técnicos & Maestros de Colombia
            </span>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-full border border-white/15 transition-all cursor-pointer flex items-center gap-1.5 apple-press"
        >
          <span>Saltar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Three.js 3D Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      />

      {/* Bottom Progress Bar & Colombian Cultural Quote */}
      <div className="relative z-10 max-w-md mx-auto w-full text-center space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-[#f05023] tracking-wider uppercase">
            Experiencia Interactiva 3D
          </p>
          <h2 className="text-xl font-bold font-display text-white">
            {loadingText}
          </h2>
          <p className="text-xs text-[#86868b]">
            Dignificando la mano de obra colombiana con tecnología, garantía y seguridad.
          </p>
        </div>

        {/* Apple Style Segmented Progress */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#f05023] to-[#ffaa00] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(240,80,35,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-[#86868b] font-mono tabular-nums block">
          {progress}% completado
        </span>
      </div>
    </div>
  );
};
