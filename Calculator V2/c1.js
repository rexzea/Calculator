class ScientificCalculator {
    constructor() {
        this.result = document.getElementById('result');
        this.history = document.getElementById('history');
        this.currentInput = '';
        this.angleMode = 'deg'; // Default mode: derajat
        this.memory = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tombol angka dan operator
        document.querySelectorAll('.number, .operator, .decimal').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleInput(e.target.dataset.btn);
                this.addButtonEffect(e.target);
            });
        });

            // Tombol backspace
    document.querySelector('.backspace').addEventListener('click', (e) => {
        this.backspace();
        this.addButtonEffect(e.target);
    });

        // Tombol fungsi ilmiah
        document.querySelectorAll('.fn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleScientificFunction(e.target.dataset.fn);
                this.addButtonEffect(e.target);
            });
        });

        // Tombol clear dan equals
        document.querySelector('.clear').addEventListener('click', () => this.clear());
        document.querySelector('.equals').addEventListener('click', () => this.calculate());


        // Keyboard input
        document.addEventListener('keydown', (event) => this.handleKeyboardInput(event));
    }


    addButtonEffect(button) {
        button.classList.add('active-button');
        setTimeout(() => {
            button.classList.remove('active-button');
        }, 300);
    }

    handleInput(value) {
        // Batasi panjang input
        if (this.currentInput.length > 50) return;

        if (value === '.') {
            if (!this.currentInput.includes('.')) {
                this.currentInput += value;
            }
        } else {
            this.currentInput += value;
        }
        this.result.value = this.currentInput;
    }

    backspace() {
        // Hapus karakter terakhir dari currentInput dan hasil
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.result.value = this.currentInput; // Perbarui tampilan hasil
        }
    }


    handleKeyboardInput(event) {
        const key = event.key;
        const validKeys = '0123456789.+-*/()';
        
        if (validKeys.includes(key)) {
            event.preventDefault();
            this.handleInput(key);
        } else if (key === 'Enter') {
            this.calculate();
        } else if (key === 'Backspace') {
            this.currentInput = this.currentInput.slice(0, -1);
            this.result.value = this.currentInput;
        }
    }

    handleScientificFunction(fn) {
        try {
            let value = parseFloat(this.currentInput);
            let result;

            switch(fn) {
                case 'sin':
                    result = this.angleMode === 'deg' 
                        ? Math.sin(value * Math.PI / 180).toFixed(6)
                        : Math.sin(value).toFixed(6);
                    break;
                case 'cos':
                    result = this.angleMode === 'deg' 
                        ? Math.cos(value * Math.PI / 180).toFixed(6)
                        : Math.cos(value).toFixed(6);
                    break;
                case 'tan':
                    result = this.angleMode === 'deg' 
                        ? Math.tan(value * Math.PI / 180).toFixed(6)
                        : Math.tan(value).toFixed(6);
                    break;
                case 'log':
                    result = Math.log10(value).toFixed(6);
                    break;
                case 'ln':
                    result = Math.log(value).toFixed(6);
                    break;
                case 'sqrt':
                    result = Math.sqrt(value).toFixed(6);
                    break;
                case 'pow2':
                    result = Math.pow(value, 2).toFixed(6);
                    break;
                case 'pow3':
                    result = Math.pow(value, 3).toFixed(6);
                    break;
                case 'factorial':
                    result = this.calculateFactorial(value).toFixed(6);
                    break;
            }

            this.currentInput = result.toString();
            this.result.value = this.currentInput;
            this.updateHistory(`${fn}(${value}) = ${result}`);
        } catch (error) {
            this.result.value = 'Error';
            this.updateHistory(`Error in ${fn} calculation`);
        }
    }

    calculateFactorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        return n * this.calculateFactorial(n - 1);
    }

    calculate() {
        try {
            const calculatedResult = eval(this.currentInput);
            const formattedResult = Number(calculatedResult.toFixed(6)).toString();
            
            this.updateHistory(`${this.currentInput} = ${formattedResult}`);
            this.currentInput = formattedResult;
            this.result.value = this.currentInput;
        } catch (error) {
            this.result.value = 'Error';
            this.updateHistory('Calculation Error');
        }
    }

    clear() {
        this.currentInput = '';
        this.result.value = '';
    }

    updateHistory(calculation) {
        // Batasi riwayat hingga 10 entri terakhir
        const historyEntries = this.history.children;
        if (historyEntries.length >= 10) {
            this.history.removeChild(historyEntries[0]);
        }

        const entry = document.createElement('div');
        entry.textContent = calculation;
        entry.style.opacity = '0';
        this.history.appendChild(entry);

        // Animasi fade-in
        requestAnimationFrame(() => {
            entry.style.transition = 'opacity 0.5s';
            entry.style.opacity = '1';
        });
    }
}

function backspace() {
    const resultField = document.getElementById('result');
    resultField.value = resultField.value.slice(0, -1);
}


// Konfigurasi tambahan untuk memastikan font dimuat
document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Inisialisasi kalkulator setelah font dimuat
    const calculator = new ScientificCalculator();
});
