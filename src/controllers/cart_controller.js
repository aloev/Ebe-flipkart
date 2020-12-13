const Cart = require('../models/cart_model');


exports.addItemtoCart = ( req, res ) => {
    
    // res.json({ msg: 'Bitch' })
    Cart.findOne({ user:req.user._id })
    .exec((error, cart) => {
        if( error ) return res.status(400).json({ error});
        if(cart){
            // if cart already exists then update cart

            const product = req.body.cartItems.product;
            const item = cart.cartItems.find( c => c.product == product );

            if( item ){

                // if you wanna change the quantity of the same product
                Cart.findOneAndUpdate({ "user": req.user._id, "cartItems.product": product }, {

                    "$set": {
                        "cartItems": {
                            ...req.body.cartItems,
                            quantity: item.quantity + req.body.cartItems.quantity
                        }
                    }
    
                })
                .exec((error, _cart) => {
                    if( error ) return res.status(400).json({ error});
                    if( _cart){
                        return res.status(200).json({cart: _cart});
                    }
                })


            }else {
                // Add new Item within the same old Cart

                Cart.findOneAndUpdate({ user: req.user._id }, {

                    "$push": {
                        "cartItems": {
                            "cartItems": req.body.cartItems
                        }
                    }
    
                })
                .exec((error, _cart) => {
                    if( error ) return res.status(400).json({ error});
                    if( _cart){
                        return res.status(200).json({cart: _cart});
                    }
                })


            } 
        }else {

            const cart = new Cart({
                user: req.user._id,
                cartItems: [ req.body.cartItems ]
            });
        
            cart.save((error, cart) => {
        
                if( error ) return res.status(400).json({ error});
                if(cart){
                    return res.status(201).json({ cart });
                }
        
        
            });

        }
    });

};