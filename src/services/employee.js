import ApiService from "./apiService";

export async function createEmployee(body) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `designation/create`;
  apiObject.multipart = false;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function getAllEmployee() {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `designation/get-all`;
  apiObject.multipart = false;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getEmployeeFindById(id) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `designation/${id}`;
  apiObject.multipart = false;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
