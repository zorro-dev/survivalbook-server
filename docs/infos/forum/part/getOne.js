const ApiError = require("../../../../error/ApiError")
const {FORUM_PART} = require('../../../tags')

module.exports = {
    get: {
        tags: [FORUM_PART],
        description: "Получить определенный раздел.",
        operationId: "get_one_forum_part",

        parameters: [
            {
                name: "id",
                in: "path",
                type: "string",
                required: true,
                description: "Идентификатор раздела",
            }
        ],

        responses: {
            200: {
                description: "Успешное получение раздела",
                content: {
                    "application/json": {
                        schema: {},
                        example: {
                            success: true,
                            part: {
                                "id": 423,
                                "name": "Название группы разделов",
                                "themes" : [
                                    // TODO возвращение тем
                                ]
                            },
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
                            ApiError.UNEXPECTED_ERROR("unexpected error info"),
                            ApiError.REQUIRED_FIELD_EMPTY('id'),
                        ]
                    },
                },
            },
        },
    },
};