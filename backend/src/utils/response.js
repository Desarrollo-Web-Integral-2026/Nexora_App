const success = (res, data = null, message = 'ok', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    })
}

const error = (res, message = 'Error interno del servidor', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    })
}

module.exports = { success, error}