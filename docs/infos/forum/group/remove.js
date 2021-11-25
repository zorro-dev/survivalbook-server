const ApiError = require("../../../../error/ApiError")
const {FORUM_GROUP} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_GROUP],
        description: "Удаление группы разделов. Необходима авторизация в роли Admin",
        operationId: "remove_forum_group",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
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
                        id: 345,
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Удаление группы успешно",
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
                            ApiError.NOT_ACCESS(),
                            ApiError.NOT_AUTH(),
                            ApiError.REQUIRED_FIELD_EMPTY('id'),
                            ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumGroup'),
                        ]
                    },
                },
            },
        },
    },
};