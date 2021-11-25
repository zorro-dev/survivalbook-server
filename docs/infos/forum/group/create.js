const ApiError = require("../../../../error/ApiError")
const {FORUM_GROUP} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_GROUP],
        description: "Создание новой группы разделов. Необходима авторизация в роли Admin",
        operationId: "create_forum_group",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "name",
                in: "body",
                type: "string",
                required: true,
                description: "Название группы",
            }
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        name: "Название группы разделов",
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Создание группы успешно",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ForumGroup"
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
                            ApiError.REQUIRED_FIELD_EMPTY('name'),
                        ]
                    },
                },
            },
        },
    },
};