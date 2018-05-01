import Vue from 'vue';
import Router from 'vue-router';
import Timetable from '@/components/layout/Timetable';

import SettingsInterface from '@/components/modals/SettingsInterface';
import SettingsPayslip from '@/components/modals/SettingsPayslip';

Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Timetable',
      component: Timetable,
      meta: { auth: false },
      children: [
        {
          path: 'timein'
        },
        {
          path: 'settings/interface',
          component: SettingsInterface,
          meta: { auth: false }
        },
        {
          path: 'settings/payslip',
          component: SettingsPayslip,
          meta: { auth: false }
        }
      ]
    }
  ]
});
