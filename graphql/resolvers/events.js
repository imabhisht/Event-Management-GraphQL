const Event = require("../../models/events");
const User = require("../../models/user");
const { transformEvent } = require("./merge");
const { dateToString } = require("../../helpers/date");
module.exports = {
  // <------------------------- Event Query ------------------------------->
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  // <------------------------- Event Create ------------------------------->

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: -args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);

      //Finding User with ID
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not found."); //Error if not user not in Database
      }

      //If found, push the EventID in created Event List in UserDatabase
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  },

  // <------------------------- Create User ------------------------------->

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
};
