import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
import {BASE_URL} from './constance/Constance';


const AddTask = React.lazy(() => import('./views/AddTask/AddTask'));
const Login = React.lazy(() => import('./views/Pages/Login/Login'));
const Register = React.lazy(() => import('./views/Pages/Register/Register'));
const ErrorPage =React.lazy(() => import('./views/Pages/Page404/Page404'));
const ErrorPage1 =React.lazy(() => import('./views/Pages/Page500/Page500'));
const TaskHistory = React.lazy(() => import('./views/TaskHistory/TaskHistory'));
const ForgotPWPage = React.lazy(() => import('./views/Pages/ForgotPW/ForgotPW'));
const ReportPage = React.lazy(() => import('./views/Report/Report'));
const AllTasksPage = React.lazy(() => import('./views/Admin/AllTasks/AllTasks'));
const ManageProjects = React.lazy(() => import('./views/Admin/Projects/Projects'));
const ManageEmployee = React.lazy(() => import('./views/Admin/Employees/Employees'));
const ResetPw = React.lazy(() => import('./views/Pages/RestPW/ResetPW'));


const routes = [
  {path: '/', exact: true, name: 'Home', component: DefaultLayout},
  {path: BASE_URL + '/add-task',exact: true, name: 'Add Task', component: AddTask},
  {path: BASE_URL + '/login', exact: true, name: 'Login Page', component: Login},
  {path: BASE_URL + '/register', exact: true, name: 'Register Page', component: Register},
  {path: BASE_URL + '/404', exact: true, name: '404 Page', component: ErrorPage},
  {path: BASE_URL + '/500', exact: true, name: '500 Page', component: ErrorPage1},
  {path: BASE_URL + '/task-history', exact: true, name: 'Task History', component: TaskHistory},
  {path: BASE_URL + '/forgot-password', exact: true, name: 'Forgot Password Page', component: ForgotPWPage},
  {path: BASE_URL + '/change-password', exact: true, name: 'Change Password', component: ResetPw},
  {path: BASE_URL + '/Report', exact: true, name: 'Report', component: ReportPage},
  {path: BASE_URL + '/admin/all-tasks', exact: true, name: 'All Tasks', component: AllTasksPage},
  {path: BASE_URL + '/admin/manage-projects', exact: true, name: 'Manage Projects', component: ManageProjects},
  {path: BASE_URL + '/admin/manage-employee', exact: true, name: 'Manage Employee', component: ManageEmployee},
];

export default routes;
