const ApiError = require("../../../../error/ApiError")
const {FORUM_THEME} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_THEME],
        description: "Удаление сообщения в теме. Необходима авторизация в роли User",
        operationId: "remove_message_to_theme",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "theme_id",
                in: "body",
                type: "string",
                required: true,
                description: "id темы",
            },
            {
                name: "message_id",
                in: "body",
                type: "string",
                required: true,
                description: "id сообщения",
            }
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        theme_id: 123123,
                        message_id: 4234,
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Сообщение успешно удалено",
                content: {
                    "application/json": {
                        schema: {},
                        example: {
                            success: true
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
                            ApiError.UNEXPECTED_ERROR(),
                            ApiError.NOT_ACCESS(),
                            ApiError.NOT_AUTH(),
                            ApiError.REQUIRED_FIELD_EMPTY('theme_id'),
                            ApiError.REQUIRED_FIELD_EMPTY('message_id'),
                        ]
                    },
                },
            },
        },
    },
};