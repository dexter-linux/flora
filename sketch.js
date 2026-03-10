let vaseType = 0
let bubbles = []
let messages = []
let song
let musicStarted = false

function preload(){
song = loadSound('song.mp3')
}

function setup(){

let canvas = createCanvas(900,550)
canvas.parent("canvas-holder")

angleMode(DEGREES)

document.getElementById("switchVase").onclick = () =>{
vaseType = (vaseType + 1) % 2
}

}

function windowResized(){

if(window.innerWidth < 768){
resizeCanvas(window.innerWidth * 0.95 , window.innerHeight * 0.8)
}else{
resizeCanvas(900,550)
}

}

function draw(){

drawBackground()

drawTable()

if(vaseType == 0){
drawVaseClassic()
}else{
drawVaseModern()
}

drawFlowers()

updateBubbles()

updateMessages()

}

function mousePressed(){

// start music on first interaction
if(!musicStarted){
song.loop()
song.setVolume(0.5)
musicStarted = true
}

for(let i = 0; i < 10; i++){

bubbles.push({
x:mouseX,
y:mouseY,
r:random(10,25),
speed:random(1,3),
alpha:255
})

}

messages.push({
x:mouseX,
y:mouseY,
alpha:255
})

}

function drawBackground(){

for(let y = 0; y < height; y++){
let inter = map(y,0,height,0,1)
let c = lerpColor(color("#2a4d69"),color("#1b263b"),inter)
stroke(c)
line(0,y,width,y)
}

}

function drawTable(){

fill(60,40,30)
rect(0,height*0.8,width,height*0.2)

}

function drawVaseClassic(){

let x = width/2
let y = height*0.75

fill(200,220,255,180)
stroke(180)

beginShape()
vertex(x-50,y)
vertex(x-30,y-120)
vertex(x+30,y-120)
vertex(x+50,y)
endShape(CLOSE)

}

function drawVaseModern(){

let x = width/2
let y = height*0.75

fill(180,240,255,200)
stroke(160)

rect(x-40,y-130,80,130,30)

}

function drawFlowers(){

let baseX = width/2
let baseY = height*0.63

drawHydrangea(baseX-80,baseY-80)

drawHydrangea(baseX+80,baseY-90)

drawLily(baseX-20,baseY-120)

drawLily(baseX+30,baseY-130)

stroke(40,120,40)
strokeWeight(4)

line(baseX-80,baseY-80,baseX,baseY)
line(baseX+80,baseY-90,baseX,baseY)
line(baseX-20,baseY-120,baseX,baseY)
line(baseX+30,baseY-130,baseX,baseY)

}

function drawHydrangea(x,y){

noStroke()

for(let i = 0; i < 25; i++){

let a = random(360)
let r = random(25)

let px = x + cos(a) * r
let py = y + sin(a) * r

fill(150 + random(50),120 + random(40),220 + random(30))

ellipse(px,py,12)

}

}

function drawLily(x,y){

push()

translate(x,y)

for(let i = 0; i < 6; i++){

rotate(60)

fill(255)

ellipse(0,20,20,50)

}

fill(255,200,0)

ellipse(0,0,10)

pop()

}

function updateBubbles(){

noStroke()

for(let i = bubbles.length - 1; i >= 0; i--){

let b = bubbles[i]

fill(200,220,255,b.alpha)

ellipse(b.x,b.y,b.r)

b.y -= b.speed

b.alpha -= 3

if(b.alpha <= 0){
bubbles.splice(i,1)
}

}

}

function updateMessages(){

textAlign(CENTER)

textSize(26)

for(let i = messages.length - 1; i >= 0; i--){

let m = messages[i]

fill(255,120,150,m.alpha)

text("I love you Mideva",m.x,m.y)

m.y -= 0.5

m.alpha -= 2

if(m.alpha <= 0){
messages.splice(i,1)
}

}

}