import crypto from 'crypto';
import base64URLEncode from './base64URLEncode';

function sha256 (buffer) {
 return crypto.createHash('sha256').update(buffer).digest();
}

export default function generateRandomChallengePair () {
  const secret = base64URLEncode(crypto.randomBytes(32));
  const hashed = base64URLEncode(sha256(secret));
  return {secret, hashed};
}
