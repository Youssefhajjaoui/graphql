import { XPChart } from "./xpchart.js";

export class Home {
    constructor() {
    }

    async getProgress() {
        let data = null;
        const jwt = localStorage.getItem('jwt');
        var graphql = JSON.stringify({
            query: "{\n  transaction(where: {type: {_eq: \"xp\"}, object: {type: {_eq: \"project\"}}}) {\n    amount\n    objectId\n    object {\n      name\n    }\n  }\n}\n",
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
        } else {
            return { valid: false, data: null }

        }
        return { valid: true, data: data }
    }


    async renderHtml() {
        const app = document.querySelector('.app');
        app.style.display = 'block';
        const login = document.querySelector('.login');
        app.style.style.display = 'none';
        const progress = document.querySelector('.progress');
        const response = await this.getProgress();

        const transactions = response.data;
        // console.log(transactions.data.transaction);
        const chart = new XPChart('.chart-container');
        chart.updateData(transactions);
    }
} 