const express = require('express')
const routes = express.Router()

const { onlyUsers } = require('../app/middlewares/session') /*usuário comum */
const { onlyUserAdmin } = require('../app/middlewares/session') 

const ChefValidator = require("../app/validators/ChefValidator")

const ChefController = require("../app/controllers/ChefController")

//admin chefs
routes.get("/", onlyUsers, ChefController.index)
routes.get("/create", onlyUserAdmin, ChefController.create)
routes.get("/:id", onlyUsers, ChefValidator.show, ChefController.show)
routes.get("/:id/edit", onlyUserAdmin, ChefValidator.show, ChefController.edit)

routes.post("/", ChefValidator.post, ChefController.post)
routes.put("/", ChefValidator.put, ChefController.put)
routes.delete("/", ChefController.delete)

module.exports = routes