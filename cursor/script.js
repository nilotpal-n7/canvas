const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const randSize = (size = 1, offset = 0) => size * Math.random() - offset
const randColor = () => `rgba(${randSize(255)}, ${randSize(255)}, ${randSize(255)}, ${randSize()})`
const c = canvas.getContext('2d')

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

class Circle {
    constructor(x=10, y=10, dx=1, dy=1, radius=10, strokeColor='black', fillColor='white') {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.radius = radius
        this.strokeColor = strokeColor
        this.fillColor = fillColor
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        c.strokeStyle = this.strokeColor
        c.fillStyle = this.fillColor
        c.stroke()
        c.fill()
    }

    update() {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) this.dx = -this.dx
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) this.dy = -this.dy
        this.x += this.dx
        this.y += this.dy

        if(this.radius < 60 && ((mouse.x - this.x)**2 + (mouse.y - this.y)**2 < 100**2)) this.radius++;
        else if(this.radius > 3) this.radius--;
    }

    getX() {return this.x}
    getY() {return this.y}
}

let circleArray = []
function init() {
    circleArray = []

    for(let i = 0; i < 3000; i++) {
        const radius = randSize(5, -1)
        const x = randSize(innerWidth - 2*radius) + radius
        const y = randSize(innerHeight - 2*radius) + radius
        const dx = randSize(2, 1) * 5
        const dy = randSize(2, 1) * 3

        const strokeColor = randColor()
        const fillColor = randColor()
        circleArray.push(new Circle(x, y, dx, dy, radius, strokeColor, fillColor))
    }
}
init()

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)
    
    for(let i = 0; i < circleArray.length; i++) {
        const circle = circleArray[i]
        circle.draw()
        circle.update()
    }
}
animate()
