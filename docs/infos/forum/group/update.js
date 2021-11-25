const ApiError = require("../../../../error/ApiError")
const {FORUM_GROUP} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_GROUP],
        description: "Изменение группы разделов. Необходима авторизация в роли Admin",
        operationId: "update_forum_group",
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
            },
            {
                name: "id",
                in: "body",
                type: "string",
                required: true,
                description: "Идентификатор группы",
            }
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        id: 234,
                        name: "Новое название группы разделов",
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Изменение данных группы успешно",
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
                            ApiError.REQUIRED_FIELD_EMPTY('id'),
                        ]
                    },
                },
            },
        },
    },
};