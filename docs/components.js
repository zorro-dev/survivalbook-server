module.exports = {
    components: {
        schemas: {
            JsonWebToken: {
                type: "object", // data type
                properties: {
                    token: {
                        type: "string", // data type
                        description: "Json Web Token (JWT)", // desc
                        example: "xxxxx.yyyyy.zzzzz", // example of a title
                    }
                },
            },

            Error: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Описание ошибки",
                    },
                    internal_code: {
                        type: "integer",
                        description: "Внутренний код ошибки",
                    }
                }
            },

            ForumGroup: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        example: 423,
                        description: "Идентификатор группы",
                    },
                    name: {
                        type: "string",
                        example: "Название группы разделов",
                        description: "Название группы",
                    }
                }
            },
            ForumPart: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        example: 423,
                        description: "Идентификатор раздела",
                    },
                    name: {
                        type: "string",
                        example: "Название раздела",
                        description: "Название раздела",
                    },
                    icon_url: {
                        type: "string",
                        example: "https://telegra.ph/file/652df73bd135f4688d996.png",
                        description: "Иконка раздела",
                    },
                    group_id: {
                        type: "integer",
                        example: 123,
                        description: "id группы раздела",
                    }
                }
            },
            ForumTheme: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        example: 423,
                        description: "Идентификатор темы",
                    },
                    name: {
                        type: "string",
                        example: "Название темы",
                        description: "Название темы",
                    },
                    part_id: {
                        type: "integer",
                        example: 123,
                        description: "id раздела темы",
                    }
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
};