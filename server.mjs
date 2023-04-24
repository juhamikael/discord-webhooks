import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();




const getTodayDate = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-GB");
    const time = now.toLocaleTimeString("en-GB");
    return `${date} - ${time}`;
  };
  


const app = express();
app.use(cors({ origin: "https://dev.juhamikael.info" }));
app.use(bodyParser.json());

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

app.post("/api/send-message", async (req, res) => {
  const { data } = req.body;
  console.log(data)
  const body = {
    content: `--------------------------
      **Name:** ${data.name}
      **Email:** ${data.email}
      **Subject:** ${data.subject}

      **Message:**
      --------------------------
      ${data.message}
      `,
    embeds: [
      {
        title: "New Message from https://dev.juhamikael.info",
        description: getTodayDate(),

        fields: [
          {
            name: "Name",
            value: data.name,
          },
          {
            name: "Email",
            value: data.email,
          },
          {
            name: "Subject",
            value: data.subject,
          },
        ],
      },
    ],
    attachments: [],
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    res.status(200).json({ message: "Message sent!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while sending the message" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
