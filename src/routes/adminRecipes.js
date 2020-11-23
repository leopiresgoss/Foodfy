const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session') /*usuário comum */

const RecipeValidator = require("../app/validators/RecipeValidator")

const RecipeController = require("../app/controllers/RecipeController")

//admin recipes
routes.get("/", onlyUsers, RecipeController.index)
routes.get("/create", onlyUsers, RecipeController.create)
routes.get("/:id", onlyUsers, RecipeValidator.show, RecipeController.show)
routes.get("/:id/edit", onlyUsers, RecipeValidator.edit, RecipeController.edit) //somente autorizado (proprio usuario e admin)

routes.post("/", RecipeValidator.fillAllFields, multer.array("photos", 5), RecipeController.post)
routes.put("/", RecipeValidator.fillAllFields, multer.array("photos", 5), RecipeController.put)
routes.delete("/", RecipeController.delete)

module.exports = routes