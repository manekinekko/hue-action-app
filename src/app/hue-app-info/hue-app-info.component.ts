import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";

@Component({
  selector: "hue-app-info",
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
        <mat-card-content>
          <p>
            Enter your Philips HUE Remote app information (<a
              href="https://developers.meethue.com/my-apps/"
              target="__blank"
              >create one</a
            >).
          </p>

          <div class="row">
            <mat-form-field class="full-width">
              <input
                matInput
                placeholder="AppId"
                formControlName="appId"
                autocomplete="off"
              />
              <mat-error
                *ngIf="appInfoForm.controls['appId'].hasError('required')"
              >
                AppId is <strong>required</strong>
              </mat-error>
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
              <mat-error
                *ngIf="appInfoForm.controls['clientId'].hasError('required')"
              >
                Client ID is <strong>required</strong>
              </mat-error>
            </mat-form-field>
          </div>
          <div class="row">
            <mat-form-field class="full-width">
              <input
                matInput
                placeholder="Client Secret"
                formControlName="clientSecret"
                autocomplete="off"
                [type]="clientSecretInputType"
              />
              <mat-icon
                matSuffix
                (click)="toggleSecret()"
                class="toggle-client-secret"
                >{{ clientSecretInputIcon }}</mat-icon
              >
              <mat-error
                *ngIf="
                  appInfoForm.controls['clientSecret'].hasError('required')
                "
              >
                Client Secret is <strong>required</strong>
              </mat-error>
            </mat-form-field>
          </div>
        </mat-card-content>
        <mat-divider></mat-divider>

        <mat-card-actions>
          <button
            mat-raised-button
            color="secondary"
            type="submit"
            (click)="generateAuthUrl()"
            [disabled]="appInfoForm.invalid || authUrl"
          >
            Generate Auth URL
          </button>
          <a
            mat-raised-button
            color="primary"
            [disabled]="!authUrl"
            [href]="authUrl"
          >
            Authorize
          </a>
        </mat-card-actions>
      </mat-card>
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
      .toggle-client-secret {
        cursor: pointer;
      }
      .clipboard {
        position: absolute;
        left: -9999px;
      }
      mat-progress-bar {
        position: absolute;
        left: 0px;
      }
    `
  ]
})
export class HueAppInfoComponent {
  authUrl = null;
  loading = false;
  clientSecretInputType: "text" | "password" = "password";
  clientSecretInputIcon: "visibility" | "visibility_off" = "visibility";
  appInfoForm = this.fb.group({
    clientId: ["pmezi2dN8wTF0AtsCAA3Wzz3fbb6Yb2h", Validators.required],
    clientSecret: ["HRrx12yItLmoHcG1", Validators.required],
    appId: ["hueaction", Validators.required]
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {}

  toggleSecret() {
    if (this.clientSecretInputType === "password") {
      this.clientSecretInputType = "text";
      this.clientSecretInputIcon = "visibility_off";
    } else {
      this.clientSecretInputType = "password";
      this.clientSecretInputIcon = "visibility";
    }
  }

  async generateAuthUrl() {
    if (this.appInfoForm.valid) {
      this.loading = true;
      const res: { auth: string } = await this.post(
        environment.api.authUrl,
        this.appInfoForm.value
      );
      this.authUrl = res.auth;
      this.loading = false;
    }
  }

  async post(url: string, body) {
    return await (
      await fetch(url, {
        method: "post",
        body: JSON.stringify(body)
      })
    ).json();
  }
}
