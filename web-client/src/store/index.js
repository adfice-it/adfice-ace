import { createStore } from 'vuex';
import { vuexSimple } from '../helpers';
const props = {
  // todo: store in cookie
  sideBySide: false,
  currentStep: 'prepare',
  initialJSON: null,
  sharedData: {},
  messages: [],
  box_states: {},
  field_entries: {},
  wsInitRecieved: false,
  wsReadyState: null
};
const { freeze } = Object;
const s = createStore(
  vuexSimple(
    {
      mutations: {
        addMessage({ messages }, value) {
          const received = new Date() * 1;
          messages.push(freeze({ ...value, received }));
        }
      },
      actions: {
        async addMessage({ dispatch, commit, getters: { sharedData, viewer_id } }, value) {
          await dispatch('sharedData', freeze({ ...sharedData, ...value, updated: new Date() * 1 }));
          commit('addMessage', value);
          const { type, kind, box_states, field_entires: field_entries } = value;
          if (kind === 'patient' && ['init', 'checkboxes', 'freetexts'].includes(type)) {
            console.log('patient message', value);
            const differentViewer = (value.viewer_id + '') !== (viewer_id + '');
            if (type === 'init') {
              await dispatch('wsInitRecieved', true);
            }
            if (differentViewer) {
              if (box_states) {
                await dispatch('box_states', freeze(box_states));
              }
              if (field_entries) {
                await dispatch('field_entries', freeze(field_entries));
              }
            }
          }
        }
      },
      getters: {
        id(state, { record: { id } }) {
          return id;
        },
        age(state, { record: { age } }) {
          return age;
        },
        viewer_id(state, { initialJSON }) {
          return initialJSON?.viewer_id;
        },
        viewers(state, { record }) {
          return record?.viewers;
        },
        medicationAdvice(state, { record: { medication_advice } }) {
          return medication_advice;
        },
        record(state, { initialJSON, sharedData, viewer_id }) {
          return { id: initialJSON?.patientId || 'no id', ...(initialJSON?.patient_advice || {}), ...sharedData, viewer_id };
        },
        lastMessage({ messages }) {
          return messages[messages.length - 1];
        },
        wsOpen(state, { wsReadyState }) {
          return wsReadyState === 1;
        },
        steps() {
          // todo: dutch version
          return [
            [
              'Step 1:',
              'Preparation',
              'Does the patient have hearing / soul / language / cognition impairments?',
              'Does the patient have (a) loved one (s) with you?'
            ],[
              'Step 2:',
              'Discuss possible treatment goals',
              'What is / is not suitable for the patient?',
              'What does quality of life represent for the patient?',
              '--What contributes to this and what stands in the way of this?'
            ],[
              'Step 3:',
              'Select treatment goal (s)',
              'What are the patient\'s treatment goals?'
            ],[
              'Step 4:',
              'Discuss the treatment options.',
              'Use the "Consult" view for this.',
              'Discuss the advantages and disadvantages of the different treatment options.'
            ],[
              'Step 5:',
              'Decision-making',
              'Does the decision match the patient\'s norms and values?'
            ],[
              'Step 6:',
              'Evaluate',
              'Use the "Advice" view here for',
              'Are the patient and any caregiver(s) satisfied with the decision?',
              'Draw up a treatment plan'
            ]
          ];
        }
      },
      modules: {}
    },
    props
  )
);
window.store = s;
window.g = s.getters;
export default s;
