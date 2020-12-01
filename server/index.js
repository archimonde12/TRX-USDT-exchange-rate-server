const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const saveTRXPrice = require("./saveDataToDB/saveTRXprice");
const redis = require("redis");

const trxusdtAPI = require("./datasource/trx-usdt-API");
const PERIOD = 10;

const redisHost = "redis-15381.c245.us-east-1-3.ec2.cloud.redislabs.com";
const redisPort = process.argv[3] || 15381;
const redisAuth = `0xCDbcCuRusFwrpSVOKzQTV2bVgOax1J`;
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
});

redisClient.auth(redisAuth, function (err, response) {
  if (err) {
    console.log("auth:", err);
  }
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    TRX_USDT_API: new trxusdtAPI(redisClient),
  }),
});

server.listen().then(({ url }) => {
  console.log(`
          Server is running!
          Listening on ${url}
          Explore at https://studio.apollographql.com/dev
        `);
  saveTRXPrice(redisClient);
  setInterval(() => {
    saveTRXPrice(redisClient);
  }, PERIOD * 1000);
});
