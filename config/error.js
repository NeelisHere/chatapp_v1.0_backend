const handleError = (res, error_message, status_code) => {
    res.status(status_code).json({
        success: false,
        message: error_message
    })
    throw new Error(error_message)
}

module.exports = handleError