import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DarkModeService } from '../../service/darkMode/dark-mode.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule, RouterModule, MatSlideToggleModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  isDarkMode: boolean;

  constructor(private modalService: NgbModal, private darkModeService: DarkModeService){
    this.isDarkMode = this.darkModeService.isDarkMode();
  }

  toggleTheme(event: any): void {
    this.isDarkMode = event.checked;
    if (this.isDarkMode) {
      this.darkModeService.enableDarkMode();
    } else {
      this.darkModeService.disableDarkMode();
    }
    console.log(this.isDarkMode)
  }
}
