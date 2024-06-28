import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { YearComponent } from "./year/year.component";

export const routes: Routes = [
  { path: ":year", component: YearComponent }, // Dynamic route for each year
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
