import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";


@Component({
    selector: 'app-root',
    standalone:true,
    templateUrl: 'app.component.html',
    styleUrl: 'app.component.scss',
    imports: [RouterLink,RouterOutlet]
})

export class AppComponent {
}