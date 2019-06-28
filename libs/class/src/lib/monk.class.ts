import { Attributes } from '@hive-force/assets';
import { Class } from './base.class';
import { UnarmoredDefense, StunningStrike, FurryOFBlows, MartialArts } from './class-features/monk.traits';
import { Action, AttackAction } from '@hive-force/actions';

export class Monk extends Class {
    public name = "Monk"
    public ki = 2

    constructor(private attributes: Attributes) {
        super()

    }
   

    public createClass(): void {
       this.attributes.actions = this.instantiateActions()
    }

    public loadClass(): void {

    }

    public instantiateActions(): Array<Action> {
        return [
           new AttackAction(), 
           new StunningStrike(),
           new MartialArts(),
           new FurryOFBlows()
        ]


    }

    
}