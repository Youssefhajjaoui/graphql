// import { Router } from './../router.js'

export class Login {
    constructor(router) {
        this.router = router;
        this.base64 = null;
        this.jwt = null;
        this.loged = false;
    }
    renderHtml() {
        const app = document.querySelector('.app');
        app.style.display = 'none';
        const container = document.querySelector('.login');
        container.style.display = 'block';
        const form = document.createElement('form');
        form.className = 'login-container';
        const loginheader = document.createElement('div');
        loginheader.className = 'login-header';
        const header = document.createElement('h1');
        header.textContent = 'Welcome Back!';
        loginheader.appendChild(header);
        const p = document.createElement('p');
        p.textContent = 'Please login to your account';
        loginheader.appendChild(p);
        form.appendChild(loginheader);
        const formgrp = document.createElement('div');
        formgrp.className = 'form-group';
        const labelname = document.createElement('label');
        labelname.textContent = 'Email / Username';
        labelname.setAttribute('for', 'email');
        formgrp.appendChild(labelname);
        const fieldname = document.createElement('input');
        fieldname.className = 'input-name';
        fieldname.setAttribute("placeholder", "Enter your Email or Username");
        formgrp.appendChild(fieldname);
        form.appendChild(formgrp);
        const formgrp1 = document.createElement('div');
        formgrp1.className = 'form-group';
        const labelpassword = document.createElement('label');
        labelpassword.setAttribute('for', 'password');
        formgrp1.append(labelpassword);
        const fieldpassword = document.createElement('input');
        fieldpassword.className = 'input-password';
        fieldpassword.setAttribute('type', 'password');
        fieldpassword.setAttribute("placeholder", "Enter your password")
        formgrp1.appendChild(fieldpassword);
        form.append(formgrp1);
        const button = document.createElement('button');
        button.className = 'login-button';
        button.textContent = 'Login';
        button.type = 'button';
        form.appendChild(button);
        container.appendChild(form);
    }

    async submitedata() {
        const name = document.querySelector('.input-name');
        const username = name.value;
        const passwordField = document.querySelector('.input-password');
        const password = passwordField.value;
        // console.log(username, password);

        this.base64 = btoa(`${username}:${password}`);
        const res = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${this.base64}`,
                "Content-Type": "application/json"
            }
        })
        if (res.ok) {
            this.jwt = await res.json();
            localStorage.setItem('jwt', this.jwt);
            this.router.navigateto('/');
        }
    }

    async afterRender() {
        const button = document.querySelector('.login-button');
        button.addEventListener('click', async (event) => {
            await this.submitedata();
        })
    }
}

