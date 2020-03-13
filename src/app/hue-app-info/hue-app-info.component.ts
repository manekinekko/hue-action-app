import { animate, style, transition, trigger } from "@angular/animations";
import { Component, Inject } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Component({
  selector: "hue-app-info",
  template: `
    <mat-card class="mat-elevation-z8">
      <div class="actions">
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
          *ngIf="!webhook"
          mat-stroked-button
          class="authorize"
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
          *ngIf="webhook"
          mat-stroked-button
          class="revoke"
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
      <p class="error" [hidden]="!error">{{ error }}</p>
      <div *ngIf="webhook" [@inOutAnimation]>
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
        <p>
          <strong>Note: DO NOT share this wehbook publicky!</strong>
        </p>
        <br />
        <p>
          2. (Optional) Customize <kbd>hueLightId</kbd> and
          <kbd>hueStatus</kbd>:
          <br />
          <mat-form-field color="accent">
            <mat-label color="accent">Choose light ID</mat-label>
            <mat-select
              [(value)]="selectedLightId"
              [disabled]="pingingWebhook"
              disableRipple="true"
            >
              <mat-option *ngFor="let light of lights" [value]="light.value">
                {{ light.viewValue }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field color="accent">
            <mat-label>Choose light status</mat-label>
            <mat-select
              [(value)]="selectedStatus"
              [disabled]="pingingWebhook"
              disableRipple="true"
            >
              <mat-option
                *ngFor="let status of statuses"
                [value]="status.value"
              >
                {{ status.viewValue }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button
            [disabled]="pingingWebhook"
            mat-stroked-button
            (click)="tryIt()"
            class="btn-try-it"
          >
            Try it
          </button>
        </p>
        <br />
        <p>
          3. Add this Hue Action snippet to your Github workflow:
        </p>
        <pre>
        <mat-icon class="copy-to-clipboard" (click)="copyToClipboard(actionSnippetClipboard, snippetCode)"
        svgIcon="filter_none" aria-hidden="false" aria-label="Copy code snippet">filter_none</mat-icon
        ><code #snippetCode>
- name: Run Hue Action
  uses: manekinekko/hue-action@v1.0
  if: {{this.selectedStatus}}()
  with:
    hueWebhook: <span ngNonBindable>\${{ secrets.HUEACTION_WEBHOOK }}</span>
    hueLightId: "{{this.selectedLightId}}"
    hueStatus: "{{this.selectedStatus}}"
        </code></pre>
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
      mat-card > div {
        z-index: 1000;
      }
      mat-form-field {
        margin: 20px 16px -12px;
      }
      :host .mat-select-value {
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
        color: #ff4081;
        display: inline-block;
        line-height: 1;
        background: #f1f1f1;
        padding: 2px 4px;
      }
      pre {
        border: 1px solid #b4b4b4;
        color: #ff4081;
        padding: 6px 10px;
        background: #f1f1f1;
        overflow: auto;
        border-radius: 3px;
      }
      .revoke,
      .authorize {
        position: absolute;
        left: 254px;
        top: 76px;
        background: white;
        margin: auto 0;
        width: 110px;
      }
      button.btn-try-it > span {
        display: flex;
        flex-direction: row;
        align-items: center;
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
      .error {
        text-align: center;
        color: red;
        position: absolute;
        width: 100%;
        left: 0px;
        top: 130px;
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
  lights: { value: string; viewValue: string }[] = [];
  selectedLightId: string;
  statuses: any[] = [
    { value: "success", viewValue: "success" },
    { value: "failure", viewValue: "failure" }
  ];
  selectedStatus: string;
  pingingWebhook = false;
  progressBarColor: "primary" | "accent" | "warn" = "primary";
  progressBarMode: "buffer" | "indeterminate" | "determinate" | "query" =
    "buffer";
  webhook = null;
  error = null;
  constructor(
    @Inject("WINDOW") public window: Window,
    private readonly _iconRegistry: MatIconRegistry,
    private readonly _sanitizer: DomSanitizer
  ) {
    _iconRegistry.addSvgIcon(
      "filter_none",
      _sanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/filter_none-24px.svg"
      )
    );
    _iconRegistry.addSvgIcon(
      "lock",
      _sanitizer.bypassSecurityTrustResourceUrl("assets/icons/lock-24px.svg")
    );
    _iconRegistry.addSvgIcon(
      "lock_open",
      _sanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/lock_open-24px.svg"
      )
    );
  }

  async ngOnInit() {
    this.selectedStatus = this.statuses[0].value;

    this.error = null;
    const { code, state, error } = this.getQueryParams();

    if (error?.includes("access_denied")) {
      this.error = "You need to grant permission to continue!";
      this.progressBarMode = "buffer";
      this.progressBarColor = "accent";
    } else if (code && state) {
      this.progressBarMode = "indeterminate";
      this.progressBarColor = "primary";
      const { webhook, status, lights } = await this.post(
        environment.api.registerUrl,
        {
          code,
          state,
          prod: environment.production
        }
      );

      if (status === 404 || status === 500) {
        // account not found
        this.error = "Unknown account.";
      } else if (status === 410) {
        // account revoked
        this.error = "Account revoked.";
      } else {
        // status === 200
        this.lights = lights.map(lightMetadata => {
          return {
            value: lightMetadata._data.id,
            viewValue: `${lightMetadata._data.name} (id: ${lightMetadata._data.id})`
          };
        });
        this.selectedLightId = this.lights[0].value;

        this.webhook = webhook;
        this.progressBarMode = "query";
        this.progressBarColor = "accent";
      }
    }
  }

  async authorize() {
    this.error = null;
    this.progressBarMode = "indeterminate";
    this.progressBarColor = "primary";
    try {
      const { auth } = await this.post(environment.api.authUrl, {
        prod: environment.production
      });
      document.location.href = auth;
    } catch (error) {
      this.progressBarMode = "buffer";
      this.progressBarColor = "accent";
      this.error = error.toString();
      console.log(error);
    }
  }

  async revoke() {
    this.error = null;
    this.progressBarMode = "indeterminate";
    this.progressBarColor = "primary";
    const { state } = this.getQueryParams();
    try {
      const res = await this.post(environment.api.revokeUrl, { state });
      if (res.error) {
        this.error = res.error;
      }
      this.progressBarMode = "buffer";
      this.progressBarColor = "primary";
      // this.webhook = null;
      this.webhook = null;
      this.window.history.pushState({}, "", "/");
    } catch (error) {
      this.progressBarMode = "buffer";
      this.progressBarColor = "accent";
      this.error = error.toString();
      console.log(error);
    }
  }

  async tryIt() {
    this.error = null;
    this.pingingWebhook = true;
    this.progressBarMode = "buffer";
    this.progressBarColor = "accent";
    const res = await this.post(this.webhook, {
      lightId: this.selectedLightId,
      status: this.selectedStatus,
      prod: environment.production
    });
    if (res.error) {
      this.error = res.error;
      this.progressBarMode = "buffer";
      this.progressBarColor = "warn";
    } else {
      this.progressBarMode = "query";
      this.progressBarColor = "accent";
      this.error = null;
    }
    this.pingingWebhook = false;
  }

  async post(url: string, body: object) {
    try {
      return await (
        await fetch(url, {
          method: "post",
          body: JSON.stringify(body)
        })
      ).json();
    } catch (error) {
      this.error = error;
    }
  }

  copyToClipboard(textarea: HTMLTextAreaElement, code?: HTMLElement) {
    if (code) {
      textarea.value = code.textContent;
    }
    textarea.select();
    document.execCommand("copy");
  }

  getQueryParams() {
    var urlParams = new URLSearchParams(this.window.location.search);
    var code = urlParams.get("code");
    var state = urlParams.get("state");
    var error = urlParams.get("error");
    return {
      code,
      state,
      error
    };
  }
}
