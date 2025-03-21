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
            console.log(result);
        } else {
            return { valid: false, data: null }

        }
        return { valid: true, data: data }
    }
}

function createRadarChart(categories, values) {

}