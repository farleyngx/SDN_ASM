const mongoose = require("mongoose");
const passportLocalMongoose =
  require("passport-local-mongoose").default ||
  require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
