const { transformBooking, transformEvent } = require("./merge");
const Booking = require("../../models/booking");
const Event = require("../../models/events");

module.exports = {
  bookings: async (args) => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args) => {
    try {
      const fetchedevent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: "60bca490b9bcca17a403cc54",
        event: fetchedevent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },

  cancelBooking: async (args) => {
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
