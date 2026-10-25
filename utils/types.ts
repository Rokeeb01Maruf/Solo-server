export interface signup{
    email: string,
    password: string,
    username: string,
    profileUrl: string
}

export interface signin{
    email: string,
    password: string
}

export interface UserType{
    id : string,
    email : string,
    password : string,
    username : string,
    profileUrl : string,
    authProvider : string,
    role : string,
    createdAt : string,
    updatedAt : string
}

export interface blogPostType{
    title : string,
    content : string,
    coverImageUrl : string,
    slug : string    
}