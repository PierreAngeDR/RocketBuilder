import RocketLoginHtml from './RocketLoginHtml.js';
export default class RocketLogin {
    static loginId = 'login-form-container';
    static login(show = false) {
        const htmlContent = RocketLoginHtml.getHtml();
        let loginForm = document.getElementById(RocketLogin.loginId);
        if (!loginForm) {
            //console.log('Creating login form');
            loginForm = document.createElement('div');
            loginForm.id = RocketLogin.loginId;
            loginForm.className = 'login-form-overlay';
            loginForm.innerHTML = htmlContent;
            document.body.appendChild(loginForm);


            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const messageBox = document.getElementById('auth-message');

            const showMessage = (text, color = 'text-gray-700') => {
                messageBox.textContent = text;
                messageBox.className = `mt-4 text-sm text-center ${color}`;
            };

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = emailInput.value;
                const password = passwordInput.value;

                if (await RocketApi.login(email, password)) {
                    loginForm.classList.remove('active')
                    return true;
                }

                return false;
            });
        }

        //loginForm.style.display = show ? 'block' : 'none';
        if (show) {
            loginForm.classList.add('active')
        } else {
            loginForm.classList.remove('active')
        }
    }
}

window.RocketLogin = RocketLogin;