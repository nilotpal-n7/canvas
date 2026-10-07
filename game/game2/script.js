const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

let gameSpeed = 10
//let gameFrame = 0
const slider = document.getElementById('slider')
slider.value = gameSpeed
const showGameSpeed = document.getElementById('showGameSpeed')
showGameSpeed.innerText = gameSpeed

slider.addEventListener('change', e => {
    gameSpeed = e.target.value
    showGameSpeed.innerText = gameSpeed
})

class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 600
        this.image = image
        this.speedModifier = speedModifier
        this.speed = gameSpeed * this.speedModifier
    }

    update() {
        this.speed = gameSpeed * this.speedModifier
        if(this.x <= -this.width) this.x = 0;
        this.x = Math.floor(this.x - this.speed)
        //this.x = gameFrame * this.speed % this.width
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
}

let layers = [];

function init() {
    layers = []
    let imagesLoaded = 0

    for (let i = 0; i < 5; i++) {
        const image = new Image()
        image.src = `layer-${i + 1}.png`
        const speedModifier = 0.2 * (1 + i)

        image.onload = () => {
            console.log(`Loaded: layer-${i}.png`);
            layers.push(new Layer(image, speedModifier))
            imagesLoaded++
            if (imagesLoaded === 5) animate()
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    layers.forEach(layer => {
        layer.update()
        layer.draw()
    })

    //gameFrame--;
    requestAnimationFrame(animate)
}

init()
