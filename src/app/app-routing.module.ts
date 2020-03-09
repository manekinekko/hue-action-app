import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HueAppInfoComponent } from "./hue-app-info/hue-app-info.component";
import { HueRegisterComponent } from "./hue-register/hue-register.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HueAppInfoComponent
  },
  {
    path: "register",
    component: HueRegisterComponent
  },
  {
    path: "**",
    redirectTo: "/"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
