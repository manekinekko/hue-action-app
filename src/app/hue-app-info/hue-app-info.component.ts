import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";

@Component({
  selector: "hue-app-info",
  template: `
    <form [formGroup]="appInfoForm" novalidate>
      <mat-card class="shipping-card">
        <mat-card-header>
          <mat-card-title>Remote HUE app information</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="row">
            <div class="col">
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
          </div>
          <div class="row">
            <div class="col">
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
                  >remove_red_eye</mat-icon
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
          </div>
          <div class="row">
            <div class="col">
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
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            color="secondary"
            type="submit"
            (click)="generateAuthUrl()"
            [disabled]="appInfoForm.invalid"
          >
            Generate Auth URL
          </button>
          <a
            mat-raised-button
            color="primary"
            [disabled]="!authUrl"
            [href]="authUrl"
          >
            Open Auth URL
          </a>
        </mat-card-actions>
      </mat-card>
    </form>
  `,
  styles: [
    `
      form {
        margin: 20px;
      }
      .full-width {
        width: 100%;
      }
      mat-card-actions {
        display: flex;
        justify-content: space-between;
      }
      .toggle-client-secret {
        cursor: pointer;
      }
    `
  ]
})
export class HueAppInfoComponent {
  authUrl = null;
  clientSecretInputType: "text" | "password" = "password";
  appInfoForm = this.fb.group({
    clientId: [null, Validators.required],
    clientSecret: [null, Validators.required],
    appId: [null, Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  toggleSecret() {
    if (this.clientSecretInputType === "password") {
      this.clientSecretInputType = "text";
    } else {
      this.clientSecretInputType = "password";
    }
  }

  async generateAuthUrl() {
    if (this.appInfoForm.valid) {
      const res: { authUrl: string } = await (
        await fetch(environment.api.authUrl, {
          method: "post",
          body: JSON.stringify(this.appInfoForm.value)
        })
      ).json();

      this.authUrl = res.authUrl;
    }
  }
}
