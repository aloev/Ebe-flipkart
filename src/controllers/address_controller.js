

const UserAddress = require('../models/address_model');



exports.addAddress = (req, res ) => {

    const { payload } = req.body;

    if(payload.address){
        if(payload.address._id){
            UserAddress.findOneAndUpdate(
                { user: req.user._id , "address._id": payload.address._id }, 
                {
                $set: {
                    "address.$": payload.address
                
                },
            })  // allows create new field if not existed before
            .exec((error, address) => {
                if( error ) return res.status(400).json({ error});
                if(address){
                    res.status(201).json({ address})
                }
            });
        }else {
            UserAddress.findOneAndUpdate({ user: req.user._id }, 
                {
                "$push": {
                    "address": payload.address
                
                }
            }, { new: true, upsert: true } )  // allows create new field if not existed before
            .exec((error, address) => {
                if( error ) return res.status(400).json({ error});
                if(address){
                    res.status(201).json({ address})
                }
            });
        }
    }else {
        return res.status(400).json({ error: 'Params address required'});
    }
}


exports.getAddress = (req, res) => {

    UserAddress.findOne({ user: req.user._id })
        .exec((error, userAddress) => {
            if(error) return res.status(400).json({ error });
            if(userAddress){
                res.status(200).json({ userAddress})            
            }
        })
}



