const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext('2d')
c.fillStyle = 'rgba(40, 40, 40, 1)';
c.fillRect(0, 0, innerWidth, innerHeight)

const randSize = (size = 1, offset = 0) => size * Math.random() - offset
const randColor = () => `rgba(${randSize(255)}, ${randSize(255)}, ${randSize(255)}, ${randSize()})`
let lastTime = performance.now();
let fps = 0;

const mouse = {
    x: undefined,
    y: undefined,
}

let isMouseDown = false;
let lastInitTime = 0;
const initDelay = 50; // milliseconds between particle spawns

window.addEventListener('mousedown', () => {
    isMouseDown = true;
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY

    if (isMouseDown && performance.now() - lastInitTime > initDelay) {
        init();
        lastInitTime = performance.now();
    }
})

window.addEventListener('resize', (e) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    init()
})

addEventListener('click', e => init())

class Circle {
    constructor(x=10, y=10, v=10, g=10, e=0.99, theta=0, radius=10, rgb, a=1) {
        this.x = x
        this.y = y
        this.v = v
        this.g = g
        this.e = e
        this.theta = theta
        this.radius = radius
        this.rgb = rgb
        this.a = a
        this.ux = this.v * Math.cos(this.theta) * randSize()
        this.uy = this.v * Math.sin(this.theta) * randSize()
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        c.fillStyle = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${this.a})`
        c.fill()
        c.closePath()
    }

    update(dt=1) {
        const lastUy = this.uy
        this.ux *= this.e
        this.uy *= this.e
        this.uy += this.g * dt
        this.x += this.ux * dt
        this.y += (this.uy + lastUy) * dt / 2
        this.a -= dt / 10
        this.draw()
    }
}

let circleArray = []
function init() {
    for(let i = 0; i < 300; i++) {
        const g = 100
        const e = 0.99
        const v = 300
        const x = mouse.x
        const y = mouse.y
        const radius = randSize(1, -2)
        const theta = randSize(2 * Math.PI)
        const a = randSize()
        const rgb = {
            r: Math.floor(randSize(255)),
            g: Math.floor(randSize(255)),
            b: Math.floor(randSize(255)),
        }

        circleArray.push(new Circle(x, y, v, g, e, theta, radius, rgb, a))
    }

    if (circleArray.length === 300) {
        lastTime = performance.now();
        requestAnimationFrame(animate);
    }
}

function animate(time) {
    c.fillStyle = 'rgba(40, 40, 40, 0.2)';
    c.fillRect(0, 0, innerWidth, innerHeight)
    console.log(circleArray.length)
    if(circleArray.length == 0) return;

    const delta = time - lastTime
    fps = Math.round(1000 / delta)
    const dt = delta / 1000
    lastTime = time

    c.fillStyle = 'rgba(255, 255, 255, 0.5)';
    c.fillRect(5, 5, 80, 25);
    c.fillStyle = 'black';
    c.font = '12px Arial';
    c.fillText(`FPS: ${fps}`, 10, 16);
    c.fillText(`Particles: ${circleArray.length}`, 10, 27);
    
    for (let i = circleArray.length - 1; i >= 0; i--) {
        if (circleArray[i].a > 0) circleArray[i].update(dt);
        else circleArray.splice(i, 1);
    }

    if (circleArray.length > 0) {
        requestAnimationFrame(animate);
    } else {
        console.log("Animation terminated: All particles faded.");
    }
}
