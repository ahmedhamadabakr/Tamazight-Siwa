import bcrypt from 'bcryptjs';
import zxcvbn from 'zxcvbn';
import { SECURITY_CONFIG } from './config';

export interface PasswordStrength {
    score: number; // 0-4 (0 = very weak, 4 = very strong)
    feedback: {
        warning: string;
        suggestions: string[];
    };
    isValid: boolean;
}

/**
 * Validates password strength using zxcvbn
 */
export function validatePasswordStrength(password: string, userInputs?: string[]): PasswordStrength {
    const result = zxcvbn(password, userInputs);

    return {
        score: result.score,
        feedback: {
            warning: result.feedback.warning || '',
            suggestions: result.feedback.suggestions || [],
        },
        isValid: result.score >= SECURITY_CONFIG.MIN_PASSWORD_SCORE,
    };
}

/**
 * Hashes password using bcrypt with configured salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
    try {
        return await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_SALT_ROUNDS);
    } catch (error) {
        throw new Error('Failed to hash password');
    }
}

/**
 * Compares plain text password with hashed password
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Failed to compare password');
    }
}

/**
 * Generates a secure random password
 */
export function generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
}