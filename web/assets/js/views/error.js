export class ErrorPage {
    constructor(type) {
        this.type = type;
    }

    renderHtml() {
        const container = document.querySelector('.app');
        container.innerHTML = '';
        const errorcontainer = document.createElement('div');
        errorcontainer.classList = 'error-container';
        const circle = document.createElement('div');
        circle.classList = 'error-circle';
        const iconError = document.createElement('span');
        iconError.classList = 'error-icon';
        circle.appendChild(iconError);
        errorcontainer.appendChild(circle);
        const statusError = document.createElement('h1');
        statusError.classList = 'error-status';
        errorcontainer.appendChild(statusError);
        const messageError = document.createElement('p');
        messageError.classList = 'error-message';
        errorcontainer.appendChild(messageError);
        const codeError = document.createElement('div');
        codeError.classList = 'error-code';
        errorcontainer.appendChild(codeError);
        container.appendChild(errorcontainer);
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