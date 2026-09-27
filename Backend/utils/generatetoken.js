const jwt = require('jsonwebtoken')
const generatetoken = async (id) => {
    return jwt.sign({id}, process.env.JWT_KEY, {expiresIn: "30d"})
}
module.exports = generatetoken;