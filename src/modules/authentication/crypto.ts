
import crypto  from 'crypto';
import { getConfig } from '../../libs/config'
import { JWTConfig } from './types';

export const encrypt = (text: string): string => {
    const {
        algorithm,
        secret,
        iv
    }: JWTConfig = getConfig().jwt

    const cipher = crypto.createCipheriv(algorithm, secret, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted.toString('hex');
};

export const decrypt = (hash: string) => {
    const {
        algorithm,
        secret,
        iv
    }: JWTConfig = getConfig().jwt

    const decipher = crypto.createDecipheriv(algorithm, secret, iv);
    const decrpyted = Buffer
        .concat([
            decipher.update(Buffer.from(hash || '', 'hex')),
            decipher.final()
        ]);

    return decrpyted.toString();
};

export default {
    encrypt,
    decrypt
};