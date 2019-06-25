import { CreatureAsset } from '@hive-force/assets';

export class ClassFeature { 
    public startLevel: number
    public name: string
    public savingThrow?: string
    public usesAction?: boolean
    public usesBonusAction?: boolean
    public usesReaction?: boolean
    public usesActionPoints?: boolean
    public actionPointAmmount?: number
    public durration?: string
   
    public perform(player?: CreatureAsset, characters?: Array<CreatureAsset>) {} 
     
   
   }