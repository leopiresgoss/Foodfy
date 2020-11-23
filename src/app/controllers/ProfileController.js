const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try{
            const id = req.session.userId

            const user = await User.findOne({
                where: {id}
            })

            return res.render("admin/profile/index", {user})

        }catch(error){
            console.error(error)
            return res.send("Erro Inesperado. Tente mais tarde")
        }
    },
    async put(req, res) {
        try{
            const user = req.user

            let { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            return res.render("admin/profile/index", {
                user: req.body,
                success: "Cadastro Atualizado"  
            })
            
        }catch(error){
            console.error(error)
            return res.render("admin/profile/index", {
                user: req.body,
                error: "Não foi possível atualizar"
            })
        }
    }

}
       