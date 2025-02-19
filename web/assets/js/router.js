import { ErrorPage } from "./views/error.js";
import { Home } from "./views/home.js";
import { Login } from "./views/login.js";


export class Router {
    constructor() {
        this.routes = [{ route: '/login', view: Login }, { route: '/', view: Home }]
    }

    handleRoute() {
        const path = document.location.pathname;
        console.log(path);

        this.routes.forEach((route) => {
            if (route.route === path) {
                if (localStorage.getItem('jwt')) {
                    const page = new Home();
                    page.renderHtml();
                } else {
                    history.pushState(null, null, '/login');
                    const page = new Login();
                    page.renderhtml();
                    page.afterRender();
                }
            } else {
                const page = new ErrorPage('404');
                page.renderHtml();
            }
        })
    }
}

export function navigateto(router, path) {
    history.pushState(null, null, path);
    router.handleRoute();
}