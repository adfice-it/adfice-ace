<template lang="pug">
form#patient_form(:class="{ [currentStep]: true }")
  .logo.logo-bg
  .stepper
    .step(v-for="(step, index) in ['prepare', 'consult', 'advice']",
          :class="{ selected: currentStep === step }",
          @click="currentStep = step") {{ index + 1 }}
  #footer
    .patient-id Patient: {{ id }}
    .stepper
      .step(v-for="(step, index) in ['prepare', 'consult', 'advice']",
        :class="{ selected: currentStep === step }",
        @click="currentStep = step") {{ index + 1 }}
        .label {{ step }}
    span#viewer_count
  #patient-info
    .heading patient information:
    .row
      .label patient:
      .value {{ id }}
    .row
      .label age:
      .value {{ age }}
    .prediction
      .description
        .value {{ id }}%
        .text chance of falling within 12 months (read more about prediction model)
      .bar
        .needle(:style="{ transform: `translate3d(${ 50 * (id / 100) }vw, 0, 0)` }")
        .dance.logo-bg
        .fall.logo-bg
        .legends
          .legend 0%
          .legend 100%
    #patient-medications
      #meds-with-rules Recommended measures:&nbsp;
        a(v-for="({ ATC_code: href, generic_name: title }, index) in medicationAdvice",
          :href="`#${ href }`") {{ title.trim() }}
      #meds-without-rules Medicines without recommended measures: None
  #div-clinician-view
    //-.heading Joint decision-making model to stimulate engagement
    .heading Gezamenlijke besluitvormingsmodel om betrokkenheid te stimuleren
    .steps
      .step(v-for="step in steps")
        .sub-step(v-for="subStep in step") {{ subStep }}
  #medication-section
    //-.heading Medication factors
    .heading Medicatiefactoren
    #general-advice
      //-div In general, a drug should be discontinued or reduced if:
      div In het algemeen dient een medicament gestopt of afgebouwd worden als:
      ul
        li there is no indication (anymore)
        li a safer alternative is available
      div It is desirable to actively monitor every patient after a change of medication (by means of follow-up) for the occurrence of a (re) fall and / or complaints such as dizziness or light-headedness change upon standing up.
    #recommendations(:class="{ 'side-by-side': sideBySide }")
      .toggle(@click="sideBySide = !sideBySide", :title="`switch to ${ sideBySide && 'vertical' || 'horizontal' } view`")
      .recommendation(v-for="{ generic_name: title, adviceTextsNoCheckboxes: atncs, adviceTextsCheckboxes: cb_advices, ATC_code: atc, referenceNumbers } in medicationAdvice")
        .heading {{ title }}
        .collapsable
          .advice
            //-.heading Advice
            .heading Advies:
            .rows
              .row(v-for="{ cdss_split } in atncs")
                markdowns(:items="cdss_split.map(({ text }) => text)")
          .measures
            //-.heading Measures (ticked if recommended):
            .heading Maatregelen (aangekruist indien aanbevolen):
            .items
              .item(:id="`pt_${ atc }_${ rulenum }_${ boxnum }`",
                    v-for="{ medication_criteria_id: rulenum, selectBoxNum: boxnum, cdss_split: chunks } in cb_advices")
                label
                  markdowns(:items="chunks.map(({ text }) => text)", :replacer="html => html.replace(/\\<\\/?(?:p|br)\\>/g, '')")
                  input(:id="`cb_${ atc }_${ rulenum }_${ boxnum }`",
                        @input="sync(`cb_${ atc }_${ rulenum }_${ boxnum }`)",
                        :checked="box_states[`cb_${ atc }_${ rulenum }_${ boxnum }`]", type="checkbox")
