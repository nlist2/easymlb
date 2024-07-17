import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { HttpClientModule } from "@angular/common/http";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { Router, NavigationEnd } from "@angular/router";
import { DbService } from "./db.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
  ],

  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  public userCards: string[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const startYear = 2024;
    const endYear = 1960;

    for (let year = startYear; year >= endYear; year--) {
      this.userCards.push(year.toString());
    }
  }

  public isYearComponentRoute(): boolean {
    return this.userCards.some((year) =>
      this.router.url.startsWith(`/${year}`),
    );
  }
}
