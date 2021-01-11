import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { OwlCarouselConfig, Rating } from '../../../functions';

declare var jQuery:any;
declare var $:any;

import { CategoriesService } from '../../../services/categories.service';
import { SubCategoriesService } from '../../../services/sub-categories.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-home-showcase',
  templateUrl: './home-showcase.component.html',
  styleUrls: ['./home-showcase.component.css']
})
export class HomeShowcaseComponent implements OnInit {

	path:String = Path.url;	
	categories:Array<any> = [];
	cargando:Boolean = false;
	render:Boolean = true;

   	constructor(private categoriesService: CategoriesService,
   		        private subCategoriesService: SubCategoriesService,
   		        private productsService: ProductsService) { }

	ngOnInit(): void {

		this.cargando = true;

		/*=============================================
		Tomamos la data de las categorias
		=============================================*/

		let getCategories = [];

		this.categoriesService.getData()		
		.subscribe( resp => {
			
			let i;

			for(i in resp){

				getCategories.push(resp[i])

			}

			/*=============================================
			Ordenamos de mayor vistas a menor vistas el arreglo de objetos
			=============================================*/
			
			getCategories.sort(function(a,b){

				return(b.view - a.view)

			})

			/*=============================================
			Filtramos hasta 6 categorías
			=============================================*/	

			getCategories.forEach((category, index)=>{

				if(index < 6){

					this.categories[index] = getCategories[index];
					this.cargando = false;
				}

			})

		})
			
	}

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

