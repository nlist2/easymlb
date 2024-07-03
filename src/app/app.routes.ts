import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { YearComponent } from "./year/year.component";
import { TeamComponent } from "./team/team.component";
import { GameComponent } from "./game/game.component";
import { AppComponent } from "./app.component";

export const routes: Routes = [
  { path: ":year", component: YearComponent }, // Dynamic route for each year
  { path: ":year/:team", component: TeamComponent },
  { path: ":year/:team/:game", component: GameComponent },
  { path: "**", component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
