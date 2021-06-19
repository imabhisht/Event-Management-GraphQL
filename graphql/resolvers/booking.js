const { transformBooking, transformEvent } = require("./merge");
const Booking = require("../../models/booking");
const Event = require("../../models/events");
const { dateToString } = require("../../helpers/date");
module.exports = {
  // <------------------------- Booking Query ---------------------------
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authorized");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  // <------------------------- Book Event ------------------------------->
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authorized");
    }
    try {
      const fetchedevent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedevent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },

  // <------------------------- Cancel Booking --------------------------->
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authorized");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
