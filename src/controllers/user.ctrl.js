const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

exports.CreateUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { fullname, email, password, role } = req.body;

    const CheckEmail = await User.findOne({ email });
    if (CheckEmail) {
        throw new ApiError(400, "Email already exists");
    }

    const AddUser = await User.create({ fullname, email, password, role });

    res.json(new ApiResponse(201, "User created successfully", { fullname: AddUser.fullname, email: AddUser.email, role: AddUser.role }));
});

exports.LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = user.genetateAccessToken();
    const refreshToken = user.genetateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json(new ApiResponse(200, "Login successful", { accessToken, user: { fullname: user.fullname, email: user.email, role: user.role } }));
});

exports.logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    res.clearCookie("refreshToken");
    res.json(new ApiResponse(200, "Logout successful"));
});

exports.AllUsers = async (req, res) => {

    const allusers = await User.find().select("fullname email role").lean()

    res.json({ success: true, allusers })
}



