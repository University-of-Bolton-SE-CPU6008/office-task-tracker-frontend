import {BASE_URL} from './constance/Constance';
export default {
  items: [
    {
      name: 'All Tasks',
      url: BASE_URL+'/admin/all-tasks',
      icon: 'icon-puzzle',
    },
    {
      name: 'Manage Projects',
      url: BASE_URL+'/admin/manage-projects',
      icon: 'icon-layers',
    },
    {
      name: 'Manage Employee',
      url: BASE_URL+'/admin/manage-employee',
      icon: 'icon-people',
    }
  ],
};
