let back;
function preload(){
    back = loadImage('assets/background.jpg');
}
function setup(){
    createCanvas(1000,500);
    background(0);
    image(back,0,0);
}