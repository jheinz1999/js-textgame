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

    console.log(`${this.name} was removed from the game.`);

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

     console.log(`${this.name} took damage.`);
     this.hp -= damage;
     console.log(`${this.name}'s current HP: ${this.hp}`);

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

    console.log(`${this.name} offers a greeting in ${this.language}`);

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

    console.log("Choose your weapon by entering in the number of the weapon:");

    for (let i = 0; i < this.weapons.length; i++) {

      console.log(`[${i}] ${this.weapons[i].name} ${this.weapons[i].weaponType} (remaining uses: ${this.weapons[i].uses})`);

    }

    let chosenWeapon = -1;

    while (chosenWeapon == -1 || isNaN(chosenWeapon) || chosenWeapon > this.weapons.length - 1) {

      chosenWeapon = readline.question("Weapon: ");

    }

    let damage = Math.floor(Math.random() * this.weapons[chosenWeapon].maxDamage + 1);

    this.weapons[chosenWeapon].uses--;

    if (this.weapons[chosenWeapon].uses <= 0) {

      this.weapons[chosenWeapon].uses = 0;
      damage = 1;

    }

    console.log();
    console.log(`they used thier ${this.weapons[chosenWeapon].name} ${this.weapons[chosenWeapon].weaponType}`);

    return opponent.takeDamage(damage);

  }

}

// weapon constructor function------------
class Weapon{
  constructor(obj){
    this.name = obj.name;
    this.maxDamage = obj.maxDamage;
    this.minDamage = obj.minDamage;
    this.weaponType = obj.weaponType;
    this.weaponTier = obj.weaponTier;
    this.uses = obj.uses;
  }
}

/* ====================== GAME FUNCTIONS ============================ */

// Returns a new character

function createCharacter() {

  const characterClasses = ["Elf", "Human", "Orc"];
  const characterType = ["Swordsman", "Ranger", "wizard"]

  let heroName = readline.question("What will your hero's name be? ");

  let characterClass = -1;
  let heroFaction = "undefined";
  let heroLanguage = "undefined";

  console.log(`\nThere are ${characterClasses.length} Races available to you as an adventurer.`);
  console.log("You may choose one of the following:\n");

  for (let i = 0; i < characterClasses.length; i++) {

    console.log(`[${i}]: ${characterClasses[i]}`);

  }

  while (characterClass == -1 || isNaN(characterClass) || characterClass > characterClasses.length - 1) {

    characterClass = readline.question("\nWhich class do you choose? ");

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

  console.log(`Welcome to the ${heroFaction}, ${heroName}.\n`);

//weapon choosing
  let characterWeapon = -1;
  let newWeapon = "undefined";
  let heroClass = "underfined";
  console.log(`\nThere are ${characterType.length} classes available to you as an adventurer.`);

  for (let i = 0; i < characterType.length; i++) {

    console.log(`[${i}]: ${characterType[i]}`);

  }

  while (characterWeapon == -1 || isNaN(characterWeapon) || characterWeapon > characterType.length - 1) {

    characterWeapon = readline.question("\nWhich class do you choose? ");

  }

  characterWeapon = Number.parseInt(characterWeapon);

  switch (characterWeapon) {

    case 0: // Elf
      heroClass = characterType[0];
      newWeapon = new Weapon({
        name: "Excalibur",
        maxDamage: 75,
        minDamage: 45,
        weaponType: "Sword",
        weaponTier: 0,
        uses: 10,
      });
      break;
    case 1:
      heroClass = characterType[1];
      newWeapon = new Weapon({
        name: "Vampire Killer",
        maxDamage: 75,
        minDamage: 45,
        weaponType: "CrossBow",
        weaponTier: 0,
        uses: 10,
      });
      break;
    case 2:
      heroClass = characterType[2];
      newWeapon = new Weapon({
        name: "Fire",
        maxDamage: 75,
        minDamage: 45,
        weaponType: "Wand",
        weaponTier: 0,
        uses: 30,
      });
      break;

  }

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
      new Weapon({
        name: "Piece o glass",
        maxDamage: 10,
        minDamage: 1,
        weaponType: "Dagger",
        weaponTier: 0,
        uses: 10,
      }),
      newWeapon
    ],
    language: heroLanguage,
    class: heroClass,
  });

}

// Battle function. returns whether hero won or not.

function battle(hero, villian) {

  // Introductions
  console.log();
  hero.greet();
  villian.greet();

  // Variables
  let battling = true;
  let turn = 1;

  // Game loop
  while (battling) {

    console.log();
    console.log(`Your HP: ${hero.hp}`);
    console.log(`Enemy HP: ${villian.hp}`);
    console.log();

    if (turn === 1) { // Hero's turn

      let victory = hero.attack(villian);

      if (victory) {

        villian.destroy();
        console.log(`${hero.name} has won!\n`);
        battling = false;
        return true;

      }

      turn = 2;

    }

    else { // Villian's turn

      let victory = villian.attack(hero);

      if (victory) {

        hero.destroy();
        console.log(`${villian.name} has won!\n`);
        battling = false;
        return false;

      }

      turn = 1;

    }

  }

}

/* ====================== THE GAME ============================ */

console.log("Welcome to my game. Please create a character.\n");

const hero = createCharacter();

console.log("Fight until you die!");

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
    console.log(`Great work, ${hero.name}! Your HP has been restored by ${20 + Math.floor(numVictories / 2) * 30} points. Now onto the next villian!`);
    hero.hp += 20 + Math.floor(numVictories / 3) * 4;
    hero.weapons[0].uses += 5;

    if (numVictories % 3 == 0)
      hero.weapons[1].uses += 10;

  }

}

console.log(`Great job, ${hero.name}. You have successfully slain ${numVictories} villians.`);
