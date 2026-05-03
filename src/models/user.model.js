const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["admin", "manager", "worker"],
        default: "worker"
    },
    refreshToken: {
        type: String,
        default: null
    }
},
    { timestamps: true }
);

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return;
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

UserSchema.methods.genetateAccessToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
};

UserSchema.methods.genetateRefreshToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

module.exports = mongoose.model("User", UserSchema);