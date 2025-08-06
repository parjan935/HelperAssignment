import mongoose from "mongoose";

const helperSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId_QR:{type:String,required:true},
  employeeID:{type:Number,required:true,unique:true},
  profilePic: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  organization: { type: String, required: true },
  vehicleType: { type: String, required: true },
  languages: { type: Array, required: true },
  kycDocx: { type: String, required: true },
  dateJoined: { type: Date, default: '' }
})

helperSchema.pre('save', function (next) {
  if (this.profilePic.trim() === '') {
    this.profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random&color=fff&rounded=true&length=2`;
  }
  next();
});



const Helper = mongoose.model('Helper', helperSchema);

export default Helper;