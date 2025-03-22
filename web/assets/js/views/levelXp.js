export class Level {
    async Getlevel() {
        let data = null;
        const jwt = localStorage.getItem('jwt');
        var graphql = JSON.stringify({
            query: `{
                        transaction_aggregate(where: {_and: [{type: {_eq: "level"}}, {object: {type: {_eq: "project"}}}]}) {
                        aggregate {
                         max {
                         amount
                         }
                        }
                        }
  
                        transaction(
                         where: {
                         _or: [
                             { _and: [{ type: { _eq: "xp" } }, { object: { type: { _eq: "project" } } }] },
                             { _and: [{ type: { _eq: "xp" } }, { object: { type: { _eq: "piscine" } } }] }
                            ]
                        }
                         ) {
    
                        amount
                        objectId
                        object{
                          id
                          name
                        }
                        }
                    }`,
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
            console.log(data);
            let maxXp = 0;
            data.data.transaction.forEach(element => {
                maxXp += element.amount;
            });
            const xpcontainer = document.querySelector('.xp-amount');
            console.log(data.data.transaction_aggregate.aggregate.max);

            createLevelCircle(xpcontainer, { level: data.data.transaction_aggregate.aggregate.max.amount, amountXp: maxXp });
        }
    }
}

function createLevelCircle(container, options = {}) {
    // Default options
    const defaults = {
        level: 27,
        size: 200,
        bgColor: '#f5f5f5',
        borderColor: '#e0e0e0',
        textColor: '#333333',
        labelColor: '#888888',
        amountXp: 0,
        containerBgColor: '#ffffff'
    };

    // Merge default options with user provided options
    const settings = { ...defaults, ...options };

    // Create container with white background
    container.style.backgroundColor = settings.containerBgColor;
    container.style.borderRadius = '10px';
    container.style.padding = '20px';
    container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.width = 'fit-content';

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${settings.size} ${settings.size}`);
    svg.setAttribute('width', settings.size);
    svg.setAttribute('height', settings.size);

    // Center point of the circle
    const centerX = settings.size / 2;
    const centerY = settings.size / 2;

    // Radius for the circle
    const radius = settings.size * 0.4;

    // Create the main circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', centerX);
    circle.setAttribute('cy', centerY);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', settings.bgColor);
    circle.setAttribute('stroke', settings.borderColor);
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');
    svg.appendChild(circle);

    // Add the "Level" label text
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', centerX);
    labelText.setAttribute('y', centerY - settings.size * 0.05);
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('font-family', 'Arial, sans-serif');
    labelText.setAttribute('font-size', settings.size * 0.06);
    labelText.setAttribute('fill', settings.labelColor);
    labelText.textContent = 'Level';
    svg.appendChild(labelText);

    // Add the level number
    const levelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    levelText.setAttribute('x', centerX);
    levelText.setAttribute('y', centerY + settings.size * 0.1);
    levelText.setAttribute('text-anchor', 'middle');
    levelText.setAttribute('font-family', 'Arial, sans-serif');
    levelText.setAttribute('font-size', settings.size * 0.16);
    levelText.setAttribute('font-weight', 'bold');
    levelText.setAttribute('fill', settings.textColor);
    levelText.textContent = settings.level;
    svg.appendChild(levelText);

    // Append the SVG to the container
    container.appendChild(svg);

    // Create XP display element
    const xpContainer = document.createElement('div');
    xpContainer.style.marginTop = '10px';
    xpContainer.style.textAlign = 'center';
    xpContainer.style.fontFamily = 'Arial, sans-serif';
    xpContainer.style.color = settings.textColor;
    xpContainer.style.fontSize = '14px';

    // Create XP text
    const xpText = document.createElement('div');
    xpText.textContent = `${settings.amountXp} XP`;
    xpText.style.fontWeight = 'bold';

    xpContainer.appendChild(xpText);
    // xpContainer.appendChild(progressContainer);
    container.appendChild(xpContainer);
}