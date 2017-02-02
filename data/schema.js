import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const schema = `
type Query {
  cars(make: String!, model: String!): [Car]
}

type Car {
  id: Int!
  make: String!
  model: String!
  desc: String!
  url: String!
  price: Int!
  good_condition_price: Int!
  percent_above_kbb: Int!
  thumbnail: String!
  year: Int!
  odometer: Int!
  location: String
}

`;

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});