	callback(indexes){

		if(this.render){

			this.render = false;

			let arraySubCategories = [];
			let arrayProducts = [];
			let preloadSV = 0;

			/*=============================================
			Separar las categorías
			=============================================*/

			this.categories.forEach((category, index)=>{
				
				/*=============================================
				Tomamos la colección de las sub-categorías filtrando con los nombres de categoría
				=============================================*/
				this.subCategoriesService.getFilterData("category", category.name)
				.subscribe(resp=>{
					
					let i;

					for(i in resp){

						arraySubCategories.push({

							"category": resp[i].category,
							"subcategory": resp[i].name,
							"url": resp[i].url

						})
						
					}

					/*=============================================
					Recorremos el array de objetos nuevo para buscar coincidencias con los nombres de categorías
					=============================================*/

					for(i in arraySubCategories){

						if(category.name == arraySubCategories[i].category){

							$(`[category-showcase='${category.name}']`).append(`

								<li><a href="products/${arraySubCategories[i].url}">${arraySubCategories[i].subcategory}</a></li>

							`)
						}
					}

				})

				/*=============================================
				Tomamos la colección de los productos filtrando con las url's de categorías
				=============================================*/
				this.productsService.getFilterDataWithLimit("category", category.url, 6)
				.subscribe(resp=>{ 
					
					let i;

					for(i in resp){

						arrayProducts.push({

							"category": resp[i].category,
							"url": resp[i].url,
							"name": resp[i].name,
							"image": resp[i].image,
							"price": resp[i].price,
							"offer": resp[i].offer,
							"reviews": resp[i].reviews,
							"stock": resp[i].stock,
							"vertical_slider": resp[i].vertical_slider

						})

					}

					/*=============================================
					Recorremos el array de objetos nuevo para buscar coincidencias con las url de categorías
					=============================================*/
					for(i in arrayProducts){

						if(category.url ==  arrayProducts[i].category){


							/*=============================================
							Definimos si el precio del producto tiene oferta o no
							=============================================*/	

							let price;
							let type;
							let value;
							let offer;
							let disccount;

							if(arrayProducts[i].offer != ""){

								type = JSON.parse(arrayProducts[i].offer)[0];
								value = JSON.parse(arrayProducts[i].offer)[1];

								if(type == "Disccount"){
									
									offer = (arrayProducts[i].price - (arrayProducts[i].price * value/100)).toFixed(2)	
								}

								if(type == "Fixed"){

									offer = value;
									value = Math.round(offer*100/arrayProducts[i].price);

								}

								disccount = `<div class="ps-product__badge">-${value}%</div>`;

								price = `<p class="ps-product__price sale">$${offer} <del>$${arrayProducts[i].price} </del></p>`

						
							}else{

								price = `<p class="ps-product__price">$${arrayProducts[i].price} </p>`
							}

							/*=============================================
							Calculamos el total de las calificaciones de las reseñas
							=============================================*/	

							let totalReview = 0;

							for(let f = 0; f < JSON.parse(arrayProducts[i].reviews).length; f++){

								totalReview += Number(JSON.parse(arrayProducts[i].reviews)[f]["review"])
								
							}

							/*=============================================
							Imprimimos el total de las calficiaciones para cada producto
							=============================================*/	

							let rating = Math.round(totalReview/JSON.parse(arrayProducts[i].reviews).length);

							/*=============================================
							Definimos si el producto tiene stock
							=============================================*/	


							if(arrayProducts[i].stock == 0){

								disccount = `<div class="ps-product__badge out-stock">Out Of Stock</div>`;

							}

							/*=============================================
							Imprimimos los productos en el HTML
							=============================================*/	

							$(`[category-pb='${arrayProducts[i].category}']`).append(`

								 <div class="ps-product ps-product--simple">

				                    <div class="ps-product__thumbnail">

				                    	<a href="product/${arrayProducts[i].url}">

				                    		<img src="assets/img/products/${arrayProducts[i].category}/${arrayProducts[i].image}" alt="">

				                    	</a>

				                        ${disccount}

				                    </div>

				                    <div class="ps-product__container">

				                        <div class="ps-product__content" data-mh="clothing">

				                        	<a class="ps-product__title" href="product/${arrayProducts[i].url}">${arrayProducts[i].name}</a>

				                            <div class="ps-product__rating">

				                                <select class="ps-rating productRating" data-read-only="true">

				                                </select>

				                                <span>${rating}</span>

				                            </div>

				                            ${price}

				                        </div>

				                    </div>

				                </div> 

			                `)

			                /*=============================================
							Clasificamos la cantidad de estrellas según la calificación
							=============================================*/	

							let arrayRating = $(".productRating");

							for(let i = 0; i < arrayRating.length; i++){

								for(let f = 1; f <= 5; f++){
								
									$(arrayRating[i]).append(

										`<option value="2">${f}</option>`
									)

									if(rating == f){

										$(arrayRating[i]).children('option').val(1)

									}

								}
							
							}

							/*=============================================
							Ejecutar funciones globales con respecto a las Reseñas
							=============================================*/	

							Rating.fnc();

							/*=============================================
							Imprimimos los productos en el Vertical Slider
							=============================================*/	

							$(`[category-sl='${arrayProducts[i].category}']`).append(`

								<a href="product/${arrayProducts[i].url}">

			                		<img src="assets/img/products/${arrayProducts[i].category}/vertical/${arrayProducts[i].vertical_slider}" alt="">

			                	</a>

							`)

							/*=============================================
							Ejecutar funciones globales con respecto al carrusel
							=============================================*/	

							preloadSV++;

							if(preloadSV == (indexes+1)*6){

								$(`[category-sl]`).addClass('ps-carousel--product-box')
								$(`[category-sl]`).addClass('owl-slider')

								$(`[category-sl]`).owlCarousel({

									 items: 1,
									 autoplay: true,
									 autoplayTimeout: 7000,
									 loop: true,
                        		     nav: true,
                        		     margin: 0,
                        		     dots: true,
                        		     navSpeed: 500,
                        		     dotsSpeed: 500,
                        		     dragEndSpeed: 500,
                        		     navText: ["<i class='icon-chevron-left'></i>", "<i class='icon-chevron-right'></i>"],

								});

							}

						}

					}

				})

			})

		}
	}

}
