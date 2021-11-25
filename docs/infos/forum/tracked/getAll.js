const ApiError = require("../../../../error/ApiError")
const {TRACKED_THEME} = require('../../../tags')

module.exports = {
    get: {
        tags: [TRACKED_THEME],
        description: "Получение списка отслеживаемых тем. Работает с пагинацией",
        operationId: "get_tracked_theme_list",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "chunk",
                in: "query",
                type: "string",
                required: true,
                description: "Номер чанка из которого грузить отслеживаемые",
            },
        ],

        responses: {
            200: {
                description: "Список тем успешно загружен",
                content: {
                    "application/json": {
                        schema: {},
                        example: [
                            {

                            },
                            {

                            }
                        ]
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
                            ApiError.NOT_AUTH(),
                            ApiError.NOT_ACCESS(),
                            ApiError.REQUIRED_FIELD_EMPTY('chunk'),
                        ]
                    },
                },
            },
        },
    },
};