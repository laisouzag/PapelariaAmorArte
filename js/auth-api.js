console.log('Sistema de autenticação com API iniciado!');

// ADMIN AUTHENTICATION using API
const AdminAuth = {
    login: async function(email, password) {
        try {
            const data = await api.adminLogin(email, password);
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminEmail', email);
            return data;
        } catch (error) {
            console.error('Admin login error:', error);
            return null;
        }
    },
    
    logout: function() {
        api.logout();
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
    },
    
    isLoggedIn: function() {
        return localStorage.getItem('adminLoggedIn') === 'true' && api.token;
    },
    
    getCurrentAdmin: function() {
        if (this.isLoggedIn()) {
            return {
                email: localStorage.getItem('adminEmail')
            };
        }
        return null;
    }
};

async function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    const result = await AdminAuth.login(email, password);
    if (result) {
        showNotification('Login administrativo realizado com sucesso!');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        showNotification('E-mail ou senha de administrador incorretos!');
    }
}

function checkAdminAuth() {
    if (!AdminAuth.isLoggedIn()) {
        window.location.href = 'admin-login.html';
    }
}

function showTab(tabName) {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    if (tabName === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        tabBtns[0].classList.add('active');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        tabBtns[1].classList.add('active');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const data = await api.login(email, password);
        SessionManager.setCurrentCustomer(data.user);
        showNotification('Login realizado com sucesso!');
        setTimeout(() => {
            window.location.href = '../minha-conta.html';
        }, 1000);
    } catch (error) {
        showNotification('E-mail ou senha incorretos!');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    // Clear previous error messages
    clearErrorMessages();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const cpf = document.getElementById('register-cpf').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validate required fields
    let hasError = false;
    
    if (name.length < 3) {
        showError('name-error', 'Nome deve ter pelo menos 3 caracteres');
        hasError = true;
    }
    
    if (!isValidEmail(email)) {
        showError('email-error', 'E-mail inválido');
        hasError = true;
    }
    
    if (!isValidPhone(phone)) {
        showError('phone-error', 'Telefone inválido. Use o formato (12) 99999-9999');
        hasError = true;
    }
    
    if (password.length < 6) {
        showError('password-error', 'Senha deve ter pelo menos 6 caracteres');
        hasError = true;
    }
    
    if (password !== confirmPassword) {
        showError('confirm-password-error', 'As senhas não coincidem');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    try {
        const data = await api.register({ name, email, phone, cpf, password });
        SessionManager.setCurrentCustomer(data.user);
        showNotification('Cadastro realizado com sucesso!');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    } catch (error) {
        if (error.message && error.message.includes('já cadastrado') || error.message.includes('already registered') || error.message.includes('duplicate')) {
            showError('email-error', 'Este e-mail já está cadastrado. Faça login para continuar.');
        } else {
            showError('email-error', error.message || 'Erro ao cadastrar');
        }
    }
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(el => el.textContent = '');
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone);
}

async function handlePasswordReset(event) {
    event.preventDefault();
    
    const email = document.getElementById('reset-email').value.trim();
    
    if (!isValidEmail(email)) {
        showError('reset-email-error', 'E-mail inválido');
        return;
    }
    
    try {
        // For now, just show a notification since the API might not have this endpoint yet
        showNotification('Instruções de redefinição de senha enviadas para seu e-mail!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        showError('reset-email-error', error.message || 'Erro ao enviar instruções');
    }
}

async function logout() {
    SessionManager.clearSession();
    showNotification('Logout realizado com sucesso!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

async function adminLogout() {
    AdminAuth.logout();
    showNotification('Logout administrativo realizado com sucesso!');
    setTimeout(() => {
        window.location.href = 'admin-login.html';
    }, 1000);
}

async function checkLoginStatus() {
    try {
        const customer = await api.getCurrentUser();
        const accountLink = document.querySelector('.account-link');
        if (customer) {
            accountLink.innerHTML = `<i class="fas fa-user"></i> ${customer.name.split(' ')[0]}`;
            accountLink.href = 'minha-conta.html';
        } else {
            accountLink.innerHTML = `<i class="fas fa-user"></i> Minha conta`;
            accountLink.href = 'pages/cadastro.html';
        }
    } catch (error) {
        const accountLink = document.querySelector('.account-link');
        if (accountLink) {
            accountLink.innerHTML = `<i class="fas fa-user"></i> Minha conta`;
            accountLink.href = 'pages/cadastro.html';
        }
    }
}

// showNotification is defined in main.js, removing duplicate definition

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

console.log('Sistema de autenticação com API carregado com sucesso!');
