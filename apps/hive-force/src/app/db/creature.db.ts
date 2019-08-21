// import { Attributes, CreaturesEffect, Action, CreatureAsset } from "@hive-force/assets"
// import { Item } from '@hive-force/items';


// export interface CreatureAssetModel {
//   id: string,
//   name: string,
//   level: number,
//   nonPlayableCharacter: true,
//   race: string,
//   attributes: Attributes, 
//   effects: Array<CreaturesEffect>,
//   inventory: Array<Item>,
//   disabled: false,
//   aggressive: true,
//   inInitiative: false,
//   actionPerformed: Array<Action>,
//   engagedWith: CreatureAsset,
//   location: {
//     x: number, 
//     y: number,
//   },
//   sprite: string
// }


// export class CreatureDB {
//     public get(spriteName: string): CreatureAssetModel {
//       return creatureDBCollection[spriteName];
//     }
//   }

// const creatureDBCollection: {[name: string]: CreatureAssetModel } = {
//     "basicSkeleton": {
//         id: "basicSkeleton",
//         name: "Basic Skeleton",
//         level: 1,
//         nonPlayableCharacter: true,
//         race: "monster",
//         attributes: {
//             attacksRemaining: 2,
//             numberOfAttacksAllowed: 2,
//             hasAdvantage: false,
//             hasDisadvantage: false,
//             actions: [ "moveAction", "attackAction" ],
//             actionsPerformed: [],
//             actionsQueued: [],
//             actionsRemaining: 2,
//             armorProficiencies: [],
//             armorClass: 12,
//             bonusActions: [],
//             bonusActionsRemaining: 0,
//             bonusHp: 0,
//             charisma: 10,
//             charismaModifier: 0,
//             constitution: 18,
//             constitutionModifier: 4,
//             currentHitPoints: 66,
//             dexterity: 8,
//             dexterityModifier: -1,
//             experience: 0,
//             height: 6,
//             hostile: true,
//             immunities: ["poison", "bludgeoning"],
//             intelligence: 8,
//             intelligenceModifier: -1,
//             maxActions: 1,
//             maxBonusActions: 0,
//             maxHitPoints: 66,
//             proficiencyBonus: 0,
//             senses: ["blood"],
//             selectedAction: "MoveAction",
//             size: 'medium',
//             skills: [],
//             skillProficiencies: [],
//             strength: 16,
//             strengthModifier: 3,
//             weight: 200,
//             weaponProficiencies: [],
//             wisdom: 8,
//             wisdomModifier: -1,
//             resistances: ['piercing damage'],
//             vulnerabilities: ["fire"]
//           },
//         effects: [],
//         inventory: [],
//         disabled: false,
//         aggressive: true,
//         inInitiative: false,
//         actionPerformed: [],
//         engagedWith: null,
//         location: {
//           x: 10, 
//           y: 12,
//         },
//         sprite: "basicSkeleton"
//     }
// }