const ApiError = require("../../../../error/ApiError")
const {FORUM_THEME} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_THEME],
        description: "Отправление сообщения в тему. Необходима авторизация в роли User",
        operationId: "send_message_to_theme",
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
                name: "text",
                in: "body",
                type: "string",
                required: true,
                description: "Текст сообщения",
            },
            {
                name: "answer_to",
                in: "body",
                type: "string",
                required: false,
                description: "id сообщения на которое отвечает сообщение",
            }
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        theme_id: 123123,
                        text: "Текст сообщения",
                        answer_to: 4234,
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Сообщение успешно отправлено",
                content: {
                    "application/json": {
                        schema: {},
                        example: {
                            user_id: 123,
                            theme_id: 123123,
                            text: "Текст сообщения",
                            answer_to: 4234,
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
                            ApiError.REQUIRED_FIELD_EMPTY('text'),
                        ]
                    },
                },
            },
        },
    },
};