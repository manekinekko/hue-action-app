import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-root",
  template: `
    <section class="lamp">
      <img (click)="changeBackground()" src="/assets/lamp.svg" />
      <div class="ray"></div>
    </section>
    <router-outlet></router-outlet>
    <footer>
      Made by
      <a target="__blank" href="https://twitter.com/@manekinekko"
        >Wassim Chegham</a
      >
      •
      <a target="__blank" href="https://github.com/manekinekko/hue-action-app"
        >Contribute</a
      >
      •
      <a
        target="__blank"
        href="https://github.com/manekinekko/hue-action-app/blob/master//PRIVACY.md"
        >Privacy</a
      >
      •
      <a
        target="__blank"
        href="https://github.com/manekinekko/hue-action-app/blob/master//AFFILIATION_NOTICE.md"
        >Non Affiliation notice</a
      >
    </footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .lamp {
        width: 100px;
        animation: swing ease-in-out 1s infinite alternate;
        transform-origin: center -20px;
        cursor: pointer;
        position: absolute;
        margin-top: -110px;
        z-index: 999999;
      }
      .ray {
        display: block;
        height: 100px;
        width: 200px;
        margin-top: -39px;
        z-index: 999999999999;
        background: rgb(255, 255, 0);
        background: linear-gradient(
          180deg,
          rgba(255, 255, 0, 0.3) 0%,
          rgba(255, 255, 255, 0) 50%
        );
        clip-path: polygon(26% 0, 74% 0, 100% 100%, 0 100%);
        margin-left: -50px;
        visibility: var(--ray-visibility);
      }
      body.dark-theme .ray {
        visibility: visible;
      }
      footer {
        position: absolute;
        bottom: 10px;
        text-align: center;
        width: 100%;
        display: inline-block;
        left: 0;
        color: #9a9a9a;
      }

      @keyframes swing {
        0% {
          transform: rotate(3deg);
        }
        100% {
          transform: rotate(-3deg);
        }
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
