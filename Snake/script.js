// Configuration de base pour Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);
document.getElementById('game-container').appendChild(renderer.domElement);

// Lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Matériaux et géométries
const snakeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const foodMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const segmentGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const foodGeometry = new THREE.SphereGeometry(0.5, 32, 32);

// Crée le serpent
let snake = [];
for (let i = 0; i < 5; i++) {
    const segment = new THREE.Mesh(segmentGeometry, snakeMaterial);
    segment.position.set(i, 0, 0);
    snake.push(segment);
    scene.add(segment);
}

// Crée la nourriture
const food = new THREE.Mesh(foodGeometry, foodMaterial);
food.position.set(Math.floor(Math.random() * 20 - 10), 0, Math.floor(Math.random() * 20 - 10));
scene.add(food);

// Position de la caméra
camera.position.z = 10;

// Direction du serpent
let direction = new THREE.Vector3(1, 0, 0);
let newDirection = new THREE.Vector3(1, 0, 0);

// Gestion des touches
document.addEventListener('keydown', (event) => {
    console.log(`Key pressed: ${event.key}`);
    if (event.key === 'ArrowUp' && direction.z === 0) newDirection.set(0, 0, -1);
    if (event.key === 'ArrowDown' && direction.z === 0) newDirection.set(0, 0, 1);
    if (event.key === 'ArrowLeft' && direction.x === 0) newDirection.set(-1, 0, 0);
    if (event.key === 'ArrowRight' && direction.x === 0) newDirection.set(1, 0, 0);
});

// Boucle d'animation
function animate() {
    requestAnimationFrame(animate);

    // Déplacement du serpent
    if (direction.x !== -newDirection.x || direction.z !== -newDirection.z) {
        direction.copy(newDirection);
    }

    const newSegment = snake.pop();
    const head = snake[0];
    newSegment.position.copy(head.position).add(direction);
    snake.unshift(newSegment);

    // Debugging: Add visual markers
    console.log(`Head position: ${newSegment.position.x}, ${newSegment.position.y}, ${newSegment.position.z}`);
    console.log(`Food position: ${food.position.x}, ${food.position.y}, ${food.position.z}`);

    // Vérifie si le serpent mange la nourriture
    if (newSegment.position.distanceTo(food.position) < 0.5) {
        const newSegment = new THREE.Mesh(segmentGeometry, snakeMaterial);
        newSegment.position.copy(snake[snake.length - 1].position).sub(direction);
        snake.push(newSegment);
        scene.add(newSegment);

        food.position.set(Math.floor(Math.random() * 20 - 10), 0, Math.floor(Math.random() * 20 - 10));
    }

    // Vérifie les collisions avec les murs
    if (Math.abs(newSegment.position.x) > 10 || Math.abs(newSegment.position.z) > 10) {
        console.log('Collision with wall detected.');
        alert('Game Over! Press OK to restart.');
        window.location.reload();
    }

    // Rendu de la scène
    renderer.render(scene, camera);
}

animate();
