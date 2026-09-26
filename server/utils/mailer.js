import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer verification failed:", error.message);
  } else {
    console.log("✅ Nodemailer is connected and ready to send emails");
  }
});

export const sendInquiryAlert = async (contact) => {
  const mailOptions = {
    from: `"BrickWorks Alert" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER,
    subject: `🔔 New Contact Inquiry: ${contact.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #A63D2F; border-bottom: 2px solid #A63D2F; padding-bottom: 8px;">New Customer Inquiry</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Phone:</strong> ${contact.phone}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <div style="background: #F9F9F9; padding: 15px; border-left: 4px solid #A63D2F; margin: 15px 0;">
          <p style="margin: 0;">${contact.message}</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendQuoteAlert = async (quote) => {
  const mailOptions = {
    from: `"BrickWorks RFQ" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER,
    subject: `📦 New Quotation Request: ${quote.productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4A2C23; border-bottom: 2px solid #4A2C23; padding-bottom: 8px;">New Commercial RFQ</h2>
        <p><strong>Client:</strong> ${quote.fullName}</p>
        <p><strong>Contact:</strong> ${quote.phone} | ${quote.email}</p>
        <p><strong>Product:</strong> ${quote.productName}</p>
        <p><strong>Quantity:</strong> ${quote.quantity} Units</p>
        <p><strong>Delivery Location:</strong> ${quote.deliverySite}</p>
        <p><strong>Notes:</strong> ${quote.notes || "None"}</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendInquiryCustomerAck = async (contact) => {
  if (!contact.email) return;

  const mailOptions = {
    from: `"BrickWorks Commercial Desk" <${process.env.EMAIL_USER}>`,
    to: contact.email,
    subject: `Inquiry Received: ${contact.subject} [Ref #${contact._id.toString().slice(-6)}]`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #E0E0E0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #A63D2F; color: #FFFFFF; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 1.4rem; letter-spacing: 0.5px;">BRICKWORKS HEAVY INDUSTRIES</h2>
          <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.9;">Sales & Dispatch Technical Desk</p>
        </div>
        
        <div style="padding: 24px;">
          <p>Dear <strong>${contact.name}</strong>,</p>
          <p>Thank you for contacting BrickWorks. We have registered your inquiry regarding <strong>"${contact.subject}"</strong> under reference ID <strong>#${contact._id.toString().slice(-6)}</strong>.</p>
          
          <div style="background: #F9F7F5; border-left: 4px solid #A63D2F; padding: 14px; margin: 18px 0; border-radius: 4px;">
            <p style="margin: 0 0 6px 0; font-size: 0.85rem; color: #777;"><strong>Summary of your message:</strong></p>
            <p style="margin: 0; font-style: italic; color: #444;">"${contact.message}"</p>
          </div>

          <p>A regional dispatch coordinator is reviewing your request and will follow up with technical documentation or quotation details within one business day.</p>
          
          <p style="margin-top: 24px; font-size: 0.9rem; color: #555;">
            Best regards,<br/>
            <strong>Plant Operations & Dispatch Desk</strong><br/>
            BrickWorks Heavy Industries
          </p>
        </div>

        <div style="background: #F4F4F4; padding: 12px; text-align: center; font-size: 0.75rem; color: #777; border-top: 1px solid #E0E0E0;">
          This is an automated operational acknowledgement. Please do not reply directly to this email.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};


export const sendQuoteCustomerAck = async (quote) => {
  if (!quote.email) return;

  const mailOptions = {
    from: `"BrickWorks Sales & Quotations" <${process.env.EMAIL_USER}>`,
    to: quote.email,
    subject: `Quote Request Confirmed: ${quote.productName} [RFQ #${quote._id.toString().slice(-6)}]`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #E0E0E0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4A2C23; color: #FFFFFF; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 1.4rem; letter-spacing: 0.5px;">BRICKWORKS INDUSTRIAL DESK</h2>
          <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.9;">Commercial RFQ Confirmation</p>
        </div>
        
        <div style="padding: 24px;">
          <p>Dear <strong>${quote.fullName}</strong>,</p>
          <p>We have received your commercial request for quotation (RFQ) and assigned it tracking number <strong>#${quote._id.toString().slice(-6)}</strong>.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 0.9rem;">
            <tbody>
              <tr style="border-bottom: 1px solid #EEE;">
                <td style="padding: 8px 0; color: #666;">Product Requested:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #1E1E1E;">${quote.productName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #EEE;">
                <td style="padding: 8px 0; color: #666;">Requested Volume:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #A63D2F;">${quote.quantity} Units</td>
              </tr>
              <tr style="border-bottom: 1px solid #EEE;">
                <td style="padding: 8px 0; color: #666;">Delivery Site:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #1E1E1E;">${quote.deliverySite}</td>
              </tr>
            </tbody>
          </table>

          <p>Our sales team is calculating freight logistics and current kiln batch pricing for your specified volume. You will receive a formal proforma quote shortly.</p>
          
          <p style="margin-top: 24px; font-size: 0.9rem; color: #555;">
            Warm regards,<br/>
            <strong>Logistics & Commercial Estimations Desk</strong><br/>
            BrickWorks Heavy Industries
          </p>
        </div>

        <div style="background: #F4F4F4; padding: 12px; text-align: center; font-size: 0.75rem; color: #777; border-top: 1px solid #E0E0E0;">
          Commercial Estimate Desk • Plot 48–52, Industrial Corridor
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};