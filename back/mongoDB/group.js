const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    name: String,
    profileImage: { type: String },
    members: [{_id: String, name: String, profileImage: { type: String } },],
    admin: {_id: String, name: String, profileImage: { type: String } },
},
{
    timestamps:true
})
const group = mongoose.model("Group", groupSchema)
module.exports = group