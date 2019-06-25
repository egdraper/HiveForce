import { RatialTraits } from './base.traits';

export class StoneCunning implements RatialTraits{
    public name = "Stone Cunning"
    public description: ""
    public getFeatures(): any {
      return {skill: "History", specialization: "StoneWork" }
    }  
}