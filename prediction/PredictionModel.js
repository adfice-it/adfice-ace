//
//  Created by Tsvetan Yordanov
//


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PredictionModel.css';
import API from './apiClient';


export default function PredictionModel(props) {
    const { patientId } = useParams()

    const [ patient, setPatient ] = useState({})

    useEffect( () => {
        async function fetchPatient() {
            setPatient(await API.fetchPatient(patientId))
        }
        fetchPatient()
    },[patientId]);


    if(Object.keys(patient).length === 0) return null
    const isPredictedFallRiskError = patient.predictedFallRiskError !== undefined && patient.predictedFallRiskError !== null;
    if(isPredictedFallRiskError)
        console.info("Can not calculate patient fall risk; Reason: " + patient.predictedFallRiskError );


    const pm = patient.measurements;

    var antiepi_text = null;
        if (patient.antiepileptica === 0){antiepi_text = "nee";}
        if (patient.antiepileptica === 1){antiepi_text = "ja";}
    var ca_text = null;
        if (patient.ca_blocker === 0){ca_text = "nee";}
        if (patient.ca_blocker === 1){ca_text = "ja";}
    var incont_text = null;
        if (patient.incont_med === 0){incont_text = "nee";}
        if (patient.incont_med === 1){incont_text = "ja";}

    const dtFormatter = new Intl.DateTimeFormat("nl-NL", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      });


    const generate_td_contents = function (raw_val, cell_val, prefix_txt = null, missing_txt = "ontbreekt", is_date_measured_cell = false) {
        const isPresent = raw_val !== null && raw_val !== undefined;
        const prefix_spn = prefix_txt !== null ? <span>{prefix_txt}</span> : "";
        //if value is present but date measured isn't, place a hyphon in place of the missing date. Only highlight value missing.
        if(is_date_measured_cell)
            return isPresent ? <>{prefix_spn}<span className="present-val">{cell_val}</span></> : <>{prefix_spn}<span className="">{"-"}</span></>;
        return isPresent ? <>{prefix_spn}<span className="present-val">{cell_val}</span></> : <>{prefix_spn}<span className="missing-val">{missing_txt}</span></>;
    };

    const displaypredictedFallRisk = generate_td_contents(patient.predictedFallRisk, Math.round(patient.predictedFallRisk*100) + "%", null, "Geen predictie mogelijk (ontbrekende waarde(n))");
    const displayGDS_score = generate_td_contents(pm.GDS_score, pm.GDS_score);
    const displayGDS_date_measured = generate_td_contents(pm.GDS_date_measured, dtFormatter.format(new Date(pm.GDS_date_measured)), undefined, undefined, true);
    const displaygrip_kg = generate_td_contents(pm.grip_kg, pm.grip_kg);
    const displaygrip_date_measured = generate_td_contents(pm.grip_date_measured, dtFormatter.format(new Date(pm.grip_date_measured)), undefined, undefined, true);
    const displaywalking_speed_m_per_s = generate_td_contents(pm.walking_speed_m_per_s, pm.walking_speed_m_per_s);
    const displaywalking_date_measured = generate_td_contents(pm.walking_date_measured, dtFormatter.format(new Date(pm.walking_date_measured)), undefined, undefined, true);

    const is_height_dm_missing = pm.height_date_measured === undefined || pm.height_date_measured === null;
    const is_weight_dm_missing = pm.weight_date_measured === undefined || pm.weight_date_measured === null;
    const is_height_missing = pm.height_cm === undefined || pm.height_cm === null;
    const is_weight_missing = pm.weight_kg === undefined  || pm.weight_kg === null;
    const is_using_height_and_weight = !is_height_missing || !is_weight_missing;
    // if either weight or height are present, then assume we are calculating BMI from them
    // and show only date measured for height and weight
    // if no weight and height are present and BMI is present, then show BMI date measured and not height+weight
    // if neither of the 3 are present, show height and weight as missing but not BMI .
    const is_BMI_calculated_not_calculable = is_using_height_and_weight && (is_height_missing  || is_weight_missing);
    const bmi_disp_val = is_BMI_calculated_not_calculable ? null : pm.BMI;
    const displayBMI = generate_td_contents(bmi_disp_val, Number.parseFloat(pm.BMI).toFixed(1));
    const bmi_dm_check_value = is_using_height_and_weight ? null : pm.BMI_date_measured;
    const bmi_dm_label = !is_using_height_and_weight ? "BMI: " : "";
    const bmi_dm_missing_txt = !is_using_height_and_weight ? undefined : "";
    const displayBMI_date_measured = generate_td_contents(bmi_dm_check_value, dtFormatter.format(new Date(pm.BMI_date_measured)), bmi_dm_label, bmi_dm_missing_txt, !is_using_height_and_weight);

    const height_dm_label = is_using_height_and_weight ? "lengte: " : "";
    const height_dm_missing_txt = is_using_height_and_weight ? undefined : "";
    const displayHeight_date_measured = generate_td_contents(pm.height_date_measured, dtFormatter.format(new Date(pm.height_date_measured)), height_dm_label, height_dm_missing_txt, is_using_height_and_weight);
    const weight_dm_label =  is_using_height_and_weight ? "gewicht: " : "";
    const weight_dm_missing_txt =  is_using_height_and_weight ? undefined : "";
    const displayWeight_date_measured = generate_td_contents(pm.weight_date_measured, dtFormatter.format(new Date(pm.weight_date_measured)), weight_dm_label, weight_dm_missing_txt, is_using_height_and_weight);

    const dsplaysystolic_bp_mmHg = generate_td_contents(pm.systolic_bp_mmHg, pm.systolic_bp_mmHg);
    const displaybp_date_measured = generate_td_contents(pm.bp_date_measured, dtFormatter.format(new Date(pm.bp_date_measured)), undefined, undefined, true);
    const displayfunctional_limit_trap = generate_td_contents(pm.functional_limit_trap, pm.functional_limit_trap);
    const displayfunctional_limit_kleding =  generate_td_contents(pm.functional_limit_kleding, pm.functional_limit_kleding);
    const displayfunctional_limit_stoel = generate_td_contents(pm.functional_limit_stoel, pm.functional_limit_stoel);
    const displayfunctional_limit_nagels = generate_td_contents(pm.functional_limit_nagels, pm.functional_limit_nagels);
    const displayfunctional_limit_lopen = generate_td_contents(pm.functional_limit_lopen, pm.functional_limit_lopen);
    const displayfunct_beperk = generate_td_contents(patient.funct_beperk, patient.funct_beperk);
    const displayfunctional_limit_date_measured =  generate_td_contents(pm.functional_limit_date_measured, dtFormatter.format(new Date(pm.functional_limit_date_measured)), undefined, undefined, true);
    const displaynr_falls_12m = generate_td_contents(pm.nr_falls_12m, pm.nr_falls_12m);
    const displaynr_falls_date_measured = generate_td_contents(pm.nr_falls_date_measured, dtFormatter.format(new Date(pm.nr_falls_date_measured)), undefined, undefined, true);
    const displaysmoking = generate_td_contents(pm.smoking, pm.smoking ? "ja" : "nee");
    const displaysmoking_date_measured = generate_td_contents(pm.smoking_date_measured, dtFormatter.format(new Date(pm.smoking_date_measured)), undefined, undefined, true);
    const displayantiepi_text =  generate_td_contents(antiepi_text, antiepi_text);
    const displayca_text =  generate_td_contents(ca_text, ca_text);
    const displayincont_text =  generate_td_contents(incont_text, incont_text);
    const displayeducation_level =  generate_td_contents(patient.education_level, patient.education_level);
    const displayFES_kleding =  generate_td_contents(pm.FES_kleding, pm.FES_kleding);
    const displayFES_bad =  generate_td_contents(pm.FES_bad, pm.FES_bad);
    const displayFES_stoel =  generate_td_contents(pm.FES_stoel, pm.FES_stoel);
    const displayFES_trap =  generate_td_contents(pm.FES_trap, pm.FES_trap);
    const displayFES_reiken =  generate_td_contents(pm.FES_reiken, pm.FES_reiken);
    const displayFES_helling =  generate_td_contents(pm.FES_helling, pm.FES_helling);
    const displayFES_sociale =  generate_td_contents(pm.FES_sociale, pm.FES_sociale);
    const displayfear_of_falls_date_measured =  generate_td_contents(pm.fear_of_falls_date_measured, dtFormatter.format(new Date(pm.fear_of_falls_date_measured)), undefined, undefined, true);

    const linebreak = <br></br>;

    return <>
            <h1>Toelichting predictiemodel voor berekening valrisico</h1>
            <p>Berekend valrisico: {displaypredictedFallRisk}</p>

            <h2>Berekening</h2>
            <p>Tabel: model voor berekening van de kans dat een pati&euml;nt van 65 jaar of ouder &eacute;&eacute;n of meer keer vallen binnen de komende 12 maanden:</p>
            <p>Deze kans kan berekend worden door de co&euml;ffici&euml;nt waardes uit het model te combineren met de karakteristieken van de pati&euml;nt (zie tabel).  N.B.: Omdat het een voorspellingsmodel betreft, kunnen geen conclusies getrokken worden m.b.t. de causaliteit van de variabelen in het model.</p>
            <table border="1">
            <tbody>
            <tr><td>variabel</td><td>waarde</td><td>datum gemeten</td><td>coefficient</td></tr>
            <tr><td>Intercept</td><td></td><td></td><td>0.0331 +</td></tr>
            <tr><td>Z-score depressie (GDS)</td><td>{displayGDS_score}</td><td>{displayGDS_date_measured}</td><td> 0.0778  * (GDS - 1.4401) / 1.9419 +</td></tr>
            <tr><td>Z-score grijpkracht<sup>a</sup></td><td>{displaygrip_kg}</td><td><span>{displaygrip_date_measured}</span></td><td> -0.1678  * (kga  - 32.4838) / 10.8414 +</td></tr>
            <tr><td>Z-score loopsnelheid<sup>b</sup></td><td>{displaywalking_speed_m_per_s}</td><td>{displaywalking_date_measured}</td><td> 0.0997 * (m/sb - 0.9417) / 0.2760 +</td></tr>
            <tr><td>BMI</td><td>{displayBMI}</td><td>{displayBMI_date_measured}{is_using_height_and_weight ? "" : linebreak}{displayHeight_date_measured}{linebreak}{displayWeight_date_measured}</td><td> -0.0204 * kg/m2 +</td></tr>
            <tr><td>Systolische bloeddruk<sup>c</sup></td><td>{dsplaysystolic_bp_mmHg}</td><td>{displaybp_date_measured}</td><td> -0.0039 * mmHgc +</td></tr>
            <tr><td>Kunt u een trap van 15 treden op- en aflopen zonder stil te moeten staan?</td><td>{displayfunctional_limit_trap}</td><td></td></tr>
            <tr><td>Kunt u zich aan- en uitkleden?</td><td>{displayfunctional_limit_kleding}</td><td></td></tr>
            <tr><td>Kunt u gaan zitten en opstaan uit een stoel?</td><td>{displayfunctional_limit_stoel}</td><td></td></tr>
            <tr><td>Kunt u de nagels van uw tenen knippen?</td><td>{displayfunctional_limit_nagels}</td><td></td></tr>
            <tr><td>Kunt u buitenshuis vijf minuten aan &eacute;&eacute;n stuk lopen zonder stil te staan?</td><td>{displayfunctional_limit_lopen}</td><td></td></tr>
            <tr><td>Z-score functionele beperkingen<sup>d</sup></td><td>{displayfunct_beperk}</td><td>{displayfunctional_limit_date_measured}</td><td> 0.1419 * (beperkingen - 1.2088) / 1.5286 +</td></tr>
            <tr><td>Valgeschiedenis: aantal valincidenten</td><td>{displaynr_falls_12m}</td><td>{displaynr_falls_date_measured}</td><td>1 val in vorige 12 maanden: 0.4841 + 2 of meer keer gevallen:  0.6791 +</td></tr>
            <tr><td>Is de pati&euml;nt een roker?</td><td>{displaysmoking}</td><td>{displaysmoking_date_measured}</td><td> -0.2870 (als ja) +</td></tr>
            <tr><td>Gebruik van anti-epileptica?</td><td>{displayantiepi_text}</td><td></td><td>  0.4962 (als ja) +</td></tr>
            <tr><td>Gebruik van calciumblokkers?</td><td>{displayca_text}</td><td></td><td> -0.1866 (als ja) +</td></tr>
            <tr><td>Gebruik van incontinentie medicijnen? </td><td>{displayincont_text}</td><td></td><td> 0.7459 (als ja) +</td></tr>
            <tr><td>Hoogst behaalde opleiding<sup>e-i</sup></td><td>{displayeducation_level}</td><td></td><td>
            Basisschool; lager beroepsonderwijse; MULO, ULO, MACO; middelbaarberoepsonderwijsf; of MMS, HBS, Lyceum, Atheneum, of Gymnasium tot en met derde jaar: 0<br></br>
            MMS, HBS, Lyceum, Atheneum, of Gymnasium geheel voltooid: 0.1972 (als ja) +<br></br>
            Hoger beroepsonderwijsg; Universiteit of hogeschool: 0.3687 (als ja) +</td></tr>
            <tr><td>FES: Het aan- of uitkleden</td><td>{displayFES_kleding}</td><td></td><td></td></tr>
            <tr><td>FES: Het nemen van een bad of douche</td><td>{displayFES_bad}</td><td></td><td></td></tr>
            <tr><td>FES: Het in of uit een stoel komen</td><td>{displayFES_stoel}</td><td></td><td></td></tr>
            <tr><td>FES: Het op- of aflopen van een trap</td><td>{displayFES_trap}</td><td></td><td></td></tr>
            <tr><td>FES: Het reiken naar iets boven uw hoofd of naar iets op de grond </td><td>{displayFES_reiken}</td><td></td><td></td></tr>
            <tr><td>FES: Het op- of aflopen van een helling</td><td>{displayFES_helling}</td><td></td><td></td></tr>
            <tr><td>FES: Het bezoeken van een sociale gelegenheid</td><td>{displayFES_sociale}</td><td></td><td></td></tr>
            <tr><td>Angst om te vallen</td><td></td><td>{displayfear_of_falls_date_measured}</td><td> Tenminste een <q>Een beetje bezorgd</q> of <q>redelijk bezorgd</q> = 0.2268; tenminste een <q>Erg bezorgd</q> = 0.2222</td></tr>
            </tbody>
            </table>
            <div>
            Voor het ontwikkelen van het model, waren de volgende regels gebruikt:
            <br></br><sup>a</sup> Hoogst behaalde meting
            <br></br><sup>b</sup> Deze snelheid is gebaseerd op een looptest waarin wordt gevraagd zo snel mogelijk te lopen
            <br></br><sup>c</sup> In het geval van meerdere metingen moet het gemiddelde genomen worden
            <br></br><sup>d</sup> Functionele beperkingen heeft de volgende items:
            <ol>
            <li>Kunt u een trap van 15 treden op- en aflopen zonder stil te moeten staan?</li>
            <li>Kunt u zich aan- en uitkleden?</li>
            <li>Kunt u gaan zitten en opstaan uit een stoel?</li>
            <li>Kunt u de nagels van uw tenen knippen?</li>
            <li>Kunt u buitenshuis vijf minuten aan &eacute;&eacute;n stuk lopen zonder stil te staan?</li>
            </ol>
            Met de volgende antwoordopties:
            <ol>
            <li>ja, zonder moeite</li>
            <li>ja, met enige moeite</li>
            <li>ja, met veel moeite</li>
            <li>alleen met hulp / nee, dat kan ik niet</li>
            </ol>
            Ieder item waarop de pati&euml;nt antwoord met antwoordopties 2, 3, of 4 telt als &eacute;&eacute;n functionele beperking. De maximum score voor deze variabele is dan ook 5. Het minimum is 0.
            <br></br><sup>e</sup> lager beroepsonderwijs: LTS, LHNO, LEAO, handels(dag)school, huishoudschool, agrarische school, praktijkdiploma, middenstandsonderwijs
            <br></br><sup>f</sup> middelbaarberoepsonderwijs: MBA, LO-akten, MTS, MEAO
            <br></br><sup>g</sup> Hoger beroepsonderwijs:HTS, HEAO, MO-opleiding, kweekschool, sociale/pedagogische academie
            <br></br><sup>h</sup> Helemaal niet bang: <q>Helemaal niet bezorgd</q> op alle items van de FES
            <br></br><sup>i</sup> Een beetje bang: <q>Een beetje bezorgd</q> of <q>redelijk bezorgd</q> op een van de items van de FES
            <br></br><sup>j</sup> Heel erg bang: <q>Erg bezorgd</q> op een van de items van de FES<br></br>
            <br></br>Afkortingen: GDS; Geriatric Depression Scale (0-15), FES; Falls Efficacy Scale
            </div>

            <h2>Gebruik van model</h2>
            <h3>Berekening</h3>
            <p>Uit het model volgt een totaalscore. Ons algoritme rekent deze score om naar een kans middels de volgende formule:
            <br></br>Probability = exp(score) / (1 + exp(score))
            </p>

            <h2>Contact</h2>
            <p>Bob van de Loo | PhD candidate Amsterdam UMC | r.vandeloo@amsterdamumc.nl</p>


            <h1>Uitgebreid informatie over ontwikkeling en validatie</h1>


            <h2>Introductie</h2>
            <p>Met behulp van het ons ontwikkelde predictiemodel model kan de kans om &eacute;&eacute;n keer of vaker te vallen  in de komende 12 maanden worden berekend voor pati&euml;nten van 65 jaar of ouder. Wij maken gebruik van een algoritme dat voor de pati&euml;nt de nodige informatie uit EPIC extraheert om vervolgens de kans op een val via het model te berekenen.
            </p>
            <h2>Model ontwikkeling</h2>
            <h3>Populatie voor ontwikkeling model</h3>
            <p>Het model is ontwikkeld op basis van data uit de volgende drie studies: the Longitudinal Aging Study Amsterdam (LASA), B vitamins for the PRevention Of Osteoporotic Fractures (B-PROOF), en Activity and Function in the Elderly in Ulm (ActiFE Ulm). Voor verdere informatie over deze studies verwijzen we naar Hoogendijk et al. (2019), Wijngaarden et al. (2011), en Denkinger et al. (2010). De uiteindelijke onderzoekspopulatie bestond uit 5722 participanten.
            </p>
            <h3>Uitkomst</h3>
            <p>Vallen was prospectief bijgehouden in de cohorten met valkalenders. Op basis van deze data hebben we een dichotome variabele aangemaakt om onderscheid te maken tussen vallers (= 1 val in periode van 12 maanden) en niet-vallers.
            </p>
            <h3>Voorspellers</h3>
            <p>Op basis van de literatuur hebben we een totaal van 85 mogelijke voorspellers geselecteerd. Deze voorspellers zijn onder te verdelen in: socio-demografische karakteristieken; variabelen met betrekking tot emotioneel, cognitief, en fysiek functioneren; chronische aandoeningen; leefstijl factoren; en medicatiegebruik.
            </p>
            <h3>Analyse</h3>
            <p>Voor het maken van een selectie binnen de variabelen hebben we een backward elimination procedure toegepast. Hierbij begonnen we met een volledig model met alle mogelijke voorspellers. Vervolgens hebben we stapsgewijs de minst significante variabelen uit het model verwijderdt, totdat alle variabelen significant waren (P &lt; 0.05).
            </p>
            <h2>Model validatie</h2>
            <h3>Populatie</h3>
            <p>Het uiteindelijke predictie model is gevalideerd in een onafhankelijke cohortstudie van poliklinische pati&euml;nten afkomstig uit de dagkliniek van de geriatrie afdeling van het UMC Utrecht. Metingen vonden plaats tussen 2012 en 2015. Het gaat om een kwetsbare groep ouderen, waarvan bij 58% sprake is van een valgeschiedenis.
            </p>
            <h3>Voorspellend vermogen van model</h3>
            <p>Het voorspellend vermogen van een predictiemodel wordt over het algemeen bepaald aan de hand van kalibratie en discriminatie. Kalibratie heeft betrekking op in hoeverre de voorspelde kans om te vallen overeenkomen met de geobserveerde kans om te vallen. Discriminatie heeft betrekking op het vermogen van het model om onderscheid te maken tussen vallers en niet-vallers. Discriminatie wordt doorgaans gekwantificeerd met de c-statistic, die een waarde aanneemt tussen 0.50 (geen discriminatie) en 1 (perfecte discriminatie). De c-statistic van ons model was 0.69, wat in overeenstemming is met de discriminatie zoals gemeten in de populatie voor de ontwikkeling van het model.
            </p>

            <h3>Voorbeeld</h3>
            <div>Stel we hebben de volgende pati&euml;nt:
            <ul>
            <li>GDS: score van 1</li>
            <li>Grijpkracht van 28.23 kg</li>
            <li>Loopsnelheid van 0.51 m/s</li>
            <li>BMI van 26.8</li>
            <li>Systolische bloeddruk van 128 mmHg</li>
            <li>3 functionele beperkingen</li>
            <li>4 valincidenten in de afgelopen 12 maanden</li>
            <li>Maakt gebruik van incontinentie medicijnen</li>
            <li>Hoogst behaalde opleiding: middelbaarberoepsonderwijs</li>
            <li>Angst om te vallen: heel erg bang</li>
            </ul>
            <p>Dan is de berekening als volgt:
            <br></br>Score = 0.0331 +
            <br></br>0.0778 * (1 - 1.4401) / 1.9419 +
            <br></br>-0.1678  * (28.23 - 32.4838) / 10.8414 +
            <br></br>0.0997 	* (0.51 - 0.9417) / 0.2760 +
            <br></br>-0.0204 * 26.8 +
            <br></br>-0.0039 * 128 +
            <br></br>0.1419 	* (3 - 1.2088) / 1.5286 +
            <br></br>0.4841 * 1 +
            <br></br>0.6791 * 1 +
            <br></br>-0.2870 * 0 +
            <br></br>0.4962 * 0 +
            <br></br>-0.1866 * 0 +
            <br></br>0.7459 * 1 +
            <br></br>0.1972 * 0 +
            <br></br>0.3687 * 0 +
            <br></br>0.2268 * 0 +
            <br></br>0.2222 * 1 = 1.17702
            <br></br>exp(1.17702) / (1 + exp(1.17702)) = 0.76 = 76%
            </p>
            <p>De pati&euml;nt heeft 76% kans om &eacute;&eacute;n keer of vaker te vallen in de komende 12 maanden.
            </p>
            <h2>Referenties</h2>
            <ul>
            <li>Denkinger, M. D., Franke, S., Rapp, K., Weinmayr, G., Duran-Tauleria, E., Nikolaus, T., &amp; Peter, R. (2010). Accelerometer-based physical activity in a large observational cohort - Study protocol and design of the activity and function of the elderly in Ulm (ActiFE Ulm) study. BMC Geriatrics, 10. https://doi.org/10.1186/1471-2318-10-50</li>
            <li>Hoogendijk, E. O., Deeg, D. J. H., Breij, S. De, Klokgieters, S. S., &amp; Kok, A. A. L. (2019). The Longitudinal Aging Study Amsterdam?: cohort update 2019 and additional data collections. European Journal of Epidemiology, (0123456789). https://doi.org/10.1007/s10654-019-00541-2</li>
            <li>Wijngaarden, V., Van Wijngaarden, J. P., Dhonukshe-Rutten, R. A., Van Schoor, N. M., Van Der Velde, N., Swart, K. M., Cpgm De Groot, L. (2011). Rationale and design of the B-PROOF study, a randomized controlled trial on the effect of supplemental intake of vitamin B12 and folic acid on fracture incidence Rationale and design of the B-PROOF study, a randomized controlled trial on the effect of sup. BMC Geriatrics, 11(December). https://doi.org/10.1186/1471-2318-11-80</li>
            </ul>
            </div>

    </>

}