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
import { roundMapping, RoundInfo } from "../../environment";

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
  public team_link: string;
  public userGames: any[] = []; // Initialize as an empty array
  private subscription: Subscription | undefined;
  public teamDesigns: any[];


  constructor(
    private router: Router,
    private dbService: DbService,
    private route: ActivatedRoute,
  ) { }

  getRoundInfo = (code: string): RoundInfo | undefined => {
    return roundMapping[code];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.team_link = params.get("team") || "";
      this.team = params.get("team")?.replaceAll("_", " ") || "";
      this.year = params.get("year") || "";
    });

    this.loadUserGames(this.year, this.team);
    this.loadTeamDesigns();
  }

  ngOnDestroy(): void {
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
        // Assuming years is an array of objects and each object has a property 'game_date'
        this.userGames = years.sort((a, b) => {
          const dateA = new Date(a.game_date);
          const dateB = new Date(b.game_date);
          return dateB.getTime() - dateA.getTime();
        });

      },
      error: (err) => {
        console.error("Failed to load years:", err);
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


  backToYear(): void {
    this.router.navigate(["/" + this.year]);
  }
}
