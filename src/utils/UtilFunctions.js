import {store} from '../store/store';
import Avatar from '../components/universal/Avatar.vue';

const UtilFunctions = {
  install (Vue, options) {
    // Add universal components
    Vue.component(Avatar.name, Avatar);
  }
};
export default UtilFunctions;
