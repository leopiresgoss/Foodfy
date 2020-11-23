const express = require('express')
const routes = express.Router()

const { isLoggedRedirectToUsers } = require('../app/middlewares/session')
const { onlyUsers } = require('../app/middlewares/session') /*usuário comum */
const { onlyUserAdmin } = require('../app/middlewares/session') /*exclusivo para adm */

const SessionValidator = require('../app/validators/SessionValidator')
const UserValidator = require('../app/validators/UserValidator')

const UserController = require("../app/controllers/UserController")
const SessionController = require("../app/controllers/SessionController")
const ProfileController = require("../app/controllers/ProfileController")


//login/logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)

routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// reset-password / forgot
routes.get('/forgot-password', isLoggedRedirectToUsers, SessionController.forgotForm)
routes.get('/reset-password', isLoggedRedirectToUsers, SessionController.resetForm)

routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/reset-password', SessionValidator.reset, SessionController.reset)

//admin users
// Rotas de perfil de um usuário logado
routes.get('/profile', onlyUsers, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', UserValidator.profileUpdate, ProfileController.put)// Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyUserAdmin, UserController.list) //Mostrar a lista de usuários cadastrados

//user register
routes.get('/users/register', onlyUserAdmin, UserController.registerForm)
routes.get('/users/:id/edit', onlyUserAdmin, UserValidator.edit, UserController.edit)
routes.post('/users', UserValidator.post, UserController.post) //Cadastrar um usuário
routes.put('/users', UserValidator.update, UserController.put)
routes.delete('/users', UserController.delete) // Deletar um usuário


module.exports = routes