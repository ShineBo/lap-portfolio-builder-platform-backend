const UserService = require('../services/UserService');

exports.validateUser = async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            email: req.body.email
        };

        const result = await UserService.validateUser(data);

        if (result.success) {
            const data = {
                username: result.user.usr_name,
                email: result.user.email
            }
            res.status(200).json({ success: true, data: data, message: "OTP sent successfully" });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.validateOtpCodeController = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        const result = await UserService.validateOtpCodeService(email, otp);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, roleId, contactInfo, skills } = req.body;

        // Validate input data
        if (!username || !email || !password || !roleId || !contactInfo || !skills) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Log data to verify what is being sent
        console.log("Received registration data:", req.body);

        // Call service to register user
        const result = await UserService.registerUser({
            username,
            email,
            password,
            roleId,
            contactInfo,
            skills
        });

        if (result.success) {
            return res.status(201).json({ success: true, message: "User registered successfully", user: result.user });
        } else {
            console.error("Registration failed:", result.message); // Log any failures
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};