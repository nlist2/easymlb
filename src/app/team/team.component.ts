// year.component.ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router, NavigationEnd } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { DbService } from "../db.service";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-team",
  standalone: true,
  templateUrl: "team.component.html",
  styleUrls: ["team.component.css"],
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule],
})
export class TeamComponent implements OnInit {
  public team: string;
  public year: string;
  public userGames: any[] = []; // Initialize as an empty array
  private subscription: Subscription | undefined;

  constructor(
    private router: Router,
    private dbService: DbService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.team = params.get("team")?.replaceAll("_", " ") || "";
      this.year = params.get("year") || "";
    });

    this.loadUserGames(this.year, this.team);
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public titleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private loadUserGames(year: string, team: string): void {
    const teamTitle = this.titleCase(team);
    this.subscription = this.dbService.loadGames(year, teamTitle).subscribe({
      next: (years) => {
        this.userGames = years; // Update userCards when data is loaded
      },
      error: (err) => {
        console.error("Failed to load years:", err);
        // Handle error loading years if needed
      },
    });
  }

  backToYear(): void {
    this.router.navigate(["/" + this.year]);
  }
}
