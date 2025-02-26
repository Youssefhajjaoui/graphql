// import { Router } from "../router.js";
import { XPChart } from "./xpchart.js";

export class Home {
    constructor(router) {
        this.router = router;
    }

    async getProgress() {
        let data = null;
        const jwt = localStorage.getItem('jwt');
        var graphql = JSON.stringify({
            query: "{\n  transaction(where: {\n    type: {_eq: \"xp\"}, \n    object: {type: {_in: [\"piscine\" , \"project\"]}}\n  }) {\n    amount\n    objectId\n    object {\n      type\n      name\n    }\n  }\n}",
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
        login.innerHTML = "";
        // const progress = document.querySelector('.progress');
        // progress.innerHTML = '';
        const response = await this.getProgress();

        const transactions = response.data;
        // console.log(transactions.data.transaction);
        const chart = new XPChart('.chart-container');
        chart.updateData(transactions);
    }

    afterRender() {
        const botton = document.createElement('button');
        botton.className = 'logout';
        botton.textContent = 'logout';
        const app = document.querySelector('.app');
        app.append(botton);

        botton.addEventListener('click', () => {
            console.log('fired');
            localStorage.clear();
            this.router.navigateto('/login');
            botton.remove();
        })
    }
} 