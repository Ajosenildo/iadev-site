// Arquivo: /api/send-email.js

import { Resend } from 'resend';

// A chave de API é lida de uma variável de ambiente segura
const resend = new Resend(process.env.RESEND_API_KEY);

// A função exportada como 'default' é o que a Vercel executa
export default async function handler(req, res) {
  // Apenas permite requisições do tipo POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // Pega os dados enviados pelo formulário do seu site
    const { name, email, message } = req.body;

    // Monta e envia o e-mail usando o Resend
    const { data, error } = await resend.emails.send({
      from: 'Site iadev.app <onboarding@resend.dev>', // Endereço de envio padrão do Resend
      to: ['ajosenildosilva80@yahoo.com'], // Seu e-mail de destino
      subject: `Nova mensagem do site de ${name}`,
      reply_to: email, // Faz o botão "Responder" do seu e-mail funcionar corretamente
      html: `
        <p>Você recebeu uma nova mensagem do seu site:</p>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
    });

    // Se houver um erro do Resend, retorna uma falha
    if (error) {
      console.error({ error });
      return res.status(500).json({ success: false, message: 'Falha ao enviar o e-mail.' });
    }

    // Retorna uma resposta de sucesso para o seu site
    return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });

  } catch (error) {
    // Em caso de erro inesperado no código, retorna uma falha
    console.error(error);
    return res.status(500).json({ success: false, message: 'Ocorreu um erro no servidor.' });
  }
}