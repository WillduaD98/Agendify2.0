// import { Response } from 'express';


export class WhatsAppService {
    static async sendConfirmationMessage(phoneNumber: string, clientName: string, appointmentDate: string, userName: string | undefined) {
        try {
            const formattedDate = new Date(appointmentDate).toLocaleString('es-MX', {
                dateStyle: 'short',
                timeStyle: 'short',
            })

            const response = await fetch(`https://graph.facebook.com/${process.env.WHATSAPP_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
                method : 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product : "whatsapp",
                    recipient_type : "individual",
                    to : `${phoneNumber}`,
                    type: "template",
                    template: {
                        name: "confirmappointment",
                        language: {
                            code : "en_US"
                        },
                        components : [
                            {
                                type: "body",
                                parameters: [
                                    {
                                        type: "text",
                                        text: clientName
                                    },
                                    {
                                        type: 'text',
                                        text: `Doctor ${userName}`
                                    },
                                    {
                                        type: 'text',
                                        text: formattedDate
                                    }
                                ]
                            }
                        ]
                    }
                })
            });

            const data = await response.json()

            if(!response.ok){
                console.error(`Error sending confirmation Whatsapp`, data)
            } else {
                console.log(`Whatsapp enviado Exitosamente: `, data)
            }
        } catch (error) {
            console.error(`Several error sending Whatsapp `, error)
        }
        console.log(`Enviando mensaje de confirmación a: ${phoneNumber}`)
    
        return Promise.resolve();
    }
}