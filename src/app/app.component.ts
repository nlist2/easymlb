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
  public userCards: string[] = []; // Initialize as an empty array
  private subscription: Subscription | undefined;

  constructor(
    private router: Router,
    private dbService: DbService,
  ) {}

  ngOnInit(): void {
    this.loadUserCards();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadUserCards(): void {
    this.subscription = this.dbService.loadYears().subscribe({
      next: (years) => {
        this.userCards = years; // Update userCards when data is loaded
      },
      error: (err) => {
        console.error("Failed to load years:", err);
        // Handle error loading years if needed
      },
    });
  }

  public isYearComponentRoute(): boolean {
    return this.userCards.some((year) =>
      this.router.url.startsWith(`/${year}`),
    );
  }
}
