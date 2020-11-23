const Recipe = require('../models/Recipe')

async function recipeNotFound(req) {
    let results = await Recipe.all()
    let recipes = results.rows

    results = recipes.map(async recipe => {
        let image = await Recipe.files(recipe.id)
        image = image.rows[0]
        
        if(image){
            recipe.image_path = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}` 
        }
        return recipe    
    }) 
    recipes =  await Promise.all(results)

    return recipes
}

module.exports = {
    fillAllFields(req, res, next) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key !== "moreinfo") {
                return res.send(`O campo ${key} não pode ficar vazio`)
            }
        }
        
        req.user_id = req.session.userId

        next()
    },
    async show(req, res, next) {
        try {
            let results =  await Recipe.find(req.params.id)
            const recipe = results.rows[0]
            
            if (!recipe) {
                const recipes = await recipeNotFound(req)
    
                return res.render("admin/recipes/index", {
                    recipes,
                    error: 'Receita não cadastrada'
                })
            }
            
            req.recipe = recipe
    
            next()            
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res, next) {
        try {
            const id = req.session.userId 

            let results =  await Recipe.find(req.params.id)
            const recipe = results.rows[0]
            
            if (!recipe) {
                const recipes = await recipeNotFound(req)
    
                return res.render("admin/recipes/index", {
                    recipes,
                    error: 'Receita não cadastrada'
                })
            }
            
            if (id != recipe.user_id || !req.session.is_admin) {
                const results = await Recipe.files(recipe.id)
                const files = results.rows.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` 
                }))
    
                return res.render("admin/recipes/show", {
                    recipe,
                    files,
                    error: 'Acesso não autorizado '
                })
            }
            
            req.recipe = recipe
     
            next()            
        } catch (error) {
            console.error(error)
        }
        
    }

}