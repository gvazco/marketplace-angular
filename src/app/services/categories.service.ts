import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../config';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

	private api:String = Api.url;

  	constructor(private http:HttpClient) { }

  	getData(){

		return this.http.get(`${this.api}categories.json`);

	}

	getFilterData(orderBy:String, equalTo:String){

		return this.http.get(`${this.api}categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}
}
