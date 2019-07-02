import { Attributes } from '@hive-force/assets';
import { Class } from './base.class';
import { Action, AttackAction } from '@hive-force/actions';
import { StunningStrike } from './class-features/monk-features/stunning-strike.feature';
import { FurryOFBlows } from './class-features/monk-features/furry-of-blows.feature';
import { Weapon, Item } from '@hive-force/items';

export class Monk extends Class {
    public name = "Monk"
    public ki = 2

    constructor(private attributes: Attributes, private inventory: Array<Item>) {
        super()

    }  

    public createClass(): void {
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
        selected: false,
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
        name: 'Unarmed',        
        use: "Weapon",
        selected: true,
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
           new StunningStrike(),
           new FurryOFBlows()
        ]
    }

    
}