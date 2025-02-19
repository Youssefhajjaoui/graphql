export class ErrorPage {
    constructor(type) {
        this.type = type;
    }

    renderHtml() {
        const container = document.querySelector('.app');
        const errorcontainer = document.createElement('div');
        errorcontainer.innerHTML = `
        <div class="error-circle">
            <span class="error-icon"></span>
        </div>
        <h1 class="error-status"></h1>
        <p class="error-message"></p>
        <div class="error-code"></div>
        <button class="back-button" data-link href="/">Go Back</button>
    `;
        errorcontainer.classList = 'error-container';
        let icon = null;
        let status = null;
        let message = null;
        let code = null;
        switch (this.type) {
            case '404':
                icon = '!';
                status = '404 Error';
                message = `Oops! The page you're looking for cannot be found.`;
                code = `Error Code: 404-Page-Not-Found`;
                break;
            case '500':
                icon = '⚠️';
                status = '500 Internal Server Error';
                message = 'Sorry, something went wrong on our end. Our team has been notified.';
                code = 'Error Code: 500-Internal-Server-Error';
                break;
            case '401':
                icon = '🔒';
                status = '401 Unauthorized';
                message = `Access denied. You don't have permission to view this page.`;
                code = `Error Code: 401-Unauthorized-Access`;
                break;
        }
        const iconelem = document.querySelector('.error-icon');
        iconelem.textContent = icon;
        const statuselem = document.querySelector('.error-status');
        statuselem.textContent = status;
        const messageelem = document.querySelector('.error-message');
        messageelem.textContent = message;
        const codeelem = document.querySelector('.error-code');
        codeelem.textContent = code;
    }
}