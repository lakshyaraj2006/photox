import {tranporter} from "../lib/nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await tranporter.sendMail({
            from: "'PhotoX' <noreply@photox.com>",
            to,
            subject,
            html
        });

        return info.messageId;
    } catch (error) {
        return null;
    }
}