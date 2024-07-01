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
  selector: "app-year",
  standalone: true,
  templateUrl: "year.component.html",
  styleUrls: ["year.component.css"],
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule],
})
export class YearComponent implements OnInit {
  public year: string;
  public userTeams: string[] = []; // Initialize as an empty array
  private subscription: Subscription | undefined;
  public teamDesigns: any[];

  constructor(
    private router: Router,
    private dbService: DbService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.year = params.get("year") || "";
    });

    this.loadUserTeams(this.year);
    this.loadTeamDesigns();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadUserTeams(year: string): void {
    this.subscription = this.dbService.loadTeams(year).subscribe({
      next: (years) => {
        this.userTeams = years;
      },
      error: (err) => {
        console.error("Failed to load years:", err);
        // Handle error loading years if needed
      },
    });
  }

  private loadTeamDesigns(): void {
    this.subscription = this.dbService.loadTeamsDesigns().subscribe({
      next: (years) => {
        this.teamDesigns = years;
      },
      error: (err) => {
        console.error("Failed to load years:", err);
      },
    });
  }

  public getTeamDesign(teamId: string): any | undefined {
    const team = this.teamDesigns?.find(team => team.id === teamId);
    return team ? team.data : undefined;
  }
  

  backToMain(): void {
    this.router.navigate(["/"]);
  }
}
