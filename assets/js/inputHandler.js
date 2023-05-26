console.log("inputHandler.js loaded")

let vx = 0;
let vy = 0;


let persondirection = "right";
let realdirection = "right";
let realdirectionx = "right";
let realdirectiony = "up";
let canMovex = false;
let canMovey = false;
let checkifwalkingright;
let checkifwalkingup;
let checkifwalkingdown;
let checkifwalkingleft;

addEventListener("keydown", function(event){
    console.log(event.code)
    if (event.code == 'ArrowRight'){
        persondirection="right";
        realdirectionx = "right";
        realdirection = "right";
        checkifwalkingright = true;
        vx = 1;
    } 
    if (event.code == 'ArrowLeft') {
        persondirection="left";
        realdirectionx = "left";
        realdirection = "left";
        checkifwalkingleft = true;
        vx = -1;
    }
    if (event.code == 'ArrowDown') {
        checkifwalkingdown = true;
        realdirectiony = "down";
        realdirection = "down";
        vy = 1;
    }
    if (event.code == 'ArrowUp') {
        checkifwalkingup = true;
        realdirectiony = "up";
        realdirection = "up";
        vy = -1;
    };
})
        
addEventListener("keyup", function(event){
    if (event.code == 'ArrowRight') {
        if(!checkifwalkingleft){
            vx = 0
        }
        else{
            persondirection="left";
            realdirectionx = "left";
            vx = -1;
        }
        checkifwalkingright = false;
    };
    if (event.code == 'ArrowLeft') {
        if(!checkifwalkingright){
            vx = 0
        }
        else{
            persondirection= "right";
            realdirectionx = "right"
            vx = 1;
        }
        checkifwalkingleft = false;
    };
    if (event.code == 'ArrowDown') {
        if(!checkifwalkingup){
            vy = 0
        }
        else{
            realdirectionx = "up"
            vy = -1;
        }
        checkifwalkingdown = false;

    };
    if (event.code == 'ArrowUp') {
        if(!checkifwalkingdown){
            vy = 0
        }
        else{
            realdirectionx = "down"
            vy = 1;
        }
        checkifwalkingup = false;

    };
})
  
