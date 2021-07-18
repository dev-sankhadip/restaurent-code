import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.css']
})
export class EditMenuComponent implements OnInit {
  public IsEntreeOpen: boolean = false;
  public IsNewItemOpen: boolean = false;

  public categoryList = null;
  public menuListByCategory = null;
  public selectedCategory = {
    cat_id: "",
    cat_name: ""
  }
  public menuForm: FormGroup;

  constructor(private adminService: AdminService, private formService: FormService, private toast: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.menuForm = this.formService.MenuForm;
    this.GetCategory();
  }

  GetCategory() {
    this.adminService.GetCategory()
      .subscribe((res) => {
        this.categoryList = res;
        if (this.categoryList.length > 0)
          this.openMenu(this.categoryList[0].Cat_Id, this.categoryList[0].Cat_Name)
      }, (err) => {
        console.log(err);
      })
  }

  openMenu(catId: string, catName: string) {
    this.selectedCategory.cat_id = catId;
    this.selectedCategory.cat_name = catName;

    this.adminService.GetMenu(catId)
      .subscribe((res) => {
        if (res) {
          this.menuListByCategory = res;
          this.IsEntreeOpen = true
        }
      }, (err) => {
        console.log(err);
      })
  }

  deleteMenuItem(menu_id: string) {
    this.adminService.DeleteMenuItem(menu_id, this.selectedCategory.cat_id)
      .subscribe((res) => {
        this.toast.success("Menu Removed", "Successful", { timeOut: 3000 });
        this.openMenu(this.selectedCategory.cat_id, this.selectedCategory.cat_name);
      }, (err) => {
        console.log(err);
      })
  }

  newEntreeOpen() {
    this.IsNewItemOpen = !this.IsNewItemOpen;
  }

  AddMenu() {
    const cat_id = this.selectedCategory.cat_id;
    this.adminService.AddMenu({ ...this.menuForm.value, cat_id })
      .subscribe((res) => {
        this.toast.success("New Menu Added", "Successful", { timeOut: 3000 });
        this.menuForm.reset();
        this.IsNewItemOpen = false;
        this.openMenu(cat_id, this.selectedCategory.cat_name);
      }, (err) => {

      })
  }

}
