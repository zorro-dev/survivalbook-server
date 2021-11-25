const ApiError = require("../../../../error/ApiError")
const {FORUM_THEME} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_THEME],
        description: "Изменение темы. Необходима авторизация в роли Admin",
        operationId: "update_forum_theme",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "id",
                in: "body",
                type: "string",
                required: true,
                description: "Идентификатор темы",
            },
            {
                name: "name",
                in: "body",
                type: "string",
                required: false,
                description: "Название темы",
            },
            {
                name: "part_id",
                in: "body",
                type: "string",
                required: false,
                description: "id раздела темы",
            },
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        id: 234,
                        name: "Новое название темы",
                        part_id: 123
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Изменение данных темы успешно",
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
                            ApiError.NOT_ACCESS(),
                            ApiError.NOT_AUTH(),
                            ApiError.REQUIRED_FIELD_EMPTY('id'),
                        ]
                    },
                },
            },
        },
    },
};