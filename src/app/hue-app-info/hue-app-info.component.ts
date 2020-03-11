import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { environment } from "src/environments/environment";
import { trigger, transition, style, animate } from "@angular/animations";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "hue-app-info",
  template: `
    <mat-card class="mat-elevation-z8">
      <div>
        <img
          width="60px"
          src="/assets/philipsHue.webp"
          alt="Philips Hue logo"
        />
        <mat-progress-bar
          [mode]="progressBarMode"
          [color]="progressBarColor"
        ></mat-progress-bar>
        <button
          *ngIf="!actionSnippet"
          mat-stroked-button
          color="primary"
          (click)="authorize()"
        >
          Authorize
          <mat-icon
            svgIcon="lock_open"
            aria-hidden="false"
            aria-label="Authorize Philips Hue access"
            >lock_open</mat-icon
          >
        </button>
        <button
          *ngIf="actionSnippet"
          mat-stroked-button
          color="accent"
          (click)="revoke()"
        >
          Revoke
          <mat-icon
            svgIcon="lock"
            aria-hidden="false"
            aria-label="Revoke Philips Hue access"
            >lock</mat-icon
          >
        </button>
        <img
          width="60px"
          src="/assets/github-actions.webp"
          alt="Github Actions logo"
        />
      </div>
      <div *ngIf="actionSnippet" [@inOutAnimation]>
        <br />
        <br />
        <h2>You are almost done!</h2>
        <p>
          1. Create a
          <a
            target="__blank"
            href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets"
            >GitHub secret</a
          >
          called <kbd>HUEACTION_WEBHOOK</kbd> with:
        </p>
        <pre><mat-icon svgIcon="filter_none" aria-hidden="false" aria-label="Copy code snippet" class="copy-to-clipboard" (click)="copyToClipboard(webhookClipboard)"
          >filter_none</mat-icon
        ><code>{{ webhook }}</code></pre>
        <p><strong>Note: DO NOT share this wehbook publicky!</strong></p>
        <br />
        <p>
          2. Add this HUE Action snippet as part of your Github workflow:
        </p>
        <pre>
        <mat-icon class="copy-to-clipboard" (click)="copyToClipboard(actionSnippetClipboard)"
        svgIcon="filter_none" aria-hidden="false" aria-label="Copy code snippet">filter_none</mat-icon
        ><code>{{actionSnippet}}</code></pre>
      </div>
    </mat-card>
    <label for="webhookClipboard" class="clipboard"></label>
    <textarea
      id="webhookClipboard"
      #webhookClipboard
      [value]="webhook"
      class="clipboard"
    ></textarea>
    <label for="actionSnippetClipboard" class="clipboard"></label>
    <textarea
      id="actionSnippetClipboard"
      #actionSnippetClipboard
      [value]="actionSnippet"
      class="clipboard"
    ></textarea>
  `,
  styles: [
    `
      mat-card {
        display: flex;
        padding: 60px;
        width: 500px;
        flex-direction: column;
        overflow: hidden;
        background-color: var(--background-color);
        color: var(--color);
      }
      img {
        width: 60px;
        margin: 0px;
        left: 10px;
        position: relative;
        z-index: 1;
      }
      img:last-child {
        left: -10px;
      }
      mat-progress-bar {
        width: 370px;
        top: 32px;
      }
      mat-card > div:first-child {
        display: flex;
        align-items: flex-start;
      }

      kbd {
        border-radius: 3px;
        color: #3292ff;
        display: inline-block;
        line-height: 1;
        background: #f1f1f1;
        padding: 2px 4px;
      }
      pre {
        border: 1px solid #b4b4b4;
        color: #3292ff;
        padding: 6px 10px;
        background: #f1f1f1;
        overflow: auto;
        border-radius: 3px;
      }
      button {
        position: absolute;
        left: 254px;
        top: 76px;
        background: white;
        margin: auto 0;
        width: 110px;
      }
      .copy-to-clipboard {
        cursor: pointer;
        position: absolute;
        right: 65px;
        margin-top: -3px;
      }
      .clipboard {
        position: absolute;
        left: -9999px;
      }
    `
  ],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ height: 0, opacity: 0 }),
        animate("0.4s ease-out", style({ height: 300, opacity: 1 }))
      ]),
      transition(":leave", [
        style({ height: 300, opacity: 1 }),
        animate("0.4s ease-in", style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class HueAppInfoComponent {
  progressBarColor: "primary" | "accent" = "primary";
  progressBarMode: "buffer" | "indeterminate" | "determinate" | "query" =
    "buffer";
  actionSnippet = null;
  webhook = null;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "filter_none",
      sanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/filter_none-24px.svg"
      )
    );
    iconRegistry.addSvgIcon(
      "lock",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/lock-24px.svg")
    );
    iconRegistry.addSvgIcon(
      "lock_open",
      sanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/lock_open-24px.svg"
      )
    );
  }

  async ngOnInit() {
    const { code, state } = this.route.snapshot.queryParams;
    if (code && state) {
      this.progressBarMode = "indeterminate";
      const { webhook, status } = await this.post(environment.api.registerUrl, {
        code,
        state
      });

      if (status === 404) {
        // action not found
      } else if (status === 501) {
        // action pending
      } else if (status === 503) {
        // action revoked
      } else {
        this.webhook = webhook;
        this.actionSnippet = `
- name: Run Hue Action
  uses: manekinekko/hue-action@v1
  if: success()
  with:
    hueWebhook: \${{ secrets.HUEACTION_WEBHOOK }}
    hueLightId: "1"
    hueStatus: "success"
      `;
        this.progressBarMode = "query";
        this.progressBarColor = "accent";
      }
    }
  }

  async authorize() {
    this.progressBarMode = "indeterminate";
    const { auth } = await this.post(environment.api.authUrl, {});
    document.location.href = auth;
  }

  async revoke() {
    this.progressBarMode = "indeterminate";
    const { state } = this.route.snapshot.queryParams;
    const res = await this.post(environment.api.revokeUrl, { state });
    this.progressBarMode = "indeterminate";
    this.progressBarColor = "primary";
    this.actionSnippet = null;
    this.webhook = null;
    this.router.navigateByUrl("/");
  }

  async post(url: string, body: object) {
    return await (
      await fetch(url, {
        method: "post",
        body: JSON.stringify(body)
      })
    ).json();
  }

  copyToClipboard(el: HTMLTextAreaElement) {
    el.select();
    document.execCommand("copy");
  }
}
