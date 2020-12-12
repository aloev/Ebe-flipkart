const Category = require('../models/category_model');
const slugify = require('slugify');

 // Magic happens here
function createCategories( categories, parentId = null ){
    
    const categoryList = [];
    let category;
    if( parentId == null ){
        category = categories.filter( cat => cat.parentId == undefined );   // Dont return a cat whose parentId is undefined
        
    } else {
        category = categories.filter( cat => cat.parentId == parentId); 
    }

    // The trick is the 2 comparisons  above, they determine how many times is gonna loop until all the conditions are met
    // This is gonna loop for as many parent-child relation exists. I called this the tree expansion 
    
    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories( categories, cate._id) // WEIRD
        });
    }
    
    return categoryList;
}


exports.addCategory = ( req, res) => {

    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name)
    }

    if( req.body.parentId){
        categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);
    cat.save( ( error, category ) => {
        
        if( error) return res.status(400).json({ error})

        if( category){
            return res.status(201).json({ category });
        }
    });

};

exports.getCategories = (req, res) => {
    Category.find({})
    .exec((error, categories) => {

        if( error) return res.status(400).json({ error})
        if( categories){

            const categoryList = createCategories( categories);


            res.status(200).json({ categoryList});
        }

    });
}