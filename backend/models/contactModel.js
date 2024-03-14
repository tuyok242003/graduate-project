import mongoose from "mongoose"
const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true
    },
    phone: {
      type: String,
      require: true
    },
    content: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
)
const Contact = mongoose.model("Contact", contactSchema)

export default Contact
