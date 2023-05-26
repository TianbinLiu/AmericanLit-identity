class Sprite {
  constructor(config) {

    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.id = config.id;
    this.image.sizex = config.sizex;
    this.image.sizey = config.sizey;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    //Shadow
    this.shadow = new Image();
    this.useShadow = true; //config.useShadow || false
    if (this.useShadow) {
      this.shadow.src = "https://tianbinliu.github.io/CSA-FinalProject/images/character/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "hero-idle-right": [ [7,0],[8,0],[9,0], ],
      "hero-idle-left" : [ [6,0],[5,0],[4,0], ],
      "hero-walk-left": [ [5,1],[4,1],[3,1],[2,1],[1,1], ],
      "hero-walk-right" : [ [8,1],[9,1],[10,1],[11,1],[12,1], ],
      "npcA-idle-right": [ [7,0],[8,0],[9,0], ],
      "npcA-idle-left": [ [6,0],[5,0],[4,0], ],
      "npcA-walk-left": [ [5,1],[4,1],[3,1],[2,1],[1,1], ],
      "npcA-walk-right" : [ [8,1],[9,1],[10,1],[11,1],[12,1], ],
      "Wizard-idle-right": [ [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],],
      "Wizard-idle-left": [ [27,0],[26,0],[25,0],[24,0],[23,0],[22,0], ],
      "Wizard-walk-left": [ [21,0],[20,0],[19,0],[18,0],[17,0],[16,0],[15,0],[14,0], ],
      "Wizard-walk-right" : [ [6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0], ],
    }
    this.currentAnimation = config.currentAnimation || (this.image.id + "-idle-right");
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 16;
    this.animationFrameProgress = this.animationFrameLimit;
    

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }


  }
  

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 8 + utils.withGrid(10) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

    if(this.image.id === "hero" || this.image.id === "npcA"){
    this.isShadowLoaded && ctx.drawImage(this.shadow, 
      0,0, 
      32,32,
      x, y, 
      this.image.sizex,this.image.sizey
    );
    }
    else if(this.image.id === "Wizard"){
      this.isShadowLoaded && ctx.drawImage(this.shadow, 
        0,0, 
        32,32,
        x, y, 
        40,74
      );
    }

    
    const [frameX, frameY] = this.frame;

    if(this.image.id === "hero" || this.image.id === "npcA"){
      this.isLoaded && ctx.drawImage(this.image,
        frameX * this.image.sizex, frameY * this.image.sizey,
        this.image.sizex,this.image.sizey,
        x,y,
        this.image.sizex,this.image.sizey,
      );
    }
    else if(this.image.id === "Wizard"){
      this.isLoaded && ctx.drawImage(this.image,
        frameX * this.image.sizex, frameY * this.image.sizey,
        this.image.sizex,this.image.sizey,
        x,y,
        40,74,
      );
    }


    this.updateAnimationProgress();
  }

}