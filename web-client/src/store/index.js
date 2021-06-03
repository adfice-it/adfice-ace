import { createStore } from 'vuex';
import { vuexSimple } from '../helpers';
const props = {
  // todo: store in cookie
  sideBySide: false,
  currentStep: 'prepare',
  initialJSON: null
};
const s = createStore(
  vuexSimple(
    {
      mutations: {
      },
      actions: {
      },
      getters: {
        id(state, { record: { id } }) {
          return id;
        },
        age(state, { record: { age } }) {
          return age;
        },
        medicationAdvice(state, { record: { medication_advice } }) {
          return medication_advice;
        },
        record(state, { initialJSON }) {
          return { id: initialJSON?.patientId || 'no id', ...(initialJSON?.patient_advice || {}) } || {};
        },
        steps() {
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
