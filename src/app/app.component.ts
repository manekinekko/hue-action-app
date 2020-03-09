import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      hue-app-info {
        width: 450px;
        display: block;
        margin: auto;
      }
    `
  ]
})
export class AppComponent {
  generateAuthUrl() {}
}
