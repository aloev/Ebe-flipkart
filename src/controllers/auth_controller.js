
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.signup = (req, res) => {

    User.findOne({ email: req.body.email})
    .exec( async (error, user) => {

        if(user) return res.status(400).json({
            msg: 'User already exists'
        });

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body ;

        const hash_password = await bcrypt.hash(password, 10);


        const _user = new User ({ 
            firstName, 
            lastName, 
            email, 
            hash_password,
            role: 'user',
            username: Math.random().toString()    
        })

        _user.save((error, data) => {

            if( error ){
                return res.status(400).json({
                    msg: 'Something bad boy user'
                });
            }

            if(data){
                return res.status(201).json({
                    msg: 'User created succesfully'
                });
            }
        });
    });
};

exports.signin = (req, res) => {
    
    User.findOne({email: req.body.email})
    .exec((error, user) => {
        if(error) return res.status(400).json({ error });
        if(user){
            if(user.authenticate(req.body.password)){
                console.log(user.role);
                
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5d' });
                
                const { firstName, lastName, email, role, fullName, _id } = user;
                
                // create a cookie

                res.cookie('token', token , { expiresIn: '5d' })

                res.status(200).json({
                    token,
                    user: {
                        _id, firstName, lastName, email, role, fullName
                    }
                });
            } else {
                return res.status(400).json({
                    msg: 'Invalid password'
                })
            }
        }else {
            return res.status(400).json({ msg: 'Bad'});
        }
    })
    
};


exports.signout = ( req, res ) => {
    res.clearCookie('token');
    res.status(200).json({
        msg: 'Signout successfully ...'
    });
}

    // middleware

