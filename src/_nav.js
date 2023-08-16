import {BASE_URL} from './constance/Constance';
export default {
  items: [
    {
      name: 'Add Task',
      url: BASE_URL+'/add-task',
      icon: 'icon-list',
    },
    {
      name: 'Task History',
      url: BASE_URL+'/task-history',
      icon: 'icon-chart',
    },
    {
      name: 'Report',
      url: BASE_URL+'/report',
      icon: 'icon-folder',
    }
  ],
};
