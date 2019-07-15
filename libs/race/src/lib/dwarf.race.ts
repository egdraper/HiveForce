import { Race, AbilityScoreIncrease } from './base.race';
import { StoneCunning } from './racial-traits/dwarf.traits';
import { Attributes } from '@hive-force/assets';

export class Dwarf extends Race {
    public name = "Dwarf"

    constructor(public attributes: Attributes) { 
        super()
    }

    buildCharacter(): void {
        // Ability Score Increase
        this.abilityScoreIncrease.push({ability: "Constitution", amount: 2})
        this.speed = 25
        this.vision = 60

        // Proficiencies
        this.attributes.skillProficiencies.push({skill: "History" })
        
        // Racial Traits
        const stoneCunning = new StoneCunning()
        this.traits.push(new StoneCunning())        
        this.attributes.skillProficiencies.push(stoneCunning.getFeatures())
        
        // Languages
        this.Languages.push("Common")
        this.Languages.push("Dwarfish")
    }
}

export class HillDwarf extends Dwarf {
    public name = "Hill Dwarf"

    constructor(public attributes: Attributes) { 
        super(attributes)
    }

    public buildCharacter(): void {
        // this.abilityScoreIncrease.push({ability: "Wisdom", amount: 1})
        // super.buildCharacter()
    }

    public levelUp(): void {
        this.attributes.maxHitPoints += 1
    } 
}

export class MountainDwarf extends Dwarf {
    public name = "Mountain Dwarf"

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

