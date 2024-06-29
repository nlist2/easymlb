import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { YearComponent } from "./year/year.component";
import { TeamComponent } from "./team/team.component";

export const routes: Routes = [
  { path: ":year", component: YearComponent }, // Dynamic route for each year
  { path: ":year/:team", component: TeamComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
