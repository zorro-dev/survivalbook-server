const ApiError = require("../../../../error/ApiError")
const {FORUM_GROUP} = require('../../../tags')

module.exports = {
    get: {
        tags: [FORUM_GROUP],
        description: "Получить список групп разделов.",
        operationId: "get_all_forum_groups",

        responses: {
            200: {
                description: "Успешное получение списка групп разделов",
                content: {
                    "application/json": {
                        schema: {},
                        example: {
                            success: true,
                            groups: [
                                {
                                    "id": 423,
                                    "name": "Название группы разделов"
                                },
                                {
                                    "id": 424,
                                    "name": "Название группы разделов 2"
                                }
                            ]
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
                        ]
                    },
                },
            },
        },
    },
};