import { useEffect, useRef } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const VRChatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mountRef = useRef(null);

    useEffect(() => {
        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5dc); // Light beige for a warm coffee shop feel

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 8); // Start above the floor

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        // Prevent the camera from going below the ground
        controls.addEventListener("change", () => {
            if (camera.position.y < 1) {
                camera.position.y = 1;
            }
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Warmer lighting
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        // Floor (Wood Texture)
        const floorTexture = new THREE.TextureLoader().load("/textures/wood-floor.jpg", () => {
            renderer.render(scene, camera);
        });
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(5, 5);
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        // Walls (Coffee Shop Style)
        const wallTexture = new THREE.TextureLoader().load("/textures/brick-wall.jpg", () => {
            renderer.render(scene, camera);
        });
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 4);
        const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

        const walls = [];
        const wallSize = { width: 20, height: 5, depth: 0.2 };

        // Create walls
        const wall1 = new THREE.Mesh(new THREE.BoxGeometry(wallSize.width, wallSize.height, wallSize.depth), wallMaterial);
        wall1.position.set(0, 2.5, -10);
        scene.add(wall1);

        const wall2 = new THREE.Mesh(new THREE.BoxGeometry(wallSize.width, wallSize.height, wallSize.depth), wallMaterial);
        wall2.position.set(0, 2.5, 10);
        scene.add(wall2);

        const wall3 = new THREE.Mesh(new THREE.BoxGeometry(wallSize.depth, wallSize.height, wallSize.width), wallMaterial);
        wall3.position.set(-10, 2.5, 0);
        scene.add(wall3);

        const wall4 = new THREE.Mesh(new THREE.BoxGeometry(wallSize.depth, wallSize.height, wallSize.width), wallMaterial);
        wall4.position.set(10, 2.5, 0);
        scene.add(wall4);

        scene.add(wall1, wall2, wall3, wall4);

        // Coffee Counter
        const counterTexture = new THREE.TextureLoader().load("/textures/marble-counter.jpg", () => {
            renderer.render(scene, camera);
        });
        const counterMaterial = new THREE.MeshStandardMaterial({ map: counterTexture });
        const counterGeometry = new THREE.BoxGeometry(6, 1, 2);
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(0, 0.5, 8);
        scene.add(counter);

        // Counter Woman (Avatar)
        const womanBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.5, 32), new THREE.MeshStandardMaterial({ color: 0xffc1cc })); // Light pink dress
        womanBody.position.set(-1, 1, 8);
        scene.add(womanBody);

        const womanHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffe0bd })); // Skin tone
        womanHead.position.set(-1, 1.9, 8);
        scene.add(womanHead);

        const womanHair = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshStandardMaterial({ color: 0x3d2b1f })); // Brown hair
        womanHair.position.set(-1, 2.1, 8);
        scene.add(womanHair);

        // Add point light near the avatar for a soft glow
        const avatarLight = new THREE.PointLight(0xffd5b0, 0.5, 3);
        avatarLight.position.set(-1, 1.8, 8);
        scene.add(avatarLight);


        // Tables and Chairs
        const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Wooden table
        const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const table1 = new THREE.Mesh(tableGeometry, tableMaterial);
        table1.position.set(-3, 0.5, -3);
        scene.add(table1);

        const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F }); // Dark green chairs
        const chairGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
        const chair1 = new THREE.Mesh(chairGeometry, chairMaterial);
        chair1.position.set(-3.5, 0.5, -3.5);
        scene.add(chair1);

        const chair2 = new THREE.Mesh(chairGeometry, chairMaterial);
        chair2.position.set(-2.5, 0.5, -3.5);
        scene.add(chair2);

        // Hanging Lights
        const lightGeometry = new THREE.SphereGeometry(0.2);
        const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFFD700 });
        const light1 = new THREE.Mesh(lightGeometry, lightMaterial);
        light1.position.set(-3, 4, -3);
        scene.add(light1);

        const pointLight1 = new THREE.PointLight(0xFFD700, 1, 10);
        pointLight1.position.set(-3, 4, -3);
        scene.add(pointLight1);

        // Plants in the Shop
        const vaseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const vaseMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 }); // Dark green vase
        const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
        vase.position.set(-8, 0.5, -8);
        scene.add(vase);

        const plantGeometry = new THREE.SphereGeometry(0.5);
        const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x008000 }); // Green plant
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.set(-8, 1.5, -8);
        scene.add(plant);

        // Avatars
        const avatar1Material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const avatar1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), avatar1Material);
        avatar1.position.set(-2, 1, 0);
        scene.add(avatar1);

        const avatar2Material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        const avatar2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), avatar2Material);
        avatar2.position.set(2, 1, 0);
        scene.add(avatar2);

        // Roof (Wooden Ceiling)
        const roofTexture = new THREE.TextureLoader().load("/textures/wood-ceiling.jpg");
        roofTexture.wrapS = THREE.RepeatWrapping;
        roofTexture.wrapT = THREE.RepeatWrapping;
        roofTexture.repeat.set(4, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ map: roofTexture });

        const roof = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), roofMaterial);
        roof.rotation.x = Math.PI / 2;
        roof.position.y = 5;
        scene.add(roof);

        // Chandelier Base
        const chandelierGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.2, 32);
        const chandelierMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37 }); // Gold color
        const chandelier = new THREE.Mesh(chandelierGeometry, chandelierMaterial);
        chandelier.position.set(0, 4.8, 0);
        scene.add(chandelier);

        // Chandelier Lights (Bulbs)
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshStandardMaterial({ color: 0xFFFF00, emissive: 0xFFFF00 }));
            bulb.position.set(Math.cos(angle) * 0.5, 4.6, Math.sin(angle) * 0.5);
            scene.add(bulb);

            const bulbLight = new THREE.PointLight(0xFFFFAA, 0.8, 5);
            bulbLight.position.set(Math.cos(angle) * 0.5, 4.6, Math.sin(angle) * 0.5);
            scene.add(bulbLight);
        }

        const closeButton = document.createElement("button");
		closeButton.innerText = "Close VR";
		closeButton.style.position = "absolute";
		closeButton.style.top = "20px";
		closeButton.style.right = "20px";
		closeButton.style.padding = "10px 20px";
		closeButton.style.backgroundColor = "#ff4757";
		closeButton.style.color = "#fff";
		closeButton.style.border = "none";
		closeButton.style.borderRadius = "5px";
		closeButton.style.cursor = "pointer";
		closeButton.addEventListener("click", () => {navigate(`/chat/${id}`);location.reload();});
		document.body.appendChild(closeButton);


        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef}></div>;
};

export default VRChatPage;