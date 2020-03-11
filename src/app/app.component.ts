import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-root",
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `
  ]
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  changeBackground() {
    this.document.body.classList.toggle("dark-theme");
  }
}
