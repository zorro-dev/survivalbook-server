const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const {UserRole} = require('../models/constants')
const constants = require('../models/constants')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    uid: {type: DataTypes.STRING, unique: true, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: UserRole.User},
})

const defaultAccountAttributes = {}
const defaultAccountRights = []

const Account = sequelize.define('account', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    uid: {type: DataTypes.STRING, unique: true, allowNull: false},
    attributes: {type: DataTypes.JSONB, allowNull: false, defaultValue: defaultAccountAttributes},
    rights: {type: DataTypes.JSONB, allowNull: false, defaultValue: defaultAccountRights},
    sign_in_providers: {type: DataTypes.JSONB, allowNull: false},
})

const defaultEncyclopediaPartAttributes = {
    fragment_type: constants.EncyclopediaPart_FragmentType.LinearListFragment,
    icon_url: "default_icon_url" // TODO заменить на реальное значение
}
// TODO : если при создании разделу не был назначени родительский раздел,
// закидываем его в специальный раздел, который будет сборником таких разделов
// тоже самое можно делать с удаленными разделами, для них использовать другой раздел
const defaultEncyclopediaPartParent = {
    type: constants.EncyclopediaPart_RelationshipType.Part,
    id : 0 // TODO заменить на реальное значение
}
const defaultEncyclopediaPartChild = {
    type: constants.EncyclopediaPart_RelationshipType.Part,
}
const EncyclopediaPart = sequelize.define('encyclopedia_part', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, defaultValue: "Название раздела"},
    version: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    visibility: {type: DataTypes.STRING, allowNull: false, defaultValue: constants.EncyclopediaPart_Visibility.Visible},
    attributes: {type: DataTypes.JSONB, allowNull: false, defaultValue: defaultEncyclopediaPartAttributes},
    parent: {type: DataTypes.JSONB, allowNull: false, defaultValue: defaultEncyclopediaPartParent},
    child: {type: DataTypes.JSONB, allowNull: false, defaultValue: defaultEncyclopediaPartChild},
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

module.exports = {
    User,
    Part: EncyclopediaPart,
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

    Account,
    EncyclopediaPart,
}