let back;
let globalFrame = 0;
let charmander;
let interactables = [];
let lastAttack = 0;
let enemyHealth = 3;
function preload(){
    back = loadImage('assets/background.jpg');
}
function setup(){
    createCanvas(1000,500);
    frameRate(60);
    imageMode(CORNER);
    background(0);
    image(back,0,0);
    charmander = new Interactable('charmander','.05',107,100,250,0,0,88,86,10);
    poliwag = new Interactable('poliwag',.05,79,850,300,.001,10,34,54,enemyHealth);
}
function draw(){
    if(interactables[0].health == 0) {
        textSize(36);
        text("RIP Refresh to restart", 500,250);
        noLoop();
    }
    for(let i = interactables.length - 1; i > 0;i--){
        if(interactables[i].health > 0){ 
            interactables[i].animate();
            for(let j = interactables.length - 1; j > 0;j--){
                if(j != i) interactables[i].checkCollision(interactables[j]);
                if(i != 0 && interactables[i].health == 0) interactables.splice(i,1);
                if(j != 0 && interactables[j].health == 0) interactables.splice(j,1);
            }
        }
    }
    if(keyIsDown('32') && charmander.yVelocity != 0){
        charmander.yVelocity = 30;
    }
    if(keyIsDown('70') && (lastAttack == 0 || globalFrame - lastAttack >= 60 / enemyHealth)){
        lastAttack = globalFrame;
        interactables.push(new Interactable('fireball',.1,5,200,250,0,30,111,233,1));
    }
    if(poliwag.health <= 0){
        poliwag.x = 850;
        poliwag.y = 300;
        poliwag.health = enemyHealth++;
    }
    globalFrame++;
}
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }
class Interactable{
    constructor(imagePath, frameDelay, frameCount, posX, posY, jumpChance,movementSpeed,height,width,health){
        this.gif = [];
        for(let i = 0; i < frameCount; i++){
            this.gif[i] = loadImage(`assets/${imagePath}/frame_${i.pad(frameCount.toString().length)}_delay-0${frameDelay.toString()}s.gif`,width,height);
            this.gif[i].resize(this.width,this.height);
        }
        this.x = posX;
        this.y = posY;
        this.yVelocity = 0;
        this.jumpChance = jumpChance;
        this.movementSpeed = movementSpeed;
        this.height = height;
        this.width = width;
        this.health = health;
        interactables.push(this);
    }
    move(){
        if(random() < this.jumpChance && this.yVelocity == 0) this.yVelocity = 30;
        this.posX += this.movementSpeed;
        this.posY += this.yVelocity;
        if(this.yVelocity > 0) this.yVelocity -= 3;
    }
    animate(){
        image(this.gif[globalFrame % frameCount],this.posX,this.posY);
    }
    checkCollision(otherInteractable){
        if (this.x > otherInteractable.x + otherInteractable.width || this.x + this.width < otherInteractable.x || this.y > otherInteractable.y + otherInteractable.height || this.y + this.height < otherInteractable.y) {
            // do nothing
        }else{
            console.log(collision);
            otherInteractable.health--;
            this.health--;
        }
        
    }
}