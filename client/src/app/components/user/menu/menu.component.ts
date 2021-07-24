import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


declare var $: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public menuItems: any = null;
  public categoryDetails: any = null;
  private categoryMenuDetails: any = null;
  public previous: number = 0;
  public next: number = 10;
  public totalMenuItems: number = 0;
  public searchBeforeItems: any = null;
  public prevSearchValue: string = "";

  constructor(private _MenuService: MenuService, private toast: ToastrService, private authService: AuthService,private route: ActivatedRoute,private router: Router) {
  }

  ngOnInit(): void {
    this.getMenuList();
    if (this.router.url != '/orders') {
      $(".mdi-account-circle").removeClass("text-light");
    }
  }

  private getMenuList() {
    this._MenuService.getProducts()
      .subscribe((res) => {
        this.categoryMenuDetails = res;
        this.categoryDetails = Object.keys(this.categoryMenuDetails);
        // get  all menu items
        var allMenuItems = [];
        for (let i = 0; i < this.categoryDetails.length; i++) {
          for (let j = 0; j < this.categoryMenuDetails[this.categoryDetails[i]].length; j++) {
            allMenuItems.push(this.categoryMenuDetails[this.categoryDetails[i]][j]);
          }
          this.totalMenuItems = allMenuItems.length;
          this.menuItems = allMenuItems;
          this.searchBeforeItems = this.menuItems;
        }
      }, (err) => {
        console.log(err);
      })
  }

  public getCategoryIdAndName(value: string, index: number): string {
    return value.split(",")[index];
  }

  public showMenuItems(category: string, event) {
    this.previous = 0;
    this.next = 10;
    $(".filter-btn").removeClass("active");
    event.srcElement.classList.add('active')
    this.menuItems = this.categoryMenuDetails[category];
    this.totalMenuItems = this.menuItems.length;
    this.searchBeforeItems = this.menuItems;
  }


  public showAllMenuItems() {
    this.previous = 0;
    this.next = 10;
    var allMenuItems = [];
    for (let i = 0; i < this.categoryDetails.length; i++) {
      for (let j = 0; j < this.categoryMenuDetails[this.categoryDetails[i]].length; j++) {
        allMenuItems.push(this.categoryMenuDetails[this.categoryDetails[i]][j]);
      }
    }
    this.totalMenuItems = allMenuItems.length;
    $(".filter-btn").removeClass("active");
    $(".all").addClass('active');
    this.menuItems = allMenuItems;
    this.searchBeforeItems = this.menuItems;
  }

  public addToCart(menuId: string, qty: number, cat_id: string) {
    this._MenuService.AddToCart(menuId, cat_id, qty)
      .subscribe((res) => {
        this.toast.success("Menu Added in Cart", "Successful", { timeOut: 500 });
      }, (err) => {
        if (err.status == 401 || err.status == 400) {
          this.authService.notifyResetSignupComponent();
          $("#signupModal").modal("show");
        }
      })
  }

  getCartItem() {
    this._MenuService.notifyCartShow();
  }

  public searchFunction() {
    var searchValue = $("#search").val().toLowerCase();
    $(".menuItem").filter(function () {
      $(this).toggle($(this).find(".item-name").text().toLowerCase().indexOf(searchValue) > -1)
    })

    if ($(".menuItem:visible").length == 0) {
      $("#nomenu").show();
    } else {
      $("#nomenu").hide();
    }
  }

  public searchItem() {
    var searchValue = $("#search").val().toLowerCase();
    if (searchValue == "")
      this.menuItems = this.searchBeforeItems;

    if (searchValue.length < this.prevSearchValue.length) {
      this.menuItems = this.searchBeforeItems;
    }

    var searchItems = [];
    for (var i = 0; i < this.menuItems.length; i++) {
      if ((this.menuItems[i][1]).toLowerCase().indexOf(searchValue) > -1)
        searchItems.push(this.menuItems[i]);
    }
    this.menuItems = searchItems;
    if (this.menuItems.length > 0) {
      $("#nomenu").hide();
    } else {
      $("#nomenu").show();
    }
    this.prevSearchValue = searchValue;
  }

  public prevItems() {
    this.next -= 10;
    this.previous -= 10;
  }

  public nextItems() {
    this.next += 10;
    this.previous += 10;
  }

}
