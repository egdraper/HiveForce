import { CreatureAsset } from "@hive-force/assets"
import { RacialTraits } from './racial-traits/base.traits';
import { Class } from "@hive-force/class"

export class Race {
    name: string
    age: number
    alignment: "Lawful Good" | "Neutral Good" | "Chaotic Good" | "Lawful Neutral" | "Neutral" | "Chaotic Netrual" | "Lawful Evil" | "Neutral Evil" | "Chaotic Evil"
    abilityScoreIncrease: Array<AbilityScoreIncrease>
    traits: Array<RacialTraits>
    toolProficiencies: string[]
    Languages: string[]
    vision: number
    speed

}

export class AbilityScoreIncrease { 
    ability: string
    amount: number
}