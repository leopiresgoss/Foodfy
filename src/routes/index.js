const express = require('express')
const routes = express.Router()

const HomeValidator = require("../app/validators/HomeValidator")
const HomeController = require("../app/controllers/HomeController")

const chefs = require('./adminChefs')
const recipes = require('./adminRecipes')
const users = require('./adminUsers')

//public
routes.get("/", HomeController.index)

routes.get("/about", HomeController.about)
routes.get("/chefs", HomeController.chefs)
routes.get("/recipes", HomeValidator.search, HomeController.search)
routes.get("/recipe/:id", HomeValidator.show, HomeController.show)

//admin
routes.use('/admin', users)
routes.use('/admin/chefs', chefs)
routes.use('/admin/recipes', recipes)


module.exports = routes 
