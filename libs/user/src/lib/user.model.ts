
import { Item } from "@hive-force/items"
import { Map } from "@hive-force/maps"
import { CreatureAsset } from "@hive-force/assets"


export class UserInfo {
  id: string;
  userName: string;
  games: Array<Game>;
}

export class Game {
  id: string;
  name: string;
  players: { [id: string]: Player };
  maps: { [id: string]: Map };
}

export class Player {
  id: string;
  userName: string;
  character: PlayableCharacter;
}

export class Character extends CreatureAsset {

}

export class NonPlayableCharacter extends Character {}

export class PlayableCharacter extends Character {
  level: number;
}

