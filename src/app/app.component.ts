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
import { DbService } from "./db.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";

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
  public userCards: number[];
  public cardSize: number;

  constructor(private DbService: DbService) {
    this.userCards = Array.from({ length: 2024 - 1960 + 1 }, (v, k) => 1960 + k).reverse();
  }

  public convertStringToNumber(value: string): number {
    return parseFloat(value);
  }
}
