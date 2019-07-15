import { RacialTraits } from './base.traits';

export class StoneCunning implements RacialTraits{
    public name = "Stone Cunning"
    public description: ""
    public getFeatures(): any {
      return {skill: "History", specialization: "StoneWork" }
    }  
}