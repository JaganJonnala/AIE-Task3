import { Component } from '@angular/core';
import {response} from './response'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  products :any=[];
  subTotal:number=0;
  estTotal:number=0;
  estShipping:number=0;
  storeDropdownValue:string="";
  shippingMethods:Array<string>=[];

  ngOnInit(){
    this.products = this.getProducts();
    this.products = this.products.map((item) =>{
      item.storeDropdownValue = item.stores &&  item.stores[0] && `${item.stores[0].storeName}-${item.stores[0].state}-${item.stores[0].storeDistance}` || "";
      return item;
    });
    this.shippingMethods = this.getAllShippingMethods();
    this.updateCartPricing()
  }

  private getAllShippingMethods(){
    return this.products.map((item) => item.shippingType);
  }

  private getProducts(){
    return response && response.cartDetails && response.cartDetails.cartItems || [];
  }

  removeItem(product){
    this.products = this.products.filter((item) =>{
        return item.itemId !== product.itemId;
    });
    this.updateCartPricing()
  }

  addQuantity(product){
      product.itemQuantity++;
      this.updateTotalCost(product);
  }

  reduceQuantity(product){
      product.itemQuantity--;
      this.updateTotalCost(product);
  }

  private updateTotalCost(product){
    product.itemAmount.itemTotalPrice = (+product.itemQuantity * +product.itemAmount.itemPrice).toFixed(2);
    this.updateCartPricing();
  }

  updateCartPricing(){
    this.subTotal = 0;
    this.products.forEach((product) =>{
      this.subTotal += +product.itemAmount.itemTotalPrice;
      this.subTotal = +(this.subTotal.toFixed(2));
    });
    this.estTotal = this.subTotal + this.estShipping;
  }
  dr1OptionClick(product,method){
    product.shippingType = method;
  }

  dr2OptionClick(product,store){
    product.storeDropdownValue = `${store.storeName}-${store.state}-${store.storeDistance}`
  }

}
