import { ErrorPage } from "./views/error.js";
import { Home } from "./views/home.js";
import { Login } from "./views/login.js";


export class Router {
    constructor() {
        this.routes = [{ route: '/login', view: Login }, { route: '/', view: Home }]
    }

    handleRoute() {
        const path = document.location.pathname;
        let view = null;
        console.log('yes');

        if (localStorage.getItem('jwt') && path == '/') {
            view = new Home(this);
        } else if ((!localStorage.getItem('jwt') && path == '/') || path == '/login') {
            view = new Login(this);
        }
        if (!view) {
            view = new ErrorPage(this);
        }
        view.renderHtml();
        view.afterRender();
    }

    navigateto(path) {
        history.pushState(null, null, path);
        this.handleRoute();
    }
}
