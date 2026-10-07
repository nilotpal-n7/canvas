let playerState = 'sit'
let staggerFrame = 3
const dropdown = document.getElementById('animations')
const slider = document.getElementById('frames')

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image()
playerImage.src = 'shadow_dog.png'
const spriteWidth = 575
const spriteHeight = 523
let gameFrame = 0

const spriteAnimations = []
const animationStates = [
    { name: 'idle', frames: 7 },
    { name: 'jump', frames: 7 },
    { name: 'fall', frames: 7 },
    { name: 'run', frames: 9 },
    { name: 'dizzy', frames: 11 },
    { name: 'sit', frames: 5 },
    { name: 'roll', frames: 7 },
    { name: 'bite', frames: 7 },
    { name: 'ko', frames: 12 },
    { name: 'getHit', frames: 4 },
]

animationStates.forEach((state, idx) => {
    let frames = { loc: [] }
    let option = document.createElement('option')
    option.value = state.name
    option.innerText = state.name
    dropdown.appendChild(option)

    for(let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth
        let positionY = idx * spriteHeight
        frames.loc.push({ x: positionX, y: positionY })
    }

    spriteAnimations[state.name] = frames
})

dropdown.addEventListener('change', e => {
    playerState = e.target.value
})
slider.addEventListener('change', e => {
    staggerFrame = parseInt(e.target.value)
})

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    let position = Math.floor(gameFrame / staggerFrame) % spriteAnimations[playerState].loc.length
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;

    ctx.drawImage(
        playerImage, frameX, frameY, spriteWidth, 
        spriteHeight, 0, 0, spriteWidth, spriteHeight
    )

    gameFrame++;
    requestAnimationFrame(animate)
}

playerImage.onload = () => {
    animate();
}
