import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export default function CampingScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current; // Save ref for cleanup
    
    // Configuración básica
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 35);

    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.3,
      1000
    );
    // Cámara fija enfrente del letrero grande
    camera.position.set(4, 2.5, -8);
    camera.lookAt(4, 2.5, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0a0a15, 1);
    container.appendChild(renderer.domElement);
    // ensure the container can position the overlay
    container.style.position = 'relative';

    // Controles libres (Pointer Lock / WASD fly)
    const controls = new PointerLockControls(camera, renderer.domElement);
    const moveState = { forward: false, backward: false, left: false, right: false, up: false, down: false };
    const speed = 8; // unidades por segundo
    const clock = new THREE.Clock();

    // Overlay con instrucciones para bloquear el puntero
    const blocker = document.createElement('div');
    const instructions = document.createElement('div');
    blocker.style.position = 'absolute';
    blocker.style.top = '0';
    blocker.style.left = '0';
    blocker.style.width = '100%';
    blocker.style.height = '100%';
    blocker.style.display = 'flex';
    blocker.style.alignItems = 'center';
    blocker.style.justifyContent = 'center';
    blocker.style.background = 'rgba(0,0,0,0.25)';
    blocker.style.zIndex = '999';
    instructions.style.padding = '12px 18px';
    instructions.style.background = 'rgba(0,0,0,0.5)';
    instructions.style.color = '#fff';
    instructions.style.fontFamily = 'sans-serif';
    instructions.style.borderRadius = '6px';
    instructions.style.cursor = 'pointer';
    instructions.innerText = 'Click to lock pointer — WASD to move, Space/C to up/down, Esc to unlock';
    blocker.appendChild(instructions);
    container.appendChild(blocker);

  const lockInstructions = () => controls.lock();
    // Request pointer lock on the renderer canvas (user gesture)
    instructions.addEventListener('click', () => renderer.domElement.requestPointerLock());
    const onLock = () => { blocker.style.display = 'none'; };
    const onUnlock = () => { blocker.style.display = 'flex'; };
    controls.addEventListener('lock', onLock);
    controls.addEventListener('unlock', onUnlock);

    // Teclado
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': moveState.forward = true; break;
        case 'KeyS': moveState.backward = true; break;
        case 'KeyA': moveState.left = true; break;
        case 'KeyD': moveState.right = true; break;
        case 'Space': moveState.up = true; break;
        case 'KeyC': moveState.down = true; break;
        default: break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': moveState.forward = false; break;
        case 'KeyS': moveState.backward = false; break;
        case 'KeyA': moveState.left = false; break;
        case 'KeyD': moveState.right = false; break;
        case 'Space': moveState.up = false; break;
        case 'KeyC': moveState.down = false; break;
        default: break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Permitir hacer click en letreros también cuando el puntero está bloqueado
    const handleLockedClick = () => {
      if (!controls.isLocked) return;
      mouse.x = 0;
      mouse.y = 0;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects);
      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        if (clicked.userData.clickable && clicked.userData.url) {
          window.open(clicked.userData.url, '_blank');
        }
      }
    };
    document.addEventListener('mousedown', handleLockedClick);
    // also close default click handler while locked to avoid duplicates
    const pauseWindowClickWhileLocked = (e) => {
      if (controls.isLocked) e.stopPropagation();
    };
    window.addEventListener('click', pauseWindowClickWhileLocked, true);

    // Suelo con textura de hierba
    const groundGeo = new THREE.CircleGeometry(25, 64);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x2d3a2d,
      roughness: 0.9,
      metalness: 0
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Iluminación nocturna
    const ambient = new THREE.AmbientLight(0x404060, 0.3);
    scene.add(ambient);

    const moonLight = new THREE.DirectionalLight(0xb8c5ff, 0.5);
    moonLight.position.set(15, 25, 10);
    moonLight.castShadow = true;
    moonLight.shadow.camera.left = -20;
    moonLight.shadow.camera.right = 20;
    moonLight.shadow.camera.top = 20;
    moonLight.shadow.camera.bottom = -20;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    scene.add(moonLight);

    // TIPI MEJORADO
    function createTipi() {
      const tipi = new THREE.Group();

      // Estructura de palos
      const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 6, 8);
      const poleMat = new THREE.MeshStandardMaterial({ 
        color: 0x3d2817,
        roughness: 0.8 
      });

      const poleCount = 12;
      const radius = 2.2;

      for (let i = 0; i < poleCount; i++) {
        const angle = (i / poleCount) * Math.PI * 2;
        const pole = new THREE.Mesh(poleGeo, poleMat);
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        pole.position.set(x * 0.3, 3, z * 0.3);
        pole.rotation.z = Math.atan2(x, 6) * 0.8;
        pole.rotation.x = Math.atan2(z, 6) * 0.8;
        pole.castShadow = true;
        
        tipi.add(pole);
      }

      // Tela del tipi
      const fabricGeo = new THREE.ConeGeometry(3.2, 5.5, 32, 1, true);
      const fabricMat = new THREE.MeshStandardMaterial({
        color: 0xe8d4b0,
        roughness: 0.85,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const fabric = new THREE.Mesh(fabricGeo, fabricMat);
      fabric.position.y = 2.75;
      fabric.castShadow = true;
      fabric.receiveShadow = true;
      tipi.add(fabric);

      // Decoración
      const detailGeo = new THREE.RingGeometry(2, 2.3, 32);
      const detailMat = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const detail = new THREE.Mesh(detailGeo, detailMat);
      detail.position.y = 2;
      detail.rotation.x = Math.PI / 2;
      tipi.add(detail);

      // Entrada
      const doorShape = new THREE.Shape();
      doorShape.moveTo(0, 0);
      doorShape.lineTo(0.8, 0);
      doorShape.lineTo(0.8, 1.5);
      doorShape.lineTo(0.4, 2);
      doorShape.lineTo(0, 1.5);
      doorShape.lineTo(0, 0);

      const doorGeo = new THREE.ShapeGeometry(doorShape);
      const doorMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(-0.4, 0.1, 3.15);
      tipi.add(door);

      // Luz interior del tipi
      const interiorLight = new THREE.PointLight(0xffa040, 1.2, 10);
      interiorLight.position.set(0, 1.5, 0);
      interiorLight.castShadow = true;
      tipi.add(interiorLight);

      tipi.position.set(0, 0, -2);
      return tipi;
    }

    scene.add(createTipi());

    // FOGATA MEJORADA
    function createCampfire() {
      const campfire = new THREE.Group();

      // Base de piedras
      const stoneGeo = new THREE.DodecahedronGeometry(0.3, 0);
      const stoneMat = new THREE.MeshStandardMaterial({ 
        color: 0x555555,
        roughness: 0.9 
      });

      for (let i = 0; i < 8; i++) {
        const stone = new THREE.Mesh(stoneGeo, stoneMat);
        const angle = (i / 8) * Math.PI * 2;
        stone.position.set(
          Math.cos(angle) * 1.2,
          0.15,
          Math.sin(angle) * 1.2
        );
        stone.scale.set(
          0.8 + Math.random() * 0.4,
          0.6 + Math.random() * 0.3,
          0.8 + Math.random() * 0.4
        );
        stone.rotation.set(
          Math.random() * 0.5,
          Math.random() * Math.PI * 2,
          Math.random() * 0.5
        );
        stone.castShadow = true;
        campfire.add(stone);
      }

      // Troncos
      const logGeo = new THREE.CylinderGeometry(0.12, 0.15, 1.8, 8);
      const logMat = new THREE.MeshStandardMaterial({ 
        color: 0x2d1810,
        roughness: 0.9 
      });

      for (let i = 0; i < 4; i++) {
        const log = new THREE.Mesh(logGeo, logMat);
        const angle = (i / 4) * Math.PI * 2;
        log.position.set(
          Math.cos(angle) * 0.3,
          0.3,
          Math.sin(angle) * 0.3
        );
        log.rotation.z = Math.PI / 2;
        log.rotation.y = angle;
        log.castShadow = true;
        campfire.add(log);
      }

      // Fuego (múltiples capas)
      const fireGroup = new THREE.Group();
      
      const coreGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 2
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.5;
      fireGroup.add(core);

      const flame1Geo = new THREE.ConeGeometry(0.4, 1, 8);
      const flame1Mat = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
      });
      const flame1 = new THREE.Mesh(flame1Geo, flame1Mat);
      flame1.position.y = 0.8;
      fireGroup.add(flame1);

      const flame2Geo = new THREE.ConeGeometry(0.5, 1.3, 8);
      const flame2Mat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.6
      });
      const flame2 = new THREE.Mesh(flame2Geo, flame2Mat);
      flame2.position.y = 0.7;
      fireGroup.add(flame2);

      campfire.add(fireGroup);
      campfire.userData.fireGroup = fireGroup;

      // Luz del fuego
      const fireLight = new THREE.PointLight(0xff5500, 4, 15);
      fireLight.position.y = 1;
      fireLight.castShadow = true;
      fireLight.shadow.camera.near = 0.1;
      fireLight.shadow.camera.far = 15;
      campfire.add(fireLight);
      campfire.userData.fireLight = fireLight;

      campfire.position.set(0, 0, 3.5);
      return campfire;
    }

    const campfire = createCampfire();
    scene.add(campfire);

    // TRONCOS PARA SENTARSE
    function createSeatLog(x, z, rotation = 0) {
      const log = new THREE.Group();

      const bodyGeo = new THREE.CylinderGeometry(0.35, 0.38, 2.5, 16);
      const bodyMat = new THREE.MeshStandardMaterial({ 
        color: 0x5a3825,
        roughness: 0.8 
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      log.add(body);

      const ringGeo = new THREE.TorusGeometry(0.36, 0.05, 8, 16);
      const ringMat = new THREE.MeshStandardMaterial({ 
        color: 0x3d2415 
      });
      
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.position.y = 1.2;
      ring1.rotation.x = Math.PI / 2;
      log.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.position.y = -1.2;
      ring2.rotation.x = Math.PI / 2;
      log.add(ring2);

      log.rotation.z = Math.PI / 2;
      log.rotation.y = rotation;
      log.position.set(x, 0.35, z);

      return log;
    }

    scene.add(createSeatLog(2.5, 4, 0));
    scene.add(createSeatLog(-2.5, 4, 0));
    scene.add(createSeatLog(0, 2.2, Math.PI / 2));
    scene.add(createSeatLog(0, 5, Math.PI / 2));

    // ÁRBOLES DE FONDO
    function createTree(x, z, scale = 1) {
      const tree = new THREE.Group();

      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 3, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ 
        color: 0x3d2817 
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.5;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageGeo = new THREE.ConeGeometry(1.5, 3, 8);
      const foliageMat = new THREE.MeshStandardMaterial({ 
        color: 0x1a3d1a 
      });
      
      const foliage1 = new THREE.Mesh(foliageGeo, foliageMat);
      foliage1.position.y = 3.5;
      foliage1.castShadow = true;
      tree.add(foliage1);

      const foliage2 = new THREE.Mesh(foliageGeo, foliageMat);
      foliage2.position.y = 4.5;
      foliage2.scale.set(0.7, 0.7, 0.7);
      tree.add(foliage2);

      tree.position.set(x, 0, z);
      tree.scale.setScalar(scale);
      return tree;
    }

    scene.add(createTree(-10, -5, 1.2));
    scene.add(createTree(-7, -8, 1));
    scene.add(createTree(9, -6, 1.1));
    scene.add(createTree(10, -10, 1.3));
    scene.add(createTree(-12, 2, 0.9));
    scene.add(createTree(11, 3, 1));

    // LETREROS INTERACTIVOS
    const clickableObjects = [];

    function createWoodenSign(text, x, z, rotation = 0, url = '#') {
      const sign = new THREE.Group();

      const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 2, 8);
      const poleMat = new THREE.MeshStandardMaterial({ 
        color: 0x4a2f1a,
        roughness: 0.9 
      });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 1;
      pole.castShadow = true;
      sign.add(pole);

      const boardGeo = new THREE.BoxGeometry(1.5, 0.5, 0.1);
      const boardMat = new THREE.MeshStandardMaterial({ 
        color: 0x8b5a3c,
        roughness: 0.8 
      });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.position.y = 2.2;
      board.castShadow = true;
      sign.add(board);

      const borderGeo = new THREE.BoxGeometry(1.6, 0.6, 0.08);
      const borderMat = new THREE.MeshStandardMaterial({ 
        color: 0x3d2415,
        roughness: 0.9 
      });
      const border = new THREE.Mesh(borderGeo, borderMat);
      border.position.y = 2.2;
      border.position.z = -0.01;
      sign.add(border);

      // Canvas para el texto
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#2d1810';
      ctx.font = 'bold 100px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.toUpperCase(), canvas.width / 2 + 3, canvas.height / 2 + 3);
      
      ctx.fillStyle = '#f5e6d3';
      ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const textGeo = new THREE.PlaneGeometry(1.4, 0.4);
      const textMat = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      const textMesh = new THREE.Mesh(textGeo, textMat);
      textMesh.position.y = 2.2;
      textMesh.position.z = 0.06;
      sign.add(textMesh);

      // Clavos
      const nailGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8);
      const nailMat = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.6 
      });

      const nailPositions = [
        [-0.65, 2.4, 0.06],
        [0.65, 2.4, 0.06],
        [-0.65, 2.0, 0.06],
        [0.65, 2.0, 0.06]
      ];

      nailPositions.forEach(pos => {
        const nail = new THREE.Mesh(nailGeo, nailMat);
        nail.position.set(...pos);
        nail.rotation.x = Math.PI / 2;
        sign.add(nail);
      });

      sign.position.set(x, 0, z);
      sign.rotation.y = rotation;
      
      board.userData = { clickable: true, url: url, text: text };
      clickableObjects.push(board);
      
      return sign;
    }

    scene.add(createWoodenSign('GitHub', -3.5, 3.5, 1, 'usu'));
    scene.add(createWoodenSign('CV', -5, 7, 1, ''));
    scene.add(createWoodenSign('Contacto', -6.5, 8.5, 1, ''));

    const nuevoletrerogrande = [];
      function createLargeSign(text, x, z, rotation = 2, url = '#') {
        const largeSign = new THREE.Group();
        // const letrero = new THREE.Group();
        
        const poleGeo = new THREE.CylinderGeometry(0.12, 0.15, 3, 8);
        const poleMat = new THREE.MeshStandardMaterial({
          color: 0x4a2f1a,
          roughness: 0.9 
        });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 1.5;
        pole.castShadow = true;
        largeSign.add(pole);

        const boardGeo = new THREE.BoxGeometry(5, 2.5, 0.2);
        const boardMat = new THREE.MeshStandardMaterial({
          color: 0x8b5a3c,
          roughness: 0.8 
        });
        const board = new THREE.Mesh(boardGeo, boardMat);
        board.position.y = 3;
        board.castShadow = true;
        largeSign.add(board);

        const borderGeo = new THREE.BoxGeometry(5.3, 2.8, 0.12);
        const borderMat = new THREE.MeshStandardMaterial({
          color: 0x3d2415,
          roughness: 0.9
        });
        const border = new THREE.Mesh(borderGeo, borderMat);
        border.position.y = 3;
        border.position.z = -0.02;
        largeSign.add(border);
        
        // Canvas para el texto
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#2d1810';
        ctx.font = 'bold 280px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.toUpperCase(), canvas.width / 2 + 8, canvas.height / 2 + 8);
        
        ctx.fillStyle = '#f5e6d3';
        ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const textGeo = new THREE.PlaneGeometry(4.8, 2.3);
        const textMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.position.y = 3;
        textMesh.position.z = 0.12;
        largeSign.add(textMesh);

        // Clavos
        const nailGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.07, 8);
        const nailMat = new THREE.MeshStandardMaterial({
          color: 0x1a1a1a,
          metalness: 0.6 
        });

        const nailPositions = [
          [-2.4, 4, 0.12],
          [2.4, 4, 0.12],
          [-2.4, 2, 0.12],
          [2.4, 2, 0.12]
        ];

        nailPositions.forEach(pos => {
          const nail = new THREE.Mesh(nailGeo, nailMat);
          nail.position.set(...pos);
          nail.rotation.x = Math.PI / 2;
          largeSign.add(nail);
        });

        largeSign.position.set(x, 0, z);
        largeSign.rotation.y = rotation;

        board.userData = { clickable: true, url: url, text: text };
        clickableObjects.push(board);
        nuevoletrerogrande.push(largeSign);
        return largeSign;
      }

    scene.add(createLargeSign('Camp', 4, 4.5, Math.PI / 3 , '#'));

    // Sistema de detección de clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObject = null;

    const handleSignMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects);

        if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        hoveredObject = intersects[0].object;
        const mat = hoveredObject.material;
        if (mat && 'emissive' in mat) {
          mat.emissive = new THREE.Color(0x442211);
          if ('emissiveIntensity' in mat) mat.emissiveIntensity = 0.4;
        }
      } else {
        document.body.style.cursor = 'default';
        if (hoveredObject) {
          const mat = hoveredObject.material;
          if (mat && 'emissive' in mat) {
            mat.emissive = new THREE.Color(0x000000);
            if ('emissiveIntensity' in mat) mat.emissiveIntensity = 0;
          }
          hoveredObject = null;
        }
      }
    };

    const handleSignClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        if (clicked.userData.clickable && clicked.userData.url) {
          window.open(clicked.userData.url, '_blank');
        }
      }
    };

    window.addEventListener('mousemove', handleSignMouseMove);
    window.addEventListener('click', handleSignClick);

    // Animación
    let time = 0;

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      // Fuego animado
      const fireGroup = campfire.userData.fireGroup;
      const fireLight = campfire.userData.fireLight;
      if (fireGroup && fireLight) {
        fireGroup.rotation.y = time * 0.5;
        fireGroup.scale.y = 1 + Math.sin(time * 3) * 0.1;

        const flicker = 3.5 + Math.sin(time * 5) * 0.4 + Math.random() * 0.3;
        fireLight.intensity = flicker;
        fireLight.distance = 13 + Math.sin(time * 2) * 1;
      }

      // Cámara fija enfrente del letrero - sin movimiento
      camera.position.set(4, 2.5, -8);
      camera.lookAt(4, 2.5, 0);

      renderer.render(scene, camera);
    }

    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleSignMouseMove);
      window.removeEventListener('click', handleSignClick);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousedown', handleLockedClick);
      window.removeEventListener('click', pauseWindowClickWhileLocked, true);
      instructions.removeEventListener('click', lockInstructions);
      controls.removeEventListener('lock', onLock);
      controls.removeEventListener('unlock', onUnlock);
      // quitar overlay
      if (blocker.parentNode === container) {
        container.removeChild(blocker);
      }
      // remove renderer
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      // dispose renderer
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(to bottom, #0a0a15 0%, #1a1a2e 100%)'
      }} 
    />
  );
}