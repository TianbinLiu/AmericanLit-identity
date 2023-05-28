class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }
 
   startGameLoop() {
     const step = () => {
       //Clear off the canvas
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
       //Establish the camera person
       const cameraPerson = this.map.gameObjects.hero;
 
       //Update all objects
       Object.values(this.map.gameObjects).forEach(object => {
         object.update({
          map: this.map,
         })
       })
 
       //Draw Lower layer
       
       this.map.drawLowerImage(this.ctx, cameraPerson);
 
       //Draw Game Objects
       Object.values(this.map.gameObjects).sort((a,b) => {
         return a.y - b.y;
       }).forEach(object => {
         object.sprite.draw(this.ctx, cameraPerson);
       })
 
       //Draw Upper layer
       this.map.drawUpperImage(this.ctx, cameraPerson);
       
       requestAnimationFrame(() => {
         step();   
       })
     }
     step();
  }
 
  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene()
    })
  }
 
 
  startMap(mapConfig) {
   this.map = new OverworldMap(mapConfig);
   this.map.overworld = this;
   this.map.mountObjects();
  }

  init() {
    this.startMap(window.OverworldMaps.DemoRoom);
  
  
    this.bindActionInput();
  
    this.startGameLoop();
  
  
    // this.map.startCutscene([
    //   { type: "textMessage", text: "WHY HELLO THERE!"}
    //   // { who: "npcA", type: "walk",  direction: "left", spritedirection: "left" },
    //   // { who: "npcA", type: "walk",  direction: "left", spritedirection: "left" },
    //   // { who: "npcA", type: "stand",  direction: "right", time: 800 },
    // ])

  
   }
 }