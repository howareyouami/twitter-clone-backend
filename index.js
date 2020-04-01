const { Keystone } = require('@keystonejs/keystone');
const { Text, CalendarDay, Relationship, Password } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { StaticApp } = require('@keystonejs/app-static');

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');

const PROJECT_NAME = "tweetz";


const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  onConnect: async keystone => {
    await keystone.createItems({
      User: [
        { name: 'Tweetz team', email: 'team@tweetz.com', password: 'dolphins' },
      ],
      Tweet: [
        {
          content: 'Hello, Welcome to tweetz',
          author: { where: { name: 'Tweetz team' } },
          dateCreated: Date.now()
        },
      ],
    });
  },
});

keystone.createList('User', {
  schemaDoc: 'A list of the users',
  fields: {
    name: { type: Text, schemaDoc: 'This is the name of the user' },
    email: { type: Text, schemaDoc: 'This is the email id of the user' },
    password: { type: Password, schemaDoc: 'This is the password of the user' },
  },
});

keystone.createList('Tweet', {
  schemaDoc: 'All tweets',
  fields: {
    content: { type: Text, schemaDoc: 'This is the content of the tweet' },
    dateCreated: { type: Text, schemaDoc: 'This is the time when post is created' },
    author: { type: Relationship, ref: 'User' },
  },
});

keystone.createList('Todo', {
  schemaDoc: 'A list of things which need to be done',
  fields: {
    name: { type: Text, schemaDoc: 'This is the thing you need to do' },
  },
});
module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: '/', src: 'public' }),
    new AdminUIApp({ enableDefaultRoute: true }),
  ],
};
