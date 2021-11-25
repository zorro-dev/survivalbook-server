const ApiError = require("../../../../error/ApiError")
const {FORUM_THEME} = require('../../../tags')

module.exports = {
    get: {
        tags: [FORUM_THEME],
        description: "Получение сообщение из списка. Работает с пагинацией",
        operationId: "get_messages_from_theme",
        security: [
            { bearerAuth: [] }
        ],
        parameters: [
            {
                name: "theme_id",
                in: "query",
                type: "string",
                required: true,
                description: "id темы",
            },
            {
                name: "chunk",
                in: "query",
                type: "string",
                required: true,
                description: "Номер чанка из которого грузить сообщения",
            },
        ],

        responses: {
            200: {
                description: "Список сообщений успешно загружен",
                content: {
                    "application/json": {
                        schema: {},
                        example: [
                            {
                                message_id: 101,
                                user_id: 123,
                                avatar_url: "https://img01.rl0.ru/afisha/e1200x600i/daily.afisha.ru/uploads/images/2/f2/2f23c421db983f28be0a4d9e84fe1d3d.png",
                                theme_id: 123123,
                                is_removed: false,
                                text: "Текст сообщения",
                                answer_to: null,
                            },
                            {
                                message_id: 102,
                                user_id: 123,
                                avatar_url: "https://img01.rl0.ru/afisha/e1200x600i/daily.afisha.ru/uploads/images/2/f2/2f23c421db983f28be0a4d9e84fe1d3d.png",
                                theme_id: 123123,
                                is_removed: false,
                                text: "Текст сообщения",
                                answer_to: null,
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
                            ApiError.REQUIRED_FIELD_EMPTY('theme_id'),
                            ApiError.REQUIRED_FIELD_EMPTY('chunk'),
                        ]
                    },
                },
            },
        },
    },
};