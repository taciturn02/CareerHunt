export const sendToken = (user, statusCode, res, message) => {
 
    const token = user.getJWTToken();
    // console.log("hii");
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    //console.log(user);
    return res.status(statusCode).cookie("token", token, options).status(200).json({
      success: true,
      user,
      message,
      token,
    });
  };