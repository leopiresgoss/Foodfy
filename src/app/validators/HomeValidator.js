const Recipe = require('../models/Recipe')

module.exports = {
    async search(req, res, next) {
        try {
            const { search } = req.query

            if (!search) {
                let results = await Recipe.all()
    
                const recipesPromise = results.map(async (recipe, index) => {
                    let image = await Recipe.files(recipe.id)
                    image = image[0]
    
                    if (image) {
                        recipe.image_path = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
                    }
                    return recipe
                })
                const recipes = await Promise.all(recipesPromise)
    
                return res.render("home/search", { recipes })
            }
    
            req.search = search 
            next()    
        } catch (error) {
            console.error(error)
        }   
    },
    async show(req, res, next) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
    
            if (!recipe){
                results = await Recipe.all()
                let recipes = results.rows
                
                results = recipes.map(async (recipe, index) => {
                    if(index < 2) {
                        let image = await Recipe.files(recipe.id)
                        image = image.rows[0]
                    
                        if(image){
                            recipe.image_path = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}` 
                        }
    
                        return recipe   
                    
                    }      
                })   
                recipes =  await Promise.all(results) 
                
    
                return res.render("home/index", {
                    recipes,
                    error: 'Receita não encontrada'
                })
            }
    
            req.recipe = recipe
            next()
        } catch (error) {
            console.error(error)
        }
    }
}