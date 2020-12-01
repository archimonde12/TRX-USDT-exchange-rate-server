const url =
  "https://api.coingecko.com/api/v3/coins/tron/tickers?exchange_ids=binance&page=1";
const fetch = require("node-fetch");

async function saveTRXPrice(redisClient) {
  let now = new Date().toISOString();
  const response = await fetch(url);
  const responseBody = await response.json();
  const target_currency = "USDT";
  responseBody.tickers.forEach((value) => {
    if (value.target === target_currency) {
      const key = {
        name: "appname.trx.usdt",
        price: "price",
        update_at: "update_at",
        create_at: "create_at",
      };
      redisClient.hmset(
        key.name,
        key.price,
        value.last,
        key.update_at,
        value.last_traded_at,
        key.create_at,
        now
      );
      redisClient.hgetall(key.name, (err, value) => {
        console.log(`Last value ${key.name} saved:`);
        console.log(value);
      });
    }
  });
}

module.exports = saveTRXPrice;
