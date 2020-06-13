import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Course} from "../../models/course";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() course: Course;
  @Input() redirectTo: string[] = ['/cursos', 'hola'];
  @Output() ngEditCard = new EventEmitter<string>();
  @Output() ngDeleteCard = new EventEmitter<string>();

  constructor(private router: Router,
              public authService: AuthService) { }

  ngOnInit(): void {
  }

  editCard() {
    this.ngEditCard.emit(this.course.uid);
  }

  deleteCard() {
    this.ngDeleteCard.emit(this.course.uid);
  }

  redirectCard() {
    this.router.navigate(this.redirectTo);
  }

}
