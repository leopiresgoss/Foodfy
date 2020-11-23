const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const Recipe_Files = require('./src/app/models/Recipe_Files')
const File = require('./src/app/models/File')



let totalUsers = 2
let totalChefs = 3
let totalRecipes = 1

let usersIds = []
let chefsIds = []
let password = '0000'


async function createUsers() {
    try {
        let users = []
        password = await hash(password, 8)

        while (users.length < totalUsers) {
            users.push({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password,
                is_admin: true,
            })
        }

        const usersPromise = users.map(user => User.create(user))
        usersIds = await Promise.all(usersPromise)

    } catch (error) {
        console.error(error)
    }
}

async function createChefs() {
    try {
        let chefs = []

        while (chefs.length < totalChefs) {
            chefs.push({
                name: faker.name.firstName()
            })
        }

        const chefsPromise = chefs.map(async chef => {
            const chefId = await Chef.create(chef)

            const avatar_url = "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
            
            const image_name = `${Date.now().toString()}=${avatar_url}`
            
            const file_id = await File.create({
                name: image_name,
                path: avatar_url
            })

            await Chef.update(chefId, { file_id })

            return chefId
        })

        chefsIds = await Promise.all(chefsPromise)

    } catch (error) {
        console.error(error)
    }
}

async function createRecipes() {
    try {
        let recipes = []

        while (recipes.length < totalRecipes) {
            const moreinfo = faker.random.arrayElements([
                '',
                `${faker.lorem.paragraphs(3)}`
            ])

            
            recipes.push({
                chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
                title: faker.random.words(3),
                ingredients: `{${faker.random.words(5)}}` ,
                preparation: `{${faker.random.words(5)}}` ,
                moreinfo: moreinfo[0],
                user_id: usersIds[Math.floor(Math.random() * totalUsers)]
            })
        }

        const recipesPromise = recipes.map(async recipe => {
            const recipe_id = await Recipe.create(recipe)
            
            const file_id = await File.create({
                name: faker.image.image(),
                path: `public\\images\\500x500.png`
            })

            await Recipe_Files.create({
                recipe_id,
                file_id
            })

            return 
        })

        await Promise.all(recipesPromise)

    } catch (error) {
        console.error(error)
    }
}

async function init () {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()
