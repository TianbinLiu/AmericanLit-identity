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
          if(npc.id === "npcA"){
            if(((x >= (npc.x - (npc.sizex/4)) && (x <= (npc.x + (npc.sizex/4)))) && ((y >= (npc.y - (npc.sizey/10))) &&  (y <= (npc.y + (npc.sizey/10)))))){
              isReach = true;
            }
          }
          else if(npc.id === "Chinaflag" || npc.id === "healthysleep" || npc.id === "coding"){
            if(((x >= (npc.x - 25) && (x <= (npc.x - 25 + (384)))) && ((y >= (npc.y - 37)) &&  (y <= (npc.y - 37 + (256)))))){
              isReach = true;
            }
          }
          else if(npc.id === "jojo"){
            if(((x >= (npc.x - 25) && (x <= (npc.x - 25 + (455)))) && ((y >= (npc.y - 37)) &&  (y <= (npc.y - 37 + (256)))))){
              isReach = true;
            }
          }
          else if(npc.id === "mum"){
            if(((x >= (npc.x - 25) && (x <= (npc.x - 25 + (341)))) && ((y >= (npc.y - 37)) &&  (y <= (npc.y - 37 + (256)))))){
              isReach = true;
            }
          }
          else if(npc.id === "rationalthinking"){
            if(((x >= (npc.x - 25) && (x <= (npc.x - 25 + (340)))) && ((y >= (npc.y - 37)) &&  (y <= (npc.y - 37 + (340)))))){
              isReach = true;
            }
          }
          else if(npc.id === "sister"){
            if(((x >= (npc.x - 25) && (x <= (npc.x - 25 + (200)))) && ((y >= (npc.y - 37)) &&  (y <= (npc.y - 37 + (267)))))){
              isReach = true;
            }
          }
          else if(npc.id === "yugioh"){
            if(((x >= (npc.x - 25) && (x <= (npc.x - 25 + (257)))) && ((y >= (npc.y - 37)) &&  (y <= (npc.y - 37 + (256)))))){
              isReach = true;
            }
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

      Object.values(this.gameObjects).forEach(object => {
        if(!object.picture){
        object.doBehaviorEvent(this)
        }
      })
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
        else if(object.id === "Chinaflag" || object.id === "healthysleep" || object.id === "coding"){
          if(((nextCoords.x >= (object.x - 25) && (nextCoords.x <= (object.x - 25 + (384)))) && ((nextCoords.y >= (object.y - 37)) &&  (nextCoords.y <= (object.y - 37 + (256)))))){
            ifisReach = true;
          }
        }
        else if(object.id === "jojo"){
          if(((nextCoords.x >= (object.x - 25) && (nextCoords.x <= (object.x - 25 + (455)))) && ((nextCoords.y >= (object.y - 37)) &&  (nextCoords.y <= (object.y - 37 + (256)))))){
            ifisReach = true;
          }
        }
        else if(object.id === "mum"){
          if(((nextCoords.x >= (object.x - 25) && (nextCoords.x <= (object.x - 25 + (341)))) && ((nextCoords.y >= (object.y - 37)) &&  (nextCoords.y <= (object.y - 37 + (256)))))){
            ifisReach = true;
          }
        }
        else if(object.id === "rationalthinking"){
          if(((nextCoords.x >= (object.x - 25) && (nextCoords.x <= (object.x - 25 + (340)))) && ((nextCoords.y >= (object.y - 37)) &&  (nextCoords.y <= (object.y - 37 + (340)))))){
            ifisReach = true;
          }
        }
        else if(object.id === "sister"){
          if(((nextCoords.x >= (object.x - 25) && (nextCoords.x <= (object.x - 25 + (200)))) && ((nextCoords.y >= (object.y - 37)) &&  (nextCoords.y <= (object.y - 37 + (267)))))){
            ifisReach = true;
          }
        }
        else if(object.id === "yugioh"){
          if(((nextCoords.x >= (object.x - 25) && (nextCoords.x <= (object.x - 25 + (257)))) && ((nextCoords.y >= (object.y - 37)) &&  (nextCoords.y <= (object.y - 37 + (256)))))){
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
              { type: "textMessage", text: "Well, want to know my identity? You the weirdest guy I have ever seen."},
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
        y: utils.withGrid(50),
        sizex: 1440,
        sizey: 1080,
        picture: true,
        id: "mum",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/mum.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "This is my mum."},
              { type: "textMessage", text: "She lives with us(me and my sister) and sometimes when her tourist visa was about to expire "},
              { type: "textMessage", text: "she will switch position with my dad and come back to China."},
              { type: "textMessage", text: "She likes playing golf even though she can't play really well."},
              { type: "textMessage", text: "She is a contradictory person, one way she wants us to live a happy life "},
              { type: "textMessage", text: "and wants to give no expectation or pressure to us. "},
              { type: "textMessage", text: "But another way, she wants us to attend college and have a well-pay job that we are interested in."},
            ]
          }
        ]
      }),
      sister: new Person({
        isMounted: true,
        x: utils.withGrid(40),
        y: utils.withGrid(50),
        sizex: 1080,
        sizey: 1440,
        picture: true,
        id: "sister",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/sister.jpg",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "This is my sister."},
              { type: "textMessage", text: "I know the image is not very clear, but that is a technological problem I can't solve."},
              { type: "textMessage", text: "There is no way to zoom the picture without breaking the sharpness."},
              { type: "textMessage", text: "Just like me, she is also studying in Del Norte."},
              { type: "textMessage", text: "She likes singing and dancing(K-POP), and socializing. "},
              { type: "textMessage", text: "Want to know more? Why don't you ask her by yourself?"},
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
        picture: true,
        id: "Chinaflag",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/Chinaflag.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "I was born in China and lived here for about 13 years of my life."},
              { type: "textMessage", text: "I didn't come back to China for about 5 years in total after I came to the US."},
              { type: "textMessage", text: "I will come back this year during the summer, not to relax but prepare for my SAT, college application, and CS project."},

            ]
          }
        ]
      }),
      coding: new Person({
        isMounted: true,
        x: utils.withGrid(70),
        y: utils.withGrid(50),
        sizex: 1200,
        sizey: 800,
        picture: true,
        id: "coding",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/coding.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "I like coding. If someone knows how to code, I believe he/she will also like coding."},
              { type: "textMessage", text: "I'm learning how to use Javascript to build an online web game right now, as you see, this web is part of my work."},
              { type: "textMessage", text: "Probably I will choose CS as my major."},
            ]
          }
        ]
      }),
      healthysleep: new Person({
        isMounted: true,
        x: utils.withGrid(110),
        y: utils.withGrid(13),
        sizex: 2121,
        sizey: 1414,
        picture: true,
        id: "healthysleep",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/healthysleep.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "I like sleeping, I believe anyone who doesn't get enough sleep likes to sleep."},
              { type: "textMessage", text: "I usually get some sleep when I back home, so I can do my work better at night."},
            ]
          }
        ]
      }),
      rationalthinking: new Person({
        isMounted: true,
        x: utils.withGrid(105),
        y: utils.withGrid(45),
        sizex: 1600,
        sizey: 1600,
        picture: true,
        id: "rationalthinking",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/rationalthinking.jpg",
        talking: [
          {
            events: [
              { type: "textMessage", text: "I believe in rational thinking. And I'm trying to keep myself as a rational person."},
              { type: "textMessage", text: "Whatever I do, I will think before and after I start to do it."},
              { type: "textMessage", text: "Emotional people often regret the consequences of their irrational actions in life."},
              { type: "textMessage", text: "And I'm trying to have as less irrational actions in my life as possible."},
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
        picture: true,
        id: "yugioh",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/yugioh.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "I likes playing game like Yugioh Master Duel(card game)"},
              { type: "textMessage", text: "I used to play MOBA or FPS, but it's boring if you don't have a friend to play with."},
              { type: "textMessage", text: "Especially if you already had play the games for thousands of hours."},
            ]
          }
        ]
      }),
      jojo: new Person({
        isMounted: true,
        x: utils.withGrid(15),
        y: utils.withGrid(13),
        sizex: 1920,
        sizey: 1080,
        picture: true,
        id: "jojo",
        src: "https://tianbinliu.github.io/AmericanLit-identity/images/identity/jojo.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "I like watching JoJo's Adventure, an Anime. And I watched all seasons of it."},
              { type: "textMessage", text: "I admire those characters who have “golden spirit” in the anime."},
              { type: "textMessage", text: "But if I had to choose, "},
              { type: "textMessage", text: "I would prefer to be the “savior of the wicked” just like Dio, one of the main villains in the anime,"},
              { type: "textMessage", text: "or Kira Yoshikage, a “normal” office worker. :), yes “normal”, don't ask your friend who watch JoJo"},
            ]
          }
        ]
      }),
    },
  },
}
