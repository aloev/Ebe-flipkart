const Cart = require('../models/cart_model');



function runUpdate(condition, updateData){
    return new Promise((resolve, reject) => {

        Cart.findOneAndUpdate(condition, updateData, { upsert: true })
            .then( result => resolve())
            .catch( err => reject(err))
    });
}

exports.addItemtoCart = ( req, res ) => {
    

    // Busca es el cart no el contenido
    Cart.findOne({ user: req.user._id })
    .exec((error, cart) => {
        if( error ) return res.status(400).json({ error});
        if(cart){


            let promiseArray = [];

            req.body.cartItems.forEach((cartItem) => {
                // if cart already exists then update cart

                const product = cartItem.product;


                // try {
                
                //     item = cart.cartItems.find( c => c.product == product );
                // } catch (e) {
                //     console.log(e);
                // }

                console.log('cartItems', cart.cartItems);
                const item = cart.cartItems.find( c => c.product == product );

                console.log('this is the item', item)

                let condition, update;

                
                    // add to existing product
                if( item ){


                    condition = { "user": req.user._id, "cartItems.product": product };
                    update = {
                            "$set": {
                                "cartItems.$":cartItem
                        }
                    };
                }                       // add new prod
                else {
                    condition = { user: req.user._id };
                    update = {
                        "$push" : {
                            "cartItems": cartItem 
                        }
                    }
                }

                promiseArray.push(runUpdate(condition, update))
                
            });

            Promise.all(promiseArray)
                .then( response => res.status(201).json({ response}))
                .catch( error => res.status(400).json({error}))
                
            
        }else {

            // Creates new cart, if it doesn't exist before 

            const cart = new Cart({
                user: req.user._id,
                cartItems: req.body.cartItems 
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


exports.getCartItems = (req, res) => {

    Cart.findOne({ user: req.user._id })
        .populate('cartItems.product', '_id name price productPictures')
        .exec((error, cart) => {
            if(error) return res.status(400).json({ error });
            if(cart){
                let cartItems = {};
                cart.cartItems.forEach((item, index) => {
                    cartItems[item.product._id.toString()] = {
                        _id: item.product._id.toString() ,
                        name: item.product.name ,
                        img: item.product.productPictures[0].img ,
                        price: item.product.price ,
                        qty: item.quantity ,
                    }
                })
                res.status(200).json({ cartItems})
            }
        })
}



exports.removeCartItems = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
        Cart.update(
        { user: req.user._id },
        {
            $pull: {
            cartItems: {
                product: productId,
            },
            },
        }
        ).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
            res.status(202).json({ result });
        }
        });
    }
};