const ApiError = require("../../../../error/ApiError")
const {FORUM_PART} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_PART],
        description: "Удаление раздела. Необходима авторизация в роли Admin",
        operationId: "remove_forum_part",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "id",
                in: "body",
                type: "integer",
                required: true,
                description: "Идентификатор раздела",
            }
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        id: 345,
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Удаление раздела успешно",
                content: {
                    "application/json": {
                        schema: {
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
                            ApiError.REQUIRED_FIELD_EMPTY('id'),
                            ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumPart'),
                        ]
                    },
                },
            },
        },
    },
};