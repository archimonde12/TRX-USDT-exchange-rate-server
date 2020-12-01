module.exports = {
  Query: {
    getTRXvsUSDT: (_, { checkTime = 10 }, { dataSources }) => {
      return dataSources.TRX_USDT_API.getTRXUSDTRates(checkTime);
    },
  },
};
