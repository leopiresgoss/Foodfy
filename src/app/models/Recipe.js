const Base = require('./Base')

const db = require('../../config/db')

Base.init({table: 'recipes'})


module.exports = {
    ...Base,
    async all() {
        const results = await db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ORDER BY recipes.created_at DESC
        `)
        return results.rows
    },
    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
            WHERE recipes.id = $1`, [id])
    },
    async search(search) {
        const results = await db.query(`        
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${search}%'
        ORDER BY recipes.updated_at DESC
        `)

        return results.rows
    },
    async files(id) {
        const results = await db.query(`
        SELECT files.*
        FROM files
        LEFT JOIN  recipe_files ON (files.id = recipe_files.file_id) 
        WHERE recipe_files.recipe_id = $1`, [id])

        return results.rows
    }
}