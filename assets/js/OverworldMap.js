class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
    
    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 
  
  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  heroisSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.heronextPosition(currentX, currentY, direction);
    console.log("character(control) move next position(x): " + x + ", " + "(y): " + y)
    let isReach = false;
    Object.values(this.gameObjects).forEach(npc => {
      if(npc.isMounted){
        console.log("npc position(x): " + npc.x + ", " + "(y): " + npc.y + ", length: " + npc.sizex + ", width: " + npc.sizey)
        if(npc.id === "npcA"){
          if(((x >= (npc.x - (npc.sizex/4)) && (x <= (npc.x + (npc.sizex/4)))) && ((y >= (npc.y - (npc.sizey/10))) &&  (y <= (npc.y + (npc.sizey/10)))))){
            isReach = true;
          }
        }
        else if(npc.id === "Wizard"){
          if(((x >= ((npc.x - npc.sizex/8) - (npc.sizex/8)) && (x <= ((npc.x - npc.sizex/8) + (npc.sizex/8)))) && ((y >= ((npc.y + npc.sizey/4) - (npc.sizey/40))) &&  (y <= ((npc.y + npc.sizey/4) + (npc.sizey/40)))))){
            isReach = true;
          }
        }
      }
    })
    Object.values(this.walls).forEach(wall => {
      console.log("wall position(x): " + wall.x + ", " + "(y): " + wall.y + ", length: " + wall.sizex + ", width: " + wall.sizey)
      if(((x >= (wall.x+3)) && (x <= (wall.x + wall.sizex + 13))) && ((y >= wall.y) &&  (y <= (wall.y + wall.sizey)))){
        if(wall.wall){
          isReach = true;
        }
        if(!this.isCutscenePlaying && wall.event){
          this.startCutscene( this.cutsceneSpaces[wall.id][0].events );
          wall.event = false;
        }
      }
    })
    return isReach;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      if(key.isMounted){
        object.mount(this);
      }
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.heronextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      let ifisReach = false;
      if(object.isMounted){
        if(object.id === "npcA"){
          if(((nextCoords.x >= (object.x - (object.sizex/4)) && (nextCoords.x <= (object.x + (object.sizex/4)))) && ((nextCoords.y >= (object.y - (object.sizey/10))) &&  (nextCoords.y <= (object.y + (object.sizey/10)))))){
            ifisReach = true;
          }
        }
        else if(object.id === "Wizard"){
          if(((nextCoords.x >= ((object.x - object.sizex/8) - (object.sizex/8)) && (nextCoords.x <= ((object.x - object.sizex/8) + (object.sizex/8)))) && ((nextCoords.y >= ((object.y + object.sizey/4) - (object.sizey/40))) &&  (nextCoords.y <= ((object.y + object.sizey/4) + (object.sizey/40)))))){
            ifisReach = true;
          }
        }

      return ifisReach;
      }
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

}



