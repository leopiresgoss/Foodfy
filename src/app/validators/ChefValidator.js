const Chef = require('../models/Chef')

function checkAllFields(body) {
    const keys = Object.keys(body)
    for (key of keys) {
        if (body[key] == "" || !body.avatar_input) {
            return {
                error: 'Todos os campos são obrigatórios'
            }
        }
    }
}

module.exports = {
    post(req, res, next){
        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields)
            return res.render("admin/chefs/create", {
                chef: req.body,
                error: fillAllFields.error
            })

        next()
    },
    async show(req, res, next){
        try {
            const id = req.params.id
            let results = await Chef.find({where: {id}})
    
            if (!results) {
                results = await Chef.all()
                const chefsPromise = results.map(async chef => {
                    let avatar = await Chef.find_avatar(chef.id)
                    
                    chef.avatar_url = avatar.path
        
                    return chef    
                })
    
                chefs =  await Promise.all(chefsPromise)
    
                return res.render("admin/chefs/index", {
                    chefs,
                    error: 'Chef não encontrado'
                })
            }
            
            req.chef = results
            
            next()   
        } catch (error) {
            console.error(error)
        }
    },
    put(req, res, next){
        const fillAllFields = checkAllFields(req.body)
        if (fillAllFields)
            return res.render("admin/chefs/edit", {
                chef: req.body,
                error: fillAllFields.error
            })

        next()
    },

}