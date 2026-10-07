const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const randSize = (size = 1, offset = 0) => size * Math.random() - offset
const randColor = () => `rgba(${randSize(255)}, ${randSize(255)}, ${randSize(255)}, ${randSize()})`
const c = canvas.getContext('2d')
let lastTime = performance.now();

let fps = 0;
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
})

window.addEventListener('resize', (e) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    init()
})

addEventListener('click', e => {
    init()
})

class Circle {
    constructor(type='circle', delay=0.03, omega=0, theta=0, radius=10, path=100, color='black') {
        this.omega = omega
        this.theta = theta
        this.radius = radius
        this.path = path
        this.color = color
        this.x = mouse.x + this.path * Math.cos(this.theta)
        this.y = mouse.y + this.path * Math.sin(this.theta)
        this.lastMouse = {x: this.x, y: this.y}
        this.delay = delay
        this.type = type
        this.basePath = path;
        this.wiggleSeed = Math.random() * 1000;
        this.wiggleAmp = (this.basePath / 80) * randSize(10, -5); // outer particles wiggle more
        this.wiggleFreq = randSize(0.5, -0.25) + 1;
    }

    draw(lastPoint) {
        if(this.type == 'circle') {
            c.beginPath()
            c.fillStyle = this.color
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            c.fill()
            c.closePath()
        }

        else if(this.type === 'line') {
            c.beginPath()
            c.moveTo(lastPoint.x, lastPoint.y)
            c.lineWidth = this.radius
            c.lineTo(this.x, this.y)
            c.strokeStyle = this.color
            c.stroke()
            c.closePath()
        }
    }

    update(dt=1) {
        const lastPoint = {x: this.x, y:this.y}
        this.theta += this.omega * dt
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * this.delay
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * this.delay

        // Organic wiggle (based on seed + time for randomness)
        const timeFactor = performance.now() * 0.001 + this.wiggleSeed;
        const wiggle = Math.sin(this.theta * this.wiggleFreq + Math.sin(timeFactor * this.wiggleFreq)) * this.wiggleAmp;
        const currentPath = this.basePath + wiggle;
        this.x = this.lastMouse.x + currentPath * Math.cos(this.theta);
        this.y = this.lastMouse.y + currentPath * Math.sin(this.theta);

        this.draw(lastPoint)
    }
}

let circleArray = []
function init() {
    circleArray = []
    const count = 3000

    for(let i = 0; i < count; i++) {
        const omega = randSize(1.5, -0.75)
        const theta = randSize(2 * Math.PI)
        const radius = randSize(0.5, -0.5)
        const path = randSize(count / 2, -count / 100)
        const delay = randSize(0.04, -0.01)
        const type = 'circle'

        let safe = false
        while(!safe) {
            safe = true
            circleArray.forEach(circle => {
                if(circle.path === path) safe = false;
            })
        }
        
        const color = randColor()
        circleArray.push(new Circle(type, delay, omega, theta, radius, path, color))
    }

    for(let i = 0; i < 100; i++) {
        const omega = randSize(1.5, -0.75)
        const theta = randSize(2 * Math.PI)
        const radius = randSize(0.7, -0.3)
        const path = randSize(count / 4, -count / 100)
        const delay = randSize(0.04, -0.01)
        const type = 'line'

        let safe = false
        while(!safe) {
            safe = true
            circleArray.forEach(circle => {
                if(circle.path === path) safe = false;
            })
        }
        
        const color = randColor()
        circleArray.push(new Circle(type, delay, omega, theta, radius, path, color))
    }
}
init()

function animate(time) {
    requestAnimationFrame(animate)
    //c.clearRect(0, 0, innerWidth, innerHeight)
    c.fillStyle = 'rgba(30, 30, 30, 0.5)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    const delta = time - lastTime
    fps = Math.round(1000 / delta)
    const dt = delta / 1000
    lastTime = time
    
    circleArray.forEach(circle => circle.update(dt))
}
requestAnimationFrame(animate)
