const { Keystone } = require('@keystonejs/keystone');
const { Text, CalendarDay, Relationship, Password } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { StaticApp } = require('@keystonejs/app-static');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');

const PROJECT_NAME = "tweetz";

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  onConnect: async keystone => {
    await keystone.createItems({
      User: [
        { name: 'admin', email: 'admin@admin.com', password: 'admin@admin.com' },
      ],
    });
  },
});

keystone.createList('User', {
  schemaDoc: 'A list of the users',
  fields: {
    name: { type: Text, schemaDoc: 'This is the name of the user', isRequired: true },
    email: { type: Text, schemaDoc: 'This is the email id of the user', isRequired: true },
    password: { type: Password, schemaDoc: 'This is the password of the user', isRequired: true },
    tweets: {
      type: Relationship,
      ref: 'Tweet.author',
      many: true,
    },
  },
});

keystone.createList('Tweet', {
  schemaDoc: 'All tweets',
  fields: {
    content: { type: Text, schemaDoc: 'This is the content of the tweet', isRequired: true },
    dateCreated: { type: Text, schemaDoc: 'This is the time when post is created', isRequired: true },
    author: { type: Relationship, ref: 'User.tweets', isRequired: true },
  },
});

keystone.createList('Todo', {
  schemaDoc: 'A list of things which need to be done',
  fields: {
    name: { type: Text, schemaDoc: 'This is the thing you need to do' },
  },
});

//----------------------------- Auth ---------------------------//

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'email',
    secretField: 'password',
  },
});

// app.post('/admin/signin', async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   const result = await this.authStrategy.validate({
//     username,
//     password,
//   });

//   if (result.success) {
//     // Create session and redirect
//   }

//   // Return the failure
//   return res.json({ success: false, message: result.message });
// });


module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: '/', src: 'public' }),
    new AdminUIApp({ enableDefaultRoute: true, authStrategy }),
    // new AdminUIApp({ enableDefaultRoute: true }),
  ],
};
