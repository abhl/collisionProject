
let back;
let globalFrame = 0;
let charmander;
let interactables = [];
let lastAttack = 0;
let enemyHealth = 3;
let gravity = 3;
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
function preload(){
    back = loadImage('assets/background.jpg');
    back.resize(1000,500)
}
function setup(){
    globalFrame += 0.2;
    createCanvas(1000,500);
    frameRate(60);
    imageMode(CORNER);
    textSize(36);
    back.resize(1000,500)
    image(back,0,0);
    charmander = new Interactable('charmander',0.05,107,100,250,0,0,176,172,15);
    poliwag = new Interactable('poliwag',0.05,79,850,300,.05,-1,76,108,enemyHealth);
    interactables.push(charmander);
    interactables.push(poliwag);
}
function draw(){
    image(back,0,0);
    fill(255,0,0);
    if(interactables[0].health == 0) {
        textSize(36);
        text("RIP Refresh to restart", 500,250);
        noLoop();
    }
    for(let i = interactables.length - 1; i >= 0;i--){
        if(interactables[i] && interactables[i].health > 0){
            interactables[i].animate();
            if(i != 1) interactables[i].checkCollision(interactables[1])
        }
    }
    if(keyIsDown('32') && charmander.yVelocity == 0){
        charmander.yVelocity = -15;
    }
    if(keyIsDown('70') && (lastAttack == 0 || globalFrame - lastAttack >= 60 / enemyHealth)){
        lastAttack = globalFrame;
        interactables.push(new Interactable('fireball',0.1,4,300,250,0,5,111/2,233/2,1));
    }
    if(poliwag.health <= 0){
        poliwag.x = 850;
        poliwag.y = 300;
        poliwag.health = ++enemyHealth;
    }
    text('Health: ', 10, 490)
    
    rect(130,455,300,40)
    fill(0,255,0);
    rect(130,455,300 * charmander.health / 15,40)
    globalFrame++;
}
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }
class Interactable{
    constructor(imagePath, frameDelay, frameCount, posX, posY, jumpChance,movementSpeed,height,width,health){
        this.originalY = posY;
        this.maxHealth = health;
        this.gif = [];
        this.imagePath = imagePath
        this.frameCount = frameCount;
        this.x = posX;
        this.y = posY;
        this.yVelocity = 0;
        this.jumpChance = jumpChance;
        this.movementSpeed = movementSpeed;
        this.height = height;
        this.width = width;
        for(let i = 0; i < frameCount; i++){
            this.gif[i] = loadImage(`assets/${imagePath}/frame_${i.pad(frameCount.toString().length)}_delay-${frameDelay.toString()}s.gif`, img => {
                img.resize(this.width,this.height)
            });
            this.gif[i].resize(this.width,this.height);
        }
        this.health = health;
        this.index = interactables.length - 1;
    }
    animate(){
        if (this.imagePath == 'poliwag') {
            if(this.x < charmander.x + charmander.width ) {
                charmander.health -= poliwag.health;
                poliwag.health = 0;
            }
            tint(255,this.health.map(this.maxHealth,0,255,0),this.health.map(this.maxHealth,0,255,0))
        }
        image(this.gif[Math.floor(globalFrame) % this.frameCount],this.x,this.y);
        noTint();
        if(random() < this.jumpChance && this.y >= 250) this.yVelocity = -15;
        this.x += this.movementSpeed;
        this.y += this.yVelocity;
        if(this.y < this.originalY  ) this.y += gravity;
        if(this.yVelocity < 0) this.yVelocity += 1;
    }
    checkCollision(otherInteractable){
        if (this.x > otherInteractable.x + otherInteractable.width || this.x + this.width < otherInteractable.x || this.y > otherInteractable.y + otherInteractable.height || this.y + this.height < otherInteractable.y || this.index == otherInteractable.index ) {
            // do nothing
        }else{
            otherInteractable.health--;
            this.health--;
            if(otherInteractable.health <= 0 && otherInteractable.index != 1) interactables.splice(otherInteractable.index,1);
            if(this.health <= 0 && this.index != 1) interactables.splice(this.index,1)
        }
        
    }
}