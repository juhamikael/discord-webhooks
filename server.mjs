import express from "express";
import { Resend } from "resend";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const TOKEN = process.env.RESEND_TOKEN;

const getTodayDate = () => {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-GB");
  return `${date} - ${time}`;
};

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    "You have exceeded the request limit. Try again in an hour or contact me directly at Discord",
});

const app = express();
app.use(
  cors({
    origin: [
      "https://dev.juhamikael.info",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "https://music.juhamikael.info",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/send-message", apiLimiter);

const resend = new Resend(TOKEN);
app.post("/api/send-message/dev", async (req, res) => {
  const { data } = req.body;
  const formattedMessage = data.message.replace(/\n/g, "<br />");
  try {
    const email = await resend.emails.send({
      from: "juhamikael.info@mail.juhamikael.info",
      to: "dev.juhamikael@gmail.com",
      subject: `${data.subject} / @${data.name} / ${data.email}`,
      html: `
      <h1>Message from https://dev.juhamikael.info</h1>
      <h2>${getTodayDate()}</h2>
      <hr />
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${formattedMessage}</p>
      `,
    });
    res.status(200).json({ email });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/api/send-message/music", async (req, res) => {
  const { data } = req.body;
  const formattedMessage = data.message.replace(/\n/g, "<br />");
  try {
    let optionalData = {};
    if (data.collabRequestUrl) {
      optionalData = {
        collab: true,
        collabLink: data.collabRequestUrl,
      };
    } else {
      optionalData = {
        collab: false,
      };
    }
    const email = await resend.emails.send({
      from: "juhamikael.info@mail.juhamikael.info",
      to: "music.juhamikael@gmail.com",
      subject: `${data.subject} Collab ${optionalData.collab}/ @${data.name} / ${data.email}`,
      html: `
        <h1>Message from https://music.juhamikael.info</h1>
        <h2>${getTodayDate()}</h2>
        <hr />
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${
          optionalData && optionalData.collab
            ? `
            <p><strong>Collab request</strong> </p>
            <p><strong>Collab:</strong> ${optionalData.collabLink}</p>
            `
            : ""
        }
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formattedMessage}</p>
      `,
    });
    res.status(200).json({ email });
  } catch (error) {
    res.status(500).json({ error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
