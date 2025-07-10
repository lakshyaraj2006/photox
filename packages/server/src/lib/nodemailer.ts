import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const NODEMAILER_HOST = process.env.NODEMAILER_HOST!;
const NODEMAILER_PORT = process.env.NODEMAILER_PORT!;
const NODEMAILER_USERNAME = process.env.NODEMAILER_USERNAME!;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD!;

if (!NODEMAILER_HOST || !NODEMAILER_PORT || !NODEMAILER_USERNAME || !NODEMAILER_PASSWORD) 
    throw new Error("Nodemailer missing configuration(s)!")

const options: SMTPTransport.Options = {
    host: NODEMAILER_HOST,
    port: +NODEMAILER_PORT,
    auth: {
        user: NODEMAILER_USERNAME,
        pass: NODEMAILER_PASSWORD
    }
}

export const tranporter = createTransport(options);
