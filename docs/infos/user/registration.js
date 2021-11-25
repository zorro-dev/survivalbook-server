const ApiError = require("../../../error/ApiError")
const {USERS} = require('../../tags')

module.exports = {
    post: {
        tags: [USERS],
        description: "Регистрация нового пользователя",
        operationId: "registration",
        parameters: [
            {
                name: "uid",
                in: "body",
                required: true,
                description: "Uid пользователя",
            },
            {
                name: "email",
                in: "body",
                required: true,
                description: "Email пользователя",
            },
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        uid: "123123123123",
                        email: "example.user@gmail.com",
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Регистрация пользователя прошла успешно, возвращается JWT",
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
                            ApiError.UNEXPECTED_ERROR(null),
                            ApiError.REQUIRED_FIELD_EMPTY('uid'),
                            ApiError.REQUIRED_FIELD_EMPTY('email'),
                            ApiError.EMAIL_ALREADY_EXIST(),
                        ]
                    },
                },
            },
        },
    },
};