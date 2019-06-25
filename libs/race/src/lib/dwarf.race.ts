import { Race, AbilityScoreIncrease } from './base.race';
import { StoneCunning } from './racial-traits/dwarf.traits';
import { Attributes } from '@hive-force/assets';

export class Dwarf extends Race {
    constructor(public attributes: Attributes) { 
        super()
    }

    buildCharacter(): void {
        // Ability Score Increase
        this.abilityScoreIncrease.push({ability: "Constitution", amount: 2})
        this.attributes.speed = 25
        this.attributes.vision = 60

        // Proficiencies
        this.attributes.skillPoficiencies.push({skill: "History" })
        
        // Racial Traites
        const stoneCunning = new StoneCunning()
        this.traits.push(new StoneCunning())        
        this.attributes.skillPoficiencies.push(stoneCunning.getFeatures())
        
        // Languages
        this.Languages.push("Common")
        this.Languages.push("Dwarvish")
    }
}

export class HillDwarf extends Dwarf {

    constructor(public attributes: Attributes) { 
        super(attributes)
    }

    public buildCharacter(): void {
        this.abilityScoreIncrease.push({ability: "Wisdom", amount: 1})
        super.buildCharacter()
    }

    public levelUp(): void {
        this.attributes.maxHitPoints += 1
    } 
}

export class MountainDwarf extends Dwarf {
    constructor(public attributes: Attributes) { 
        super(attributes)
    }

    public buildCharacter(): void {
        this.abilityScoreIncrease.push({ability: "Strength", amount: 2})
        this.attributes.armorProficiencies.push("Light Armor")
        this.attributes.armorProficiencies.push("Medium Armor")
        super.buildCharacter()
    }    
}

