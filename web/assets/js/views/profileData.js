export class Profile {
    constructor(router) {
        this.router = router;
    }

    async getProfile() {
        let data = null;
        const jwt = localStorage.getItem('jwt');
        var graphql = JSON.stringify({
            query: `{
                    user{
                     attrs
                    }
                }`,
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
            console.log(data);

            const profile = document.querySelector('.user-info');
            profile.innerHTML = this.renderHtml(data);
        } else {
            return { valid: false, data: null }
        }
        return { valid: true, data: data }
    }

    renderHtml(result) {
        console.log(result.data.user[0].attrs);
        return (`
        <div class="profile">
            <h1>Profile</h1>
            <p>First Name: ${result.data.user[0].attrs.firstName}</p>
            <p>Last Name: ${result.data.user[0].attrs.lastName}</p>
            <p>Email: ${result.data.user[0].attrs.email}</p>
            <p>Phone: ${result.data.user[0].attrs.tel}</p>
            <p>Birth City: ${result.data.user[0].attrs.birthCity}</p>`)
    }
}