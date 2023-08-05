import ApiService from './apiService';

export async function registerUser(userCredentials){
  const apiObject={};
  apiObject.method = 'POST';
  apiObject.authentication = false;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = 'auth/signup';
  apiObject.body = userCredentials;
  apiObject.state = "register";

  return await ApiService.callApi(apiObject)
}

export async function loginUser(userCredentials){
  const apiObject={};
  apiObject.method = 'POST';
  apiObject.authentication = false;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = 'auth/login';
  apiObject.body = userCredentials;
  apiObject.state = "login";

  return await ApiService.callApi(apiObject)
}

export async function renewToken(token) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = false;
  apiObject.isBasicAuth = true;
  apiObject.urlencoded = true;
  apiObject.endpoint = 'oauth/token';
  apiObject.body = token;
  apiObject.state = "renewToken";
  return await ApiService.callApi(apiObject);
}

export async function updatePassword(body){
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = false;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `auth/update-password`;
  apiObject.multipart = false;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function forgotPassword(userCredentials){
  const apiObject={};
  apiObject.method = 'POST';
  apiObject.authentication = false;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = 'auth/forgot-password';
  apiObject.body = userCredentials;
  apiObject.state = "login";

  return await ApiService.callApi(apiObject)
}
