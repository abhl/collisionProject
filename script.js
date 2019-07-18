let background;
function preload(){
    background = loadImage('assets/background.jpg');
}
function setup(){
    createCanvas(1000,500);
    image(background,0,0)
}