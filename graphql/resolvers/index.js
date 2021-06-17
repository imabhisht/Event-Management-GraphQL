const bcrypt = require('bcryptjs');
const Event = require('../../models/events');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id, 
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event.creator)
  };
};

const events = async eventIds => {
  try{
    const events = await Event.find({_id: {$in: eventIds}})
      return events.map(event => {
            return transformEvent(event);
        });
  }catch(err) {
        throw err;
    };
};

const singleEvent = async eventId => {
  try{
    const event = await Event.findById(eventId);
    return transformEvent(event);
  }catch(err){
    throw err;
  }
}

const user = async userId => {
  try{
      const user = await User.findById(userId)
      return {
          ...user._doc, 
          _id: user.id,
          createdEvents: events.bind(this, user._doc.createdEvents)
      };
  }catch(err){
      throw err;
  }
}

module.exports = {
    events: async () => {
      try{
        const events = await Event.find().populate('creator')
        return events.map(event => {
            return transformEvent(event);
          })
      }catch(err){
        throw err;
      }        
    }, 

    createEvent: async args => {
        const {title,description,price,date} = args.eventInput;
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: -args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '60bca490b9bcca17a403cc54'
        });
        let createdEvent;
        try {
          const result = await event.save();
          createdEvent = transformEvent(result);


          //Finding User with ID
          const creator = await User.findById('60bca490b9bcca17a403cc54');       
          if (!creator) {
            throw new Error('User not found.');  //Error if not user not in Database
          }

          //If found, push the EventID in created Event List in UserDatabase
          creator.createdEvents.push(event);   
          await creator.save();
    
          return createdEvent;
        } catch (err) {
          console.log(err);
          throw err;
        }
      },

    createUser: async args => {
        try {
          const existingUser = await User.findOne({ email: args.userInput.email });
          if (existingUser) {
            throw new Error('User exists already.');
          }
          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
    
          const result = await user.save();
    
          return { ...result._doc, password: null, _id: result.id };
        } catch (err) {
          throw err;
        }
      },

      bookings: async args => {
        try{
          const bookings = await Booking.find();
          return bookings.map(booking => {
            return{
              ...booking._doc,
              _id: booking.id,
              user: user.bind(this, booking._doc.user),
              event: singleEvent.bind(this, booking._doc.event),
              createdAt: new Date(booking._doc.createdAt),
              updatedAt: new Date(booking._doc.updatedAt),
            }
          })
        }catch(err){
          throw err;
        }
      },
      bookEvent: async args => {
          try{
            const fetchedevent = await Event.findOne({_id: args.eventId})
            const booking = new Booking({
              user: '60bca490b9bcca17a403cc54',
              event: fetchedevent
            });
            const result = await booking.save();
            return {
              ...result._doc, 
              _id: result.id,
              user: user.bind(this, booking._doc.user),
              event: singleEvent.bind(this, booking._doc.event),
              createdAt: new Date(result._doc.createdAt),
              updatedAt: new Date(result._doc.updatedAt)
            }
          }catch(err){
              throw err;
          }
      },
      cancelBooking: async args => {
        try{
          const booking = await Booking.findById(args.bookingId).populate('event');
          const event = transformEvent(booking.event);
          await Booking.deleteOne({_id:args.bookingId}); 
          return event;
        }catch(err){
          throw err;
        }
      }
    }