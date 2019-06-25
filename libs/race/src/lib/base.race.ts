import { CreatureAsset } from "@hive-force/assets"
import { RatialTraits } from './racial-traits/base.traits';
import { Class } from "@hive-force/class"

export class Race {
    attributes
    age: number
    alignment: "Lawful Good" | "Neutral Good" | "Chaotic Good" | "Lawful Neutral" | "Neutral" | "Chaotic Netrual" | "Lawful Evil" | "Neutral Evil" | "Chaotic Evil"
    abilityScoreIncrease: Array<AbilityScoreIncrease>
    traits: Array<RatialTraits>
    toolProficenies: string[]
    Languages: string[]
    class: Class

}

export class AbilityScoreIncrease { 
    ability: string
    amount: number
}