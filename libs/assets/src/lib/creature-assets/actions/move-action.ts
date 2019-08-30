import { Action } from './action.model';

export class MoveAction extends Action { 
    public name = "Move"
    public range = 5
    public maxRange = 5
    public executeWithoutAction = true
    public iconUrl = "../assets/move.png"
    public starting: string
    public execute(): boolean { return false }
}