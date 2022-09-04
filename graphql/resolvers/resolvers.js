const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();
const User = require("../../models/User");
const Message = require("../../models/Message");
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    getMessages: async () => {
      const messages = await Message.find();

      if (!messages) {
        return {
          success: false,
          messages: [],
        };
      }

      return {
        success: true,
        messages,
      };
    },
  },

  Mutation: {
    postMessage: async (_, { input }, context) => {
      const {id, author, message} = input;
      const userMessage = await Message.create({ author: id, message: message });
      const postMessageResponse = await userMessage.populate('author');

      const sucessfulResponse = {
        ...postMessageResponse._doc,
        id: postMessageResponse._doc._id,
        success: true,
      }

      pubsub.publish("message_created", {
        messageCreated: sucessfulResponse
      });
      return sucessfulResponse
    },
    Register: async (_, { input }) => {
      const { username, password, passwordConfirm, avatar } = input;

      if (await User.findOne({username})) {
        return {
          success: false,
          message: "Username already taken !"
        }
      }

      const user = await User.create({
        username,
        password,
        passwordConfirm,
        avatar,
      });
      
      if (!user) {
        return { success: false };
      }

      return {
        user: user,
        success: true,
        message: "User Created"
      };
    },
    Login: async function (_, { input }) {
      const { username, password } = input;
      const user = await User.findOne({ username });

      if (user && await bcrypt.compare(password, user.password)) {
        return {
          user,
          success: true,
        };
      }
      return {
        success: false,
      };
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => {
        return pubsub.asyncIterator("message_created");
      },
    },
  },
};

module.exports = resolvers;