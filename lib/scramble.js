// Scramble animation implementation
class ScrambleText {
    constructor(element) {
        this.el = element || document.createElement('span');
        this.el.classList.add('scramble-component');
    }

    // Helper function to parse HTML and text content
    parseContent(content) {
        const htmlRegex = /<[^>]+>/;
        const entityRegex = /&[^;\s]+;/;
        const combinedRegex = new RegExp(`(${htmlRegex.source}|${entityRegex.source})`);
        const nbsp = '&nbsp;';

        // Split content into tokens
        const tokens = [];
        let remaining = content;
        while (remaining.length) {
            const match = remaining.match(new RegExp(`^${combinedRegex.source}`));
            const token = (match || remaining)[0];
            remaining = remaining.substr(token.length);
            tokens.push(token);
        }

        // Process tokens
        const processedTokens = tokens.map(token => 
            htmlRegex.test(token) ? token : token === ' ' ? nbsp : ''
        );

        // Create queue of text characters
        const queue = tokens.reduce((acc, token, index) => {
            if (!htmlRegex.test(token)) {
                acc.push({ index, char: token });
            }
            return acc;
        }, []);

        return {
            items: tokens,
            start: processedTokens,
            queue: queue,
            text: queue.map(item => item.char)
        };
    }

    // Helper to wrap text in span
    wrapText(text, className = 'temp') {
        return `<span class="${className}">${text}</span>`;
    }

    // Helper to get random item from array
    randomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Main scramble animation method
    scramble(content, options = {}) {
        const {
            onComplete = null,
            scrambleChars = '__-—/\\|<>',
            useInput = true,
            duration = 2,
            mutation = 0.15,
            showPower = 0.5,
            mashPower = 2,
            donePower = 15,
            cursor = '-',
            delay = 0,
            ease = (t) => t // Linear easing by default
        } = options;

        // Parse content
        const parsed = this.parseContent(content);
        const { start, queue } = parsed;

        // Create scramble characters array
        let scrambleCharsArray = useInput 
            ? (scrambleChars + queue.map(item => item.char.toLowerCase())
                .reduce((acc, char) => acc.indexOf(char) === -1 ? acc + char : acc, ''))
            : scrambleChars;
        
        scrambleCharsArray = scrambleCharsArray.split('').map(char => this.wrapText(char));
        const cursorSpan = this.wrapText(cursor);

        // Shuffle queue
        this.shuffleArray(queue);

        // Animation state
        this.progress = 0;
        this.stop();

        // Animation loop
        const animate = (timestamp) => {
            if (!this.startTime) this.startTime = timestamp;
            const elapsed = timestamp - this.startTime;
            this.progress = Math.min(1, (elapsed - delay) / (duration * 1000));

            // Calculate positions
            const showCount = Math.floor(Math.pow(this.progress, showPower) * queue.length);
            const mashCount = Math.floor(Math.pow(this.progress, mashPower) * queue.length);
            const doneCount = Math.floor(Math.pow(this.progress, donePower) * queue.length);

            // Update display
            const display = start.concat();
            for (let i = 0; i < showCount; i++) {
                const item = queue[i];
                let char;
                if (i <= doneCount) {
                    char = item.char;
                } else if (i <= mashCount) {
                    if (!item.temp || Math.random() < mutation) {
                        item.temp = this.randomFromArray(scrambleCharsArray);
                    }
                    char = item.temp;
                } else {
                    char = cursorSpan;
                }
                display[item.index] = char;
            }

            this.el.innerHTML = display.join('');

            if (this.progress < 1) {
                requestAnimationFrame(animate);
            } else if (onComplete) {
                onComplete();
            }
        };

        requestAnimationFrame(animate);
    }

    // Helper to shuffle array
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Stop animation
    stop() {
        this.startTime = null;
        this.progress = 0;
    }
}

// Export for use in other files
export default ScrambleText; 