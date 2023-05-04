/**Skip for now */
// app.post("/api/verify-recaptcha", async (req, res) => {
//   const { token } = req.body;
//   const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET;
//   console.log(secretKey);
//   const recaptchaURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
//   const response = await fetch(recaptchaURL, { method: "POST" });
//   const responseData = await response.json();

//   if (responseData.success) {
//     // The user's response was successfully verified
//     res.status(200).json({ success: true });
//   } else {
//     // The user's response could not be verified
//     res
//       .status(400)
//       .json({ success: false, error: "Invalid reCAPTCHA response" });
//   }
// });