import { Component, OnInit } from '@angular/core';

import { CategoriesService } from '../../../services/categories.service';
import { SubCategoriesService } from '../../../services/sub-categories.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-breadcrumb',
  templateUrl: './products-breadcrumb.component.html',
  styleUrls: ['./products-breadcrumb.component.css'],
})
export class ProductsBreadcrumbComponent implements OnInit {

  breadcrumb:String = null;

  constructor(private categoriesService: CategoriesService,
              private SubCategoriesService: SubCategoriesService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {

    let params = this.activatedRoute.snapshot.params["param"];

    /*--=====================================
    Filtramos data de categorías
    ======================================-*/

    this.categoriesService.getFilterData("url", params)
    .subscribe(resp=>{

      if(Object.keys(resp).length > 0){
        let i;

        for(i in resp){

          this.breadcrumb = resp[i].name;
        
        }

      }else{

      /*--=====================================
      Filtramos data de subcategorías
      ======================================-*/
        
        this.SubCategoriesService.getFilterData("url", params)
        .subscribe(resp2=>{
        
          let i;

          for(i in resp){
            this.breadcrumb = resp2[i].name;
          }
        })
        
      }
      
    })
  }
}
