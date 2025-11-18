
        import * as THREE from 'three';

        // Configuración básica
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x1a1a2e, 10, 30);

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(8, 5, 12);

        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0x0a0a15, 1);
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Suelo
        const groundGeo = new THREE.CircleGeometry(20, 64);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: 0x2d3a2d,
            roughness: 0.9,
            metalness: 0
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Iluminación
        const ambient = new THREE.AmbientLight(0x404060, 0.3);
        scene.add(ambient);

        const moonLight = new THREE.DirectionalLight(0xb8c5ff, 0.4);
        moonLight.position.set(10, 20, 5);
        moonLight.castShadow = true;
        moonLight.shadow.camera.left = -15;
        moonLight.shadow.camera.right = 15;
        moonLight.shadow.camera.top = 15;
        moonLight.shadow.camera.bottom = -15;
        scene.add(moonLight);

        // TIPI
        function createTipi() {
            const tipi = new THREE.Group();

            // Palos estructurales
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

            // Luz interior
            const interiorLight = new THREE.PointLight(0xffa040, 0.8, 8);
            interiorLight.position.set(0, 1.5, 0);
            tipi.add(interiorLight);

            tipi.position.set(0, 0, -2);
            return tipi;
        }

        scene.add(createTipi());

        // FOGATA
        function createCampfire() {
            const campfire = new THREE.Group();

            // Piedras
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

            // Fuego
            const fireGroup = new THREE.Group();
            
            // Núcleo
            const coreGeo = new THREE.SphereGeometry(0.25, 16, 16);
            const coreMat = new THREE.MeshStandardMaterial({
                color: 0xffff00,
                emissive: 0xffff00,
                emissiveIntensity: 2
            });
            const core = new THREE.Mesh(coreGeo, coreMat);
            core.position.y = 0.5;
            fireGroup.add(core);

            // Llamas naranjas
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

            // Llamas rojas
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

            // Luz del fuego
            const fireLight = new THREE.PointLight(0xff5500, 3, 12);
            fireLight.position.y = 1;
            fireLight.castShadow = true;
            campfire.add(fireLight);

            campfire.userData = { fireGroup, fireLight };
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

            // Anillos
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

        // ÁRBOLES
        function createTree(x, z) {
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
            return tree;
        }

        scene.add(createTree(-8, -5));
        scene.add(createTree(-6, -8));
        scene.add(createTree(7, -6));
        scene.add(createTree(8, -9));

        // Control de mouse
        let mouseX = 0;
        let mouseY = 0;
        
        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Animación
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.016;

            // Fuego animado
            const fireGroup = campfire.userData.fireGroup;
            const fireLight = campfire.userData.fireLight;
            
            if (fireGroup && fireLight) {
                fireGroup.rotation.y = time * 0.5;
                fireGroup.scale.y = 1 + Math.sin(time * 3) * 0.1;
                
                const flicker = 2.5 + Math.sin(time * 5) * 0.3 + Math.random() * 0.2;
                fireLight.intensity = flicker;
                fireLight.distance = 10 + Math.sin(time * 2) * 1;
            }

            // Cámara sigue el mouse suavemente
            camera.position.x += (mouseX * 2 - camera.position.x + 8) * 0.05;
            camera.position.y += (mouseY * 1 - camera.position.y + 5) * 0.05;
            camera.lookAt(0, 1, 0);

            renderer.render(scene, camera);
        }

        animate();

        // Responsive
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
  