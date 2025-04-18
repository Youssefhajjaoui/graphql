export class XPChart {
    constructor(selector) {
        this.container = document.querySelector(selector);
        this.width = 400;
        this.height = 290;
        this.padding = 15;
        this.data = [];
        this.tooltip = document.getElementById('tooltip');

        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '40vw');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.container.appendChild(this.svg);

        this.init();
    }

    init() {
        this.drawBackground();
    }

    drawBackground() {
        this.svg.innerHTML = '';
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.width);
        rect.setAttribute('height', this.height);
        rect.setAttribute('fill', 'transparent');
        this.svg.appendChild(rect);
    }

    // Add this method to your class
    getMousePosition(evt) {
        const CTM = this.svg.getScreenCTM();
        if (evt.touches) { evt = evt.touches[0]; }
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    updateData(rawData) {
        const transactions = rawData.data.transaction;
        transactions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

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
        let maxXP = 0;
        this.data.forEach((a) => {
            maxXP = maxXP + a.amount;

        })
        // console.log(this.data);

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

        console.log(this.data);

        // Draw line
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', '#00BCD4');
        polyline.setAttribute('stroke-width', '2');
        this.svg.appendChild(polyline);

        this.data.forEach((d, i) => {
            const x = this.padding + (i * (chartWidth / (this.data.length - 1)));
            const y = this.height - this.padding - ((d.cumulativeXP - minXP) / (maxXP - minXP) * chartHeight);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', '#00BCD4');
            circle.dataset.index = i;
            this.svg.appendChild(circle);

            circle.addEventListener('mouseover', (e) => {
                this.tooltip.innerHTML = `
                    <div>Amount: +${this.formatXP(d.amount)} XP</div>
                    <div>Total: ${this.formatXP(d.cumulativeXP)} XP</div>
                     <div>Name: ${d.object.name}</div>
                `;
                this.tooltip.style.display = 'block';
                this.tooltip.style.left = `${e.pageX}px`;
                this.tooltip.style.top = `${e.pageY}px`;

                circle.setAttribute('r', '6');
            });

            circle.addEventListener('mouseout', (e) => {
                this.tooltip.style.display = 'none';
                circle.setAttribute('r', '4');
            });
        });
    }
}
