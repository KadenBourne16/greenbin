import jsonwebtoken from 'jsonwebtoken'


export const generateToken = (user) => {
    return jsonwebtoken.sign({
        id: user._id,
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}


export const verifyToken = (token) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET)
}