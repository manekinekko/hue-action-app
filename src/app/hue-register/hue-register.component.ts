import { Component } from "@angular/core";
import { skip } from "rxjs/operators";
import { FormBuilder, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "hue-app-register",
  template: `
    <form [formGroup]="appInfoForm" novalidate>
      <mat-card class="mat-elevation-z8">
        <mat-card-header>
          <h1>HUE App ⇌ Github Action</h1>
        </mat-card-header>
        <mat-divider></mat-divider>
        <mat-progress-bar
          [hidden]="!loading"
          mode="indeterminate"
        ></mat-progress-bar>
        <mat-card-content *ngIf="!loading">
          <div class="row">
            <mat-form-field class="full-width">
              <input
                matInput
                placeholder="AppId"
                formControlName="appId"
                autocomplete="off"
              />
            </mat-form-field>
          </div>
          <div class="row">
            <mat-form-field class="full-width">
              <input
                matInput
                placeholder="Client ID"
                formControlName="clientId"
                autocomplete="off"
              />
            </mat-form-field>
          </div>
          <div class="row">
            <p>
              Use the HUE action as part of your Github workflow:
            </p>
            <pre><code>{{appInfoForm.controls['codeSnippet'].value}}</code></pre>
          </div>
        </mat-card-content>
        <mat-divider></mat-divider>
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="copyToClipboard(clipboard)"
            [disabled]="loading"
          >
            {{ copyAction }}
          </button>
          <button
            mat-raised-button
            color="warn"
            (click)="revoke()"
            [disabled]="loading"
          >
            Revoke
          </button>
        </mat-card-actions>
      </mat-card>
      <textarea
        #clipboard
        formControlName="codeSnippet"
        class="clipboard"
      ></textarea>
    </form>
  `,
  styles: [
    `
      [hidden] {
        visibility: hidden;
      }
      form {
        margin: 20px;
      }
      .full-width {
        width: 100%;
      }
      mat-card-header {
        justify-content: center;
      }
      mat-card-content {
        padding: 20px;
      }
      mat-card-actions {
        display: flex;
        justify-content: space-between;
      }
      mat-progress-bar {
        position: absolute;
        left: 0px;
      }
      .copy-to-clipboard {
        cursor: pointer;
      }
      .clipboard {
        position: absolute;
        left: -9999px;
      }
    `
  ]
})
export class HueRegisterComponent {
  loading = false;
  copyAction = "Copy Action Snippet";
  codeSnippet = "";
  appInfoForm = this.fb.group({
    clientId: [
      {
        value: "",
        disabled: true
      }
    ],
    appId: [
      {
        value: "",
        disabled: true
      }
    ],
    codeSnippet: [
      {
        value: "",
        disabled: false
      }
    ]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  async ngOnInit() {
    this.loading = true;
    const { code, state } = this.route.snapshot.queryParams;
    const { webhook, clientId, appId } = await this.post(
      environment.api.registerUrl,
      {
        code,
        state
      }
    );
    const codeSnippet = `
- name: Run Hue Action
  uses: ./
  id: hue
  with:
    hueWebhook: "${webhook}"
    hueLightId: "1"
`;
    this.appInfoForm.patchValue({ codeSnippet, clientId, appId });
    this.loading = false;
  }

  async revoke() {
    this.loading = true;
    const { state } = this.route.snapshot.queryParams;
    const res = await this.post(environment.api.revokeUrl, { state });
    this.loading = false;
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
    this.copyAction = "Copied!";
  }
}
