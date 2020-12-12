
const User = require('../../models/user_model');
const jwt = require('jsonwebtoken');


exports.signup = (req, res) => {
    User.findOne({ email: req.body.email})
    .exec((error, user) => {

        if(user) return res.status(400).json({
            msg: 'Admin already exists'
        });

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body ;

        const _user = new User ({ 
            firstName, 
            lastName, 
            email, 
            password,
            username: Math.random().toString(),
            role: 'admin'    
        })

        _user.save((error, data) => {

            if( error ){
                return res.status(400).json({
                    msg: 'Something bad boy'
                });
            }

            if(data){
                return res.status(201).json({
                    msg: 'Admin created succesfully'
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
            if(user.authenticate(req.body.password) && user.role === 'admin'){
                console.log('alaaaa')
                
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5d' });
                
                const { firstName, lastName, email, role, fullName, _id } = user;
            
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

    // middleware

