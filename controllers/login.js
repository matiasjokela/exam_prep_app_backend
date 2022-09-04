const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')


loginRouter.post('/', async (request, reponse) => {
	console.log(request.body)
	const { username, password } = request.body
	console.log(username, password)
	const user = await User.findOne({ username })
	console.log(user)
	const passwordCorrect = !user ? false : await bcrypt.compare(password, user.passwordHash)
	if (!passwordCorrect) {
		return reponse.status(401).json({
			error: 'Väärä käyttäjätunnus tai salasana'
		})
	}
	const userForToken = {
		username: user.username,
		id: user._id
	}
	const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 360*60 })
	response.status(200).send({ token, username: username })
})





module.exports = loginRouter