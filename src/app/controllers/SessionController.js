const mailer = require('../../lib/mailer')
const crypto = require('crypto')
const { hash } = require('bcryptjs')
const User = require('../models/User')

module.exports = {
    loginForm(req, res) {
        return res.render("admin/session/login")
    },
    login(req, res){
        req.session.userId = req.user.id
        req.session.is_admin = req.user.is_admin

        return res.redirect('/admin/profile')
    },
    logout(req, res) {
        req.session.destroy()

        return res.render("admin/session/login")
    },
    forgotForm(req, res){
        return res.render("admin/session/forgot-password")
    },
    async forgot(req, res){
        try{
            const { user } = req
            const token = crypto.randomBytes(20).toString("hex")
    
            let now = new Date()
            now = now.setHours(now.getHours() + 1)
    
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a senha?</h2>
                <p> Não se preocupe, clique no link abaixo</p>
                <p>
                    <a href="http://localhost:3000/admin/reset-password?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `
            })

            return res.render("admin/session/forgot-password", {
                success: "Verifique seu e-mail para resetar a senha"
            })
        }catch (error){
            console.error(error)
            return res.render("admin/session/forgot-password", {
                error: "Erro inesperado, tente novamente"
            })
        }        
    },
    resetForm(req, res){
        return res.render("admin/session/reset-password", { token: req.query.token })
    },
    async reset(req, res) {
        const { password, token } = req.body
        const { user } = req
        try{
            const newPassword = await hash(password, 8)
        
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render("admin/session/login", {
                user: req.body,
                success: "Senha atualizada, faça seu login"
            })

        }catch(error){
            console.error(error)
            return res.render("admin/session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente!"
            })
        }
    }
}