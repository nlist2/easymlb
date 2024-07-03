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
import { mlbTeamAbbr, roundMapping, RoundInfo } from "../../environment";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";



@Component({
  selector: "app-game",
  standalone: true,
  templateUrl: "game.component.html",
  styleUrls: ["game.component.css"],
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule, MatTableModule],
})
export class GameComponent implements OnInit {
  public team: string;
  public year: string;
  public game_id: string;
  public team_link: string;
  public userGames: any[] = []; // Initialize as an empty array
  private subscription: Subscription | undefined;
  public teamDesigns: any[];
  public gameData: any[];
  public gameMeta: any;
  public mlbAbbr = mlbTeamAbbr;
  displayedColumns: string[] = ['inningScores', 'awayScore', 'homeScore', 'description'];

  public dataSource: any;


  constructor(
    private router: Router,
    private dbService: DbService,
    private route: ActivatedRoute,
  ) { }

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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  getRoundInfo = (code: string): RoundInfo | undefined => {
    return roundMapping[code];
  }

  public toAbbrev(team: string): any {
    return this.mlbAbbr[team].toLowerCase();
  }

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const dateParts = formattedDate.split(' ');
    const day = parseInt(dateParts[1], 10);

    let dayWithSuffix;
    if (day % 10 === 1 && day !== 11) {
      dayWithSuffix = day + 'st';
    } else if (day % 10 === 2 && day !== 12) {
      dayWithSuffix = day + 'nd';
    } else if (day % 10 === 3 && day !== 13) {
      dayWithSuffix = day + 'rd';
    } else {
      dayWithSuffix = day + 'th';
    }

    return `${dateParts[0]} ${dayWithSuffix}, ${dateParts[2]}`.toLowerCase();
  }

  private loadGame(): void {
    this.subscription = this.dbService.loadPlayData(this.game_id).subscribe({
      next: (years) => {
        this.gameData = years;
        console.log(this.gameData)
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
    this.dataSource = new MatTableDataSource<any>(this.gameData);
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
