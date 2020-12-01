const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    getTRXvsUSDT(checkTime: Int): checkResponse
  }

  type checkResponse {
    success: Boolean!
    message: String
    price: Float
    update_at: String
    create_at: String
  }
`;

module.exports = typeDefs;
