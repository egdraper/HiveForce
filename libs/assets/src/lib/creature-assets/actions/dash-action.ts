import { Action } from './action.model';

export class DashAction extends Action { 
    public name: "Dash"
    public execute(): boolean { return false }
}