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
import { ScoringData } from "../../environment";



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
  public gameScoreboard: any[];

  innings: number[] = [];
  awayScores: number[] = [];
  homeScores: number[] = [];


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
        this.gameData = years.sort((a, b) => (+a.id - +b.id));
        this.gameScoreboard = this.processGameData(this.gameData);
        this.innings = this.gameScoreboard.map(data => data.inning);
        this.awayScores = this.gameScoreboard.map(data => data.away_score);
        this.homeScores = this.gameScoreboard.map(data => data.home_score);
      },
      error: (err) => {
        console.error("Failed to load years:", err);
      },
    });

    this.subscription = this.dbService.loadGameMeta(this.game_id).subscribe({
      next: (years) => {
        this.gameMeta = years;
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

  processGameData(gameData: any[]): ScoringData[] {
    const processedData: ScoringData[] = [];

    let maxInning = 9;
    gameData.forEach(score => {
      if (score.inning > maxInning) {
        maxInning = score.inning;
      }
    });

    // Create innings set from 1 to maxInning
    const innings = new Set<number>();
    for (let i = 1; i <= maxInning; i++) {
      innings.add(i);
    }

    let last_top_score = 0;
    let last_bot_score = 0;

    // Iterate through each inning
    innings.forEach(inning => {
      // Check if there's a score for Top and Bottom
      const topScore = gameData.filter(score => score.inning === inning && score.halfInn === 'top');
      const bottomScore = gameData.filter(score => score.inning === inning && score.halfInn === 'bottom');

      // Create scoring entries for Top and Bottom, defaulting to 0 if no score found
      const inningEntry: ScoringData = {
        inning: inning,
        away_score: topScore.length > 0 ? topScore[topScore.length - 1].away_score - last_top_score : 0,
        home_score: bottomScore.length > 0 ? bottomScore[bottomScore.length - 1].home_score - last_bot_score : 0,
      };

      last_bot_score = bottomScore.length > 0 ? bottomScore[bottomScore.length - 1].home_score : last_bot_score;
      last_top_score = topScore.length > 0 ? topScore[topScore.length - 1].away_score : last_top_score;

      // Push to processedData
      processedData.push(inningEntry);
    });

    // Sort processedData by inning
    processedData.sort((a, b) => a.inning - b.inning);

    return processedData;
  }
}
