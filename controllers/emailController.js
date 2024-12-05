const sendEmail = require('../utils/mailer');  // Import the mailer utility

const htmlBody = (name, email, contactNo, message, referrerSource) => {
  let referrer = '';
  if (referrerSource) {
    referrer = `<p><span class="label">Referrer Source:</span></p>
            <p>${referrerSource}</p>`;
  }
  return `<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
      }

      .backgroundBg {
        background-color: #eeeeee;
        padding: 30px 20px;
      }

      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .header h1 {
        color: #333;
      }
      .content {
        margin-bottom: 20px;
      }
      .content p {
        font-size: 16px;
        color: #555;
      }

      .sub-hd-text{
        text-align: center;
      }

      .footer {
        text-align: center;
        font-size: 14px;
        color: #777;
        padding-top: 20px;
      }
      .footer p {
        margin: 0;
      }
      .details {
        margin-top: 20px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
      }
      .details p {
        margin: 5px 0;
      }
      .label {
        font-weight: bold;
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="backgroundBg">
      <div>
        <div class="container">
          <div class="header">
            <h1>New Customer Inquiry Received</h1>
          </div>

          <div class="content">
            <p class="sub-hd-text">
              A new contact form submission has been received. Details are as
              follows:
            </p>
          </div>

          <div class="details">
            <p><span class="label">Name:</span></p> <p>${name}</p> <br/>
            <p><span class="label">Email:</span></p> <p>${email}</p> <br/>
            <p><span class="label">Contact No:</span></p> <p>${contactNo}</p><br/>
            <p><span class="label">Message:</span></p>
            <p>${message}</p><br/>
            ${referrer}
          </div>

          <div class="footer">
            <p>Thank you for your attention.</p>
            <p>If you did not request this message, please disregard it.</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`
  return ` <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #333;
          }
          .content {
            margin-bottom: 20px;
          }
          .content p {
            font-size: 16px;
            color: #555;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding-top: 20px;
          }
          .footer p {
            margin: 0;
          }
          .details {
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
          }
          .details p {
            margin: 5px 0;
          }
          .label {
            font-weight: bold;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You Have a New Message</h1>
          </div>

          <div class="content">
            <p>You have received a new message from your contact form. Below are the details:</p>
          </div>

          <div class="details">
            <p><span class="label">Name:</span> ${name}</p>
            <p><span class="label">Email:</span> ${email}</p>
            <p><span class="label">Contact No:</span> ${contactNo}</p>
            <p><span class="label">Message:</span></p>
            <p>${message}</p>
          </div>

          <div class="footer">
            <p>Thank you for your attention.</p>
            <p>If you did not request this message, please disregard it.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

const handleContactForm = async (req, res) => {
  const { name, email, contactNo, message, referrer } = req.body;

  // Validate Name (non-empty and length validation)
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name is required and must be at least 2 characters long.' });
  }

  // Validate Email (check format)
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  // Validate Contact Number (check if it's 10 digits)
  if (!contactNo || !/^\d{10}$/.test(contactNo)) {
    return res.status(400).json({ error: 'A valid contact number (10 digits) is required.' });
  }

  // Validate Message (non-empty, length, and no HTML tags)
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: 'Message must not exceed 500 characters.' });
  }
  const htmlTagRegex = /<[^>]*>/g;
  if (htmlTagRegex.test(message)) {
    return res.status(400).json({ error: 'HTML tags are not allowed in the message.' });
  }

  const emailSubject = `New Message from ${name}`;


  const emailBody = htmlBody(name, email, contactNo, message, referrer);

  try {
    // Send email to the company's email address (replace with actual email)
    await sendEmail(process.env.EMAIL, emailSubject, emailBody);

    return res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'There was an error sending the message.' });
  }
};

module.exports = { handleContactForm };
