// Game.js - Main game file

// Allows reading from console in node.js
const readline = require('readline-sync');

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

  }

  // Attacks an opponent. Opponent must also be derivative of Fighter class. Returns whether attack resulted in a kill or not.

  attack(opponent) {

    let weapon = Math.floor(Math.random() * this.weapons.length);
    let damage = Math.floor(Math.random() * this.weapons[weapon].maxDamage + 1);

    this.weapons[weapon].uses--;

    if (this.weapons[weapon].uses <= 0) {

      this.weapons[weapon].uses = 0;
      damage = 1;

    }

    return opponent.takeDamage(damage);

  }

}

// Hero class, inherits from Fighter

class Hero extends Fighter {

  constructor(obj) {

    super(obj);

  }

  // Attacks opponent. Same as Fighter attack function overridden with input.

  attack(opponent) {

    io.output("Choose your weapon by entering in the number of the weapon:");

    for (let i = 0; i < this.weapons.length; i++) {

      io.output(`[${i}] ${this.weapons[i].name} (remaining uses: ${this.weapons[i].uses})`);

    }

    let chosenWeapon = -1;

    while (chosenWeapon == -1 || isNaN(chosenWeapon) || chosenWeapon > this.weapons.length - 1) {

      chosenWeapon = io.input("Weapon: ");

    }

    let damage = Math.floor(Math.random() * this.weapons[chosenWeapon].maxDamage + 1);

    this.weapons[chosenWeapon].uses--;

    if (this.weapons[chosenWeapon].uses <= 0) {

      this.weapons[chosenWeapon].uses = 0;
      damage = 1;

    }

    io.output("");

    return opponent.takeDamage(damage);

  }

}

// IO class, used for processing IO

class IO {

  constructor(ioType) {

    this.ioType = ioType;

  }

  // io.outputs a string
  output(str) {

    if (this.ioType == "console")
      console.log(str);

    else {

      // Put io.output to DOM code here

    }

  }

  input(str) {

    if (this.ioType == "console")
      return readline.question(str);

    else {

      // put input from DOM here

    }

  }

}

let io = new IO("console");

/* ====================== GAME FUNCTIONS ============================ */

// Returns a new character

function createCharacter() {

  const characterClasses = ["Elf", "Human", "Orc"];

  let heroName = io.input("What will your hero's name be? ");

  let characterClass = -1;
  let heroFaction = "undefined";
  let heroLanguage = "undefined";

  io.output(`\nThere are ${characterClasses.length} classes available to you as an adventurer.`);
  io.output("You may choose one of the following:\n");

  for (let i = 0; i < characterClasses.length; i++) {

    io.output(`[${i}]: ${characterClasses[i]}`);

  }

  while (characterClass == -1 || isNaN(characterClass) || characterClass > characterClasses.length - 1) {

    characterClass = io.input("\nWhich class do you choose? ");

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

      let victory = hero.attack(villian);

      if (victory) {

        villian.destroy();
        io.output(`${hero.name} has won!\n`);
        battling = false;
        return true;

      }

      turn = 2;

    }

    else { // Villian's turn

      let victory = villian.attack(hero);

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

io.output("Fight until you die!");

let numVictories = 0;
let fighting = true;

while (fighting) {

  let myVillian = new Fighter({
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

io.output(`Great job, ${hero.name}. You have successfully slain ${numVictories} villians.`);
