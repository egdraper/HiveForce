import { Action } from './action.model';

export class CastAction extends Action { 
    public name: "Cast"
    public execute(): boolean { return false }
}