// Game.js - Main game file

// Allows reading from console in node.js
//const readline = require('readline-sync');

// GameObject class - represents all Game Objects.

class GameObject {

  constructor(obj) {

    this.createdAt = obj.createdAt;
    this.dimensions = obj.dimensions;
    this.name = obj.name;

  }

  // Removes object from game

  destroy() {

    io.output(`${this.name} was removed from the game.`);

  }

}

// Entity class - Represents all entities with HP.

class Entity extends GameObject {

  constructor(obj) {

    super(obj);
    this.hp = obj.hp;
    this.name = obj.name;

  }

  // Applies damage to self, returns if self is dead

  takeDamage(damage) {

     io.output(`${this.name} took damage.`);
     this.hp -= damage;
     io.output(`${this.name}'s current HP: ${this.hp}`);

     return this.hp <= 0;

  }

}

// Humanoid class - represents all humanoids

class Humanoid extends Entity {

  constructor(obj) {

    super(obj);
    this.faction = obj.faction;
    this.weapons = obj.weapons;
    this.language = obj.language;

  }

  // Logs greeting

  greet() {

    io.output(`${this.name} offers a greeting in ${this.language}`);

  }

}

/* ====================== MY CLASSES ============================ */

// Fighter class, inherits from Humanoid

class Fighter extends Humanoid {

  constructor(obj) {

    super(obj);

    // Status: Status of fighter
    this.status = "NORMAL";
    // statusTime: Number of turns fighter is affected by status
    this.statusTime = 0;

  }

  // extension of takeDamage function

  takeDamage(damage) {

    // If I am not afflicted with anything, then there is a 5% chance I will be stunned and a 10% chance I will be poisoned.

    if (this.status == "NORMAL") {

      const affliction = Math.floor(Math.random() * 100 + 1);

      if (affliction < 5) {

        this.setStatus("STUNNED", 1);

      }

      else if (affliction < 15) {

        this.setStatus("POISONED", Math.floor(Math.random() * 4 + 1));

      }

    }

    if (this.status == "POISONED") {

      let damage = Math.floor(Math.random() * 9 + 1);
      console.log(`${this.name} took ${damage} damage due to poison.`);

      this.hp -= damage;
      console.log(`${this.name}'s current HP: ${this.hp}`);

      this.statusTime--;

      if (this.statusTime == 0)
        this.status = "NORMAL";

    }

    return super.takeDamage(damage);

  }

  // Attacks an opponent. Opponent must also be derivative of Fighter class. Returns whether attack resulted in a kill or not.

  attack(opponent, weapon) {

    if (this.status != "STUNNED") {

      let damage = Math.floor(Math.random() * this.weapons[weapon].maxDamage + 1);

      this.weapons[weapon].uses--;

      if (this.weapons[weapon].uses <= 0) {

        this.weapons[weapon].uses = 0;
        damage = 1;

      }

      return opponent.takeDamage(damage);

    }

    else {

      io.output(`${this.name} is stunned!`);
      return false;

    }

  }

  setStatus(newStatus, time) {

    /*

    Possible statuses:

    "NORMAL": normal
    "STUNNED": cannot attack for n turns
    "POISONED": Takes damage a bit for n turns

    */

    this.status = newStatus;
    this.statusTime = time;

  }

}

// Villian class, inherits from Fighter

class Villian extends Fighter {

  constructor(obj) {

    super(obj);

  }

  // Chooses a weapon to use

  chooseWeapon() {

    return Math.floor(Math.random() * this.weapons.length);

  }

}

// Hero class, inherits from Fighter

class Hero extends Fighter {

  constructor(obj) {

    super(obj);

  }

  // Chooses a weapon. Set up for input.

  chooseWeapon() {

    io.output("Choose your weapon by entering in the number of the weapon:");

    for (let i = 0; i < this.weapons.length; i++) {

      io.output(`[${i}] ${this.weapons[i].name} (remaining uses: ${this.weapons[i].uses})`);

    }

    let chosenWeapon = -1;

    while (chosenWeapon == -1 || isNaN(chosenWeapon) || chosenWeapon > this.weapons.length - 1) {

      chosenWeapon = io.input("Weapon: ");

    }

    return chosenWeapon;

  }

}

// IO class, used for processing IO

class IO {

  constructor(ioType) {

    this.ioType = ioType;
    this.keyInput = document.querySelector(".container .console .input");
    this.keyOutput = document.querySelector(".container .console .output");
    this.done = true;

  }

  // io.outputs a string
  output(str) {

    if (this.ioType == "console")
      console.log(str);

    else {

      document.querySelector(".container .console .output").innerHTML += str + '<br>';

    }

  }

