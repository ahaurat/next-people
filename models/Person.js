const mongoose = require('mongoose')
const { Schema } = mongoose

const personSchema = new Schema({
  name: String,
  email: String,
  birthday: Date,
  zipCode: {
    type: String, // Using String instead of Number since ZIPs such as 00501 exist
    validate: {
      validator: function(v) {
        return /^\d{5}$/.test(v) || v === '';
      },
      message: '{VALUE} is not a valid ZIP Code'
    }
  }
})

mongoose.model('Person', personSchema)