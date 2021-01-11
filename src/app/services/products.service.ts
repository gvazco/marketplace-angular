import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../config';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

	private api:String = Api.url;

	constructor(private http:HttpClient ) { }

	getData(){

		return this.http.get(`${this.api}products.json`);

	}

	getLimitData(startAt:String, limitToFirst:Number){

		return this.http.get(`${this.api}products.json?orderBy="$key"&startAt="${startAt}"&limitToFirst=${limitToFirst}&print=pretty`);

	}

	getFilterData(orderBy:String, equalTo:String){

		return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	getFilterDataWithLimit(orderBy:String, equalTo:String, limitToFirst:Number){

		return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&limitToFirst=${limitToFirst}&print=pretty`);

	}
}
