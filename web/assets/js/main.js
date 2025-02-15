import { Home } from "./views/home.js";
import { Login } from "./views/login.js";

async function main() {
    const app = new Home();
    const loginpage = new Login(app);
    loginpage.renderhtml();
    await loginpage.afterRender();
    // app.jwt = loginpage.jwt;
    // if (loginpage.loged || loginpage.jwt !== null) {
    //     app.renderHtml();
    // }
}

main();