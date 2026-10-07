const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const randSize = (size = 1, offset = 0) => size * Math.random() - offset
const randColor = () => `rgba(${randSize(255)}, ${randSize(255)}, ${randSize(255)}, ${randSize()})`
const c = canvas.getContext('2d')
let lastTime = performance.now();

let fps = 0;
const mouse = {
    x: undefined,
    y: undefined,
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
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        c.strokeStyle = this.strokeColor
        c.fillStyle = this.fillColor
        c.stroke()
        c.fill()
    }

    update(dt = 1) {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) this.ux = -this.ux
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

    for(let i = 0; i < 1000; i++) {
        const radius = randSize(10, -1)
        const x = randSize(innerWidth - 2*radius, - radius)
        const y = randSize(innerHeight - 2*radius, -radius)
        const ux = randSize(200, 100)
        const uy = randSize(200, 100)
        const g = 100
        const e = randSize(0.5) + 0.5

        const strokeColor = randColor()
        const fillColor = randColor()
        circleArray.push(new Circle(x, y, ux, uy, g, e, radius, strokeColor, fillColor))
    }
}
init()

function animate(time) {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)

    const delta = time - lastTime
    fps = Math.round(1000 / delta)
    const dt = delta / 1000
    lastTime = time

    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(5, 5, 80, 25);
    c.fillStyle = 'black';
    c.font = '16px Arial';
    c.fillText(`FPS: ${fps}`, 15, 23);
    
    for(let i = 0; i < circleArray.length; i++) {
        const circle = circleArray[i]
        circle.draw()
        circle.update(dt)
    }
}
requestAnimationFrame(animate)
