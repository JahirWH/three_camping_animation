import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
// color del fondo de la ecena
// scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 4, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true,  alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 0); // <-- 0 significa 100% transparente

// Controles
const controls = new OrbitControls(camera, renderer.domElement);

// Suelo
const planeGeo = new THREE.PlaneGeometry(30, 30);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x2e4b2e });
const ground = new THREE.Mesh(planeGeo, planeMat);
ground.rotation.x = -Math.PI / 2;
// scene.add(ground); sin suelo

// Luces
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const moonLight = new THREE.PointLight(0xffffff, 1, 50);
moonLight.position.set(10, 15, 10);
scene.add(moonLight);

function createTipi() {

    const tipi = new THREE.Group();

    // --- 1. CUERPO DEL TIPI (cono) ---
    const tipiGeo = new THREE.ConeGeometry(
        3,      // radio base
        4,      // altura
        64,     // segmentos (smooth)
        1,
        true     // openEnded = true (abierto abajo)
    );

    const tipiMat = new THREE.MeshStandardMaterial({
        color: 0xd8b484,    // beige tela
        roughness: 0.9,
        metalness: 0,
        side: THREE.DoubleSide   // visible desde dentro
    });

    const tipiMesh = new THREE.Mesh(tipiGeo, tipiMat);
    tipiMesh.position.y = 2; // altura correcta
    tipiMesh.position.z = -1;
    tipi.add(tipiMesh);

    // --- 2. PUERTA (corte frontal) ---
    // Es un arco oscuro que simula apertura y elimina parte visual del cono

    const doorGeo = new THREE.CylinderGeometry(
        1.1, 1.1,         // radio arriba-abajo
        1,              // altura de la puerta
        22,               // suave
        1,
        true              // sin tapas
    );
    const doorMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
    });

    const door = new THREE.Mesh(doorGeo, doorMat);
    door.rotation.z = Math.PI / 2;      // giramos para que quede vertical
    door.rotation.y = Math.PI;          // cara hacia enfrente
    door.position.set(0, 0.4, 1.6);     // colocamos en la parte frontal del cono

    tipi.add(door);

    // --- 3. PALOS SUPERIORES DEL TIPI ---
    const stickGeo = new THREE.CylinderGeometry(0.07, 0.07, 5, 8);
    const stickMat = new THREE.MeshStandardMaterial({ color: 0x4c2e05 });

    const stick1 = new THREE.Mesh(stickGeo, stickMat);
    stick1.position.set(0.5, 3.3, 0);
    stick1.rotation.z = 0.5;
    tipi.add(stick1);

    const stick2 = new THREE.Mesh(stickGeo, stickMat);
    stick2.position.set(-0.5, 3.3, 0);
    stick2.rotation.z = -0.5;
    tipi.add(stick2);

    const stick3 = new THREE.Mesh(stickGeo, stickMat);
    stick3.position.set(0, 3.3, 0.5);
    stick3.rotation.x = 0.5;
    tipi.add(stick3);

    return tipi;
}
scene.add(createTipi());

// scene.add(createHut());

// Fogata (leños + “fuego”)
function createCampfire() {
    const campfire = new THREE.Group();

    // Troncos en cruz
    const logGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const logMat = new THREE.MeshStandardMaterial({ color: 0x4b2e04 });

    const log1 = new THREE.Mesh(logGeo, logMat);
    log1.rotation.z = Math.PI / 4;

    const log2 = new THREE.Mesh(logGeo, logMat);
    log2.rotation.z = -Math.PI / 4;

    campfire.add(log1, log2);

    // Fuego (solo una esfera brillante por ahora)
    const fireGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const fireMat = new THREE.MeshStandardMaterial({ emissive: 0xff5500, emissiveIntensity: 2 });
    const fire = new THREE.Mesh(fireGeo, fireMat);
    fire.position.y = 0.3;

    campfire.add(fire);

    // Luz del fuego
    const fireLight = new THREE.PointLight(0xff5500, 2, 5);
    fireLight.position.y = 1;
    campfire.add(fireLight);

    campfire.position.set(0, 0, 5);
    return campfire;
}

scene.add(createCampfire());

// Troncos para sentarse
function createSeatLog(x, z) {
    const geo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0x6b3f0a });
    const log = new THREE.Mesh(geo, mat);

    log.rotation.z = Math.PI / 2;
    log.position.set(x, 0.3, z);

    return log;
}

scene.add(createSeatLog(2, 4));
scene.add(createSeatLog(-2, 4));
scene.add(createSeatLog(0, 3));

// Animación (parpadeo del fuego)
function animate() {
    requestAnimationFrame(animate);

    // Luz de fogata animada
    const intensity = 1.8 + Math.random() * 0.3;
    const fireLight = scene.getObjectByProperty("type", "PointLight");
    if (fireLight) fireLight.intensity = intensity;

    controls.update();
    renderer.render(scene, camera);
}

animate();
