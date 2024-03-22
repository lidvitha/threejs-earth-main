import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const marsGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const marsMaterial = new THREE.MeshPhongMaterial({ color: 0xff5733 });
const marsTexture = loader.load("./textures/mars.jpg"); // Load texture for Mars
marsMaterial.map = marsTexture; // Apply texture to Mars material
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
marsMesh.position.set(3, 0, 0); // Position relative to the Earth
scene.add(marsMesh);

const venusGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const venusMaterial = new THREE.MeshPhongMaterial({ color: 0xffcc80 });
const venusTexture = loader.load("./textures/venus.jpg"); // Load texture for Venus
venusMaterial.map = venusTexture; // Apply texture to Venus material
const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
venusMesh.position.set(-4, 0, 0); // Position relative to the Earth
scene.add(venusMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

// Scale the geometries of Mars and Venus to make them more visible
marsMesh.scale.setScalar(1.2);
venusMesh.scale.setScalar(1.);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  // Update information text based on time of day
  // ...

  // Day-Night Cycle Animation
  // ...

  // Clouds Movement Animation
  // ...

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animatePlanets() {
    requestAnimationFrame(animatePlanets);

    marsMesh.rotation.y += 0.005; // Adjust rotation speed as needed
    venusMesh.rotation.y += 0.003;
}

animatePlanets();
window.addEventListener('resize', handleWindowResize, false);
