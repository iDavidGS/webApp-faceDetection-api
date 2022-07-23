
const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('No encontrado')
            }
        })
        .catch(err => res.status(400).json('Error al obtener el usuario'))
}

module.exports = {
    handleProfileGet: handleProfileGet
};
