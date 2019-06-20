import { Component } from '@angular/core';

@Component({
  selector: 'hive-force-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hive-force';

  public onCreateCreatureClicked(): void {
    character = new CreatureAsset()
  }
}