  async input(str, input) {

    this.done = false;

    if (this.ioType == "console")
      return readline.question(str);

    else {

      this.output(str);

      return new Promise(resolve => {

        let done = false;

        window.addEventListener("keydown", getInput);

        let me = this;

        function getInput(keys) {

          if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 \n".includes(keys.key))
            me.keyInput.innerHTML += keys.key;

          if (keys.code === "Backspace") me.keyInput.innerHTML = "";

          if (keys.code === "Space") me.keyInput.innerHTML += "&nbsp";

          if (keys.code === "Enter") {
            done = true;
            me.done = true;
            input = me.keyInput.innerHTML;
            me.keyInput.innerHTML = "";
            window.removeEventListener("keydown", getInput);
            resolve(input);
          }

        }

      });

    }

  }

}

let start = true;

let io = new IO("window");

/* ====================== GAME FUNCTIONS ============================ */

// Returns a new character

async function createCharacter() {

  const characterClasses = ["Elf", "Human", "Orc"];

  let heroName = await io.input("What will your hero's name be? ");

  let characterClass = -1;
  let heroFaction = "undefined";
  let heroLanguage = "undefined";

  if (io.done) {

  io.output(`\nThere are ${characterClasses.length} classes available to you as an adventurer.`);
  io.output("You may choose one of the following:\n");

  for (let i = 0; i < characterClasses.length; i++) {

    io.output(`[${i}]: ${characterClasses[i]}`);

  }

  while (characterClass == -1 || isNaN(characterClass) || characterClass > characterClasses.length - 1) {

    characterClass = await io.input("\nWhich class do you choose? ");

  }

  characterClass = Number.parseInt(characterClass);

  switch (characterClass) {

    case 0: // Elf
      heroFaction = "Elven Clan";
      heroLanguage = "Elvish";
      break;
    case 1:
      heroFaction = "Human Clan";
      heroLanguage = "English";
      break;
    case 2:
      heroFaction = "Orc Clan";
      heroLanguage = "Oricsh";
      break;

  }

  io.output(`Welcome to the ${heroFaction}, ${heroName}.\n`);

  return new Hero({
    createdAt: new Date(),
    dimensions: {
      length: 1,
      width: 2,
      height: 4,
    },
    hp: 100,
    name: heroName,
    faction: heroFaction,
    weapons: [
      {name: "Dagger", maxDamage: 20, uses: 25},
      {name: "Sword", maxDamage: 75, uses: 5}
    ],
    language: heroLanguage,
  });

}

}

// Battle function. returns whether hero won or not.

function battle(hero, villian) {

  // Introductions
  io.output("");
  hero.greet();
  villian.greet();

  // Variables
  let battling = true;
  let turn = 1;

  // Game loop
  while (battling) {

    io.output("");
    io.output(`Your HP: ${hero.hp}`);
    io.output(`Enemy HP: ${villian.hp}`);
    io.output("");

    if (turn === 1) { // Hero's turn

      let victory = false;

      let weapon = hero.chooseWeapon();

      victory = hero.attack(villian, weapon);

      if (victory) {

        villian.destroy();
        io.output(`${hero.name} has won!\n`);
        battling = false;
        return true;

      }

      turn = 2;

    }

    else { // Villian's turn

      let victory = false;

      let weapon = villian.chooseWeapon();

      victory = villian.attack(hero, weapon);

      if (victory) {

        hero.destroy();
        io.output(`${villian.name} has won!\n`);
        battling = false;
        return false;

      }

      turn = 1;

    }

  }

}

/* ====================== THE GAME ============================ */

io.output("Welcome to my game. Please create a character.\n");

const hero = createCharacter();

/*io.output("Fight until you die!");

let numVictories = 0;
let fighting = true;

while (fighting) {

  let myVillian = new Villian({
    createdAt: new Date(),
    dimensions: {
      length: 1,
      width: 2,
      height: 4,
    },
    hp: 75 + numVictories * 5,
    name: 'Evil Villian',
    faction: 'Mountain Kingdom',
    weapons: [
      {name: "Dagger", maxDamage: 20, uses: 25},
      {name: "Sword", maxDamage: 30, uses: 2}
    ],
    language: 'Pig Latin',
  });

  fighting = battle(hero, myVillian);

  if (fighting) {

    numVictories++;
    io.output(`Great work, ${hero.name}! Your HP has been restored by ${20 + Math.floor(numVictories / 2) * 30} points. Now onto the next villian!`);
    hero.hp += 20 + Math.floor(numVictories / 3) * 4;
    hero.weapons[0].uses += 5;

    if (numVictories % 3 == 0)
      hero.weapons[1].uses += 10;

  }

}

io.output(`Great job, ${hero.name}. You have successfully slain ${numVictories} villians.`);*/
