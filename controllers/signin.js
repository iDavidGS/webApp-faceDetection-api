
const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Información en formulario incorrecta')
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('No se puede obtener el usuario'))
            } else {
                res.status(400).json('Credenciales incorrectas')
            }
        })
        .catch(err => res.status(400).json('Credenciales incorrectas'))
}

module.exports = {
    handleSignin: handleSignin
};
