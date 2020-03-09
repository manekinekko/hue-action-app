import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HueAppInfoComponent } from "./hue-app-info/hue-app-info.component";

const routes: Routes = [
  {
    path: "",
    component: HueAppInfoComponent
  },
  {
    path: "",
    redirectTo: "/",
    pathMatch: "full"
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
