const ApiError = require("../../../../error/ApiError")
const {FORUM_PART} = require('../../../tags')

module.exports = {
    post: {
        tags: [FORUM_PART],
        description: "Изменение раздела. Необходима авторизация в роли Admin",
        operationId: "update_forum_part",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "id",
                in: "body",
                type: "string",
                required: true,
                description: "Идентификатор раздела",
            },
            {
                name: "name",
                in: "body",
                type: "string",
                required: false,
                description: "Название раздела",
            },
            {
                name: "icon_url",
                in: "body",
                type: "string",
                required: false,
                description: "Ссылка на иконку раздела",
            },
            {
                name: "group_id",
                in: "body",
                type: "string",
                required: false,
                description: "id группы раздела",
            },
        ],
        requestBody: {
            content: {
                "application/json": {
                    schema: {},
                    example: {
                        id: 234,
                        name: "Новое название раздела",
                        icon_url: "https://telegra.ph/file/652df73bd135f4688d996.png",
                        group_id: 123
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Изменение данных раздела успешно",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ForumPart"
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