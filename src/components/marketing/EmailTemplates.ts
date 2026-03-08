// Professional email templates for Rocha Marketing
export const emailTemplates = [
    {
        id: 'promocional',
        name: '🔥 Promocional',
        description: 'Ideal para promoções e ofertas especiais',
        preview: 'Destaque suas ofertas com visual impactante',
        generate: (content: string, buttonText?: string, buttonUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <!-- Header -->
    <div style="background-color:#0a192f;padding:25px 30px;text-align:center;border-bottom:3px solid #c5a059;">
        <img src="https://iili.io/qKbr1Qj.png" alt="Pátio Rocha Leilões" style="max-width:220px;max-height:80px;display:inline-block;" />
    </div>
    <!-- Content -->
    <div style="padding:40px 30px;">
        <div style="font-size:16px;line-height:1.6;color:#333333;">
            ${(content || '').replace(/\n/g, '<br>')}
        </div>
        ${buttonText && buttonUrl ? `
        <div style="text-align:center;margin:30px 0;">
            <a href="${buttonUrl}" style="display:inline-block;background:linear-gradient(135deg,#009688,#00796B);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-weight:700;font-size:16px;">
                ${buttonText}
            </a>
        </div>` : ''}
    </div>
    <!-- Footer -->
    <div style="background-color:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#999;font-size:12px;margin:0;">Pátio Rocha Leilões • Feira de Santana, BA</p>
        <p style="color:#bbb;font-size:11px;margin:5px 0 0;">Você está recebendo este email porque se cadastrou em nossa lista. Para descadastrar, responda este email com o assunto "cancelar".</p>
    </div>
</div>
</body>
</html>`
    },
    {
        id: 'informativo',
        name: '📋 Informativo',
        description: 'Para comunicados e notícias importantes',
        preview: 'Layout clean para informações e novidades',
        generate: (content: string, buttonText?: string, buttonUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background-color:#0a192f;padding:25px 30px;text-align:center;border-bottom:3px solid #c5a059;">
        <img src="https://iili.io/qKbr1Qj.png" alt="Pátio Rocha Leilões" style="max-width:220px;max-height:80px;display:inline-block;" />
    </div>
    <!-- Content -->
    <div style="padding:35px 30px;">
        <div style="font-size:15px;line-height:1.7;color:#444444;">
            ${(content || '').replace(/\n/g, '<br>')}
        </div>
        ${buttonText && buttonUrl ? `
        <div style="text-align:center;margin:30px 0;">
            <a href="${buttonUrl}" style="display:inline-block;background-color:#0a192f;color:#c5a059;text-decoration:none;padding:12px 35px;border-radius:6px;font-weight:700;font-size:15px;border:2px solid #c5a059;">
                ${buttonText}
            </a>
        </div>` : ''}
    </div>
    <!-- Footer -->
    <div style="padding:20px 30px;text-align:center;border-top:1px solid #eef0f2;">
        <p style="color:#999;font-size:12px;margin:0;">Pátio Rocha Leilões • contato@patiorochaleiloes.com.br</p>
    </div>
</div>
</body>
</html>`
    },
    {
        id: 'leilao',
        name: '🔨 Leilão',
        description: 'Convite para leilões e eventos',
        preview: 'Template especial para divulgação de leilões',
        generate: (content: string, buttonText?: string, buttonUrl?: string, imageUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f0f0;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;">
    <!-- Header with Logo -->
    <div style="background-color:#0a192f;padding:25px 30px;text-align:center;border-bottom:3px solid #c5a059;">
        <img src="https://iili.io/qKbr1Qj.png" alt="Pátio Rocha Leilões" style="max-width:220px;max-height:80px;display:inline-block;" />
    </div>
    ${imageUrl ? `
    <!-- Product Image -->
    <div style="background-color:#ffffff;padding:0;">
        <img src="${imageUrl}" alt="Produto em Leilão" style="width:100%;max-height:350px;object-fit:cover;display:block;" />
    </div>` : ''}
    <!-- Content -->
    <div style="background-color:#ffffff;padding:35px 30px;">
        <div style="font-size:16px;line-height:1.7;color:#333333;">
            ${(content || '').replace(/\n/g, '<br>')}
        </div>
        ${buttonText && buttonUrl ? `
        <div style="text-align:center;margin:35px 0 20px;">
            <a href="${buttonUrl}" style="display:inline-block;background:linear-gradient(135deg,#c5a059,#e6c27a);color:#0a192f;text-decoration:none;padding:16px 50px;border-radius:10px;font-weight:800;font-size:18px;text-transform:uppercase;letter-spacing:1px;">
                ${buttonText}
            </a>
        </div>` : ''}
    </div>
    <!-- Footer -->
    <div style="background-color:#0a192f;padding:20px 30px;text-align:center;">
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 12px;">
            <tr>
                <td style="padding-right:8px;">
                    <a href="https://www.instagram.com/patiorochaleiloes" style="display:inline-block;background:linear-gradient(135deg,#E1306C,#F77737);color:#ffffff;text-decoration:none;padding:8px 16px;border-radius:6px;font-weight:600;font-size:11px;">
                        📸 Instagram
                    </a>
                </td>
                <td>
                    <a href="https://wa.me/5575992635858" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:8px 16px;border-radius:6px;font-weight:600;font-size:11px;">
                        💬 WhatsApp
                    </a>
                </td>
            </tr>
        </table>
        <p style="color:#c5a059;font-size:12px;margin:0;font-weight:600;">Pátio Rocha Leilões</p>
        <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:4px 0 0;">Feira de Santana, BA • (75) 99263-5858</p>
    </div>
</div>
</body>
</html>`
    },
    {
        id: 'minimalista',
        name: '✨ Minimalista',
        description: 'Layout simples e direto ao ponto',
        preview: 'Clean e focado no conteúdo',
        generate: (content: string, buttonText?: string, buttonUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <!-- Logo -->
    <div style="margin-bottom:30px;text-align:left;">
        <img src="https://iili.io/qKbr1Qj.png" alt="Pátio Rocha Leilões" style="max-width:180px;max-height:60px;display:inline-block;" />
    </div>
    <!-- Content Header -->
    <div style="border-left:4px solid #009688;padding-left:20px;margin-bottom:30px;">
        <h2 style="color:#0a192f;margin:0 0 5px;font-size:18px;font-weight:700;">Comunicado Oficial</h2>
        <p style="color:#999;margin:0;font-size:12px;">Pátio Rocha Leilões</p>
    </div>
    <div style="font-size:15px;line-height:1.8;color:#555555;padding:0 0 0 24px;">
        ${(content || '').replace(/\n/g, '<br>')}
    </div>
    ${buttonText && buttonUrl ? `
    <div style="padding-left:24px;margin:25px 0;">
        <a href="${buttonUrl}" style="display:inline-block;background-color:#009688;color:#ffffff;text-decoration:none;padding:10px 28px;border-radius:5px;font-weight:600;font-size:14px;">
            ${buttonText} →
        </a>
    </div>` : ''}
    <div style="border-top:1px solid #eee;margin-top:30px;padding-top:15px;padding-left:24px;">
        <p style="color:#ccc;font-size:11px;margin:0;">contato@patiorochaleiloes.com.br</p>
    </div>
</div>
</body>
</html>`
    }
];
