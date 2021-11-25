const ApiError = require("../../../../error/ApiError")
const {TRACKED_THEME} = require('../../../tags')

module.exports = {
    post: {
        tags: [TRACKED_THEME],
        description: "Изменение состояния отслеживаемой темы (добавление/удаление). Необходима авторизация в роли User",
        operationId: "change_state_tracked_theme",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "theme_id",
                in: "body",
                type: "string",
                required: true,
                description: "Идентификатор темы",
            },
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        theme_id: 1123,
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Изменение состояния темы успешно",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ForumTheme"
                        },
                        example: {
                            success: true,
                            is_tracked: true,
                            theme: {

                            }
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
                        ]
                    },
                },
            },
        },
    },
};