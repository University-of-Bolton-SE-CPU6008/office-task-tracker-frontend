import ApiService from './apiService';

export async function getAllTasks(body) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `task/get-all`;
  apiObject.multipart = false;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function createTask(body) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `task/create`;
  apiObject.multipart = false;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function getTaskReport() {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `reports`;
  apiObject.multipart = false;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getTaskByTaskId(id) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `task/${id}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getAllTasksType(body) {
  const apiObject = {};
  apiObject.method = 'POST';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `task-type/get-all`;
  apiObject.multipart = false;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}
