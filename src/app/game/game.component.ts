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

interface RoundInfo {
  description: string;
  color: string;
}


@Component({
  selector: "app-game",
  standalone: true,
  templateUrl: "game.component.html",
  styleUrls: ["game.component.css"],
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule],
})
export class GameComponent implements OnInit {
  public team: string;
  public year: string;
  public game_id: string;
  public team_link: string;
  public userGames: any[] = []; // Initialize as an empty array
  private subscription: Subscription | undefined;
  public teamDesigns: any[];
  public gameData:any[];
  public gameMeta: any;
  

  constructor(
    private router: Router,
    private dbService: DbService,
    private route: ActivatedRoute,
  ) {}

  
  roundMapping: { [key: string]: RoundInfo } = {
    "F": { description: "Wild Card", color: "#FF0000" },  // Red
    "D": { description: "Divisional Series", color: "#CD7F32" },  // Bronze
    "L": { description: "League Championship", color: "#C0C0C0" },  // Silver
    "W": { description: "World Series", color: "#FFD700" },  // Gold
    "R": { description: "Regular Season", color: "#FFFFFF" },  // None (White for no specific color)
    "S": { description: "Spring Training", color: "#808080" }  // Gray
  };
  
  // Example usage:
  getRoundInfo = (code: string): RoundInfo | undefined => {
    return this.roundMapping[code];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.team_link = params.get("team") || "";
      this.team = params.get("team")?.replaceAll("_", " ") || "";
      this.year = params.get("year") || "";
      this.game_id = params.get("game") || "";
    });

    this.loadGame();
    this.loadTeamDesigns();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadGame(): void {
    this.subscription = this.dbService.loadPlayData(this.game_id).subscribe({
      next: (years) => {
        this.gameData = years;
      },
      error: (err) => {
        console.error("Failed to load years:", err);
      },
    });

    this.subscription = this.dbService.loadGameMeta(this.game_id).subscribe({
        next: (years) => {
          this.gameMeta = years;
          console.log(this.gameMeta);
        },
        error: (err) => {
          console.error("Failed to load years:", err);
        },
      });

  }

  public titleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
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
  


  backToTeam(): void {
    this.router.navigate(["/" + this.year + "/" + this.team_link]);
  }
}
