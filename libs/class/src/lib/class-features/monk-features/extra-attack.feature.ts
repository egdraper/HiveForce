import { Action } from 'rxjs/internal/scheduler/Action';
import { ClassFeature } from '../class.features';
import { CreatureAsset } from '@hive-force/assets';
import { Weapon } from '@hive-force/items';
import { AttackAction } from '@hive-force/actions';
import { MasterLog } from '@hive-force/log';
import { MonkFeature } from './monk.feature';
import { Monk } from '../../monk.class';
import { Subject } from 'rxjs';

export class ExtraAttack extends MonkFeature  {
    public name = 'Extra Attack';
    public startLevel = 5;
    public duration = 'action';
    public usesActionPoints = true;
    public usesBonusAction = true;
    public requiresAttackAction = true;
    public disabled = true


    public execute(player: CreatureAsset, characters: Array<CreatureAsset>): void {
        new AttackAction().execute(player, characters);
        this.disabled = true
    }  
}