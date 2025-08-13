document.addEventListener('DOMContentLoaded', function() {

    // --- SCROLL SUAVE PARA LINKS ÂNCORA ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- GERENCIAMENTO DO FORMULÁRIO COM RESEND VIA VERCEL FUNCTION ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const name = formData.get('name');

        const data = Object.fromEntries(formData.entries());

        formStatus.textContent = 'Enviando...';
        formStatus.style.color = '#333';

        try {
            // Envia os dados para a nossa função serverless na Vercel
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                formStatus.textContent = `Obrigado, ${name}! Sua mensagem foi enviada com sucesso.`;
                formStatus.style.color = 'green';
                form.reset();
            } else {
                formStatus.textContent = result.message || 'Ocorreu um erro ao enviar a mensagem.';
                formStatus.style.color = 'red';
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            formStatus.textContent = 'Ocorreu um erro de conexão. Tente novamente.';
            formStatus.style.color = 'red';
        }

        setTimeout(() => {
            formStatus.textContent = '';
        }, 8000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
    }
});