// year.component.ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-year",
  standalone: true,
  templateUrl: "year.component.html",
  styleUrls: ["year.component.css"],
  imports: [MatButtonModule, MatIconModule],
})
export class YearComponent implements OnInit {
  year: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.year = params.get("year") || "";
    });
  }

  backToMain(): void {
    this.router.navigate(["/"]);
  }
}
