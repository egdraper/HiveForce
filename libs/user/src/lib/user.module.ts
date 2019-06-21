import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from "./user.service";

@NgModule({
  imports: [CommonModule],
  providers: [User]
})
export class UserModule {}
