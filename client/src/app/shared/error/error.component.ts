import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  public FormName: FormControl;
  @Input()
  public Valid: boolean;
  @Input()
  public Required: boolean;
  @Input()
  public Email: boolean;
  @Input()
  public Message: string;
  @Input()
  public MaxLength: string;
  @Input()
  public Number: boolean;
}
