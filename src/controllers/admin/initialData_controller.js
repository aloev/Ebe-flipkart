const Category = require('../../models/category_model');
const Product = require('../../models/product_model');

// Cretes Lists
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
            children: createCategories( categories, cate._id) // WEIRD
        });
    }
    
    return categoryList;
}

exports.initialData = async (req, res) => {   

    const categories = await Category.find({}).exec();

    const products = await Product.find({})
                    .select('id name price quantity slug description productPictures category')
                    .populate({path: 'category', select: '_id name'})
                    .exec();

    res.status(200).json({
        categories: createCategories(categories),
        products
    });

}