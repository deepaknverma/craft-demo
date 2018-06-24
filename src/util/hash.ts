import * as hash from 'object-hash';

export function md5Object(obj: object) {
    return hash.MD5(obj);
}
