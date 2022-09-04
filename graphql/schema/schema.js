const { gql } = require('apollo-server-express')

const schema = gql`

type Query {
  getMessages:getMessageResponse!
}

type Mutation {
  postMessage(input: postMessageInput): postMessageResponse!
  Register(input: registerInput): registerResponse
  Login(input: loginInput): loginResponse
}

type Subscription {
  messageCreated: Message
}

type Message {
  id: ID
  author: User
  message: String
}


input postMessageInput {
  id: ID!
  author: String
  message: String
}

type postMessageResponse {
  id: ID
  author: User
  message: String
  success: Boolean!
}

type getMessageResponse {
  success: Boolean!
  messages: [Message!]!
}

type User {
  id: ID!
  username: String!
  avatar: String!
}

input registerInput {
  username: String!
  avatar: String!
  password: String!
  passwordConfirm: String!
}

input loginInput {
  username: String!
  password: String!
}

type registerResponse {
  user: User
  success: Boolean!
  message: String!
}

type loginResponse {
  user: User,
  success: Boolean!
}

`;

module.exports = schema;