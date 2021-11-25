const ApiError = require("../../../../error/ApiError")
const {FORUM_THEME} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_THEME],
        description: "Создание новой темы обсуждения. Необходима авторизация в роли Admin",
        operationId: "create_forum_theme",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "name",
                in: "body",
                type: "string",
                required: true,
                description: "Название темы",
            },
            {
                name: "part_id",
                in: "body",
                type: "string",
                required: false,
                description: "id раездела в которую будет добавлена тема",
            }
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        name: "Название темы",
                        part_id: 123,
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Создание темы успешно",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ForumTheme"
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
                            ApiError.REQUIRED_FIELD_EMPTY('name'),
                        ]
                    },
                },
            },
        },
    },
};