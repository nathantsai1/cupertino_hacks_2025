const bcrypt = require('bcryptjs');

async function check_users(email, password, confirm_password, date, security_q) {
    // 1=success, 2=pw not the same, 3=email not valid, 4=security question not valid
    // 5=pw not valid
    if (password !== confirm_password) {
        return 2;
    }
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // 1=success 2=pw error 3=username error 4=pw error
    if (!passwordRegex.test(password)) {
      return 4;
    } else if (email.length < 5) {
        return 3;
    } else {
        return 1;
    }
}

async function encrypt_password(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch(e) {
        console.error('Error encrypting password:', e);
        return 0; // or handle the error as needed
    }
}

async function compare_passwords(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}
module.exports = {
    check_users,
    encrypt_password,
}