window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "https://tianbinliu.github.io/CSA-FinalProject/images/maps/DemoLower.png",
    upperSrc: "https://tianbinliu.github.io/CSA-FinalProject/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        sizex: 50,
        sizey: 37,
        id: "hero",
      }),
      npcA: new Person({
        isMounted: true,
        x: utils.withGrid(6),
        y: utils.withGrid(9),
        sizex: 50,
        sizey: 37,
        id: "npcA",
        src: "https://tianbinliu.github.io/CSA-FinalProject/images/character/adventurer-v1.5-Sheetflip.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "I'm busy..."},
              { type: "textMessage", text: "Go away!"},
            ]
          }
        ]
      }),
    },
    walls: {
      wall1: new GameObject({
        id: "wall1",
        wall: true,
        x: utils.withGrid(6),
        y: utils.withGrid(5),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(2),
      }),
      wall2: new GameObject({
        id: "wall2",
        wall: true,
        x: utils.withGrid(0),
        y: utils.withGrid(2),
        sizex: utils.withGrid(10),
        sizey: utils.withGrid(1),
      }),
      wall3: new GameObject({
        id: "wall3",
        wall: true,
        x: utils.withGrid(0),
        y: utils.withGrid(3),
        sizex: utils.withGrid(0),
        sizey: utils.withGrid(6),
      }),
      wall4: new GameObject({
        id: "wall4",
        wall: true,
        x: utils.withGrid(0),
        y: utils.withGrid(9),
        sizex: utils.withGrid(10),
        sizey: utils.withGrid(0),
      }),
      wall5: new GameObject({
        id: "wall5",
        wall: true,
        x: utils.withGrid(10),
        y: utils.withGrid(3),
        sizex: utils.withGrid(0),
        sizey: utils.withGrid(6),
      }),
      wall6: new GameObject({
        id: "wall6",
        wall: true,
        x: utils.withGrid(2),
        y: utils.withGrid(3),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(0.5),
      }),
      wall7: new GameObject({
        id: "wall7",
        wall: true,
        x: utils.withGrid(5),
        y: utils.withGrid(3),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
      wall8: new GameObject({
        id: "wall8",
        wall: true,
        x: utils.withGrid(7),
        y: utils.withGrid(3),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
      event1: new GameObject({
        id: "event1",
        event: true,
        x: utils.withGrid(4),
        y: utils.withGrid(8),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
      door1: new GameObject({
        id: "door1",
        event: true,
        x: utils.withGrid(4),
        y: utils.withGrid(9),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
    },
    cutsceneSpaces: {

      ["event1"]: [
        {
          events: [
            { who: "npcA", type: "walk",  direction: "left", spritedirection: "left" },
            { who: "npcA", type: "stand",  direction: "right", time: 500 },
            { type: "textMessage", text:"You can't stay there! "},
            { type: "textMessage", text:"Go straight to the CS classroom. You don't want to be late right?"},
            { type: "textMessage", text:"..."},
            { type: "textMessage", text:"......."},
            { type: "textMessage", text:"..........."},
            { type: "textMessage", text:"Move!!!!!!!!!"},
            { who: "npcA", type: "walk",  direction: "right", spritedirection: "right" },
            { who: "npcA", type: "walk",  direction: "right", spritedirection: "right" },
          ]
        }
      ],
      ["door1"]: [
        {
          events: [
            { type: "changeMap", map: "classroom" }
          ]
        }
      ]
    }
  },
  classroom: {
    lowerSrc: "https://tianbinliu.github.io/CSA-FinalProject/images/maps/classroom.png",
    upperSrc: "https://tianbinliu.github.io/CSA-FinalProject/images/maps/classroomUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3),
        y: utils.withGrid(4),
        sizex: 50,
        sizey: 37,
        id: "hero",
      }),
      Wizard: new Person({
        isMounted: true,
        x: utils.withGrid(13),
        y: utils.withGrid(20),
        sizex: 80,
        sizey: 149,
        id: "Wizard",
        src: "https://tianbinliu.github.io/CSA-FinalProject/images/character/wizard/WizardMrM.png",
        behaviorLoop: [
          { type: "stand",  direction: "right", time: 1200 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "You made it!"},
            ]
          }
        ]
      }),
    },
    walls: {
      table1left: new GameObject({
        id: "table1left",
        wall: true,
        x: utils.withGrid(0), //table left 1
        y: utils.withGrid(5),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(5),
      }),
      table1righttop: new GameObject({
        id: "table1righttop",
        wall: true,
        x: utils.withGrid(2), //table left 1
        y: utils.withGrid(5),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
      table1rightbutton: new GameObject({
        id: "table1rightbutton",
        wall: true,
        x: utils.withGrid(2), //table left 1
        y: utils.withGrid(9),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
      wall2: new GameObject({
        id: "wall2",
        wall: true,
        x: utils.withGrid(0),
        y: utils.withGrid(2.5),
        sizex: utils.withGrid(19),
        sizey: utils.withGrid(1),
      }),
      wall3: new GameObject({
        id: "wall3",
        wall: true,
        x: utils.withGrid(0),
        y: utils.withGrid(3),
        sizex: utils.withGrid(0.5),
        sizey: utils.withGrid(22),
      }),
      wall4: new GameObject({
        id: "wall4",
        wall: true,
        x: utils.withGrid(0),
        y: utils.withGrid(25),
        sizex: utils.withGrid(19),
        sizey: utils.withGrid(0.25),
      }),
      wall5: new GameObject({
        id: "wall5",
        wall: true,
        x: utils.withGrid(18.5),
        y: utils.withGrid(2),
        sizex: utils.withGrid(0),
        sizey: utils.withGrid(25),
      }),

      table2topleft: new GameObject({
        id: "table2topleft",               //table middle 1
        wall: true,
        x: utils.withGrid(6.5),
        y: utils.withGrid(5.5),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
      table2topright: new GameObject({
        id: "table2topright",               //table middle 1
        wall: true,
        x: utils.withGrid(11.5),
        y: utils.withGrid(5.5),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
      table2buttonleft: new GameObject({
        id: "table2buttonleft",               //table middle 1
        wall: true,
        x: utils.withGrid(6.5),
        y: utils.withGrid(10.5),
        sizex: utils.withGrid(1.5),
        sizey: utils.withGrid(1.5),
      }),
      table2buttonright: new GameObject({
        id: "table2buttonright",               //table middle 1
        wall: true,
        x: utils.withGrid(11.5),
        y: utils.withGrid(10.5),
        sizex: utils.withGrid(1.5),
        sizey: utils.withGrid(1.5),
      }),

      table3: new GameObject({
        id: "table3",               //table left 2
        wall: true,
        x: utils.withGrid(0),
        y: utils.withGrid(12),
        sizex: utils.withGrid(3),
        sizey: utils.withGrid(4.5),
      }),

      table4: new GameObject({
        id: "table4",               //table left 3
        wall: true,
        x: utils.withGrid(0),
        y: utils.withGrid(18),
        sizex: utils.withGrid(3),
        sizey: utils.withGrid(4.5),
      }),

      table5: new GameObject({
        id: "table5",               //table middle 2
        wall: true,
        x: utils.withGrid(7),
        y: utils.withGrid(21.5),
        sizex: utils.withGrid(4),
        sizey: utils.withGrid(3.5),
      }),

      table6: new GameObject({
        id: "table6",               //table right 1
        wall: true,
        x: utils.withGrid(16),
        y: utils.withGrid(5.5),
        sizex: utils.withGrid(3),
        sizey: utils.withGrid(4.5),
      }),

      table7: new GameObject({
        id: "table7",               //table right 2
        wall: true,
        x: utils.withGrid(16),
        y: utils.withGrid(11.5),
        sizex: utils.withGrid(3),
        sizey: utils.withGrid(4.5),
      }),

      table8: new GameObject({
        id: "table8",               //table right 3
        wall: true,
        x: utils.withGrid(16),
        y: utils.withGrid(18.5),
        sizex: utils.withGrid(3),
        sizey: utils.withGrid(4.5),
      }),

      chair1: new GameObject({
        id: "chair1",             //chair left 1
        wall: true,
        x: utils.withGrid(3),
        y: utils.withGrid(7),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(2),
      }),

      chair2: new GameObject({
        id: "chair2",               // chair middle 1
        wall: true,
        x: utils.withGrid(8),
        y: utils.withGrid(12),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(2),
      }),
      
      chair3: new GameObject({
        id: "chair3",               // chair middle 2
        wall: true,
        x: utils.withGrid(12),
        y: utils.withGrid(6),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(2),
      }),
      chair4: new GameObject({
        id: "chair4",               // chair middle 3
        wall: true,
        x: utils.withGrid(12),
        y: utils.withGrid(9),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(2),
      }),

      chair5: new GameObject({
        id: "chair5",               // chair left 2
        wall: true,
        x: utils.withGrid(3),
        y: utils.withGrid(13),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(2),
      }),
      
      chair6: new GameObject({
        id: "chair6",               // chair left 3
        wall: true,
        x: utils.withGrid(3),
        y: utils.withGrid(18),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(2),
      }),

      chair7: new GameObject({
        id: "chair7",               // chair left 3
        wall: true,
        x: utils.withGrid(3),
        y: utils.withGrid(20),
        sizex: utils.withGrid(2),
        sizey: utils.withGrid(2),
      }),

      chair8: new GameObject({
        id: "chair8",               // chair left 3
        wall: true,
        x: utils.withGrid(11.75),
        y: utils.withGrid(22.75),
        sizex: utils.withGrid(1.25),
        sizey: utils.withGrid(1.25),
      }),

      bookshelf: new GameObject({
        id: "bookshelf",               // chair left 3
        wall: true,
        x: utils.withGrid(15.75),
        y: utils.withGrid(3),
        sizex: utils.withGrid(2.25),
        sizey: utils.withGrid(1),
      }),
    },
  },
}