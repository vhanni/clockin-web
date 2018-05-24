const state = {
  alerts: [],
  alertIndex: 1
};

const mutations = {
  addAlert: (state, data) => {
    state.alerts.push(data);
    // Increase index for next alert
    state.alertIndex++;
  },
  removeAlert: (state, id) => {
    // Get index of alert we want to remove
    const index = state.alerts.map(el => el.id).indexOf(id);
    // Maybe user clicked it away before timer ended
    if (index !== -1) state.alerts.splice(index, 1);
  }
};

const actions = {
  addAlert: (context, data) => {
    // Add alert
    const id = context.state.alertIndex;
    context.commit('addAlert', { id, ...data });

    // Remove alert afer 5 seconds
    setTimeout(() => {
      context.commit('removeAlert', id);
    }, 5000);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
