const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const Sequelize = require('sequelize')
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
  id: 0 // TODO заменить на реальное значение
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
  // order: {type: DataTypes.INTEGER, allowNull: false, defaultValue: Sequelize.col('id')}
})

const FavoritePart = sequelize.define('favorite_part', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  icon: {type: DataTypes.STRING, allowNull: false},
})

const FavoriteArticle = sequelize.define('favorite_article', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Article = sequelize.define('article', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  content: {type: DataTypes.TEXT},
  version: {type: DataTypes.INTEGER, allowNull: false}
})

const ForumGroup = sequelize.define('forum_group', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
})

const ForumPart = sequelize.define('forum_part', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false, defaultValue: "Название раздела"},
  icon_url: {type: DataTypes.STRING},
})

const ForumTheme = sequelize.define('forum_theme', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
})

const ForumMessage = sequelize.define('forum_message', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  text: {type: DataTypes.STRING, allowNull: false},
  is_removed: {type: DataTypes.BOOLEAN, allowNull: false},
  answer_to: {type: DataTypes.INTEGER},
  answer_to_account: {type: DataTypes.INTEGER},
})

const ForumTrackedTheme = sequelize.define('forum_tracked_theme', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const ForumLastReadMessage = sequelize.define('forum_last_read_message', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


Account.hasMany(FavoriteArticle)
Account.hasMany(FavoritePart)
FavoriteArticle.belongsTo(FavoritePart)
FavoriteArticle.belongsTo(Article)

ForumGroup.hasMany(ForumPart)
ForumPart.hasMany(ForumTheme)

ForumMessage.belongsTo(Account)
ForumMessage.belongsTo(ForumTheme)

ForumTrackedTheme.belongsTo(Account)
ForumTrackedTheme.belongsTo(ForumTheme)

ForumLastReadMessage.belongsTo(Account)
ForumLastReadMessage.belongsTo(ForumTheme)
ForumLastReadMessage.belongsTo(ForumMessage)

module.exports = {
  User,

  ForumGroup,
  ForumPart,
  ForumTheme,
  ForumMessage,
  ForumTrackedTheme,
  ForumLastReadMessage,

  Article,
  FavoritePart,
  FavoriteArticle,
  Account,
  EncyclopediaPart,
}