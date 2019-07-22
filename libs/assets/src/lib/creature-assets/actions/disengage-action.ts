import { Action } from './action.model';

export class DisengageAction extends Action {
    public name = "Disengage"
    public execute(): boolean { return false }
 }