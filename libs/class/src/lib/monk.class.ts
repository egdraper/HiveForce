import { Attributes, CreatureAsset } from '@hive-force/assets';
import { Class } from './base.class';
import { Action, AttackAction } from '@hive-force/actions';
import { StunningStrike } from './class-features/monk-features/stunning-strike.feature';
import { FurryOFBlows } from './class-features/monk-features/furry-of-blows.feature';
import { Weapon, Item } from '@hive-force/items';
import { UnarmoredDefense } from './class-features/monk-features';
import { UnarmedStrike } from "./class-features/monk-features/unarmed-strike.feature"
import { Subject } from 'rxjs';

export class Monk extends Class {
    public name = "Monk"
    public ki = 2

    public actionPerformed = new Subject<Action[]>()

    constructor(private attributes: Attributes, private inventory: Array<Item>) {
        super()
    }  

    public createClass(level: number): void {
       for(let i = 0; i < level; i++) {
         this["ToLevel"+i]()
       }
       this.attributes.actions = this.instantiateActions()
       this.getItems().forEach(a => this.inventory.push(a))
    }

    public loadClass(): void {

    }

     // for demo purposes
  private getItems(): Array<Weapon> {
    return [
      {
        description: 'Strong Weapon',
        diceEquation: '2d8',
        id: '1234',
        name: 'Mace',
        use: "Weapon",
        equipped: true,
        selected: true,
        type: "Brute",
      },
      {
        description: 'Small and Pokey',
        diceEquation: '1d4',
        id: '1237',
        name: 'Short Sword',
        use: "Weapon",
        equipped: false,
        selected: false,
        type: "Versatile",
      },
      {
        description: 'Fists of Fury',
        diceEquation: '1d6',
        id: '1235',
        equipped: true,
        name: "Fist",        
        use: "Weapon",
        selected: false,
        type: "Finesse",
      },      
      {
        description: 'Long Bow',
        diceEquation: '1d12',
        id: '1236',
        name: 'Silver Bow',        
        use: "Weapon",
        equipped: false,
        selected: true,
        type: "Ranged",
      },
    ];
  } 

    public instantiateActions(): Array<Action> {
        return [
           new AttackAction(), 
           new UnarmedStrike(this.actionPerformed),
           new StunningStrike(this.actionPerformed),
           new FurryOFBlows(this.actionPerformed)
        ]
    }

    public ToLevel1() {
      this.attributes.actions.push(new AttackAction())
      const unarmored = new UnarmoredDefense()
    }

    public ToLevel2() {
      this.attributes.actions.push(new UnarmedStrike(this.actionPerformed))
    }

    public ToLevel3() {
      this.attributes.actions.push(new FurryOFBlows(this.actionPerformed))
    }

    public ToLevel4() {
      // Slow Fall
    }
    
    public ToLevel5() {
      this.attributes.numberOfAttacksAllowed = 2
      this.attributes.actions.push(new StunningStrike(this.actionPerformed))
    }

    public ToLevel6() {

    }
    public ToLevel7() {}
    public ToLevel8() {}
    public ToLevel9() {}
    public ToLevel10() {}
    public ToLevel11() {}
    public ToLevel12() {}
    public ToLevel13() {}
    public ToLevel14() {}
    public ToLevel15() {}
    public ToLevel16() {}
    public ToLevel17() {}
    public ToLevel18() {}
    public ToLevel19() {}
    public ToLevel20() {}
}