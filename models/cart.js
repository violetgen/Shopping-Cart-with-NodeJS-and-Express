//note, for now, we are saving our info from cart into session, not in our database
module.exports = function Cart(oldCart){
    this.items = oldCart.items || {}; //if undefined, use an empty object
    this.totalQty = oldCart.totalQty || 0; //if undefined, use 0
    this.totalPrice = oldCart.totalPrice || 0; //if undefined, use 0

    this.add = function(item, id){
        //use what we already have in the cart
        var storedItem = this.items[id];
        //if nothing is in the cart, add stuffs to it
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        //in any of the cases, we do:
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        //the storedItem.price is the stored price, lets take the single price instead
        // this.totalPrice += storedItem.price;
        this.totalPrice += Number(storedItem.item.price); 

    }

    this.reduceByOne = function(id){
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <= 0){
            delete this.items[id];
        }
    }
    this.removeItem = function(id){
        this.totalQty -= this.items[id].qty;
        //we are deleting the entire price, not just each item's price
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
}