const User = require('../models/User')
const { compare } = require("bcryptjs")
const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

function checkAllFields(body) {
    const keys = Object.keys(body)
    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Complete todos os campos'
            }
        }
    }

}


module.exports = {
    async profileUpdate(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body)

            if (fillAllFields) {
                return res.render("admin/profile/index", fillAllFields)
            }
    
            const { id, password } = req.body
    
            if (!password) return res.render("admin/profile/index", {
                user: req.body,
                error: "Senha Inválida"
            })
    
            const user = await User.findOne({ where: { id } })
    
            const passed = await compare(password, user.password)
    
            if (!passed) return res.render("admin/profile/index", {
                user: req.body,
                error: "Senha incorreta"
            })
    
            req.user = user
    
            next()            
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body)

            if (fillAllFields) {
                return res.render("admin/users/register", fillAllFields)
            }

            const { email } = req.body

            if (!email.match(mailFormat)) return res.render("admin/users/register", {
                user: req.body,
                error: 'Digite um e-mail válido'
            })

            const user = await User.findOne({
                where: { email }
            })

            if (user) return res.render("admin/users/register", {
                user: req.body,
                error: 'E-mail já existente'
            })

            next()
        } catch (error) {
            console.error(error)
        }       
    },
    async edit(req, res, next) {
        try {
            const id = req.params.id

            if (req.session.userId == id){
                return res.redirect('/admin/profile')
            }
    
            const user = await User.findOne({ where: { id } })
    
            if (!user) return res.render("admin/users/register", {
                error: "Usário não encontrado"
            })
    
            req.selectedUser = user
    
            next()
        } catch (error) {
            console.error(error)
        }
    },
    update(req, res, next) {
        const fillAllFields = checkAllFields(req.body)

        if (fillAllFields) {
            return res.render("admin/users/edit", fillAllFields)
        }

        next()
    }


}