document.addEventListener('DOMContentLoaded', () => {
    const regexInput = document.getElementById('regex-input');
    const textInput = document.getElementById('text-input');
    const highlightedOutput = document.getElementById('highlighted-output');
    const matchesList = document.getElementById('matches-list');
    const matchCount = document.getElementById('match-count');
    const errorMessage = document.getElementById('error-message');
    const exampleSelect = document.getElementById('example-select');
    const btnGenerate = document.getElementById('btn-generate');

    const examples = {
        'ex1': { regex: '(c|d)*(cc)(c|d)*', text: 'dcc ccd cccddc dcd' },
        'ex2': { regex: '1*01*', text: '101 0 1110 0111 1001' },
        'ex3': { regex: '(b|c|d)*a(b|c|d)*a(b|c|d)*', text: 'abaca bada cab adad' },
        'ex4': { regex: 'a(a|b|c|d)*(b|c)', text: 'ab ac adb adc axc' },
        'ex5': { regex: '(a|b|c)+', text: 'a ab abc d cba' },
        'ex6': { regex: '[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}', text: 'contato@email.com, invalido@.com, meu.email@provedor.net, teste@dominio' },
        'ex7': { regex: '\\d{2}\\/\\d{2}\\/\\d{4}', text: 'Hoje é 25/12/2023. Outra data: 31/01/24 e 01-02-2025.' },
        'ex8': { regex: '\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}', text: '(11) 98765-4321, 21912345678, 41 3333-4444, 1234-5678' }
    };

    function generateTextFromRegex() {
        const regexStr = regexInput.value;
        if (!regexStr) return;
        
        try {
            // Check if RandExp is available
            if (typeof RandExp !== 'undefined') {
                const randexp = new RandExp(new RegExp(regexStr));
                randexp.max = 5; // limit repetition
                
                let generatedTexts = [];
                for (let i = 0; i < 5; i++) {
                    generatedTexts.push(randexp.gen());
                }
                
                textInput.value = generatedTexts.join(' ');
                testRegex();
            } else {
                errorMessage.textContent = 'Erro: A biblioteca de geração (RandExp) não carregou corretamente. Verifique sua conexão.';
            }
        } catch (e) {
            errorMessage.textContent = 'Erro ao gerar texto: ' + e.message;
        }
    }

    function testRegex() {
        const regexStr = regexInput.value;
        const text = textInput.value;

        // Limpar resultados anteriores
        highlightedOutput.innerHTML = text;
        matchesList.innerHTML = 'Nenhuma correspondência encontrada.';
        matchCount.textContent = '0';
        errorMessage.textContent = '';

        if (!regexStr || !text) {
            return;
        }

        try {
            // 'g' para encontrar todas as correspondências (global)
            const regex = new RegExp(regexStr, 'g');
            
            // 1. Encontrar todas as correspondências
            const matches = text.match(regex);

            if (matches) {
                // 2. Criar o texto com destaques
                const highlightedText = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
                highlightedOutput.innerHTML = highlightedText;

                // 3. Listar as correspondências
                matchCount.textContent = matches.length;
                const listHtml = '<ul>' + matches.map(m => `<li>${m}</li>`).join('') + '</ul>';
                matchesList.innerHTML = listHtml;
            }

        } catch (e) {
            errorMessage.textContent = 'Erro na expressão regular: ' + e.message;
        }
    }

    exampleSelect.addEventListener('change', () => {
        const selected = exampleSelect.value;
        if (selected && examples[selected]) {
            regexInput.value = examples[selected].regex;
            textInput.value = examples[selected].text;
            testRegex();
        }
    });

    // Generate new text when the generate button is clicked
    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateTextFromRegex);
    }
    
    // Automatically generate text if the user clears the text input and types a new regex
    let typingTimer;
    regexInput.addEventListener('input', () => {
        clearTimeout(typingTimer);
        testRegex(); // still test whatever is there
        
        // If text input is empty, maybe auto-generate after user stops typing
        if (textInput.value.trim() === '') {
            typingTimer = setTimeout(generateTextFromRegex, 800);
        }
    });

    textInput.addEventListener('input', testRegex);

    // Teste inicial
    exampleSelect.value = 'ex5';
    regexInput.value = examples.ex5.regex;
    textInput.value = examples.ex5.text;
    testRegex();
});
