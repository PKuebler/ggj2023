type TreeType = "OAK" | "MAPLE" | "PINE";

class Tree {
  type: TreeType;
  height: number;
  health: number;
  water: number;
  fertilizer: number;
  insects: number;

  constructor(treeType: TreeType) {
    this.type = treeType;
    this.height = 0;
    this.health = 100;
    this.water = 0;
    this.fertilizer = 0;
    this.insects = 0;
    console.log(`Ein ${treeType}-Baum wurde gepflanzt.`);
  }

  growRoots(): void {
    this.water += 10;
    console.log("Die Wurzeln des Baumes wachsen, weil sie gegossen wurden.");
  }

  grow(): void {
    if (this.water >= 10 && this.fertilizer >= 5) {
      this.height += 10;
      this.health += 10;
      this.water -= 10;
      this.fertilizer -= 5;
      console.log("Der Baum wächst und seine Gesundheit verbessert sich.");
    } else {
      console.log("Der Baum benötigt mehr Wasser und Düngemittel, um zu wachsen.");
    }
  }

  addFertilizer(): void {
    this.fertilizer += 10;
    console.log("Düngemittel wurde dem Baum hinzugefügt.");
  }

  preventInsects(): void {
    this.insects = 0;
    console.log("Schädlinge wurden von dem Baum entfernt.");
  }

  randomInsectAttack(): void {
    let randomNumber = Math.random();
    if (randomNumber <= 0.5) {
      this.insects += 5;
      this.health -= 5;
      console.log("Ein Schädlingsbefall tritt auf und beeinträchtigt die Gesundheit des Baumes.");
    } else {
      console.log("Glücklicherweise tritt kein Schädlingsbefall auf.");
    }
  }

  checkWinningCondition(): void {
    if (this.height >= 100 && this.health >= 90 && this.insects === 0) {
      console.log(`Gratulation! Du hast den ${this.type}-Baum erfolgreich gepflegt.`);
    } else {
      console.log("Es sind noch weitere Anstrengungen erforderlich, um den Baum erfolgreich zu pflegen.");
    }
  }
}

let tree1 = new Tree("OAK");
let tree2 = new Tree("MAPLE");

let trees = [tree1, tree2];

for(let l = 0; l < 20; l++) {
  for (let i = 0; i < trees.length; i++) {
    trees[i].growRoots();
    trees[i].grow();
    trees[i].addFertilizer();
    trees[i].preventInsects();
    trees[i].randomInsectAttack();
    trees[i].checkWinningCondition();
  }
}