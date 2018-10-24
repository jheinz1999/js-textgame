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

    if (this.status == "POISONED") {

      let damage = Math.floor(Math.random() * 9 + 1);
      console.log(`${this.name} took ${damage} damage due to poison.`);

      this.hp -= damage;
      console.log(`${this.name}'s current HP: ${this.hp}`);

      this.statusTime--;

      if (this.statusTime == 0)
        this.status = "NORMAL";

    }

    if (this.status == "BLEEDING") {

      let damage = Math.floor(Math.random() * 9 + 1);
      console.log(`${this.name} took ${damage} damage due to bleeding.`);

      this.hp -= damage;
      console.log(`${this.name}'s current HP: ${this.hp}`);

      this.statusTime--;

      if (this.statusTime == 0)
        this.status = "NORMAL";

    }

    if (this.status == "BURNED") {

      let damage = Math.floor(Math.random() * 9 + 1);
      console.log(`${this.name} took ${damage} damage due to a burn.`);

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
      io.output(`${this.name} used his ${this.weapons[weapon].name}`);

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
    "BURNED": Takes damage a bit for n turns
    "BLEEDING": Takes damage a bit for n turns

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

  async chooseWeapon() {

    let me = this;

    return new Promise(async function(success) {

      io.output("Choose your weapon by entering in the number of the weapon:");

      for (let i = 0; i < me.weapons.length; i++) {

        io.output(`[${i}] ${me.weapons[i].name} ${me.weapons[i].weaponType} (remaining uses: ${me.weapons[i].uses})`);

      }

      let chosenWeapon = -1;

      while (chosenWeapon == -1 || isNaN(chosenWeapon) || chosenWeapon > me.weapons.length - 1) {

        chosenWeapon = await io.input("Weapon: ");

      }

      success(chosenWeapon);

    });

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
      document.querySelector(".container .console .output").scrollTop = document.querySelector(".container .console .output").scrollHeight;

    }

    // console.log();
    // console.log(`they used thier ${this.weapons[chosenWeapon].name} ${this.weapons[chosenWeapon].weaponType}`);
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

let start = true;

let io = new IO("window");

/* ====================== GAME FUNCTIONS ============================ */

// Returns a new character

async function createCharacter() {

  return new Promise(async function(success) {

    const characterClasses = ["Elf", "Human", "Orc"];
    const characterType = ["Swordsman", "Ranger", "wizard"];

    let heroName = await io.input("What will your hero's name be? ");

    let characterClass = -1;
    let heroFaction = "undefined";
    let heroLanguage = "undefined";

    io.output(`\nThere are ${characterClasses.length} Races available to you as an adventurer.`);
    io.output("You may choose one of the following:\n");

    for (let i = 0; i < characterClasses.length; i++) {

      io.output(`[${i}]: ${characterClasses[i]}`);

    }

    while (characterClass == -1 || isNaN(characterClass) || characterClass > characterClasses.length - 1) {

      characterClass = await io.input("\nWhich Race do you choose? ");

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


    //weapon choosing
  let characterWeapon = -1;
  let newWeapon = "undefined";
  let heroClass = "underfined";

  io.output(`\nThere are ${characterClasses.length} Classes available to you as an adventurer.`);
  io.output("You may choose one of the following:\n");

  for (let i = 0; i < characterType.length; i++) {

    io.output(`[${i}]: ${characterType[i]}`);

  }

  while (characterWeapon == -1 || isNaN(characterWeapon) || characterWeapon > characterType.length - 1) {

    characterWeapon = await io.input("\nWhich class do you choose? ");

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


    io.output(`Welcome to the ${heroFaction}, ${heroName} the ${heroClass}.\n`);

    return success(new Hero({
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
        }));
  })
}



// Battle function. returns whether hero won or not.

async function battle(hero, villian) {

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

      let weapon = await hero.chooseWeapon();

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

async function game() {

  io.output("Welcome to my game. Please create a character.\n");

  const hero = await createCharacter();

  io.output("Fight until you die!");

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

    fighting = await battle(hero, myVillian);

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

}

game();
