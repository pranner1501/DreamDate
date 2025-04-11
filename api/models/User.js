import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		genderPreference: {
			type: String,
			required: true,
			enum: ["male", "female", "both"],
		},
		bio: { type: String, default: "" },
		image: { type: String, default: "" },
		interests: { type: [String], default: [] }, // Added interests field
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		matches: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	// Only hash the password if it has been modified
	if (!this.isModified("password")) {
		return next();
	}
	try {
		this.password = await bcrypt.hash(this.password, 10);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
