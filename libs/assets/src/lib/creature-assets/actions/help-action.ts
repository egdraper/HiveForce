import { Action } from './action.model';

export class HelpAction extends Action { 
    public name: "Help"
    public execute(): boolean { return false}
}