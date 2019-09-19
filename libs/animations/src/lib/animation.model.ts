import { ActionAnimation } from './action-animation'
import { Weapon } from '@hive-force/items'

export class AnimatingWeapon extends Weapon {
  public strikeAnimation?: ActionAnimation
  public hitAnimation?: ActionAnimation
}