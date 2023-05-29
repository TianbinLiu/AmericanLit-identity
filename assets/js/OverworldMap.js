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
        if(npc.id != "brain"){
          if(((x >= (npc.x+3) && (x <= (npc.x + npc.sizex + 13))) && ((y >= npc.y) &&  (y <= (npc.y + npc.sizey))))){
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
        if(object.id != "brain"){
          if(((nextCoords.x >= (object.x+3) && (nextCoords.x <= (object.x + object.sizex + 13))) && ((nextCoords.y >= object.y) &&  (nextCoords.y <= (object.y + object.sizey))))){
            isReach = true;
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
    lowerSrc: "https://tianbinliu.github.io/AmericanLit-identity/images/maps/space.jpg",
    upperSrc: "https://tianbinliu.github.io/AmericanLit-identity/images/maps/transparent.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(55),
        y: utils.withGrid(22),
        sizex: 50,
        sizey: 37,
        id: "hero",
      }),
      npcA: new Person({
        isMounted: true,
        x: utils.withGrid(56),
        y: utils.withGrid(25),
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
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
    },
  },
  brainoutside: {
    lowerSrc: "https://tianbinliu.github.io/AmericanLit-identity/images/maps/room.jpg",
    upperSrc: "https://tianbinliu.github.io/AmericanLit-identity/images/maps/transparent.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(85),
        sizex: 50,
        sizey: 37,
        id: "hero",
      }),
      brain: new Person({
        isMounted: true,
        x: utils.withGrid(30),
        y: utils.withGrid(50),
        sizex: 600,
        sizey: 338,
        id: "brain",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/maps/brain.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
    },

    walls: {
      door1: new GameObject({
        id: "door1",
        event: true,
        x: utils.withGrid(29),
        y: utils.withGrid(50),
        sizex: utils.withGrid(1),
        sizey: utils.withGrid(1),
      }),
    },
    cutsceneSpaces: {
      ["door1"]: [
        {
          events: [
            { type: "changeMap", map: "braininside" }
          ]
        }
      ]
    }
  },
  braininside: {
    lowerSrc: "https://tianbinliu.github.io/AmericanLit-identity/images/maps/brainworld.jpeg",
    upperSrc: "https://tianbinliu.github.io/AmericanLit-identity/images/maps/transparent.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(37),
        sizex: 50,
        sizey: 37,
        id: "hero",
      }),
      mum: new Person({
        isMounted: true,
        x: utils.withGrid(10),
        y: utils.withGrid(55),
        sizex: 1440,
        sizey: 1080,
        id: "mum",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/mum.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
      sister: new Person({
        isMounted: true,
        x: utils.withGrid(40),
        y: utils.withGrid(55),
        sizex: 1080,
        sizey: 1440,
        id: "sister",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/sister.jpg",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
      Chinaflag: new Person({
        isMounted: true,
        x: utils.withGrid(80),
        y: utils.withGrid(13),
        sizex: 4256,
        sizey: 2832,
        id: "sister",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/Chinaflag.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
      coding: new Person({
        isMounted: true,
        x: utils.withGrid(70),
        y: utils.withGrid(55),
        sizex: 1200,
        sizey: 800,
        id: "coding",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/coding.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
      healthysleep: new Person({
        isMounted: true,
        x: utils.withGrid(100),
        y: utils.withGrid(13),
        sizex: 2121,
        sizey: 1414,
        id: "healthysleep",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/healthysleep.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
      rationalthinking: new Person({
        isMounted: true,
        x: utils.withGrid(90),
        y: utils.withGrid(55),
        sizex: 1600,
        sizey: 1600,
        id: "rationalthinking",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/rationalthinking.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
      yugioh: new Person({
        isMounted: true,
        x: utils.withGrid(60),
        y: utils.withGrid(13),
        sizex: 818,
        sizey: 816,
        id: "yugioh",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/yugioh.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
      jojo: new Person({
        isMounted: true,
        x: utils.withGrid(15),
        y: utils.withGrid(13),
        sizex: 600,
        sizey: 338,
        id: "jojo",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/jojo.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hi, Welcome to my spiritual world!"},
              { type: "textMessage", text: "You are my first visitor today, sounds lucky huh."},
              { type: "textMessage", text: "..."},
              { type: "textMessage", text: "Well, wants to know my identity? You are the weirdest guy I have ever seen."},
              { type: "textMessage", text: "It's hard to let a person to tell who he is, how about you just come into my brain to see it by yourself?"},
              { type: "changeMap", map: "brainoutside" }
            ]
          }
        ]
      }),
    },
  },
}