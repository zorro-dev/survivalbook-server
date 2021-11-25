const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const {UserRole} = require('../models/constants')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    uid: {type: DataTypes.STRING, unique: true, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: UserRole.User},
})

const Part = sequelize.define('part', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    version: {type: DataTypes.INTEGER, allowNull: false},
    is_article: {type: DataTypes.BOOLEAN, allowNull: false},
    article_id: {type: DataTypes.STRING},
    is_hidden: {type: DataTypes.BOOLEAN, allowNull: false},
    icon_url: {type: DataTypes.STRING, allowNull: false},
    fragment_type: {type: DataTypes.STRING}
})

const FavoritePart = sequelize.define('favorite_part', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    user_id: {type: DataTypes.STRING, allowNull: false},
    icon: {type: DataTypes.STRING, allowNull: false},
})

const FavoriteArticle = sequelize.define('favorite_article', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    part_id: {type: DataTypes.STRING, allowNull: false},
    article_id: {type: DataTypes.STRING, allowNull: false},
    user_id: {type: DataTypes.STRING, allowNull: false},
    favorite_part_id: {type: DataTypes.STRING},
})

const Article = sequelize.define('article', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    content: {type: DataTypes.TEXT},
    version: {type: DataTypes.INTEGER, allowNull: false}
})

const ContentPart = sequelize.define('content_part', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    parent: {type: DataTypes.INTEGER, allowNull: false},
    child: {type: DataTypes.INTEGER},
})


const ForumGroup  = sequelize.define('forum_group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})

const ForumPart  = sequelize.define('forum_part', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    icon_url: {type: DataTypes.STRING},
    group_id: {type: DataTypes.STRING},
})

const ForumTheme  = sequelize.define('forum_theme', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    part_id: {type: DataTypes.STRING},
})

const ForumMessage  = sequelize.define('forum_message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.STRING, allowNull: false},
    theme_id: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.STRING, allowNull: false},
    is_removed: {type: DataTypes.BOOLEAN, allowNull: false},
    answer_to: {type: DataTypes.STRING},
    answer_to_user: {type: DataTypes.STRING},
})

const TrackedTheme  = sequelize.define('tracked_theme', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.STRING, allowNull: false},
    theme_id: {type: DataTypes.STRING, allowNull: false},
})

const LastReadMessage  = sequelize.define('last_read_message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.STRING, allowNull: false},
    theme_id: {type: DataTypes.STRING, allowNull: false},
    message_id: {type: DataTypes.STRING, allowNull: false},
})



// для обновления базы данных
// sequelize.sync({alter: true})

module.exports = {
    User,
    Part,
    Article,
    ContentPart,
    FavoritePart,
    FavoriteArticle,
    ForumGroup,
    ForumPart,
    ForumTheme,
    ForumMessage,
    TrackedTheme,
    LastReadMessage,
}