const Base = require('./Base')

const db = require('../../config/db')


Base.init({table: 'files'})

module.exports = {
    ...Base,
    async SelectAllRecipeFiles(id) {
        const results = await db.query(`
        SELECT files.*
        FROM files
        LEFT JOIN  recipe_files ON (files.id = recipe_files.file_id) 
        WHERE recipe_files.recipe_id = $1
        `, [id])
        
        return results.rows
    }
}