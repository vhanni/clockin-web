<template>
  <div>
    <b-container fluid>
      <alerts/>
      <router-view/>
      <tablesettings id="tablesettings"/>
      <tablecontainer/>
    </b-container>
  </div>
</template>
<script>
import Alerts from './Alerts';
import tablesettings from '../tablecontents/tablesettings';
import tablecontainer from '../tablecontents/tablecontainer';
import Modal from '../modals/Modal';
export default {
  name: 'Timetable',
  components: {
    tablesettings,
    tablecontainer,
    Alerts
  }
};
</script>
