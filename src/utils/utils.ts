import bcrypt from "bcrypt";

export async function isValidDisplayName(name: string): Promise<void> {
    if (typeof name === 'undefined') {
        throw new Error("Display name is not set");
    } else if (name.length < 6 || name.length > 30) {
        throw new Error("Display name must be 6 - 30 characters");
    }
}
export async function isValidEmail(email: string): Promise<void> {
    let isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!isValid.test(email)) {
        throw new Error("Invalid email address");
    }
}

export async function isValidPhone(phone: string): Promise<void> {
    let isValid = /^+[1-9]\d{1,14}$/;
    if (!isValid.test(phone)) {
        throw new Error("Invalid phone number");
    }
}

export async function isValidPassword(password: string): Promise<void> {
    if (!(/^.{8,}$/.test(password))) {
        throw new Error("Password must contain a lowercase and uppercase");
    }
    if (!(/\d+/.test(password))) {
        throw new Error("Password must contain a number");
    }
    if (!(/.[a-zA-Z]./.test(password))) {
        throw new Error("Password must contain a letter");
    }
    if (password.length <= 7) {
        throw new Error("Password must be longer than 7 characters");
    }
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function compareHashPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}