import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const VRChatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mountRef = useRef(null);
    const [bitmojiUrl, setBitmojiUrl] = useState(null);

    useEffect(() => {
        // Function to initialize Snap Login
        const initSnapLogin = () => {
            window.snapKitInit = () => {
                const loginButton = document.createElement("div");
                loginButton.id = "snap-login-btn";
                document.body.appendChild(loginButton);

                window.snap.loginkit.mountButton("snap-login-btn", {
                    clientId: "YOUR_SNAP_CLIENT_ID",
                    redirectURI: "YOUR_REDIRECT_URI",
                    scopeList: ["user.display_name", "user.bitmoji.avatar"],
                    handleResponseCallback: (response) => {
                        fetch("https://kit.snapchat.com/v1/me", {
                            headers: { Authorization: `Bearer ${response.access_token}` },
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.bitmoji) {
                                    setBitmojiUrl(data.bitmoji.avatar);
                                }
                            });
                    },
                });
            };

            const script = document.createElement("script");
            script.src = "https://sdk.snapkit.com/js/v1/login.js";
            script.async = true;
            document.body.appendChild(script);
        };

        initSnapLogin();

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5dc);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = true;

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        // Floor
        const floorTexture = new THREE.TextureLoader().load("/textures/wood-floor.jpg");
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(5, 5);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ map: floorTexture }));
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        // Avatar placeholders
        const avatarMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const avatar = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), avatarMaterial);
        avatar.position.set(-2, 1, 0);
        scene.add(avatar);

        const loadBitmoji = () => {
            if (!bitmojiUrl) return;

            new THREE.TextureLoader().load(bitmojiUrl, (texture) => {
                avatar.material = new THREE.MeshStandardMaterial({ map: texture });
                avatar.material.needsUpdate = true;
            });
        };

        loadBitmoji();

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [bitmojiUrl]);

    return <div ref={mountRef}></div>;
};

export default VRChatPage;
