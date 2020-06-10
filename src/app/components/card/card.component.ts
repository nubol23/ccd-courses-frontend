import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Course} from "../../models/course";
import {Router} from "@angular/router";

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  editCard() {
    this.ngEditCard.emit(this.course.title);
  }

  deleteCard() {
    this.ngDeleteCard.emit(this.course.title);
  }

  redirectCard() {
    this.router.navigate(this.redirectTo);
  }

}
