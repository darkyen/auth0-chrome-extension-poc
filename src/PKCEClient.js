import autobind from 'core-decorators/lib/autobind';
import generateRandomChallengePair from './generateRandomChallengePair';
import qs from 'qs';


/*
  Generic JavaScript PKCE Client, you can subclass this for React-Native,
  Cordova, Chrome, Some Other Environment which has its own handling for
  OAuth flows (like Windows?)
*/

@autobind
class PKCEClient{
  // These params will never change
  constructor (domain, clientId) {
    this.domain = domain;
    this.clientId = clientId;
  }

  async getAuthResult (url, interactive) {
    throw new Error('Must be implemented by a sub-class');
  }

  getRedirectURL () {
    throw new Error('Must be implemented by a sub-class');
  }

  async exchangeCodeForToken (code, verifier) {
    const {domain, clientId} = this;
    const body = JSON.stringify({
      redirect_uri: this.getRedirectURL(),
      grant_type: 'authorization_code',
      code_verifier: verifier,
      client_id: clientId,
      code
    });
    const result = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    return result.json();
  }

  extractCode (resultUrl) {
    const response = qs.parse(resultUrl.split('?')[1]);

    if (response.error) {
      throw new Error(response.error_description || response.error);
    }

    return response.code;
  }

  async authenticate (options = {}, interactive = true) {
    const {domain, clientId} = this;
    const {secret, hashed} = generateRandomChallengePair();

    Object.assign(options, {
      client_id: clientId,
      code_challenge: hashed,
      redirect_uri: this.getRedirectURL(),
      code_challenge_method: 'S256',
      response_type: 'code',
    });

    const url = `https://${domain}/authorize?${qs.stringify(options)}`;
    const resultUrl = await this.getAuthResult(url, interactive);
    const code = this.extractCode(resultUrl);
    return this.exchangeCodeForToken(code, secret);
  }
}

export default PKCEClient;
