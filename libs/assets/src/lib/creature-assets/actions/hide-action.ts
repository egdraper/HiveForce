import { Action } from './action.model';

export class HideAction extends Action { 
    public name: "Hide"
    public execute(): boolean { return false }
}