import ApiService from "./apiService";

export async function getAllProjects(body) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `project/get-all`;
  apiObject.multipart = false;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function createProjects(body) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `project/create`;
  apiObject.multipart = false;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function getProjectByEmployee(id) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `project/${id}`;
  apiObject.multipart = false;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
