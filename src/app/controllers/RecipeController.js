const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe_Files = require('../models/Recipe_Files')

const fs = require('fs')

module.exports = {
    async index(req, res) {
        const results = await Recipe.all()

        const recipesPromise = results.map(async recipe => {
            let image = await Recipe.files(recipe.id)
            image = image[0]
            
            if(image){
                recipe.image_path = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}` 
            }

            return recipe    
        })   
        const recipes =  await Promise.all(recipesPromise)

        return res.render("admin/recipes/index", {recipes})
    },
    async create(req, res) {
        const chefOptions = await Chef.all()
        
        return res.render("admin/recipes/create", { chefOptions })
    }, 
    async post(req, res) {
        req.body.user_id = req.user_id

        let { ingredients, preparation } = req.body

        ingredients = ingredients.join(',')
        ingredients = `{${ingredients}}`

        preparation = preparation.join(',')
        preparation = `{${preparation}}`

        req.body.ingredients = ingredients
        req.body.preparation = preparation

        const recipe_id = await Recipe.create(req.body)

       req.files.map(async file => {
            const file_id = await File.create({
                name: file.filename,
                path: file.path
            })

            await Recipe_Files.create({
                recipe_id,
                file_id
            })
        })
        
        return res.redirect(`/admin/recipes/${recipe_id}`)
        
    },
    async show(req, res) {
        const recipe = req.recipe

        const results = await Recipe.files(recipe.id)
        const files = results.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` 
        }))
        
        return res.render("admin/recipes/show", { recipe, files })
    },
    async edit(req, res) {
        const recipe = req.recipe
        
        const chefOptions = await Chef.all()

        let results = await Recipe.files(recipe.id)
        const files = results.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}` 
        }))

        return res.render("admin/recipes/edit", { recipe, files, chefOptions })
    },
    async put(req, res) {
        try {
            let { id, title, chef_id, ingredients, preparation, moreinfo } = req.body


            if (req.files.length != 0) {
                req.files.map(async file => {
                    const file_id = await File.create({
                        name: file.filename,
                        path: file.path
                    })
        
                    await Recipe_Files.create({
                        recipe_id: id,
                        file_id
                    })
                })
            }
    
            if (req.body.removed_files) {
                let removed_files = req.body.removed_files.split(",")
                const lastIndex = removed_files.length - 1
                removed_files.splice(lastIndex, 1)
    
                removed_files.map(async removedFileId => {
                    const recipe_file = await Recipe_Files.findOne({
                        where: { file_id: removedFileId }
                    })

                    await Recipe_Files.delete(recipe_file.id)

                    const file = await File.findOne({
                        where: {id: removedFileId}
                    })


                    fs.unlinkSync(file.path)

                    await File.delete(file.id)
                })

                await Promise.all(removed_files)
            }

            ingredients = ingredients.join(',')
            ingredients = `{${ingredients}}`
    
            preparation = preparation.join(',')
            preparation = `{${preparation}}`
    
            const data = {
                title, 
                chef_id, 
                ingredients, 
                preparation,
                moreinfo,  
                user_id: req.session.userId
            }
            
            await Recipe.update(id, data)
            
            return res.redirect(`/admin/recipes/${id}`)    
        } catch (error) {
            console.error(error)
        }
        
    },
    async delete(req,res) {
        const recipeFiles = await File.SelectAllRecipeFiles(req.body.id)

        await Recipe.delete(req.body.id)
        
        recipeFiles.map(async file => {
            fs.unlinkSync(file.path)
            
            await File.delete(file.id)
        })
                
        return res.redirect("/admin/recipes") 
    }

}
