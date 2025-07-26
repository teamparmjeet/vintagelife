import mongoose, { Schema } from "mongoose";


const CounterSchema = new Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const CounterModel = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);


const UserSchema = new Schema(
  {
    dscode: { type: String, unique: true },
    pdscode: { type: String, required: true, default: "0" },
    level: { type: String },
    saosp: { type: String },
    sgosp: { type: String },
    earnsp: { type: String, required: true, default: "0" },
    group: { type: String, enum: ["SAO", "SGO"] },
    name: { type: String, required: true },
    image: { type: String },
    relationTitle: { type: String, enum: ["S/o", "D/o", "W/o"] },
    fatherOrHusbandName: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date },
    profession: { type: String, enum: ["SALARIED", "SELF-EMPLOYED", "STUDENT", "RETIRED", "OTHER"] },
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"] },
    mobileNo: { type: String, required: true },
    whatsappNo: { type: String },
    email: { type: String, required: true },
    bankName: { type: String },
    acnumber: { type: String },
    ifscCode: { type: String },
    bankimage: { type: String },
    panno: { type: String },
    panimage: { type: String },
    aadharno: { type: String },
    aadharimage: { type: String },
    aadharfullname: { type: String },
    addressproof: { type: String },
    addressproofno: { type: String },
    addressproofimage: { type: String },
    nomineeName: { type: String },
    nomineeRelation: { type: String },
    nomineeDOB: { type: Date },
    address: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      landmark: { type: String },
      pinCode: { type: String },
      state: { type: String },
    },
    kycVerification: {
      isVerified: { type: Boolean, default: false },
      proofType: { type: String, enum: ["Aadhar Card", "PAN Card", "Passport", "Voter ID", "Driving License"] },
      documentNo: { type: String },
    },
    LevelDetails: [
      {
        levelName: { type: String, },
        sao: { type: String, },
        sgo: { type: String, }
      }
    ],
    WalletDetails: [
      {
        salecommission: { type: String, },
        salesgrowth: { type: String, },
        performance: { type: String, },
        date: { type: String }
      }
    ],
    wallet: { type: String, default: "0" },
    lastMatchedSP: { type: String, default: "0" },
    branchName: { type: String },
    nomineebankName: { type: String },
    nomineeacnumber: { type: String },
    nomineeifscCode: { type: String },
    nomineeipanno: { type: String },
    nomineeiaadharno: { type: String },
    password: { type: String, required: true },
    plainpassword:{type: String, required: true },
    status: { type: String, enum: ["0", "1", "2"], default: "0", required: true },
    activesp: { type: String },
    activedate: { type: Date },
    usertype: { type: String, enum: ["0", "1", "2"], default: "0", required: true },
    defaultdata: { type: String, required: true, default: "user" },
  },
  { timestamps: true }
);


UserSchema.pre("save", async function (next) {
  const doc = this;
  if (!doc.isNew) return next();
  try {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "dscode" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    doc.dscode = counter.sequence_value.toString().padStart(6, "0");
    next();
  } catch (error) {
    next(error);
  }
});




const UserModel = mongoose.models.user5 || mongoose.model("user5", UserSchema);

export default UserModel;