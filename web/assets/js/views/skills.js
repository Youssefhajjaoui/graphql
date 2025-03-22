export class Radarchart {
  constructor(jwt) {
    this.jwt = jwt;
  }

  async getskills() {
    let data = null;
    const jwt = localStorage.getItem('jwt');
    var graphql = JSON.stringify({
      query: `{
  transaction(where: { type: { _in: ["skill_prog", "skill_go", "skill_html", "skill_js"] } }) {
    type
    amount
  }
}`
    });
    const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json"
      },
      body: graphql,
      redirect: 'follow'
    });

    if (response.ok) {
      data = await response.json();
      let result = {
        categories: [],
        values: []
      };
      const maxAmounts = data.data.transaction.reduce((acc, transaction) => {
        if (!acc[transaction.type] || transaction.amount > acc[transaction.type]) {
          acc[transaction.type] = transaction.amount;

        }
        return acc;
      }, {});

      for (const [type, amount] of Object.entries(maxAmounts)) {
        result.categories.push(type);
        result.values.push(amount / 100);
      }
      // console.log(result);
      createRadarChart(result.categories, result.values);
    } else {
      return { valid: false, data: null }

    }
    return { valid: true, data: data }
  }



}

function createRadarChart(categories, values) {
  const svgSize = 500;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  const chartDiv = document.querySelector('.skills');
  chartDiv.innerHTML = ''; // Clear previous content

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', `${svgSize / 10}vmax`);
  svg.setAttribute('height', `${svgSize / 10}vmin`);
  svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
  chartDiv.appendChild(svg);

  // Draw grid circles
  for (let i = 1; i <= 5; i++) {
    const gridRadius = radius * (i / 5);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', centerX);
    circle.setAttribute('cy', centerY);
    circle.setAttribute('r', gridRadius);
    circle.setAttribute('class', 'grid');
    svg.appendChild(circle);
  }

  // Calculate angles for each category
  const angleStep = (2 * Math.PI) / categories.length;

  //   // Draw axes and labels
  for (let i = 0; i < categories.length; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from the top
    const axisX = centerX + radius * Math.cos(angle);
    const axisY = centerY + radius * Math.sin(angle);

    // Draw axis line
    const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axis.setAttribute('x1', centerX);
    axis.setAttribute('y1', centerY);
    axis.setAttribute('x2', axisX);
    axis.setAttribute('y2', axisY);
    axis.setAttribute('class', 'axis');
    svg.appendChild(axis);

    // Draw category label
    const labelX = centerX + (radius + 20) * Math.cos(angle);
    const labelY = centerY + (radius + 20) * Math.sin(angle);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', labelX);
    label.setAttribute('y', labelY);
    label.setAttribute('class', 'category-label');
    label.textContent = categories[i];
    svg.appendChild(label);
  }

  //   // Draw the data polygon
  let polygonPoints = '';
  const dataPoints = [];

  for (let i = 0; i < categories.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const valueRadius = radius * values[i];
    const x = centerX + valueRadius * Math.cos(angle);
    const y = centerY + valueRadius * Math.sin(angle);

    polygonPoints += `${x},${y} `;

    // Store data points for later
    dataPoints.push({ x, y });
  }

  //   // Create polygon
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', polygonPoints.trim());
  polygon.setAttribute('class', 'polygon');
  svg.appendChild(polygon);

  // Draw data points
  for (const point of dataPoints) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('class', 'data-point');
    svg.appendChild(circle);
  }
}