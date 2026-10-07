const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const mouseForceRadius = 100;
const mouseForceStrength = 10**6;
let lastMouse = { x: undefined, y: undefined };

const randSize = (size = 1, offset = 0) => size * Math.random() - offset
const randColor = () => `rgba(${randSize(255)}, ${randSize(255)}, ${randSize(255)}, ${randSize()})`
const distance = (x1, y1, x2, y2) => Math.sqrt((x1-x2)**2 + (y1-y2)**2)
const c = canvas.getContext('2d')
let lastTime = performance.now();

let fps = 0;
const mouse = {
    x: undefined,
    y: undefined,
}

window.addEventListener('mousemove', (e) => {
    if (mouse.x !== undefined && mouse.y !== undefined) {
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', (e) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    init()
})

addEventListener('click', e => {
    init()
})

class Circle {
    constructor(x=10, y=10, ux=1, uy=1, g=10, e=1, radius=10, strokeColor='black', fillColor='white') {
        this.x = x
        this.y = y
        this.ux = ux
        this.uy = uy
        this.radius = radius
        this.strokeColor = strokeColor
        this.fillColor = fillColor
        this.g = g
        this.e = e
        this.mass = radius**2; // mass ∝ area (assuming 2D)
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        c.strokeStyle = this.strokeColor
        c.fillStyle = this.fillColor
        c.stroke()
        c.fill()
    }

    update(dt=1, circleArray=[]) {
        const neighbors = [];
        const xCell = Math.floor(this.x / GRID_SIZE);
        const yCell = Math.floor(this.y / GRID_SIZE);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const key = `${xCell + dx},${yCell + dy}`;
                if (grid.has(key)) {
                    neighbors.push(...grid.get(key));
                }
            }
        }

        for (const other of neighbors) {
            if (this === other) continue;
        
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.hypot(dx, dy);
            const minDist = this.radius + other.radius;
        
            if (dist < minDist) {
                const nx = dx / dist;
                const ny = dy / dist;
            
                // Tangent vector
                const tx = -ny;
                const ty = nx;
            
                // Dot product tangent
                const dpTan1 = this.ux * tx + this.uy * ty;
                const dpTan2 = other.ux * tx + other.uy * ty;
            
                // Dot product normal
                const dpNorm1 = this.ux * nx + this.uy * ny;
                const dpNorm2 = other.ux * nx + other.uy * ny;
            
                // 1D elastic collision response
                const m1 = this.mass;
                const m2 = other.mass;
                const restitution = (this.e + other.e) / 2

                const rawNorm1 = (dpNorm1 * (m1 - m2) + 2 * m2 * dpNorm2) / (m1 + m2);
                const rawNorm2 = (dpNorm2 * (m2 - m1) + 2 * m1 * dpNorm1) / (m1 + m2);      
                const newNorm1 = rawNorm1 * restitution;
                const newNorm2 = rawNorm2 * restitution;

                this.ux = tx * dpTan1 + nx * newNorm1;
                this.uy = ty * dpTan1 + ny * newNorm1;
                other.ux = tx * dpTan2 + nx * newNorm2;
                other.uy = ty * dpTan2 + ny * newNorm2;
            
                // Fully separate circles
                const overlap = minDist - dist + 0.1;
                const totalMass = this.mass + other.mass;
                const ratio1 = other.mass / totalMass;
                const ratio2 = this.mass / totalMass;
            
                this.x -= overlap * nx * ratio1;
                this.y -= overlap * ny * ratio1;
                other.x += overlap * nx * ratio2;
                other.y += overlap * ny * ratio2;
            }
        }

        // Apply outward force from mouse
        if (mouse.x !== lastMouse.x || mouse.y !== lastMouse.y) {
            if (mouse.x !== undefined && mouse.y !== undefined && lastMouse.x !== undefined) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
            
                if (dist < mouseForceRadius) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                
                    const force = (1 - dist / mouseForceRadius) * mouseForceStrength;
                    const ax = nx * force / this.mass;
                    const ay = ny * force / this.mass;
                
                    this.ux += ax * dt;
                    this.uy += ay * dt;
                }
            }
        }

        // Wall collisions
        if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) this.ux = -this.ux
        if (this.y - this.radius <= 0) this.uy = -this.uy
        if (this.y + this.radius >= innerHeight) {
            this.uy = -this.uy * this.e
            this.y = innerHeight - this.radius
        }

        this.uy += this.g * dt
        this.x += this.ux * dt
        this.y += this.uy * dt + 0.5 * this.g * (dt)**2
    }
}

let circleArray = []
function init() {
    circleArray = []

    for(let i = 0; i < 300; i++) {
        const radius = randSize(9, -1)
        const ux = randSize(500, 250)
        const uy = randSize(-500, -100)
        const g = 300
        const e = randSize(0.1, -0.9)
        const strokeColor = randColor()
        const fillColor = randColor()

        let x, y;
        let safe = false

        while (!safe) {
            x = randSize(innerWidth - 2 * radius, -radius)
            y = randSize(innerHeight - 2 * radius, -radius)
            safe = true

            for (let j = 0; j < circleArray.length; j++) {
                if (distance(x, y, circleArray[j].x, circleArray[j].y) < radius + circleArray[j].radius) {
                    safe = false
                    break
                }
            }
        }

        circleArray.push(new Circle(x, y, ux, uy, g, e, radius, strokeColor, fillColor))
    }
}
init()

const GRID_SIZE = 100; // size of each grid cell
let grid = new Map(); // spatial hash map

function getGridKey(x, y) {
    const col = Math.floor(x / GRID_SIZE);
    const row = Math.floor(y / GRID_SIZE);
    return `${col},${row}`;
}

function animate(time) {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)

    c.beginPath();
    c.arc(mouse.x, mouse.y, mouseForceRadius, 0, Math.PI * 2);
    c.strokeStyle = 'red';
    c.stroke();


    const delta = time - lastTime
    fps = Math.round(1000 / delta)
    const dt = delta / 1000
    lastTime = time

    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(5, 5, 100, 50);
    c.fillStyle = 'black';
    c.font = '12px Arial';
    c.fillText(`FPS: ${fps}`, 10, 20);
    c.fillText(`Gravity: ${circleArray[0].g}`, 10, 35);
    c.fillText(`Particles: ${circleArray.length}`, 10, 50);

    grid.clear();
    for (const circle of circleArray) {
        const key = getGridKey(circle.x, circle.y);
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(circle);
    }
    
    for(let i = 0; i < circleArray.length; i++) {
        const circle = circleArray[i]
        circle.draw()
        circle.update(dt, circleArray)
    }

    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
}
requestAnimationFrame(animate)
