import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    if (this.router.url != '/orders') {
      $(".mdi-account-circle").removeClass("text-light");
    }
  }

}
