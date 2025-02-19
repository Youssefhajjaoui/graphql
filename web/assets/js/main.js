import { Router } from "./router.js";
import { Home } from "./views/home.js";
import { Login } from "./views/login.js";

async function main() {
    const router = new Router();
    router.handleRoute();
    // const app = new Home();
    // const loginpage = new Login(router);
    // loginpage.renderhtml();
    // await loginpage.afterRender();
    // app.jwt = loginpage.jwt;
    // if (loginpage.loged || loginpage.jwt !== null) {
    //     app.renderHtml();
    // }
}

main();