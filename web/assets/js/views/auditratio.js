export class Audit {
    constructor(router) {
        this.router = router;
    }

    async getAudit() {
        let data = null;
        const jwt = localStorage.getItem('jwt');
        var graphql = JSON.stringify({
            query: `{
                transaction(where: {type: {_in: ["up" , "down"]}}) {
                    type
                    amount
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
            let result = {
                up: 0,
                down: 0
            };
            const maxAmounts = data.data.transaction.forEach(element => {
                if (element.type == "up") {
                    result.up += element.amount;
                }
                if (element.type == "down") {
                    result.down += element.amount;
                }
            });
            createRadarChart(result);
        } else {
            return { valid: false, data: null }

        }
        return { valid: true, data: data }
    }
}

function createRadarChart(data) {
    console.log("here", data.up);

    const width = 100;
    const height = 10;
    const container = document.querySelector('.audit');

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", `${width}%`);
    svg.setAttribute("height", `${height}%`);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const upRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    upRect.setAttribute("width", `${(data.up / (data.up + data.down)) * width}`);
    upRect.setAttribute("height", `${height / 2}`);
    upRect.setAttribute("x", "0");
    upRect.setAttribute("y", "0");
    upRect.setAttribute("fill", "#70c3ed");

    const downRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    downRect.setAttribute("width", `${(data.down / (data.up + data.down)) * width}`);
    downRect.setAttribute("height", `${height / 2}`);
    downRect.setAttribute("x", "0");
    downRect.setAttribute("y", `${height / 2}`);
    downRect.setAttribute("fill", "#f05b41");
    const testsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    testsvg.setAttribute("width", `${width}%`);
    testsvg.setAttribute("height", `${height}%`);
    testsvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const ratioValue = (Math.round(((data.up / data.down).toFixed(2)) * 10)) / 10;

    const ratioText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    ratioText.textContent = `Ratio: ${ratioValue}`;
    ratioText.setAttribute("x", "0");
    ratioText.setAttribute("y", `${height - 2}`);
    ratioText.setAttribute("fill", "white");
    ratioText.setAttribute("font-size", "4");
    ratioText.setAttribute("font-family", "Arial, sans-serif");

    svg.appendChild(upRect);
    svg.appendChild(downRect);
    testsvg.appendChild(ratioText);

    container.appendChild(svg);
    container.appendChild(testsvg);
}
