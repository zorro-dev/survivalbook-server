class UserRole {
    static Visitor = "Visitor"
    static User = "User"
    static Admin = "Admin"
}

class SignInProvider {
    static custom  = "custom"
    static password = "password"
    static phone = "phone"
    static anonymous = "anonymous"
    static google = "google.com"
    static facebook = "facebook.com"
    static github = "github.com"
    static twitter = "twitter.com"
}

class EncyclopediaPart_RelationshipType {
    static Part = "part"
    static Article = "article"
}

class EncyclopediaPart_Visibility {
    static Visible = "visible"
    static Invisible = "invisible"
    static Development = "development"
}

class EncyclopediaPart_FragmentType {
    static LinearListFragment = "LinearListFragment"
    static LinearListWithIconFragment = "LinearListWithIconFragment"
    static GridListFragment = "GridListFragment"
}

module.exports = {
    UserRole,
    EncyclopediaPart_RelationshipType, EncyclopediaPart_Visibility, EncyclopediaPart_FragmentType
}