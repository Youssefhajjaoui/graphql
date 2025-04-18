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
        // console.log('yes');

        if (localStorage.getItem('jwt') && path == '/' || localStorage.getItem('jwt') && path !== '/login') {
            view = new Home(this);
        } else if ((!localStorage.getItem('jwt') && path == '/') || path == '/login' && localStorage.getItem('jwt')) {
            view = new Login(this);
            localStorage.removeItem('jwt')
        } else {
            view = new ErrorPage('404');
        }
        if (!view) {
            view = new ErrorPage(this);
        }
        view.renderHtml();
        view.afterRender();
    }

    handleError(type) {
        console.log('trigred');

        const view = new ErrorPage(type);
        view.renderHtml();
    }

    navigateto(path) {
        history.pushState(null, null, path);
        this.handleRoute();
    }
}
