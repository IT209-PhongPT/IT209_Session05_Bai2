// Module Authentication - IT209 Session 05
// Sinh vien: Pham Thanh Phong - N24DTCN120

function login(username, password) {
    console.log("Xác thực người dùng: " + username);
    return Boolean(username && password);
}

function generateToken(userId) {
    return "jwt_token_" + userId + "_" + Date.now();
}

function validateToken(token) {
    return typeof token === "string" && token.startsWith("jwt_token_");
}

module.exports = { login, generateToken, validateToken };
