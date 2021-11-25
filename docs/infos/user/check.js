const ApiError = require("../../../error/ApiError")
const {USERS} = require('../../tags')

module.exports = {
    get: {
        tags: [USERS],
        description: "Обновление Json Web Token",
        operationId: "check",
        security: [
            { bearerAuth: [] }
        ],

        responses: {
            200: {
                description: "Проверка текна прошла успешно, возвращается новый JWT",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/JsonWebToken"
                        }
                    },
                },
            },
            500: {
                description: "Ошибка сервера",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Error"
                        },
                        example: [
                            ApiError.NOT_AUTH()
                        ]
                    },
                },
            },
        },
    },
};