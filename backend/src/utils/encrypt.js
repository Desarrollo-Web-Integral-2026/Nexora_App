const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const SALT_ROUNDS = 10
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const ALGORITHM = 'aes-256-cbc'

// Bcrypt para contraseñas
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    return bcrypt.hash(password, salt)
}

const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash)
}

// AES-256 para datos sensibles
const encryptField = (text) => {
    if (!ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY no definida en variables de entorno')
    }

    const iv = crypto.randomBytes(16)
    const key = Buffer.from(ENCRYPTION_KEY, 'hex')
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return `${iv.toString('hex')}:${encrypted}`
}

const decryptField = (encryptedText) => {
    if (!ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY no definida en variables de entorno')
    }

    const [ivHex, encrypted] = encryptedText.split(':')

    if (!ivHex || !encrypted) {
        throw new Error('Formato de texto cifrado inválido')
    }

    const iv = Buffer.from(ivHex, 'hex')
    const key = Buffer.from(ENCRYPTION_KEY, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}

module.exports = {
    hashPassword,
    comparePassword,
    encryptField,
    decryptField
}