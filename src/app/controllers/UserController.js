const User = require('../models/User')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

const mailer = require('../../lib/mailer')
const crypto = require('crypto')
const fs = require('fs')
const { hash } = require('bcryptjs')


module.exports = {
    async list(req, res) {
        const users = await User.findAll()
        return res.render("admin/users/index", { users })
    },
    registerForm(req, res) {    
        return res.render("admin/users/register")
    },
    async post(req, res) {
        try {
            let user = req.body
        
            const token = crypto.randomBytes(5).toString("hex")
            
            let now = new Date()
            now = now.setHours(now.getHours() + 0.5)
    
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Cadastro de Usuário Foodfy',
                html: `<h2>Quase lá!</h2>
                <p> Para finalizar seu cadastro, use a senha abaixo para entrar no sistema</p>
                <p>Senha: ${token}</p>
                <p>
                    <a href="http://localhost:3000/admin/login" target="_blank">
                        Login
                    </a>
                </p>
                `
            })
            
            user.reset_token_expires = now
            user.password = await hash(token, 8)
            user.is_admin = user.is_admin ? true : false
    
            await User.create(user)

            const users = await User.findAll()
            return res.render("admin/users/index", {
                users,
                success: 'Cadastro realizado com sucesso'
            })          
        } catch (error) {
            console.error(error)
            return res.render("admin/users/register", {
                user: req.body,
                error: 'Não foi possível cadastrar'
            })
        }
    },
    async edit(req, res) {
        return res.render("admin/users/edit", { user: req.selectedUser })
    },
    async put(req, res) {
        try{
            let {id, name, email, is_admin} = req.body
            is_admin = is_admin ? true : false
            
            await User.update(id, {
                name,
                email,
                is_admin
            })

            return res.render("admin/users/edit", {
                user: req.body,
                success: "Cadastro Atualizado"
            })
        } catch (error){
            console.log(error)
            return res.render("admin/users/edit", {
                user: req.body,
                error: "Não foi possível atualizar"
            })
            
        }
    },
    async delete(req, res) {
        try{
            const recipes = await Recipe.findAll({where: {user_id: req.body.id}})

            let filesId = []
            if (recipes) {
                const allFilesPromise = recipes.map(recipe => Recipe.files(recipe.id))

                

                let promiseResults = await Promise.all(allFilesPromise)

                promiseResults.map(results => {
                    results.map(file => {
                        fs.unlinkSync(file.path)
                        filesId.push(file.id)
                    })

                })
            }

            await User.delete(req.body.id)

            if (filesId) {
                filesId.map(file => File.delete(file.id))

                await Promise.all(filesId)
            }
                        
            let users = await User.findAll()

            return res.render("admin/users/index", {
                users,
                success: 'Conta deletada com sucesso!'
            })
        } catch (error) {
            console.error(error)
            return res.render("admin/users/edit", {
                user: req.body,
                error: 'Erro ao tentar deletar sua conta'
            })
        }
    }
}