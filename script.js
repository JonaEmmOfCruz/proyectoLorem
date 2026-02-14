
const loremParagraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
    "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
    "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio."
];

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lorem-form');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resultContainer = document.getElementById('result-container');
    const errorDiv = document.getElementById('error-message');
    const errorSpan = errorDiv ? errorDiv.querySelector('span') : null;
    const paragraphsInput = document.getElementById('paragraphs');

    if (!form || !generateBtn || !copyBtn || !resultContainer || !errorDiv || !paragraphsInput) {
        console.error('Error: No se encontraron todos los elementos del DOM');
        return;
    }

    function generateLoremText(count, format) {
        if (!count || count === '') {
            throw new Error('Por favor, ingresa un número de párrafos');
        }
        
        count = parseInt(count, 10);
        
        if (isNaN(count)) {
            throw new Error('Debes ingresar un número válido');
        }
        
        if (count < 1) {
            throw new Error('El mínimo de párrafos es 1');
        }
        
        if (count > 10) {
            throw new Error('El máximo de párrafos es 10');
        }

        let selectedParagraphs = [];
        
        const shuffled = [...loremParagraphs].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < count; i++) {
            if (i < shuffled.length) {
                selectedParagraphs.push(shuffled[i]);
            } else {
                const randomIndex = Math.floor(Math.random() * loremParagraphs.length);
                selectedParagraphs.push(loremParagraphs[randomIndex]);
            }
        }

        if (format === 'single') {
            return `<p class="single-line">${selectedParagraphs.join(' ')}</p>`;
        } else {
            return selectedParagraphs.map(p => `<p class="generated-paragraph">${p}</p>`).join('');
        }
    }

    function displayResult(content) {
        resultContainer.innerHTML = content;
        
        resultContainer.style.transition = 'opacity 0.3s';
        resultContainer.style.opacity = '0.7';
        setTimeout(() => {
            resultContainer.style.opacity = '1';
        }, 100);
    }

    function showError(message) {
        if (errorSpan) {
            errorSpan.textContent = message;
        } else {
            errorDiv.textContent = message;
        }
        
        errorDiv.style.display = 'flex';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 4000);
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Feedback visual en el botón
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i><span>¡Copiado!</span>';
            copyBtn.style.background = 'rgba(40, 167, 69, 0.2)';
            copyBtn.style.borderColor = '#28a745';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.borderColor = '';
            }, 2000);
            
        } catch (err) {
            showError('No se pudo copiar el texto. Permisos denegados.');
            console.error('Error al copiar:', err);
        }
    }

    function validateInput(value) {
        if (value === '' || value === null || value === undefined) {
            return 5; 
        }
        
        let num = parseInt(value, 10);
        
        if (isNaN(num)) {
            return 5;
        }
        
        if (num < 1) {
            return 1;
        }
        
        if (num > 10) {
            return 10;
        }
        
        return num;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        errorDiv.style.display = 'none';
        
        let paragraphCount = paragraphsInput.value;
        const formatElement = document.querySelector('input[name="output-format"]:checked');
        
        if (!formatElement) {
            showError('Error: Selecciona un formato de salida');
            return;
        }
        
        const format = formatElement.value;
        
        paragraphCount = validateInput(paragraphCount);
        paragraphsInput.value = paragraphCount;
        
        try {
            const generatedContent = generateLoremText(paragraphCount, format);
            displayResult(generatedContent);
            
        } catch (error) {
            showError(error.message);
        }
    });

    copyBtn.addEventListener('click', function() {
        const resultHTML = resultContainer.innerHTML;
        
        if (resultHTML.includes('liquid-placeholder') || 
            resultHTML.includes('Generated text will appear here') || 
            resultHTML.trim() === '' ||
            resultHTML === '<div class="liquid-placeholder">\n                                <i class="fas fa-rainbow"></i>\n                                <p>Generated text will appear here...</p>\n                            </div>') {
            showError('No hay texto generado. Primero genera contenido.');
            return;
        }
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = resultHTML;
        const plainText = tempDiv.textContent || tempDiv.innerText;
        
        copyToClipboard(plainText);
    });

    paragraphsInput.addEventListener('input', function() {
        let value = this.value.trim();
        
        if (value === '') {
            return;
        }
        
        let num = parseInt(value, 10);
        
        if (!isNaN(num)) {
            if (num < 1) {
                this.value = 1;
            } else if (num > 10) {
                this.value = 10;
            }
        }
    });

    paragraphsInput.addEventListener('blur', function() {
        let value = this.value.trim();
        
        if (value === '') {
            this.value = 5;
        } else {
            let num = parseInt(value, 10);
            if (isNaN(num)) {
                this.value = 5;
            } else if (num < 1) {
                this.value = 1;
            } else if (num > 10) {
                this.value = 10;
            }
        }
    });

    function initializeDefaultText() {
        try {
            const defaultContent = generateLoremText(5, 'paragraphs');
            displayResult(defaultContent);
        } catch (error) {
            console.log('Esperando interacción del usuario...');
        }
    }

    console.log('Generador Lorem Modern listo y funcionando');
});

