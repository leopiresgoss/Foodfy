const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        let recipes = await Recipe.all()

        const recipesPromise = recipes.map(async (recipe, index) => {

            const images = await Recipe.files(recipe.id)
            const image = images[0]

            if (image) {
                recipe.image_path = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
            }

            return recipe


        })
        const firstRecipes = await Promise.all(recipesPromise)
        recipes = firstRecipes.filter((recipe, index) => index > 2 ? false : true)

        return res.render("home/index", { recipes })
    },
    about(req, res) {
        return res.render("home/about")
    },
    async chefs(req, res) {
        let chefs = await Chef.all()

        const chefsPromise = chefs.map(async chef => {
            let avatar = await Chef.find_avatar(chef.id)

            chef.avatar_url = avatar.path

            return chef
        })

        chefs = await Promise.all(chefsPromise)
        return res.render("home/chefs", { chefs })
    },
    async search(req, res) {
        const { search } = req

        let results = await Recipe.search(search)

        const recipesPromise = results.map(async recipe => {
            let image = await Recipe.files(recipe.id)
            image = image[0]

            recipe.image_path = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`

            return recipe
        })

        const recipes = await Promise.all(recipesPromise)

        return res.render("home/search", { recipes, search })
    },
    async show(req, res) {
        let { recipe } = req
        let results = await Recipe.files(recipe.id)

        const files = results.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("home/recipe", { recipe, files })
    }
}


