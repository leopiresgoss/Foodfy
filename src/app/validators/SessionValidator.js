const User = require('../models/User')
const { compare } = require("bcryptjs")
module.exports = {
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: {email} })
    
            if (!user) return res.render("admin/session/login", {
                user: req.body,
                error: "Usuário não cadastrado"
            })
            
            if (!password) return res.render("admin/session/login", {
                user: req.body,
                error: "Coloque uma senha válida"
            })
            const passed = await compare(password, user.password)
    
            if (!passed) return res.render("admin/session/login", {
                user: req.body,
                error: "Senha incorreta"
            })
    
            req.user = user 
    
            next()            
        } catch (error) {
            console.error(error)
        }
    },
    async forgot(req, res, next) {
        try{
            const { email } = req.body

            let user = await User.findOne({ where: {email} })
    
            if (!user) return res.render("admin/session/forgot-password", {
                error: "Email não cadastrado"
            })
    
            req.user = user
    
            next()
        } catch(error){
            console.error(error)
        }
    },
    async reset(req, res, next){ 
        try {
            const { email, password, passwordRepeat, token }  = req.body
            const user = await User.findOne({ where: {email} })
        
            if (!user) return res.render("admin/session/reset-password", {
                user: req.body,
                token,
                error: "Usário não cadastrado"
            })
    
            if (!password) return res.render("admin/session/reset-password", {
                user: req.body,
                token,
                error: "Coloque uma senha válida"
            })
    
            if (password != passwordRepeat)
                return res.render("admin/session/reset-password", {
                    user: req.body,
                    token,
                    error: 'A senha e a repetição da senha são diferentes'
                })
        
            
            if (token != user.reset_token) return res.render("admin/session/reset-password", {
                user: req.body,
                token,
                error: 'Token inválido! Solicite uma nova recuperação de senha'  
            })
    
            let now = new Date()
            now = now.setHours(now.getHours())
        
            if (now > user.reset_token_expires){
                return res.render("admin/session/reset-password", {
                    user: req.body,
                    token,
                    error: 'Token expirado! Solicite uma nova recuperação de senha'  
                })
            }
    
            req.user = user 
    
            next()  
        } catch (error) {
            console.error(error)
        }
    }
}