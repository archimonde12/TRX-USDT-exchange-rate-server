class TRXUSDTAPI {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  checkTime(time1, checkTime) {
    const now = new Date().getTime();
    return now - time1 < checkTime * 1000 * 60;
  }

  async getTRXUSDTRates(checkTime) {
    try {
      const hgetallPromise = (key) => {
        return new Promise((resolve, reject) => {
          this.redisClient.hgetall(key, (err, value) => {
            if (err) return reject(err);
            resolve(value);
          });
        });
      };

      const key = "appname.trx.usdt";
      let redisRes = await hgetallPromise(key);
      let updateAtTime = new Date(redisRes.update_at).getTime();
      //Check Time
      let isCheckTimePass = this.checkTime(updateAtTime, checkTime);
      if (isCheckTimePass) {
        return {
          success: isCheckTimePass,
          message: "Found lastest Data!",
          price: redisRes.price,
          update_at: redisRes.update_at,
          create_at: redisRes.create_at,
        };
      }
      return {
        success: isCheckTimePass,
        message: "Data were expired! Waitting for new data",
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
}

module.exports = TRXUSDTAPI;
