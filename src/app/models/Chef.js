const Base = require('./Base')

const db = require('../../config/db')

Base.init({ table: 'chefs' })

function findChef(filters) {
    let query = `
    SELECT chefs.*, count(recipes) AS total_recipes
    FROM chefs
    LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
   `
    if (filters) {
        Object.keys(filters).map(key => {
            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
                query += ` chefs.${field} = '${filters[key][field]}'`
            })
        })
    }

    query += ' GROUP BY chefs.id'

    return db.query(query)
}

module.exports = {

    ...Base,
    async all(filters) {
        const results = await findChef(filters)

        return results.rows
    },
    async find(filters) {
        const results = await findChef(filters)

        return results.rows[0]
    },
    findRecipes(id) {
        return db.query(`        
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.chef_id = $1
       `, [id])

    },
    async find_avatar(id) {
        const results = await db.query(`
        SELECT files.*
        FROM files
        LEFT JOIN chefs ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
        `, [id])

        return results.rows[0]
    }


}