export class XPChart {
    constructor(selector) {
        this.container = document.querySelector(selector);
        this.width = 500;
        this.height = 400;
        this.padding = 60;
        this.data = [];
        this.tooltip = document.getElementById('tooltip');

        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.container.appendChild(this.svg);

        this.init();
    }

    init() {
        this.drawBackground();
        // this.setupEventListeners();
    }

    drawBackground() {
        this.svg.innerHTML = '';
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.width);
        rect.setAttribute('height', this.height);
        rect.setAttribute('fill', 'white');
        this.svg.appendChild(rect);
    }

    updateData(rawData) {
        // Process the transaction data
        console.log(rawData);

        const transactions = rawData.data.transaction;

        // Sort transactions by date
        transactions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        // Calculate cumulative XP
        this.data = transactions.map((item, index) => {
            const previousXP = index > 0
                ? transactions.slice(0, index).reduce((sum, d) => sum + d.amount, 0)
                : 0;
            return {
                ...item,
                cumulativeXP: previousXP + item.amount,
                date: new Date(item.createdAt)
            };
        });

        this.render();
    }

    formatXP(xp) {
        return new Intl.NumberFormat('en-US').format(Math.round(xp));
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    render() {
        this.drawBackground();

        const maxXP = Math.max(...this.data.map(d => d.cumulativeXP));
        const minXP = 0;
        const chartWidth = this.width - 2 * this.padding;
        const chartHeight = this.height - 2 * this.padding;

        // Draw grid lines and Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const y = this.padding + (i * (chartHeight / 5));
            const xpValue = maxXP - ((i / 5) * (maxXP - minXP));

            // Grid line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', this.padding);
            line.setAttribute('y1', y);
            line.setAttribute('x2', this.width - this.padding);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#E0E0E0');
            line.setAttribute('stroke-width', '1');
            this.svg.appendChild(line);

            // Y-axis label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', this.padding - 10);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', '#666');
            text.textContent = `${this.formatXP(xpValue)} XP`;
            this.svg.appendChild(text);
        }

        // Draw axes
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', this.padding);
        xAxis.setAttribute('y1', this.height - this.padding);
        xAxis.setAttribute('x2', this.width - this.padding);
        xAxis.setAttribute('y2', this.height - this.padding);
        xAxis.setAttribute('stroke', '#333');
        xAxis.setAttribute('stroke-width', '2');
        this.svg.appendChild(xAxis);

        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', this.padding);
        yAxis.setAttribute('y1', this.padding);
        yAxis.setAttribute('x2', this.padding);
        yAxis.setAttribute('y2', this.height - this.padding);
        yAxis.setAttribute('stroke', '#333');
        yAxis.setAttribute('stroke-width', '2');
        this.svg.appendChild(yAxis);

        // Create points for the line
        const points = this.data.map((d, i) => {
            const x = this.padding + (i * (chartWidth / (this.data.length - 1)));
            const y = this.height - this.padding - ((d.cumulativeXP - minXP) / (maxXP - minXP) * chartHeight);
            return `${x},${y}`;
        }).join(' ');

        // Draw line
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', '#00BCD4');
        polyline.setAttribute('stroke-width', '2');
        this.svg.appendChild(polyline);

        // Draw points and x-axis labels
        this.data.forEach((d, i) => {
            const x = this.padding + (i * (chartWidth / (this.data.length - 1)));
            const y = this.height - this.padding - ((d.cumulativeXP - minXP) / (maxXP - minXP) * chartHeight);

            // Data point
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', '#00BCD4');
            circle.dataset.index = i;
            this.svg.appendChild(circle);

            // X-axis label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', this.height - this.padding + 20);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', '#666');
            text.setAttribute('transform', `rotate(45, ${x}, ${this.height - this.padding + 20})`);
            text.textContent = this.formatDate(d.date);
            this.svg.appendChild(text);
        });
    }

    setupEventListeners() {
        this.svg.addEventListener('mousemove', (e) => {
            const target = e.target;
            if (target.tagName === 'circle') {
                const index = target.dataset.index;
                const data = this.data[index];
                const tooltipText = `Project: ${data.object.name}\nXP: ${this.formatXP(data.amount)}\nTotal XP: ${this.formatXP(data.cumulativeXP)}\nDate: ${data.date.toLocaleDateString()}`;
                this.showTooltip(e.clientX, e.clientY, tooltipText);
            } else {
                this.hideTooltip();
            }
        });

        this.svg.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    showTooltip(x, y, text) {
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${x + 10}px`;
        this.tooltip.style.top = `${y - 10}px`;
        this.tooltip.textContent = text;
    }

    hideTooltip() {
        this.tooltip.style.display = 'none';
    }
}
