export default class RocketLoginHtml {
    static getHtml() {
        return `
    <div id="login-form" class="login-form-modal">
        <div class="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>
            <form id="login-form" class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" name="email" type="email" required
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input id="password" name="password" type="password" required
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                    <button type="submit"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Connexion
                    </button>
                    <button type="button" id="logout-btn"
                            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                        Déconnexion
                    </button>
                </div>
            </form>

            <div id="auth-message" class="mt-4 text-sm text-center text-gray-600"></div>
        </div>
    </div>
        `
    }
}

window.RocketLoginHtml = RocketLoginHtml;