// import { Router } from "../router.js";
import { XPChart } from "./xpchart.js";
import { Radarchart } from "./skills.js";
import { Audit } from "./auditratio.js";
import { Level } from "./levelXp.js";

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
        this.setupApp();
        app.style.display = 'block';
        const login = document.querySelector('.login');
        login.innerHTML = "";
        // const progress = document.querySelector('.progress');
        // progress.innerHTML = '';
        const response = await this.getProgress();

        const transactions = response.data;
        // console.log(transactions.data.transaction);
        const chart = new XPChart('.chart');
        chart.updateData(transactions);
        const skills = new Radarchart();
        const auditratio = new Audit();
        await auditratio.getAudit();
        skills.getskills();
        const levels = new Level();
        levels.Getlevel();
    }
    setupApp() {
        const app = document.querySelector('.app');
        app.innerHTML = `<nav class="navbar">
            <div class="logo">SkillTracker</div>
            <ul class="nav-links">
                <li><a href="#xp-container" class="active">Level</a></li>
                <li><a href="#skills-container">Skills</a></li>
                <li><a href="#chart-container">Progress</a></li>
                <li><a href="#audit-container">Audit ratio</a></li>
            </ul>
            <div class="nav-right">
            </div>
        </nav>
        <div class="content">
          <div class="xp-container" id="xp-container">
            <div class="xp-amount"></div>
        </div>

        <div class="user-identifier"></div>

        <div class="chart-container" id="chart-container">
            <div class="chart"></div>
        </div>

        <div class="skills-container" id="skills-container">
            <div class="chart-title">this is some of your skills:</div>
            <div class="skills"></div>
        </div>

        <div class="audit-container" id="audit-container">
            <div class="audit"></div>
        </div>
        </div>
      `;
    }

    afterRender() {
        const botton = document.createElement('button');
        botton.className = 'logout';
        botton.textContent = 'logout';
        const app = document.querySelector('.nav-right');
        app.append(botton);

        botton.addEventListener('click', () => {
            // console.log('fired');
            localStorage.clear();
            this.router.navigateto('/login');
            botton.remove();
        })
    }
} 