</template>
<script>
import { markdown } from 'markdown';
import { mapGetters, mapActions } from 'vuex';
import { vuexComputed } from '@/helpers';
import markdowns from '@/components/markdowns';
let ws;
export default {
  name: 'app',
  computed: {
    ...mapGetters(['id', 'age', 'viewer_id', 'record', 'medicationAdvice', 'steps']),
    ...vuexComputed('sideBySide', 'currentStep', 'box_states', 'field_entries'),
  },
  methods: {
    ...mapActions(['addMessage']),
    md(text) {
      // todo: patient 4 strong tag?
      return markdown.toHTML(text.replace(/\</g, '&lt;').replace(/\>/g, '&gt;'));
    },
    async sync(key, value) {
      const { box_states, field_entries, id: patient_id, viewer_id } = this;
      const group = key in box_states && box_states || field_entries;
      if (group) {
        const was = group[key];
        let checkbox_id;
        const message = {
          viewer_id,
          patient_id
        };
        if (group === box_states) {
          message.type = 'checkboxes';
          message.checkbox_id = key;
          message.checkbox_checked = !was;
          await (this.box_states = message.box_states = { ...box_states, [key]: !was });
        } else {
          field_entries[key] = value;
        }
        ws.send(JSON.stringify(message, null, 4));
      }
    },
    onMessage(e) {
      const { addMessage } = this;
      let data;
      try {
        data = JSON.parse(e.data);
        addMessage(data);
      } catch ({ message }) {
        console.log('socket error', message, e.data);
      }
      console.log('onMessage', data, e);
    }
  },
  components: { markdowns },
  mounted() {
    const { id, onMessage } = this;
    console.log('mounted...');
    ws = new WebSocket(`wss://venus.freesa.org:443/patient/${ id }`);
    ws.onmessage = onMessage;
    console.log('...mounted');
  }
};
</script>
<style lang="scss">
@use "sass:math";
body {
  margin: 0;
  padding: 0;
  * {
    -webkit-tap-highlight-color: transparent;
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  * {
    box-sizing: border-box;
  }
  input {
    display: inline;
  }
  $half-padding: 0.5rem;
  $padding: $half-padding * 2;
  $medium-color: #d9d9d9;
  $footer-height: 4.5rem;
  #patient_form {
    padding-bottom: $footer-height * 2;
    &.consult, &.advice {
      .stepper {
        &::after {
          background-color: #ccc;
          box-shadow: 0 0 2px white,
                      0 0 2px white,
                      0 0 2px white,
                      0 0 2px white;
        }
      }
      #medication-section {
        #recommendations.side-by-side {
          .measures {
            transform: translate3d(calc(-100% - 4rem), 0, 0);
          }
          .advice {
            opacity: 0;
            pointer-events: none;
          }
        }
      }
    }
    &.advice {
      .stepper {
        &::before {
          background-color: #ccc;
          box-shadow: 0 0 2px white,
          0 0 2px white,
          0 0 2px white,
          0 0 2px white;
        }
      }
      #medication-section {
        #recommendations {
          .recommendation {
            .collapsable {
              pointer-events: none;
              max-height: 0;
            }
          }
        }
      }
    }
  }
  form#patient_form > .stepper {
    position: fixed;
    top: $padding;
    right: $padding;
  }
  #footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    padding: 1rem;
    background: white;
    line-height: 2;
    text-align: center;
    z-index: 16000;
    text-shadow: none;
    height: $footer-height;
    .patient-id {
      position: absolute;
      top: $half-padding;
      left: $padding;
      font-size: 2rem;
    }
    .stepper {
      left: 50%;
      bottom: $half-padding;
      transform: translate3d(-50%, 0, 0);
      grid-column-gap: 15rem;
      .step {
        line-height: 1rem;
        padding-top: $padding;
        .label {
          pointer-events: all;
          opacity: 1;
          color: #ccc;
          &:hover {
            $shadow-color: transparent;
            text-shadow: 0 0 0 $shadow-color,
                         0 0 0 $shadow-color,
                         0 0 0 $shadow-color,
                         0 0 0 $shadow-color,
                         0 0 0 $shadow-color,
                         1px 1px 0 $shadow-color,
                         -1px -1px 0 $shadow-color,
                         -1px 1px 0 $shadow-color,
                         1px -1px 0 $shadow-color;
          }
        }
        &.selected {
          .label {
            color: #dadada;
            $shadow-color: #bbb;
            text-shadow: 0 0 0 $shadow-color,
                         0 0 0 $shadow-color,
                         0 0 0 $shadow-color,
                         0 0 0 $shadow-color,
                         0 0 0 $shadow-color,
                         1px 1px 0 $shadow-color,
                         -1px -1px 0 $shadow-color,
                         -1px 1px 0 $shadow-color,
                         1px -1px 0 $shadow-color;
          }
        }
      }
    }
  }
  .stepper {
    position: fixed;
    z-index: 15000;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: $padding * 2;
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 2rem;
      right: 0;
      height: 2px;
      background-color: #efefef;
      transform: translate3d(0, -50%, 0);
      transition: all 300ms ease-in-out;
      z-index: -1;
    }
    &::after {
      //first connector
      right: 50%;
    }
    > .step {
      position: relative;
      cursor: pointer;
      width: 3rem;
      height: 3rem;
      box-sizing: border-box;
      border-radius: 50%;
      background-color: white;
      font-size: 2.3rem;
      color: white;
      text-align: center;
      $shadow-color: #ccc;
      text-shadow: 0 0 1px $shadow-color,
                   0 0 1px $shadow-color,
                   0 0 1px $shadow-color,
                   0 0 1px $shadow-color,
                   0 0 1px $shadow-color,
                   1px 1px 1px $shadow-color,
                   -1px -1px 1px $shadow-color,
                   -1px 1px 1px $shadow-color,
                   1px -1px 1px $shadow-color;
      transition: all 300ms ease-in-out;
      border: 1px solid #ccc;
      &.selected {
        background-color: #ccc;
        border-color: #aaa;
      }
      .label {
        cursor: pointer;
        position: absolute;
        top: 50%;
        left: 100%;
        transition: all 300ms ease-in-out;
        opacity: 0;
        pointer-events: none;
        color: #dadada;
        text-shadow: none;
        background-color: white;
        border-radius: 1rem;
        transform: translate3d(0, -50%, 0);
        box-sizing: border-box;
        padding: math.div($half-padding, 2);
        margin-top: -2px;
        margin-left: math.div($half-padding, 2);
      }
    }
  }
  #patient-info {
    box-sizing: border-box;
    padding: $half-padding;
    margin: $padding;
    background-color: $medium-color;
    & > .heading {
      text-transform: capitalize;
      font-weight: 600;
    }
    .row {
      display: flex;
      justify-content: flex-start;
      .label {
        text-transform: capitalize;
        margin-right: math.div($half-padding, 2);
      }
    }
    #patient-medications {
      #meds-with-rules {
        a {
          &:not(&:last-of-type) {
            &::after {
              content: ',';
              display: inline-block;
              font-weight: 500;
              margin-right: 0.25rem;
              text-decoration: none;
              color: black;
            }
          }
        }
      }
    }
  }
  .prediction {
    margin: auto auto 5rem;
    width: 50vw;
    .description {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      .value {
        font-size: 5rem;
        font-weight: 600;
        padding-right: $half-padding;
        color: white;
        text-shadow: 0 0 1px black,
                     0 0 1px black,
                     0 0 1px black,
                     0 0 1px black,
                     0 0 1px black,
                     1px 1px 1px black,
                     -1px -1px 1px black,
                     -1px 1px 1px black,
                     1px -1px 1px black;
      }
    }
    .bar {
      position: relative;
      width: 50vw;
      height: 0.75rem;
      background-color: white;
      background: linear-gradient(to right, #0f0, #ff0 15%, #f00);
      box-sizing: border-box;
      border: 1px solid rgba(black, 0.9);
      border-left-width: 0;
      border-right-width: 0;
      .dance,
      .fall {
        position: absolute;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        background-color: white;
        background-repeat: no-repeat;
        background-size: 425%;
        width: 3.5rem;
        padding-top: 6%;
        border: 1px solid rgba(black, 0.9);
        border-radius: math.div($half-padding, 2);
      }
      .dance {
        background-position-x: 14%;
        background-position-y: -3px;
        right: 100%;
      }
      .fall {
        background-position-x: 83%;
        background-position-y: -3px;
        left: 100%;
      }
      .needle {
        position: absolute;
        top: -$half-padding;
        left: 0;
        bottom: -$half-padding;
        width: math.div($padding, 4);
        background-color: black;
        border-radius: 0.125rem;
      }
      .legends {
        position: absolute;
        left: 0;
        bottom: -4rem;
        right: 0;
        .legend {
          position: absolute;
          bottom: 0;
          font-size: 2rem;
          &:first-of-type {
            left: 0;
          }
          &:last-of-type {
            right: 0;
          }
        }
      }
    }
  }
  #div-clinician-view {
    margin: $padding * 2;
    border-radius: $half-padding;
    padding: $padding * 2;
    background-color: white;
    & > .heading {
      font-size: 1.3rem;
    }
    .steps {
      display: grid;
      grid-auto-flow: column;
      grid-template-rows: repeat(3, 1fr);
      grid-template-columns: repeat(2, 1fr);
      grid-gap: $half-padding;
      .step {
        box-sizing: border-box;
        padding: $padding;
        border: math.div($half-padding, 4) solid black;
        border-radius: $half-padding;
        background-color: #ddd;
        .sub-step {
          &:first-of-type {
            position: absolute;
            font-size: 1.2rem;
            font-weight: 600;
          }
          &:nth-of-type(2) {
            margin: $padding;
            margin-top: math.div($half-padding, 4);
            margin-left: 5rem;
            font-weight: 600;
          }

        }
      }
    }
  }
  #medication-section {
    margin: $padding;
    & > .heading {
      font-size: 2rem;
      margin-bottom: -$padding * 2;
    }
    #general-advice {
      margin: $padding;
      border-radius: $half-padding;
      padding: $padding * 2;
      background-color: white;
    }
    #recommendations {
      position: relative;
      &.side-by-side {
        .toggle {
          background-color: #aaa;
          border-color: #ddd;
          &::after {
            top: 0;
            left: 50%;
            bottom: 0;
            width: 1px;
            background-color: #ddd;
            transform: translate3d(-50%, 0, 0);
          }
        }
        .advice {
          margin-bottom: 0;
          transition: opacity 300ms ease-in-out;
        }
        .recommendation {
          .collapsable {
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: $padding * 2;
            max-height: 200vh;
            transition: max-height 300ms ease-in-out;
          }
          .measures {
            transition: transform 300ms ease-in-out;
            padding: $padding * 2;
            & > .heading {
              margin-top: -2rem;
            }
          }
        }
      }
      &:not(.side-by-side) {
        .toggle {
          &::after {
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: black;
            transform: translate3d(0, -50%, 0);
          }
        }
      }
      .toggle {
        cursor: pointer;
        position: absolute;
        top: -$padding * 2;
        right: $padding * 2;
        box-sizing: border-box;
        width: 2rem;
        padding-top: 1%;
        border: 1px solid black;
        border-radius: math.div($half-padding, 2);
        transition: all 300ms ease-in-out;
        &::after {
          content: '';
          position: absolute;
        }
      }
      .recommendation {
        position: relative;
        margin: $padding * 2;
        border-radius: $half-padding;
        padding: $padding * 2;
        background-color: #efefef;
        .collapsable {
          display: grid;
          overflow: hidden;
        }
        & > .heading {
          position: absolute;
          top: -$padding * 2;
          left: 0;
          font-size: 1.75rem;
          text-transform: capitalize;
        }
        .advice {
          margin-bottom: $padding;
          & > .heading {
            font-size: 1.3rem;
          }
          .rows {
            padding: $padding * 1.5;
            border-radius: $half-padding;
            background-color: white;
            .row {
              padding: $half-padding;
              margin-bottom: -$half-padding;
              //&:first-of-type {
              //  border-top-left-radius: $half-padding;
              //  border-top-right-radius: $half-padding;
              //}
              //&:last-of-type {
              //  border-bottom-left-radius: $half-padding;
              //  border-bottom-right-radius: $half-padding;
              //}
              & + .row {
                border-top: 1px solid #efefef;
                margin-top: -$half-padding;
                padding-top: 0;
              }
            }
          }
        }
        .measures {
          border-radius: $half-padding;
          background-color: #efefef;
          & > .heading {
            font-size: 1.3rem;
          }
          & > .items {
            border-radius: $half-padding;
            padding: $padding * 2;
            background-color: #ddd;
            .item {
              position: relative;
              padding-left: 4rem;
              padding-top: $half-padding;
              padding-bottom: $padding;
              margin-bottom: $half-padding;
              min-height: 2.5rem;
              border-bottom: 2px solid white;
              input[type="checkbox"] {
                position: absolute;
                top: 50%;
                left: 0;
                margin-top: 2px;
                transform: translate3d(0, -100%, 0) scale(2);
                transform-origin: center;
              }
              input[type="text"] {
                margin-left: $half-padding;
                &:focus::placeholder {
                  color: black;
                }
              }
            }
          }
        }
      }
    }
  }
  .logo {
    margin: $padding;
    padding-top: 4.5%;
    max-width: 10vw;
    background: no-repeat center;
    background-size: contain;
  }
  .logo-bg {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAADTCAYAAAB3COGwAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAABcRgAAXEYBFJRDQQAAAAd0SU1FB+UFHAYBJQ7g3nIAACAASURBVHja7Z13eFRV+sc/NwkQejGhikgEK1hBVnABQV3Fjq6ra2UtKOiu/hBRsXex4SrYe3ctWFGBEEURK9gFNHQsoUoLJTm/P95zkzuTKXdaMjN5P88zD2Hmzr13zj3nfM97znve1yEaEwfCiBL37zZAR2AgcCCwG9AeaAIYFEVJFpXAWmAR8BUwHfgGWM6Iks012maKKC4sYlBZqft3O2PYwXE4BDgA6G6g0DGmIY6j7V9REsMYY9Y6jrMImA0UG5jjwPJBZaVbAIoLujJoxYKwJ3DCfjJhoHw6ogQmDuyE4TYc+gE7Vl8+4hkURUlKM7ftzLAeh7nAk4wouTeVol5cWATAoLJSiguLehm41oF9gQ76QBQlpe3c6qoBnPXATwYeH1xWOhFgWkFXBocRdSeiVT5xYGMM1wBj7NEq4YqSHo1/NQ7HAB8zoqQyqWJeUMSgFaUUF3ZtjnHuMw6nOzqEV5S61voyA0djzKzBKxYEzJ655EQQ84OA74ExOCrmipJW7duhNfAh8CITBzatartJsMxFzItOAOdnqsUcbf+KUjc4YMAUOvAxjvNkcWFRbrCYBzbQCbYzGFkCEweeCTxO9bq4NmRFST9ZNzg4wA9Ab0aUbExkCr64sCuDyhZQXNj1MnBuUYtcUdLUWDfMMg4HDy4r3eC11J0Qlvl5wP3amBUlgxq4OM8NYETJorgtc1kvvwy4RQfzipL2ov6VccygwWUL1gZa6NVifhzwagQx9y7bu/9X71ZFSR2O5xWtiX8G9GNEybZYLHWPmP8deClS+zfgOIHtXtu/oiRXrR1HZtkdYxwcJ3yLN5hijHPY4BWlWwHyAGn4Ewa2wfBAhLVy9/21wPPAZOBLRpQs00egKClg4sBGwC7AX4GhwCDbEt2pdq/sG2B/YAIwPA4LfXfgBQPGCdH+jci54zjOYuBZYCqYrweVLVipD0pRkkNxYVFDB3YG+mOcoTgMDtJf70DfODiDcBgJjC8uLMJhwkB33fxV4Lgwo3PXxH8bh5OBdTVG/7WwJ1ZR6omQE7J9QT9gCobGIYbc3nZ7NCNK3vTVgViP9mkFRW84DkdVG+Ehz32jMeZqwARvmwnlcasoim8hr9F+igu7OuD8FZiGMXnhTHVLt0Flpb+4U+4HYpgRxjo3SJCLyxlRcrsWvaLUochPHNgCeB/oE9JSl/Y6CxgAbI00yHY7kWkFRb0dma4PRzmYMweVLXhRhVtRaodpBUUMlsF2C8dhqsH0dnBCzqAbw3tgDneYMNDBoRiJ/hZ8sPv/S6vEXC1xRakbqmfTwDAPh+4hjnJlfg9GlPzg0zr4BSgKYZ0bYJuBQwaXlX6gD0BR6sZyLy4saoRhCQ6FYXR6A9AjB4dOwF4RxPz9AMtcxVxR6gZXzEeUgENfDH9S0ynNtdmvqxqAR+owCor2ETGnhpgbcAw8Oris9AM3cpyiKLWHFXMGlZVuxmFvYIu4uQS2eQPNMGZIjhXz1jXMeIMDrAdO8NMxKLXG5UhM7xeAploc9YwRVaK+AodHCO/9foK/Abj5G6H9ZhwHNgwuKz3f7VgURalTUV8OTMSEyJsgk2tn5QCHhzyLNO+XrKirZZ4ezABuBnoC/wDWANtpsdRDURfujnjcxIGDI1rnhUU5Bme/CIOCsQDTCrtqmStKHYu62NnmSfF1MyZw9O0YYL8c4C/hhu5AMSNKdJ9penAukuHOu/83z1rsqWAAkuGrxA4elHRiwkAYUbIUma0JR+8oZ8lxHHYK08C3Am8BDC5boOWtKGnA4LIFc4C1xtSYUZcGDXQL891KDN9pEaYN7dzBmOdfA+wB5Cb5Wt2A9xBHyQHI9P4V+gjSiJElbkN+K+xwXNbGIwo60DaMef4bEnNCUZQ0wOPHUlxzgUzeyQFahD2Dw+9ajGnDvJBPCApxAwQlj7uARkHv3QTk62NIMySdauiaYWgV9dvQLMxn64HNWsCKkh5U+7GYeY4JP0J3Iozwt2kxpg2/hHm/bZIFfW/gKAK9p92/d9HHkHaEa6MGh8Y+vt8gVPRWI7EndLlNUdIMg7MhXJCZvIhjdyUZdKPage1hYEuCgh7skdyW5E25O8D4EDXA/Xu+Ps4Mst19C7I2dkXJsLYdo6AryeCfSNxrl4utlVsRx7lWh3mYjYDGwJ9JuN89Ce8k+SywUR+poihKepKjRZAyOlOdhtZ97YTkri5I0EoPpmeS7vkGaq6du6F/J+gjVRRFUUGvj3Sl2uHQTX9pkEw60+M85zcRLOtE2QdZOw/GAT6xL0VRFEUFvd6xkZoOS66o9wA+h6heyMHMCfP+Xkm43wcjfHaSPk5FURQV9PrKV1a0g52T3P/3At5OEwu9jz1HKCeqx4Cl+jgVRVFU0OsrlUj+6o8iiHpfoBho4vOcX6dI0Mcga+fByXm2oGvniqIoKugKBhhiLetwon4Q8LrP860IYUUb+xzjfZb7AseFeN8BPrMzDYqiKIoKer1nHRJT+9swog5wMPA/H+fajEzju0Lu7kn/0c4IxMMjET47WR+foiiKCrpSzRYkJvp3hA74YZB0l0f6OM+FnsGAAywEBsd5X/lU5cKuwQPo2rmiKIoKulKD1cABwDLCR/Eq8nGez5DIcP8ChiLb436N857Kgd+D7scAm4B7U1gWBcj2vbZaLZR6TCFwLPCm7R/cWbelyMzZgfj3r1EUFfRaZj2yZv1DGFGf6vM8lcDjwGtJuKdjPBa/O4X/jr3HVHAlsv3uW8S34EStFko95N/AbNuGjyRwC2sn4CxgBvCpFXZFUUFPQ/4A/gaUEZgK9YYUimgkfrJW/gxgORJv/oQUXKcz8IX9nR2BhtZCfxFor9VCqUc8Bdxj20E09rBt869abEo0NJZ73bAU2A2ZMt8O+Ng22rpiIdA/hef/L3Au1WFlg+PR/x9wqVYLpR5wLXAaNZMshcM95kPEV6ZYi1BRQU8/VlprOFtxkEQvU4m+DthYq4NSD+gMXBNmUBsNA9yBxK4oz0Idykd28WzVahI/OuWupIIuwHPATCvmJor1cZ8WmVIPeMUjzvEMkPdBfHCyTYPuQ5xzZwD/ARpoVVFBV9KDvwPzkPjvJoI1YhAnwQOBuVpsSpazI9XhlRNJQH9RLWjC3sjs4VfAW8junFTREDgUmaXbHxiPBNA6QquMCrpSd+yHTK+/ZBtpKCH3WiYPAt0Q/wFFyXZ2R6aWnQTPc1SKdOAQ4E7ESXY2cLadETgCmWk7P0XlshVJC+0tlxZ2IFFs+xVFBV2pRa5HPNgHU72XNpRF7tjRd0/bQfyuRafUEwqTIOYga83JoiPibb8GmIw4p3YPMfgGmIjEj0g2FcAw4DdP+bh9yEG2X7lCq48KulLN3xBP80+BxcB824AvAXZJ8Nz72gbnnV4P1XFtAm60Hdt3+kgU7WtjxiThHL2RZExfIEGu/g00R4JVeQnVhs9IUdksBTogQXamePoQV9hvQrI+qvNsFNTLPbvpikxbdQ7RYLsBh1nreqIV93jYPcS5g63yD5Ateqv0kSj1lLIkCLJjB8bxcJkV79YJWPktU1xGryMppXsD79mBhltmw5A19gOQ/BiKWuj1igORQDU7RnnO+cAo4MkIwhyJlUHWg3fK/VfgAmCgirlSz/kWifCYqKi/7fO4FsgS2NP2mrdYK7hRAtd+I47v7ADcigSU6ufDiNwGfGLv/5kgS30PK/SqWyro9Ypu1irOJ7pXrdtgTreNP1ZmIuvi3tCxDuIl2wPNp64oAIuozriYCLdG+TwP2a8+F3gfODVowB3P/neQwE9fxHG/ryBT/FcC04DvgeN9fvc0JOOjdwr+AMRhT1FBrxfkAi/bZxtLNCqDxFX/S4zXW2sb2RxkTW424sxyLpJwQlEU4fQ4v+eK6pdWEEPRDhiNBGcZZf/vBLXxWK+HbdMXA7fHee+9PH83QpIyvYz40Qz0oUEvINvaNnl+w59alVTQ6wv7WMs41v2ujh0M3BnHNX9GtpfsZwcEJfoYFKUG3yMOXsGi6Zd/EzpK3C3W+h8XNJCP1xp37IzCSbY/GZ/Ab94c5jp7INtcZyIzipGYYgcGd9tB0QtalVTQ05V8O5punqTzHW+FOZ6pPYOEluwQx3crkcQzW/SRKkpYrrYDXsdne3T5hxU/l1wk/8IKxOGtIE5r3Mt6JAPiMYjvzYv2/Ikw3vNbgqf9c4A+yK6b84gcIe4HZFvd01qFVNDTlb8h4Q6/QbaUnZOEcw5O4LtuQztJH42ipIRK20YvDyPcwe1xJTAICdjk0gnZdvoBktwpnuhz3mt+iaxL9wb2Ij7nt3BcBzxK4Dq49/e5/78fSUDTVquICnom0hd4F5lKagvsCjyEhE5NhC5JuLce+ngUJaWifqsV5rcQP5SNyOzWZmsp/4EkcimgegnLQRzFliKR3WK1yL1iuhFxmuth+6BHSU0I5k12sNAJ8VAvD7ofbzCZvyDBpgZoFYkP3Yded+U+JahSuxX7JSTYy7w4z52MbEX5aVZeObYTVJRsYjkSyrUlEjOiBRI5rSxE+2+HTDcfEkIM/eIgjqq3Aa8l0MfE+1sPQ9JGnw9cSM2dMe7fU4GxiE+AohZ62vNXqlOKhmqUiVTkn5Jwfz+nQRk5toN70XZyBrhLq46ShaxFdol8iOQ2CBba/lYQDyH+7WcbkK1nbaygz6uj3/oj4ty3fYh7cH9Trr3H8Vo1VNAzgWYRPjNIVqbWcZ779QTuy+0sXq3DsmmAOPa9YK2JEz2fXYystTlahZR6ws3IWnks21BD8SLxbz1LBcuQZcYxVM8qegcrBkmlerdWARX0dOfPKJZpB8TZJR7es+ePN+fyz8DXtVweudb6+B+yfvg/K+Q5Qb/DWLFvpVVIqQd98xTEg50ExdwA/0KccNMJYwcZvRDfASfEDMRF9t4VH+gaet3wW5TP8+3oNZ6p73mIl+qpMXYCbkM6L0W/uRXixV9kBbwZ0B7ZHtM1yiDD+3dzrbdKlrMjMtO2Z5h2EM9AHcQzvghYmGa/9xsk89vbiGNccL81DEnOoqigpyU/+xh1/xvxgI2H05BEBjvHIOYOEjt5Wgp+bwNkr2mBj3uINuD4yVrxipKNtEDW0jsnaJVHauMHkRzn2XAcigSkmQtM8vmdVUj+iVnWYvf+9k1aLfyhU+51Q4UdJTsRGt8hSEjVeNkP+MinVe4gGddOS9HvHWbF3Pi0xL33573HD4B/agNX0oDdkDjj+yfxnC2Br6yYJ2qVh2pfBkmQckwKyqMT4nS3Gln2uxXxpP8V8eT32y/2Rtb7XZYhAWUUFfS05okgUQ3FK7ahxMN6JCDFWbahhGvk822nNDKFv7VTHNaGdzvLFGS/7CGIl6yi1CUDkahtzyEBofZOwjnzrJDtRHLynkcaNL9Ecrem3mHb5W0E+rcYZFltEnBvDOc7xX5vVyQ983da5VTQ0517I4zC3fc6INPzJxI+NGy+HdkXWiu4NdUhFLcia0951rJ9CFlHe92OoA9ApuU/T/Fv/ZmaUaJCzRS4bEN8AR4BuiNTeN/b9xWlLilAnDZbeept7ySc9zDEaS2Z0+yRBsr/S/A8bYAzkC13owi9c8fx/HsB8CDV23WjWep/IFP2moglxlGhUjessiPXY6M0vnw7cl+G5AlejEzJ7WhFvqF9jnmexrAZicH8HpLnfAHwvH3VBU8DlxDo5BPc8A0SUOJ/QLFt0Ou0mihpZgB9QvXykStYyUgW8nKEAX6yrXQDHI44oM2K4xyXIN7nnYIGCdFmBs5FYrcfhGZiVEHPQu6mej0rkqUO4gV6Qgyj8G62wV6DbEO7BnG2qauGtBcSIeovyBr4WiRYxs9IytXlWh2UNOda2668M0pHJ2HgeSOSWjTV1rm3X8m1g/1dfH6nBRLg5glqbql1YuwHfkAc4H7RKqWCnk18CDxghc7vKNdvgw1uRJOQGNDPAldSN9PX99uXomQaXYCrgtrYQ8CbYY4/APFNeR6ZbYoklCfVoph7B/07299wbpRjz0d23ezq0yKPdt32iPPfqRHKT4kDXUOve0YgjjWR1piTRSckMlOptfiTSXNkKrKlPlIlC5keJGbLgOFhjh2DOM2NR2agIjmg7YbsDa/t6Iduf3M6kigqmKbIuv4fyA6YXeM0LsIZGy2QeBkaNEYFPes4HEmjWlvrZ52Rafidk3DOTsga+aeIp+scJFylomQL5yLBj9wB9xZkB0kojkYcTl3xb45sbwvHv6i7UMYOMtX/TND7f0V8BSYjzrapMDTcLamP2lkCRQU9a1iNrE9djyRRCK74yW7EIOtgT9kGHS+HINP4p9oRfAEyNXk5qdvTrii1SUNkFs0bD+FpQic3yUfyfweHL10ZZbDgVwBT0R8YO1iZaf9/FLIU2DNJFnmkfsg1MM6xBkFDrW4q6NnENbYh/QcJouK1qlPRoPrYDigeTkHyKbudghPU+G/Qx6lkAYciPiheUbsqzLH9kD3p3mNXICFNQ3GMT5F221d5CsTV7V8OoDpsdCoGDtGuvz/wJfHH3VBU0NOSBcB/keAVOXYEn6opOYOs9x0S4/f2JHCazglx3hb2pSiZzBNB9fxOJPpZKO4LagMGCbYSLrDTCB8WsCvmM5FZsPUpEFz3+t2TZJVX2pffWQVX1HsAS4B9tdqpoGcjBtmTnerR8QP4C/gAsm1nVoSG6nZAa9CgEEpmcySyNOXW883I1rVQHG4F1zvdvhEJjhSKVnZgbHyI+Xw76F4EDLaink4phL0hmqfamYd+wD0xDA4cz+/9CAmEpaigZx1ltXCNIgLjJ0fiVaAx4beuuO8N1UenZDhnBNXpN6np4+JyVZAwYa3zNWGO390OFpwoYu464G2073+GOK1tDBLSusRdD7/UDjzesoP+i4G/2xkK4/M82P7lWeAmrYIq6NnGn7XQGI21Rh6N0MG0RNb1e4YRc68H8AmIt7uiZCotkJCuXtF8LYww7WgF2mudbyKyH8kZVIdoDifmPyI7UpYGfT4H8X/5mtrZ7hrJMgdx+jscyW0ezMvA8YgvATHcqwGusFZ+rlZHFfRsYmUtifq/bCeyX9DnPW3n0T+KZb4F2ANJKqMomd43NvFYn7OQZCyhGGgHvN528WCEc+cS3bt9GxLbPVxQmu8QR7aH6kjU3X7ge2SG790Ix75u+5QlMdyrW5b/RqbgG2mVVEHPFubVwjXchrYL8AUSOKMYCc/4DbIdjQiW+Txk+8vP+riULGANstvkVSR9Z6RUxsGZCrdaEQvHtVGsVQfJYLYkyj2WI8FthtRiu/POQjyP5D33M4u4xPYhL3v6EOPzen9B9sV31Gqpgp4NzK2l6wTHjj/Ijr6j5TH/FvFM1XjsSjbxPDJdfHeEY1oDvYIEaL0dFIdjWJjBsVfkYgmRPBnZWhdtoJAsq3wzslZ+ih28xPL9v9syDff7wxka+wAlSKwLRQU9o/mpjq8fqeOZiUynbdDHpNRDzgjRVj6hentZMO0JnWo0uK0tjvE+NiExJQ6J47uxzFo8hfgXTE1g4PCqLQe/md682+pO1Sqngp7pzE/RaDve0bw7Un8R8cDdqo9IqaeECuv6aITjmxHdyasigfuZagfYk5Jora9CIj/ubAcwW5Jwzt+BAcCZIfqkSOyoVU4FPdNJ9hq6K8gLYmxM3mMeQ7JEbU6TMspHnIgUpbZogXihmxAWaDga++h3KxO8r5XAcYhXfjL2q7dBEs1cikztFyZJO7YgKVy7ISlV/aytz9dqp4Ke6aTKy/1A4AL7d7SG790X+w/grDQqn/7I9N27hM6A1UqrkJICtrcWt7ftlEb5Tp6PtrY2Sfc31DNbkIilbpA986ORLXNzkC2sNyLZ4hLlFyTIzlmevsiEmbn4WqudCnqms43k7Ud3hfkNxIltom34q6I0+q2Io08X4H9pUi6NkMxWH1AddWs8sj6HtZ6+sverdV1JNh2RNKNePovynXVEn1JPZjCp4VYwE9naFjwA6YBEghtrLeuliKNfqwRmBCqQWb+miF9OqHtdiDjgKhFGi0r6s9UKejJiozu28Xgt2deojkA1EPEo7YBMp5dawXyfyJ67tc1pSHa6HYM6nXz7/hokVrbb4Q5BIlgpSrLYKcRA8YMo31ljB+iRWJbEe6xAgtB8D7RL0jmdIAOhkxXjO5HtercS/86cjXawcBQS7Gon2//NQRzy1mq1U0HPBgt9XRKt8ycRp5TgTuQF+0pnmiHZq/qHGsV36NDBlJSUnNO/f39+//137+dvIuuX5VqdlCTRJoRl/W6U72wi+hr5L0m+z5XIMtl7yKyWIXmx4L3naYU4uZ1pBfhMJIZFPDMDb9qXEgM6DZk5gr4+iee7mfSIAR1vB9Il+M1GjRpxxx13sGzZMmfnnXemuLjY29nEs7dXUaLxHtUe398je6wXRvnO5qA6GYofU3CvHyCZFVPdNt3ftrcV9TdQHxYVdCXpuKPysSmwAGqTdUjc6KoOZODAgaxevZpRo0bhONKn7Lbbbpx33nnejsYgW266p9FvOR6ZUlQyk6+QWZ8WSOrPD3x8ZxuyjOVE+DxVkSHvAa4h9aFivec/Es3roIKuBPBvJFFEoo3sB2udZzo/Ajd269aNJ598kunTp9O4cWOMqe6jHMfhuuuuo1mzZt7f7yDT9ammBZIpqm+Yz/sCHyJhMK8O8Zz6a5XPGCqJfTns3DADbpBp+49SeL83II6wqU6/6rXWuwCjtKqooCvwOJKGMVHrvCKEeGQsTZs2bfHWW29x+umnB4h41Q82hrZt2/Luu+8Gl0N3YFwKb62vnQG5wop6g6BO7glgBuKACHA64ojoDgQ+R0Jc7q5VP2uZTc2ANG7+9ANIjr9MpL5gJHB2iMFEKoX9WH3sKuj1me7AFMSxJNE9pA4SkCEbsqAdCpRu2LDh3+eee27YcnEcB2MM/fr146yzzvJ2LgY4B9ghyffV1Yr1x0i8aWOF2s0Lf4R9BmeEsI5eLSgoGIV48O5nP7/bc1w3xMNXrZzs4QVkD/c1SCKWs5G15kW1dP1HkVm/l6npIJsKgW+JLE8oKuj1jpOQLWIHkzyP1BOzoFyGI45IXQHz4YcfOrfffjvRRP3WW2+lUaNGXlFvBTwQw3V7A08TflfIJYg37xlU5892n9nTzZs3n4Js59kp+HkWFRWZuXPntj7ttNPu8HSmxg5cBgIXA18i2/TusOKuZAc/IVssR1uBre0Qyl8gjny7IFvFng+yqpNJruqNCnp9ozWypex5qvecJ9q4HCRQQzYEZHiQ6jSRDsCtt97K8uXLA9bPg0W9oKCAl156KdgCORz4Z5TrdQDuQvbon0r1NLlLD2R6/Haq97u7a/UceeSRrF27Nu+WW2452NPWHICGDRsyatQofvnlF2fnnXfm+uuvp2XLllXf79atm7n++uuL7fW98QdeIXoscKV+sx2ylHMHcKGtp5H40/YR/7T1b3fgPGRv+QdI7vXlhA7z7NearyDxkLaKCnrGsD/i7HW6x0pLFu2yqJxGWkvGAKxatYprrrmmyhoPhTGGo48+mvPPP5+gQdI4JC51KM5C1jov9rz3tue7j1gLZ0Cw1d2+fXtmzZrFpEmTaNGihXP22WfTuXPngIHZli1buO6666rur1mzZrzzzjsA3HzzzcyePZurrrqKsWPHmqDOc0/gBG0uSgSj4DtrGIwC/otkf5uO/x0eP9rB81nILNFfkGBTu9m/L6J6v71fg2MzmsRJBb2eMBz4FGjrEYdkTXsZZKr3uCwpq/cRD/GqrTGPPPIIM2bMCHCKC7bSjTFceeWVFBQEpFPuBPwn6PAdbWf1SNBAyACNi4qKpjuO85vt7Bp6O7X8/HxOP/10li9fTp8+fcjJkebVqFEj/ve/mtFyDznkkIBBR9++fSkrK+Pyyy+nadOmjjGGiy66yOnYsWPwQORRz7UVxcvfkNDH3oFgUyvM85A1854x9v0bgD+QZE6fItvfDkd8RX7weY6tRI+Qp6igZzyvUr2em0whDxaBiQR6XGcyRyIewVVlddppp7F27dqIU+8dO3bk4YcfDv5oLOKIBjK9/a3tFANmSRo0aOA888wzpqSkZECHDh3aBVvl/fv359NPP+XJJ5+sGkC4AwxjDH369OGyyy4LuPCsWbN44403cByn6lh3wOG+V1BQwKOPPho8QGuKBOxQlGAmITslvNvGHE99Pp7qnRQDErzWSgK95SMZFVv00aigZzONgXes5VwbUdvaAqdkSdmVA//ydBYsWrSIRx55JOrU+7HHHsvJJ58cyuqfj0yvB6yF5+Tk0LdvX37//XdOOeUUp3Pnztx7770ED7x69erFnnvuWXVt72yBe08XX3wxnTp1CrifCy+8MOz9usccdthhnHbaad4BmkHy0A8EDMZoa1K8bWN/ZHfMUkKvWzdC/EFKkCyFeyUw4/OJT6Nikz4aFfRsJR8oJijiWS0868uyqAxfsdZ0VdldcsklLFmyJOrU+7hx42jRooXXemiDeI8HWN3bb789b775Jh9//DGtW7fGGIMxhqFDhwbsfwcYP348n376afgezXFo27YtN98cGNdn8eLFnHnmmRG/53rqt27d2ttBNgD+S8uGm7U5KSFw84wfhzh1OtSMEGeQxC1zgGlIOuV48LM2vl4fiQp6NpILvIg4l5gEGlCs3zXI9pRzs6QctyHThwG469KRpt633357rr76akIMpqo80M8991yWLFnCkCFDAqxuV2Bvu+02Cgur/ekqKysZO3Zs2MGEe0+nn356wNo5wLPPPstHH30U9r7d5YKgKXsD9OTer2+igTZjJSSbkQQnfZAZnUWET916IBLwKJ7+rIGP/kgHniroWclo4Ghi21/ubSwfIUFKngvxWSTca92NeMJmA/ORiGxVzJ07l6effjri1DvAqFGjOPjgg2sI58EHH0xJSQkPPvhglcAGi7Tjey4J7AAAIABJREFUOLRv355LLrkk4P1p06bxwAMPRBRmgIcfftg7Q0BFRQVjxkTPm3HppZfSv39/7/M0fPbHrixcp9PuSjSmIw6fxwKTA+pQIPkxnne3EAPjUGzQR6CCnm30AG4hvmAxC+wo+69IBLlTkfWrWM/TmJqe3ZnM/VQnmzEA//nPf6oENNJ6+kMPPeSN9Y7jOJx//vkccMABIdfCQwnsrrvuGvDeiBEjWLx4ccTvdenShXPPDZwomTlzJg899FDE7wE89dRTNGnSpFrUKw28Uepo06rXyPKL1P/5wCERjn0bGALsjHioV1qrfTMSvCjW9MKdfB6ngq6CnnVlfZPP0azX8v4EifJWZEfZXvoiHqux4CB7uRtlSbmusbMeVaxevZoTTjghoiA7jkPXrl0ZPnx41XuVlZWMGjUqpFUeakAA8MYbb5Cfnx/w/hVXXBHWSne5/fbbKSoqCnjvvPPOY8GCBRGvGWowwHer4KsyyMtBLfV6ySAkgAzIuvn7SCa4cyK08/nAHsgyXB9kC9ozcVy7hc/jyvUxqaBnE22QxAt+elzXgr/MivbLEY49wzaWWHryAhJP+JJOvIZE16tS4ddee43JkydH/eIdd9xB27Ztq/6/cOHCqtjvkQTZtf67d+9ew0Hu2WefZfbs2WFnCNz33EAywYOBysrKsNcEuPvuu70OcsLjP8DqcnDUWK+HfIXsE/caAvsgwWF+tX1EOH5BQgvH67TmV0NU0FXQs4r2SFSyaD2uQaa/jvIpuj8iU+ix5Dg29jtFWVS+FyD7Yo1rbUezlL3C6gaBAXj88ceZOXNmVCvd/Xz8+PE1BHbw4MGUl5eHPEekwUBZWRkVFRVRZwamTJkSeO5KYFKpe5C2tvpFme1fLiAw97iD+Ms8geRgP5/k+8/4dXZbq49JBT2b8Bt20UEigb0Vw7kfAp4l9vX0q6mdLXO1wSrgTu/AZs6cOdxwww1hLWX3/X333Zdjjjkm4LPLLrusaptaxJGRMTRu3Jj3338/4P3Vq1dz+eWXR/S2z8nJ4f7775eGmJPDa6+9xvvvv09eXl7UmYF99tmHE08MyrfzyW/w+0bIUSu9HmKACcge9P7AEs/7BkloNAHZntYiidf1K9S6hq6CnlXEEinp9jjOfxmw2tOIow0aDJJpKZvivN9iZyyqFO3qq6/mp59+iriW7jgOEyZMIDe3OufJjBkzeOKJJ6J6y3sHBe66vcsDDzzAvHnzIg4GmjRpQnFxMQsXLuTYY48NiBoX6Zo5OTncc8893ixywvg5UKkWej1mG7L9bAckL8QXnvbgZhrMS/LsgN8Bt6KCnjX8EsOx8eREXgoMi+F4B2iCJCjJJg4jaJ/+qFGjqKioiDj13qFDB5566qmA98855xwWLFjgW2DvuuuugPfLy8tZtGhR1MHAQQcdROfOnX0543nvuV27drzySlCK+7Vb4PUF2toUkJS/ByLr6eOBG5A0qckU1999HrdaH4cKejaxBv/hD/PjvMbryPYVv+vpBtmq0jWLynkxEhu/qgzeeecdpk2bFnXq/cQTT6R3795V71dUVHDJJZf4nnrv3LkzEyZMACS2+6JFizj00EOjWvih/o46GrP3PGTIEA499NDADz9cBms0jocCyMzgHCSs8dWIk1wyKfP0JZH4Qx+FCno2sdFa0X7YLoHrXEJgcgY/XJ5lZT2aoOQtRx11FH/++WfEqfe8vLyqlKYur776Kp988onvqffzzz+fWbNmMX36dHbYYYeYrO5Ycafnb789aIWmvAIe/h6aN9BWp9QGm330N79qMamgZxPrgYU+j03EYt5KiJCo4TTBjqz3QwLOZFMHMyTATNmyhZEjR0a0to0xHH744TVCsx566KFUVFT4mnp3HIc+ffpUHeukeBuZMYY999yzRiY3FvwJj/+o7VupDfys8egaugp6VlGJ5BL2w24JXmtJLIYe0JLsCTTj8gHwkveN5557jh9++CGqtf3iiy/SvHnzqv9v2LCBCy+8sEpA/VrPtYF7nZtuuok999wz8MPipXsCzbXpKSkmms+PJmZRQc9K3K1o0VRhvwSvE0sCFoNsKdmaheV9JdW7C0xlZSVHHHFEWMF132vVqhUXX3xxwGePP/54lYOcScN93jk5Odx0000B++mBzsi6qaKkkt+ifP6tFpEKejbyKeIYF8182z2Ba7QkKGFJFDF3kLzI2bhP1M1xXm1KLFpUFXAmktU7atQoGjeuXoUoLy/n+OOPr1XrO1aOPPJIhgwZEvz2JUjedEVJFSuifP6dFpEKerbyqI9j2hJ/8IdTgS4+j3WAdWRXspZgJgIfewdR999/f9V2snChWVu0aMGjjwY+qtmzZ9fYmpZuvPnmmwEDETtoexDZoqgoqeCDKJ/P1CJSQc9WJvg4ph0SACJWOgD3xmCdrwV614Myv5TqiFmsWbOGkSNHRrTQjTGcfPLJDBgwoOr90aNHc9JJJ6Xtj3QHJ/fcc0/wRzsTOZ63oiTCFGC5t415+ph1wDtaRCro2coiogeZaYUkUImVN/C/Xc0BhgNz60GZzyQoecvbb7/NU089FXEbG8DNN99M165dmT9/PuPGjaNjx45p+yPdez777LPp0qWL9zm7MxWttPkpKaAciUrnBPU/DnAVugddBT3LK/8sH8cNivG8RyERofx6bF0KvFiPyv0UguIAjB49mpUrV0Z0cuvbty+lpaV069YtLZ3hwgn722+/jaculAL/QIIbKUoqmAZ0BMYgs4Q3Ab2Ae7RoVNCzGQO87eO4w2I878NAbhQL3e3gHwHuqIdlPxKocMvhjz/+4I477vDluZ7KADFJr2DGsMcee3DV1Vc59jnvRNAWPkVJAb8ioaT/jeww+VKLRAW9PjDJxzEHxSjm7aJY565H+2wrbPUxg8cbyE6DqrCwt956K3PmzPGdKjXdhRygvHIr97zwMHc+MXENEgpYURQVdCVFbAJejSK+OUjGpGgcgKxfmSjWuYPEOe9LbJnfso3DPOUBwNChQykvL8+YKfVIg44vf/2Jnfv05KJ/nsvGxStbEVsaXkVRVNCVOLghiviCZEqKxi1Awwhi7qrUZiRdank9r+frgPO9ZbNgwQJfqVIzgcdum8DSL+e5T90AewKjtLkpigq6kjq+IXps92hbyv4DDPB5vaHAZ/WwnO+iZorYJ5CgM1WDoJEjR7Jhw4aMWScPx4S772WvvfbyDgwN4qjUXpucoqigK6mhEtm/GYkeET7rjOQ49rNufg31by/o3sBPSKS4fxO4fLEVeDPgYVRWVqUhzWQr3WC48847vSFgHaAQuE6bnKKooCupY5oV9nC0i/DZDVH7dunMp/s4NpvIRbbjfQbsYt9rAEy1f/cGvgL+L3gwNHPmTF599dWMt9IHDx5cFbPew7nAkdrkFEUFXUkNxVbQTRhBzgvzvd2ojvzlRBDzhch+9vrg0Z6L7MXfCpwYVHamcePG3bt06fKZFfo9CeNEOHr0aCoqKjLWUncHI6+//jr5+fnBdeJhNPuaoqigKymhDNlGFkqUHSQ0ayimejrpcGwADq0n5bgHMtvhRsoLEOt+/fo5H374oZkyZUrvRo0aEWEgRGlpKeecc05GF4a7Z/6xxx4L/qg9cKE2O0VRQVdSw7lBVpRXpB8PcfxoJCJTpG1qDnAa4viVzeRZgfoOcQ40XrFu2LAhd999Nx999BG9evVyunfvzpgxY6q+3KlTJ+bPn0///v0DTvr4448zY8aMjJ16d731TzzxRHr06BE8gLkJSf5TVeOMtkFFySpB1zZdd8yhOsWnNxbybcBDQcc2RLaehRNz9zn+H/BalpfbdsBHBAZOqSqTM888k7lz53LRRRdhjKmaPr/uuus47LDDuPXWW5k3bx7dunXjmWeeoUWLwOR2l19+eZW1m6minpuby6RJk0LVj2lAI1uLjKNtUFEyp21HaLI5QCUmrKXXTIuvVhiPrAH3RZy2HOCyEMc1QDJnRVo3f8+eL9tZiYSaDBiQ5ufnU1JSwuOPP16VoMRxnCpr2xjD5MmTGTNmTFWa0c6dOzN8+PCAk3/88cdVe9MzFWMMO+20E7fffjtBg8BGQGv7v/JQ43lH6lquNk1FSbeG7RRGEvTlYeTcwV+kMiU5VAKfAF9EOS437MANvgeOpv7MuJwErPYOcLbbbjv22WefsLHXve95/x43bpw3QxkAw4YNY+HChZk7krdT78OHD2eXXXZxkOQsI+yg8Dc7mF8bZuWmDdC4uLBIW6aipAHFhV3dnn7/SIL+XQSB6K3FmFZsRfZWmxDW+UrgYOpXWNfNSBaxKpYtW8Ztt90WU9Q397ipU6fW+Mz1es/EqXdjb7p58+Ybunbt+j3QGrg/YBDpsCT0lykA02FQWam2OkVJAwaVLaC4sKihgf2CFcCAwRhyMEyPIOjHAjBxoJZmerAFuILqqeYqHQNOsFZXfWM68IFnYMPNN9/Mzz//7FvU3eN22mknhg0bFvDZyy+/zKxZszIuLKwxxjiOs3nKlCk/t2/fftm77767BxJgyEuFMeansK0f5zKxDNRKV5S0aNdwlAM5wZNqDjg4znqHiQP3QhyzwtGXESWfMGEgjCzREk0PmgLdgB2BFfb5bajH5dHRDmqq6NSpE0uXLo35RGvXrqVVq1YB7+Xn57Nx48aMW0+/5pprll5//fXtkPVwkG2QvfHsfiguLDodCYUb5seZnoPKFnynTU5R6o5phV2xvnBTHYfBYQ57IQdYBCwg1LqrvPMeEwZux8gSmKCWepqwAfgaeB34uJ6LOcByJK599ZTFsmXcc889rrXq16qlZcuWvPzyywHvl5eXc8EFF8R0rnSw0P/+979vn5+f38Dzdkvg+qBD3yRCtEKD81xxYVHD4sIitdQVpY4YXLYA4CzHYXCEnaaP5jCiZA2GySFH6A4GaI7D665dr9PvSpryMOIPUlXZr7zySrZs2eL1cDdewatR3e20+tChQ2uETn344YdZvHhxJlnpTo8ePTj//POD3z8JWZ4BYFBZ6WrgMVscNXwzHOhpMI/pWrqi1D7uIHpaYdFJjsODhBRqDLDIYL7KsUI9BqgI1SnYw/sxceCXGHZgRIl8osKupBebgEu99X39+vUcd9xxVULlOM7m6dOn/3jvvfeudRzHcTXdq/OusN9www3k5lZvKNi6dWuNrW1preZ24HHXXXexww47BDf+xwDvusIFjuNsDtFXOCLqzinFhUVvgGmj1UxRak/IDeQUFxb93YFnqI4b4wS0Z9l2/uzgsgWrcpg4EEaUrMdwcvjeAQPsi8O3TBw4jokDc6uEXVHSh8kEenHzzjvv8PLLLzvbtm37ulevXosGDRpUNHbs2JbLly83rqHuOA5Tp06d520o++yzD9dee23VeQ455JCqKfxMwR2oPP/88+TlBaQFaI6kVOWAhk0YVFa6xUg2NhNiTcHBYICjwPmhuLBIQ8cqSgqYVlC9pDWorJRpBUV7O+Lw+xKyXTl0iHCHxYPKSsdWK71Y23nIetphRIpEZnDsJy9hmITD99SvrVJKulJpYFV5Q276YgabK6pCvzXq3PrXzUtWtwSauHV76NChvPLKK/y68o9tYy6+5JOnn366z+jRoxuMGzfOccXQcRwOPPBAzjrrrBre75nGEUccwTvv1Mig2xVYOKWgK7kOuRjnR4Pp7kCoTfzesLqbxMo3k4FSg6PR5hQlObQG+gHDjDG7R1niMwazFePsMXhF6c/UEO2JA1sg65Cd/ZsBISYBFKVuTFJwHJix3PD8PIemDeC0XaDndoZn5jp88lvAQPX480/l/UnvVK77dVUOQF5eHp9//jl77bWXVGnHoaKigtzc3CrDNUMjx5l169bRrl07Z9OmTd4WWwp0xzrFFRcWbYc4W3aK0uKdcIF7FEVJoKHahmm7skj5Olzj+rxBZaUPFhcWMais1JOcRabe/8SwC+L17p4/sluvo2KupAmuwAza3uGvHeGWA2DPAqmlw3aDZg3kgPxcOGUXXunyC+tWrq1qA9u2bePKK68MCBXrrqN738uoIY4diDRu3HjzEUcc8Z2nxRproXun0FcCfzPGrHTdC8K0eBVzRUlFFxbYlTkRTWiHK0XMu+I6rVZ7/by9UER9ZMk2jtjxJWBf2+C15SqZZaVXGNinUKquuyRsgHZNoHEuDNsNdm8DDXNh/VZY8GfV1+fPn0/Xrl3Ze++9M90qt7fuVEyaNGnOQQcdZD7//PPuHiPAfQ1EEgFVntG0NYPKSsvOaNrmNaC/49CeyFn9FEWpfQMeYNigstJ7pxUWuVvawowA3L3mI0tg4sA77Ai+YYgTKkpmDoErTbU13yAHLvoQNmzzqiDLly+nffv2ACxa8xvjH7qPcRdfQ15eXroLvNtGK9evX7+qf//+c2fPnt0vxOcGiV/wDyBgcd162OYhGfuGEJiVUdu/otRd214G9BtUVrpYxDxwO2nNfOgjS6ojwo0ouQT4K4ZngwYAmm5VyeAxrlNtzW+rhJF7BsiUMYYrrxjL2spNjLhhNDtuvz3jx9zEtGnT0joErJ1fd4A148aNm1tQULDVirkJIch3Ir4yNTzlBpWVMqisdNugstKjgL8B72r7V5Q67bcWARcbY3YeVFa6uLigppjja7Qta+swcWAz4BoMI3BoHPN5FCVtG4uBR76H2Suq3sptmY9plkflsvVVQpiTk8O2bdvSzkK3cdsdgHXr1v3QtWtXVq5cuXuQNe7edCkyzb4klmsUFxZ1BG4HTg6y0x2Vd0VJEu4mUcd1YnG+c+DqQWWlkwBCWeWxC7Er6tX/3wPYA+iCpFnM0SehZDS/b9zMdZ/9H9CYhjmPcu3+q/hhtcMzc0d728kpp5zCM888Q7p4ebv3UVFRsXjUqFHr77nnnu2BFiHEfCWyVn57rNdwPWir/l/QtTeOszviDd9SK4+iJI1y4A/gZ2PMV4NXLCgD2aM+eEWyozVqdDglu+kN7B303n+p3u1h8vLyzHfffWdcKisrK0P9nWoqLcYYU1xc/EnDhg3XItvPTIh/pyH7WxNCY7kriqIomUxH4E+vqPfs2dMrrGU33njjN6eeeupG+//a0HJjjDFLlixZdtxxx822o3qvgLuvn4F/6iNUFEVRFOGkYMt39OjRlT/++OMnzZs3/xWoyMnJMZMnT061ke6evPy2226bnpeXtzZIwCs993g91btTFEVRFEWxTPYI5yYkvvJyr9DvtddeqbLQ3ZNunjNnzuKuXbt+HULI3b+/AA7Qx6UoiqIooekBbAV+QBxCAUYFC+ro0aNNMqfePSb/ymOOOebr3NzcjYReJzfA6UAjfVSKoiiKEpljQ7wXbC2br7/+OkDU165du3bLli0VsYi8R8jLP/roo+/tQCKUkFci+8Sb6+NRFEVRlPgpQiKuVVnKQ4YMccV4ywsvvDCzZcuWK8eOHVvh13J3xXzz5s1z+vTpM5eaTm/uv0uA/mgcCEVR6rAjyAG2w5/TTjmyhzbdyQUa2Fee55Xr+bslske4OdAKmR51X/khzrkN2Ih4WW+w5fCH/XsbkrZ2K7DZviqyqG7GUkdqAwOst88imPuAkXgCuEyZMmXL3Xff/eU777zjrmebb775xunZs2fUC23ZsmXjc8899/2wYcN6AI2puae8HPgfcAbJj9qWCzS1rybI8kJPYBckt0MnoL29r0hUACuA34GlSECb+Ug2x1LED2GjZzCUKK3sPacbxtaZ9So3vjWpIES7d2xftyKGfi7f1ovcLCufSmCtbTt1LuhNgUeBg4gelMJYEXsRuDRNBetA4D+2Eno7wia208u3Ip9sNttOYh2wBlgN/Ab8CHwFfG7FPxPJBR5G4oi3SpN7qrDCdBvwWNBnDaxIbR/0fALWs3v16sWMGTNo1KhRQFAaN2Sr4zh89dVX35x66qnb/fjjj23teYPjp3+C5Ff4Mom/rTkS4nUwsBvQwb6a+2if8fYhbn1dDswBXkAc+uLhTOAqe8/pFuRqG7AQuBx4U/U6Ik2AZ5B84KG0YQMwGzjSDmoj0Q14Ctg9jLGUyWwDFgPnAB/X9c2cT+g9s+Fe7nF907BgdyG0p3FdvEJdf51tIEfYmYFMcZg6oo7LMlIZLwUKQ9zzTD/nePHFF6vW1z2xYcy2bdvWDh8+fKqddQn1PNcBI5JUvg3sQOls4Bsf9ai26u0JCVjB6f76MUUD+2ziP1HqoPv+Mz7O9XyG1ItEX3XOpjhvfF4aVsAb00TM/Qj8VuAz4F4klnc681YaC/ovhI66Nt/PORo2bGhWrFjh3Yq2/umnn55TUFCwlND7yY2dEUhGmLbWwBjgA1sf0q1858Y5OEnXNuh9LUPjAkTjSp9l+Z6Pc03LciGvTAdBvzXOxuce/480q4A3p4EVHu/3VwPD0rSTSecGNC3MPc/ze64BAwYYY0zl+vXrV/bs2fMLwm9D2wAMSrAsHSvkjydYjyprod5ekoCgp/trqQp6VMb6LMt3fZxrqlroqaUQWQ9PpGP4Js2mjW9OQodWjqyBl9lR/CLPqwxxftiS5M7We/xvdqDVIU3K9JA0trg2I74fCQl6gwYNzGmnnbYY8VIP91tvJfG1v92skG8LY/nHW6f+sL/3K7vU8KEd6MwEPrXtdIGt137OX2mXFLZLsaDXZZ16Dk1iVZuCflkaGVWpqndTgn90Xi0+rKFIZrZ4RxUG8bbdz3YcmYLrOLTOTtF/asV6GYHevSaCheV+3gLojqzd74MkE9k/aJDjx1HJe852iMPhGDvldVMdl9exQfcYqUyn2mWEyhTfk4M4oTyDeGYnxNatW3n66ae3J9Bz3f33eztoKEvwfu9D1txDpVD1e45KK9bFwEeIQ9K6oLpqItQv97qFSNKbA4AB9uUEHX8Xqd3N4v7+rXYgsrWW6vN6xOHvSdXrWp8NXgpcZPu4ZNAQaBtDP+ut36ttXXCS0BettQP18XVZwCuijDZWBk0Lhnt9mUaVxq+FPi/Fo/MOiCPZjcA71oKKZXTotdw+Qzz364KGwCwf97wN6JNmHYhvCz3M6P13JPJcohzuuZfKGJ67sQPN5xHH1R4pLq9uSIz8U4GdEzhPLBb6Heie/fpioaeyr309hr51FrLdM6u4LkIBuO9diwTJ8FNQQzNM0G+oxXvKRbbL/QVxfopV2A0yxX9ZHZRnO2uZRrvPR9Owjscr6MZ2EMnIKz4e/85u3voww9aXJhkoeH4FfYXqpQp6kmhC9GVQ97VLtj2kVnaaLpqguOuFq3xavHlp8Nv8Cvp1dXiPnYEJRF6vDdfZv0TtBuv4i8/yPDAN6/k8Yl9L+xE4LgnX3s52crEI+Xr7fHtmeP/iV9B/U71UQU8SjWz78XOv22fbQxrhQ0he8hzvZy9iBYl7/9YXQXdpY2dB/Fjs3qnY2lzimOCjLFfa35KJgl4BlNi/L0vSYKkxkvfcj9Ob+9lHZM80oAq6CnpdCPqG+iroi6J0MNuQyD8uOYg3cbSC+jgNflsmCbpLd8S5KRYB+NpOM6WatT6syw9Jz+0/fqfc90niDEN7Av0loj3Htcj6eDahgq6CroLuEc9UMgrYgcie7euQtV6XSmSLRzT6IuEqldiYjziUjUPWSyOtmbpeynsCz6b4vvZAvPhNlPv5Alm/ylQqrYWcDCGbhniQR9s54iABcXoC92sTUJTsJJWC3hi4hfDu/e77T1tR9/ICMj0ZraOaqI8wLrYg29RGEz1IgSvqx5IcL+xwnOS5HmHqC8Db+vgAeAOJU+2nzL4B9kK23imKooIeM+cQ2XHN7YRGh/jsPeBXou9F7qJWekLcYcvfz751d9tPvxTdyyE+7gHCR2qrT9wGHObTMp+DTPFv0GJTFBX0eMhFnOGiTelOQNbLQ3GBj84qN8VWY33gTuAhj2hHE9RrU1Bv2iPe+NGYpI+L7rZtGB+W+W+I8+g6LTZFUUGPl9OpzkQWrsPZBDwS4RyvI1OFfiy7fvooE2I0EtjEDwcj0emSSUf7isZ9+qh4Gv/7xc9GIlQpiqKCHvc5Hwqy6oLF3LFiPSfKuW7GX1aZ5/RRJsSfVM+o+OGRJF//CB/HbCKzQv6mghMRh0Y/U+1Pov4GiqKCniD/RtbOo3U65/k41+vItpxoa+nbA0fp40yIV5E489EwiEf6Xkm89sk+rvk5tRd/Ox1piGzrwUd7WAVcrFVaUVTQE6ERcBaR1/ccK9RzfJyvHLjKhzWSQ/Q1dyU6V/o4xn2uJyXpms2RrGDR1u8/Q2IW1Fd2tS8/z+c1dKpdUVTQE2QIktQhkrPOZh8i7eURoNTHcYcC++ojTYjvEUeqaLMrBsn0lozwu6f7sDoBptfzZzOU6AF13Of2kFZlRVFBT5Roa9nuNprvYjzvGJ8d2av6SBPiVyStq59tbN1IPF83wCk+n2193652jk/rfAUym6GErkeKooLug/+zHbyJ0qAui6NxvY/kto3Ukbn70o/Ux5oQM3we15nEQ7BuB+xI9On2hYTf3lgfaIvsAvDTbtQ6D017JDiSomQtycpY1gQ4w9MBh+uYi5HkFLHyJxJM417Cr8+7740EJiOR5pTY8Wvd5SBhR1clcK2uSKKVaDMCOyDLKV/V02dytE8L1AFe1CoctmxeAr5FYoFvIvWpYj8BpmrxK5km6H9F4n0TxTq/MIFr3Id4+baPctxhSPCNn/TxxsW8GI7tAsxN4Fq9EEfKaLhOcU8Q+3KNH7YgqUw/QLZJphv9ogyWvZ9pvQ9fNg3swLA2fW0mI75FipIxgv68j2NmxigWobgAeNnHca9SHedaiY2yGI5tkeC1jo+hQ85FdlCkCjdpyoA0fCY9fB73q1bftONwoBPim6IoKSUZa+gXAq2JvHbuIFPmiW47mgYsiHKMQbZB6Vp6fJTHcGzzBK91cJpZcfun6UCwDf7Wz9eizl/phPHMDChK2gt6U2C4p0OEJD3sAAAN+0lEQVQM11F+AbyZhPtdAzwY1FhCXQ/goiTOQNQnGsdwbCIxwo+K8hzrgq0ktoSQynbqZ713kwp6WrJWi0DJBEHvg0QNi0Yyp0pvs0ISrYMbDOykjzhmWsdw7O8JXOfsKAPB2raiHOAt0s+ZMpbyyUuD8kx3a9n9u7IWXhuQOBoa5EepFRK1YB/zcUwJErAkmQzD31r6c8B++phjomsMxy6M8xqNgL5pJpivA+enqRC5r2hi3Virb9gydMvucuDLWpjJqETCVn+nxa9kgqCfhXg5R+toVpN8z+FFPhvxvki+9Pf0Ufump8/jthB/ju0eyHJNtA54E3C3tXLWpsj6dIOxpDMbfP727UhdBsVMxi27IqL74ChKvRP0plRHb4vW0QxBQr3eR2J7ll2Owl8aTfe+xiDOdNv0cfviQJ/HLbGiHg97+rQmD0e2ktV35uHP0701MvuxWYusBr+rmCvZTryj+b8ge7390BC4DlhJ4PRhvK83kChlfhmAhClVotMMmXL3Mx35C7F5xHs5xMdg7FcV8yq+9HGM+8wGanEpigp6LNwdw7GpmiaN5Tfep4/aF52QEKN+yvdL4p/18JP/XJdJqnk/SLQjtYkztbgURQXdLyfif501XRiMRLNTogttE5+W4KQ4r7En/gLSFOvjqOKLGAayx6Hr6Iqigu6Dhsi2sUzkNu3oouI3H/pS4s/oNdzHMZuAb/RxBOBnV4c72PqXFpeiqKBH42AkUYaffNm1hfF5TC/8h9Csj1xN5Ih/3rIekcB1TvbxrMqBr/WRBPCgz8EWwGkknglPUZQMI1Yv9yuiDALc7UbrgA+RfZipFPKmwF5IqNdI2+ccJPziTVRHKFOq6QiMIvoWRAeYT/xR/3azzyzas3o/wgC0sp4+o68RR8H2RJ9674+Esf1Iq7aiqKCH4jCqsz5F6vB/tyL7ey39hlzgcWuVRBOkI5Hodp/qow/gDmRdO5p17gD3JHCd3kSOZuZeI5w1WlmPn1EZknRoJP6CzEwm8Vj7iqJkELFMuT/kw2I2wM21KOYgoTrPwl84WIAJ+tgDuBCZBjc+hHZ+guXXL0qdc68/XR9LSP4PiTfv+GiLzYD/aZEpigp6MEcj07LR1qu3Ak/Xwe/YioSh9bO23wMNB+vyD2QLYrRyc5AgMonuFBjo45g39LGEZQvwTx/HOfaZnoAkKVIURQW9iouRqe1oFtx46i4RwQSfwtQIuEQfPUcBL3ieqxPmubpleh6Jzby0BnZWQU+YNxD/FIi+L93YAdtwLTZFUUEHOMCHZeUAfwKX1eFvmQ884aOjAzgJcdCqr9zlEU4/g6BbET+FRDjLx/U2AXO0WUa10v+OhHf1s8RkgPsRh1BFUeq5oD/v81y3Ufe5mIcj0cv8dHTP1MPn3RGYjcy4eNOGhrPMHSQxyuVJuPa5Ea7nXnMN8LM2y6j8AexNdSx9E2Ew5pb3FcC7QCstvnpDLrK7pyGQj+RPaBBl8N7YvhrZ7+WiKXkzhmhe7scSPaOaATYiqUrrmm3AfxHnoWhWS08khefMevCcm1sL7Uz7t5/taSDTtaOTcP12SOz/aNvVfkCyqinR+QmJ2jjJR4frTr//Ddn+djP+9rUr6U93YEckv8X2QCFQYEU5377yrJDnAm8B14Y5107Ai8huki22P91sX5uQWdg/gN+Q5EyL7QBc22wG4O4HjpQopdL++0Ia3fduSGASP4leEh2E3OzzOtfV0fNrZAV5S9DzivY8tyLe78niH1Gu7X52Rga3l3k+68JeSb7uX2zH6+f5eo/5BvFpyM3wfqqBz3L/LcN/YxMkydSFwGuET3a1zbb3civCG+1rk/38iQjX6elp/97vlVtR3xqhjn0OjEPCbDezfU+slv1Yn8/y3Tp+Ho2QlMZ+7nX7dLHQe+AvKxZUT6emAz8CbwNDfViiJyOpXX9J8T3V5v7pfCSe99FIbPbmIZ5XuFkLB0kxORyYksR7OtBnPXoOJVZmIdsBXwM6+Jx9cWeo5iLBZ15CltZWZHE5ZWLY5yNsH7wfNXMgrEHCLy+w1vJyK/JrrMW83iPKW5BAQy/b81wepjza239fodoRuom19pvavqQ1smzT3opVF2vZ97Kv0Z5++Gtbv96w96jUIXN9jkDGpeG9N8J/OtavasFCf7gWfu9JyP5tryXm1yJ3X6/bcyV70PiZjzLK9GA/dWWhewWr2PNMK33ej/e46UjwpTxSv27qru83SfBaDWJo6wdnQD3KB25H4mt42/EK248cZcU1VgZaYa+M8jLAk3Hee087WPgsRP/zKdFDb6uFniIL/Sg7Hedn7fzRNGwUm5H134ujHGcQ56J+wMcpvJ+z7QDpRSR8ZyxpR3PtyLwNsjbWHklzuiOwi21EXYN+UzRrnKBnW4I4Nb6bosrfy8dxz6MkOgs0CLjAdoztfdYFx1MfBtqXQTK8zUH8GhZaC+s3ZA11awzi1AZo67HounrqrbuN8Q9kXfcBUuNY655zirVSZ1P7UQfX2Hb2U5jP2yD5FC6wbb4MifY3DfgAWJSkQdSnVrBDWegdbd2Jl2/t6xY70OoPHAQcamcIvkW2XN5IcmcAlSgi/57P0cfUNP4dPewoyo+lEm8wHD8Wutdicp1LvGtbv4Z4/W7v3T3Wu4a1Lcxvisci+9kOaFJpjf3dxz1tA/ZRCz1pNKU60FIsdSPUsZVUr8t66+9yO0idBXxiX1/ZOrUyqN5uiVBvjcc4KEyhhR5LGaTi5ZbjiSF+wz62nIwtt3+mYJZkoO0/nohiYSdioUcySoqCZuoeUQu9dtg9hkq6c5p3su/G0Jg7pkjQIzXwylrqSLz/Xww8hTiv1AbTfNzfEmvFqaAnl13ts16VZGGrJDUCOiqFgp4Or0rEv8drHe9sBzMGiQ+RqsF1XQq6lyNtH2SAa1TQU8+XPm80E6ZIW8XQ8XxYy4Je269XkCBBzam9faU5Pu/tkyyY2UpHQXenWVvbqdw/08hiDfX6LMsF3SCZCr2CPtm+n2rH4nQRdJAlxHX2WgUq6MntcIPZN8p3DOKwcW0GdLJrqE4mEm1tLp445Wt9njtVhLruVmTN8yP72w+3nfrxVjjX1eL9dvfcp4lw/69lgaBv9vmsKuugjqwG7rMd6d+AZ5G18fI0qrcbiG9759YMqR/ub64I+v2HAd8TPflVNvEnssMI4PQQz9JEKcMNafAs/da7dXVd2MN9jDruyqDK0wFZl472m06Oc6S5lNqbLg/1+gN4B3GoGQDsgDjY5KVJ+d/lwyrLhkhU+/t4VsWIo1g60MzWlWMQH5LVdWCtliIBbo4isSWXcRlkofcOIQ6LauF5p5OFDuInYBAHOZftEN+MSOW3xvbpdYljDdpoz/q2urixUHSyI8fgMIHbkDXRBRnY4Q6xHVgoy+pNEtuD+w8k6EMb+3L3a7qhFnPsyw3iES3RTYV9uZGaVlnhXoasNy9AYtcvzpCy38UONnKC6t73xLfUka40RWIANA+yMgyyJ3dWmt9/C2RZpheyX7mL/U1u1LGGdqCYa185QVbnNs9rC9UBTjZS7UT3vS2Lb5N873sQPT1vXbIK2e8fzuq8wQ7KUynoU+zszJkRBP0bxO8ilUGeipAlqlwr6FcFff43ZBePE9Rf/JZms3lFyM6SYOOpEpkh/QEla3GsuDegOq5yqJcbqlHjJyvpQEOgJRK+tzOy7ay7HaTtZl872/e62mM6WGurWRrNFKUrXovuDWRffjZb6OdZK9v9zTdoFUge2thqt+G66y5btTiUDMG1tDVed+qYg8zqHIWsD1+FbDssy5K+ojWyNe9ha9VuAl5FonkqSSRHi0BRFKVOWYTMclyMLLHdgExJf4BMSWdijIY2wL+QKfLZyFJtkRXyPsAYfeyKoihKNuFuZfNyKRJcyk2o4t3ydh6y3NEK8W9ohL8EOwNJ7pS7u4TYGPG9aGdnGCYQ6Ci8DfFqf4tAH6Y90Cn3pKNT7oqiKHUv6l7G2Zeb8GQw4lR6pH2BLIMsRZxly6h2nP0DcfBdTXWSlnLE0dmvX04LxCeiGeLT09K+CqgOP72d/bst4jPRJugcM5FdHR8jmdhWhvnN6iukKIqiZI2Yz/B5bBvgVGR9/Reqc5VHCgkd/PJjoUfbSlthr+mGA16DhAsfg+yO8MMAe76xWgXUQlcURckGPkHSC5+HJKeJxCrgGfty6Wgt5kL7amWt6RaIo10Ta2V3RIJnRUoMtdH+u9Ra2G5e9A1IgJS1VrxX2lmB35HtiBtj/M2dka1xoEmZFEVRlCxhd2RavNJa3qniIGtRL0eSak0L8ZplreanSN1U+CF2YGCQrGyKoiiKkjX8FfjOityfwE1I5MFkMhBZS/czpZ7sfeidgGF2NsLdvnsjun6uKIqiZCH5iHe7K6ybrTV9E8lJ8JGLOLn5eTVK0m86CXGK86axLiENMpBlKzpCUhRFSR8aABch3uz7IOvgIGFPS6xAzrVi/yuyrl6XNEbW8Dsg29J6A/0R73yXH5A1+QlIEB1FBV1RFKVeCXtzZOr9dCRfhBsIzFirtxxZFy9FYrD/YMV+gX0lM7NfARIYpjuwK9AD8Yp3t7Y1RsIEu8xB1uJfsYOO9fpIVdAVRVEUYSckGUg/K6xtEK/2NkFi6qUc2Ze+Flmf34BsO/sz6Lh8zyAi356ztT1/OFYjXu+r7YzB50iypRJ9VCroiqIoiv++213zbmL/dZPndEa2qbVDAr9sh2xla+bz3FusUK+xgwF3e9pyYKG1/ldRvaVtvf2OUsf8PxjGpeZEBkbPAAAAAElFTkSuQmCC');
  }
}
</style>
