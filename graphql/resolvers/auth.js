const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  // <------------------------- CREATE USER --------------------------->

  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  // <------------------------- LOGIN ------------------------------->
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    const isEqual = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new Error("User does not Exist!");
    }

    if (!isEqual) {
      throw new Error("Password is Incorrect!");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "1h",
      }
    );

    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
