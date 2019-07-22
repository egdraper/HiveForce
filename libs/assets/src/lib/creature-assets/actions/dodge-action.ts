import { Action } from './action.model';

export class DodgeAction extends Action { 
    public name: "Dodge"
    public execute(): boolean { return false }
}