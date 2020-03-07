import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <hue-app-info></hue-app-info>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      hue-app-info {
        width: 400px;
        display: block;
        margin: auto;
      }
    `
  ]
})
export class AppComponent {
  generateAuthUrl() {}
}
