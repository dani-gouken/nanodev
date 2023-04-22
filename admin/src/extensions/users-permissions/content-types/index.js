const user = require("./user");
const otp = require("./otp");
module.exports = {
    user: { schema: user },
    otp: { schema: otp }
};
