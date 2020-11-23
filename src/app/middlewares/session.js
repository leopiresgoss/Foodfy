const User = require('../models/User')
module.exports = {
    isLoggedRedirectToUsers(req, res, next) {
        if (req.session.userId) 
            return res.redirect('/admin/profile')
    
        next()
    },
    onlyUsers (req, res, next) {   
        if (!req.session.userId)
            return res.render("admin/session/login", {
                error: 'Acesso não autorizado '
                })
        next()
    },
    async onlyUserAdmin(req, res, next){
        const id = req.session.userId
        const user = await User.findOne({where: {id}})

        if (!req.session.is_admin)
            return res.render("admin/profile/index", {
                user,
                error: 'Acesso não autorizado '
            })
        next()
    }

    

}