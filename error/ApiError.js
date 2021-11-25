class ApiError extends Error {

    constructor(status, errorCode, message) {
        super();
        this.status = status
        this.errorCode = errorCode
        this.message = message
    }

    static UNEXPECTED_ERROR(err) {
        return ApiError.sendErrorCode(1000, 'Непредвиденная ошибка [' + err + ']')
    }

    static ENCYCLOPEDIA_NOT_FOUND() {
        return ApiError.sendErrorCode(1001, 'Энциклопедия не найдена')
    }

    static PARENT_PART_NOT_FOUND() {
        return ApiError.sendErrorCode(1002, 'Родительский раздел не найден')
    }

    static EMPTY_EMAIL() {
        return ApiError.sendErrorCode(1003, 'Введен пустой email')
    }


    static EMPTY_PASSWORD() {
        return ApiError.sendErrorCode(1005, 'Введен пустой пароль')
    }

    static EMAIL_ALREADY_EXIST() {
        return ApiError.sendErrorCode(1006, 'Пользователь с таким Email уже существует')
    }

    static EMPTY_UID() {
        return ApiError.sendErrorCode(1007, 'Пустой uid')
    }

    static USER_WITH_SOME_EMAIL_NOT_FOUND() {
        return ApiError.sendErrorCode(1008, 'Пользователь с таким email не найден')
    }

    static INVALID_UID_OR_EMAIL() {
        return ApiError.sendErrorCode(1009, 'Неверный логин или uid')
    }

    static INVALID_EMAIL_OR_PASSWORD() {
        return ApiError.sendErrorCode(1010, 'Неверный логин или пароль')
    }

    static NOT_AUTH() {
        return ApiError.sendErrorCode(1011, 'Пользователь не авторизирован')
    }

    static NOT_ACCESS() {
        return ApiError.sendErrorCode(1012, 'Нет доступа')
    }

    static INVALID_UPDATE_PART(validationError) {
        return ApiError.sendErrorCode(1013, 'Неверные данные при попытке обновления [' + validationError + ']')
    }

    static REQUIRED_FIELD_EMPTY(fieldName) {
        return ApiError.sendErrorCode(1014, 'Не передано обязательное поле [' + fieldName + ']')
    }

    static REQUIRED_OBJECT_NOT_FOUND(objectName) {
        return ApiError.sendErrorCode(1015, 'Не был найден объект [' + objectName + ']')
    }

    static sendErrorCode(errorCode, message) {
        return new ApiError(500, errorCode, message)
    }

    static badRequest(message) {
        return new ApiError(404, message)
    }

    static internal(message) {
        return new ApiError(500, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }

}

module.exports = ApiError