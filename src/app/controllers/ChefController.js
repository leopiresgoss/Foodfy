const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')


module.exports = {
    async index(req, res) {
        try {
            let results = await Chef.all()
        
            results = results.map(async chef => {
                let avatar = await Chef.find_avatar(chef.id)
                
                chef.avatar_url = avatar.path
    
                return chef    
            })   
            const chefs =  await Promise.all(results)
            
    
            return res.render("admin/chefs/index", { chefs })   

        } catch (error) {
            console.error(error)
        }
    },    
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    async post(req, res) {
        try {
            const image_name = `${Date.now().toString()}=${req.body.avatar_input}`
            const image_path = req.body.avatar_input
            delete req.body.avatar_input
            
            const chefId = await Chef.create(req.body)
            
            const file_id = await File.create({
                name: image_name,
                path: image_path
            })
            await Chef.update(chefId, { file_id })
           
    
            return res.redirect(`/admin/chefs/${chefId}`)
           
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            const { chef } = req

            const avatar = await Chef.find_avatar(chef.id)
        
            let results = await Chef.findRecipes(chef.id)
            const recipesPromise = results.rows.map(async recipe => {
                let image = await Recipe.files(recipe.id)
                image = image[0]
                if(image){
                    recipe.image_path = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
                    return recipe
                }
                
                return recipe
    
            })
    
            const recipes = await Promise.all(recipesPromise)
    
                    
            return res.render("admin/chefs/show", { chef, recipes, avatar })
                        
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            const { chef } = req

            const avatar = await Chef.find_avatar(chef.id)
    
            return res.render("admin/chefs/edit", {chef, avatar})            
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const results = await Chef.find_avatar(req.body.id)
            const file_id = results.id
    
            const image_name = `${Date.now().toString()}=${req.body.avatar_input}`
            const image_path = req.body.avatar_input
            
            await File.update(file_id, {
                name: image_name,
                path: image_path
            })
            
            delete req.body.avatar_input
    
            await Chef.update(req.body.id, req.body)
    
            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch (error) {
           console.error(error) 
        }
    },
    async delete(req, res) {
        try {
            const results = await Chef.find_avatar(req.body.id)
            const file_id = results.id
    
            await Chef.delete(req.body.id)
    
            await File.delete(file_id)
    
            return res.redirect('/admin/chefs')
                        
        } catch (error) {
            console.error(error)
        }
    }
}
