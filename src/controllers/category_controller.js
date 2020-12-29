const Category = require('../models/category_model');
const slugify = require('slugify');
const shortid = require('shortid');

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
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories( categories, cate._id) // WEIRD
        });
    }
    
    return categoryList;
}


exports.addCategory = ( req, res) => {


    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    }

    if(req.file){
        
        categoryObj.categoryImage = '/public/' + req.file.filename;
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

exports.updateCategories = async (req, res) => {

    const { _id, name, parentId, type } = req.body;

    const updatedCategories = [];

    if(name instanceof Array){
        
        for( let i=0; i < name.length; i++ ){

            
            const category = {
                name: name[i],
                type: type[i]
            }


            if(parentId[i] !== "" ){
                category.parentId = parentId[i]
            }

            const updatedCategory = await Category.findOneAndUpdate({ _id: _id[i] }, category,{ new: true});

            updatedCategories.push(updatedCategory);

        }
        return res.status(201).json({ updatedCategories });
    }else {

        // If there is no array

        const category = {
            name,
            type
        };

        if(parentId !== ""){
            category.parentId = parentId
        }

        const updatedCategory = await Category.findOneAndUpdate({ _id }, category,{ new: true});

        res.status(201).json({ updatedCategory});

    }

}

exports.deleteCategories = async ( req, res ) => {

    const { ids } = req.body.payload;

    const deletedCategories = [];

    for( let i = 0; i< ids.length; i++){

        const deleteCategory = await Category.findByIdAndDelete({_id: ids[i]._id});
        deletedCategories.push(deleteCategory);
    }

    if( deletedCategories.length == ids.length){
        res.status(201).json({message: 'Categories removed'})
    }else {
        
        res.status(400).json({message: 'Pailas '})
    }
}