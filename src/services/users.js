import ApiService from './apiService';

export async function getAllPublicUsers(pagination) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/user/all?page=${pagination.page}&size=${pagination.size}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function searchPublicUsers(pagination) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.endpoint = `web/admin/user/search?page=${pagination.page}&size=${pagination.size}&name=${pagination.name}${pagination.packageType !== '' ? `&packageId=` + pagination.packageType : ``}${pagination.startDateTime !== '' ? `&startDateTime=` + pagination.startDateTime : ``}${pagination.endDateTime !== '' ? `&endDateTime=` + pagination.endDateTime : ''}${pagination.publicUserStatus !== '' ? `&publicUserStatus=` + pagination.publicUserStatus : ''}${pagination.country!==''?'&country='+pagination.country:''}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getPublicUserCount() {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `web/admin/user/count`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getPublicUserById(id) {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `web/admin/user/${id}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function updateUserStatus(body) {
  const apiObject = {};
  apiObject.method = 'PUT';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `web/admin/user/update/status`;
  apiObject.body = body;
  return await ApiService.callApi(apiObject);
}

export async function getLatestPublicUsers() {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `web/admin/user/latest?size=10`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getNewUsersPerMonth() {
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `web/admin/user/month`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getPublicUserCSV(){
  const apiObject = {};
  apiObject.method = 'GET';
  apiObject.authentication = true;
  apiObject.isBasicAuth = false;
  apiObject.urlencoded = false;
  apiObject.multipart = false;
  apiObject.endpoint = `web/admin/user/search/all`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}



