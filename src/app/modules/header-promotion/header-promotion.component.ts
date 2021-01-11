import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-header-promotion',
  templateUrl: './header-promotion.component.html',
  styleUrls: ['./header-promotion.component.css']
})
export class HeaderPromotionComponent implements OnInit {

	path:String = Path.url;	
	top_banner:Object = null;
	category:Object = null;
	url:Object = null;
	preload:Boolean = false;

	constructor(private productsService: ProductsService ) { }

	ngOnInit(): void {

		this.preload = true;

		this.productsService.getData()
		.subscribe(resp =>{
			
			// console.log("resp", resp[Object.keys(resp)[1]]);

			/*=============================================
			Tomar la longitud del objeto
			=============================================*/

			let i;
			let size = 0;

			for(i in resp){

				size++			

			}

			/*=============================================
			Generar un número aleatorio 
			=============================================*/

			let index = Math.floor(Math.random()*size);

			/*=============================================
			Devolvemos a la vista un banner aleatorio
			=============================================*/

			this.top_banner = JSON.parse(resp[Object.keys(resp)[index]].top_banner);
			this.category = resp[Object.keys(resp)[index]].category;
			this.url = resp[Object.keys(resp)[index]].url;
			
			this.preload = false;
		

		})

	}

}
