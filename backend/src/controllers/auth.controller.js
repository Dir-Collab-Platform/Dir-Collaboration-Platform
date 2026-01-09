import jwt from "jsonwebtoken";
import statusCodes from "http-status-codes";

export const githubAuthCallback = (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ status: "error", message: "Auth failed" });
    }
    
    const token = jwt.sign(
      {
        id: user._id,
        accessToken: req.authInfo.accessToken,
        githubUsername: user.githubUsername
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: "Auth failed" });
  }
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie("dir.sid");
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.clearCookie("dir.sid");
      res.status(200).json({ message: "Logged out successfully" });
    }
  });
};
