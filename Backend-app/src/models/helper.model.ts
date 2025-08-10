import mongoose from "mongoose";


const helperSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profilePic: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    organization: { type: String, required: true },
    languages: { type: Array, required: true },
    households: { type: Number, default: 0 },
    employeeId_QR: { type: String, required: true },
    employeeID: { type: Number, required: true, unique: true },
    vehicleType: { type: String, required: true },
    vehicleNo: { type: String, default: '' },
    kycDocx: {
        type: {
            fileName: String,
            mimeType: String,
            base64File: String,
        },
        required: true
    },

    additionalDocx: {
        type: {
            fileName: String,
            mimeType: String,
            base64File: String,
        },
        default: null
    },
    dateJoined: { type: Date, required: true }
})

helperSchema.pre('save', function (next) {

    const lightBackgrounds = ['F0E68C', 'FFFACD', 'E0FFFF', 'F5F5DC', 'F0FFF0', 'FAFAD2'];
    const randomLightBg = lightBackgrounds[Math.floor(Math.random() * lightBackgrounds.length)];

    if (this.profilePic.trim() === '') {
        this.profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=${randomLightBg}&color=333&rounded=true&length=2`;

    }
    next();
});


const Helper = mongoose.model('Helper', helperSchema);

export default Helper;