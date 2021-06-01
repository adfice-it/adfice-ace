function populate(){
// Populate the table with the specific patient data.
// For now I've hard coded the values for Mw. Smit, but we should get the values for each patient out of the database.

var GDS_score = 1; //depressie
document.getElementById('GDS_score').innerHTML = GDS_score;

var GDS_date_measured = "2020-07-27";
document.getElementById('GDS_date_measured').innerHTML = GDS_date_measured;

var grip_kg = 13.5;
document.getElementById('grip_kg').innerHTML = grip_kg;

var grip_date_measured = "2020-07-27";
document.getElementById('grip_date_measured').innerHTML = grip_date_measured;

var walking_speed_m_per_s = 0.5; //loopsnelheid
document.getElementById('walking_speed_m_per_s').innerHTML = walking_speed_m_per_s;

var walking_date_measured = "2020-07-27";
document.getElementById('walking_date_measured').innerHTML = walking_date_measured;

var height_cm = 160;
var height_date_measured = "2020-07-27";
document.getElementById('height_date_measured').innerHTML = "lengte: " + height_date_measured + "<br>";

var weight_kg = 45.5;
var weight_date_measured = "2020-07-27";
document.getElementById('weight_date_measured').innerHTML = "gewicht: " + weight_date_measured;

var BMI = weight_kg / (height_cm/100)^2;
document.getElementById('BMI').innerHTML = BMI;

var systolic_bp_mmHg = 138;
document.getElementById('systolic_bp_mmHg').innerHTML = systolic_bp_mmHg;

var bp_date_measured = "2020-07-27";
document.getElementById('bp_date_measured').innerHTML = bp_date_measured;

var functional_limit_trap = 'ja, met enige moeite';
document.getElementById('functional_limit_trap').innerHTML = functional_limit_trap;

var functional_limit_kleding = 'ja, zonder moeite';
document.getElementById('functional_limit_kleding').innerHTML = functional_limit_kleding;

var functional_limit_stoel = 'ja, met enige moeite';
document.getElementById('functional_limit_stoel').innerHTML = functional_limit_stoel;

var functional_limit_nagels = 'ja, zonder moeite';
document.getElementById('functional_limit_nagels').innerHTML = functional_limit_nagels;

var functional_limit_lopen = 'ja, zonder moeite';
document.getElementById('functional_limit_lopen').innerHTML = functional_limit_lopen;

var functional_limit_date_measured = "2020-07-27";
document.getElementById('functional_limit_date_measured').innerHTML = functional_limit_date_measured;

// TODO if any of the functional_limit values are missing, then this should not be calculated.
var funct_beperk = 0;
	if(functional_limit_trap == "ja, met enige moeite" || functional_limit_trap == "ja, met veel moeite" || functional_limit_trap == "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
	if(functional_limit_kleding == "ja, met enige moeite" || functional_limit_trap == "ja, met veel moeite" || functional_limit_trap == "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
	if(functional_limit_stoel == "ja, met enige moeite" || functional_limit_trap == "ja, met veel moeite" || functional_limit_trap == "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
	if(functional_limit_nagels == "ja, met enige moeite" || functional_limit_trap == "ja, met veel moeite" || functional_limit_trap == "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
	if(functional_limit_lopen == "ja, met enige moeite" || functional_limit_trap == "ja, met veel moeite" || functional_limit_trap == "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
document.getElementById('funct_beperk').innerHTML = funct_beperk;

var nr_falls_12m = 50;
document.getElementById('nr_falls_12m').innerHTML = nr_falls_12m;

var nr_falls_date_measured = "2020-07-27";
document.getElementById('nr_falls_date_measured').innerHTML = nr_falls_date_measured;

//TODO if nr_falls_12m is missing, then the valgeschiedenis values should not be calculated
var valgeschiedenis1 = 0;
	if(nr_falls_12m >= 1){valgeschiedenis1++;}
var valgeschiedenis2 = 0;
	if(nr_falls_12m >= 2){valgeschiedenis2++;}

var smoking = 0;
document.getElementById('smoking').innerHTML = smoking;

var smoking_date_measured = "2020-07-27";
document.getElementById('smoking_date_measured').innerHTML = smoking_date_measured;

var antiepileptica = 0; //Gebruik van anti-epileptica? If the patient has any medication with ATC code N03 then this should be 1; else 0.
var antiepi_text = "";
	if (antiepileptica == 0){antiepi_text = "nee";}
	if (antiepileptica == 1){antiepi_text = "ja";}
document.getElementById('antiepi_text').innerHTML = antiepi_text;

var ca_blocker = 0; //Gebruik van calciumblokkers? If the patient has any medication with ATC code in: (C08, C09BB, C09DB, C07FB, C10BX03, C10BX07, C10BX09, C10BX11, C10BX14, C09BX03, C09BX01, C09BX02, C09DX01, C09DX03 C09DX06, C09XA53, C09XA54) then 1, else 0.
var ca_text = "";
	if (ca_blocker == 0){ca_text = "nee";}
	if (ca_blocker == 1){ca_text = "ja";}
document.getElementById('ca_text').innerHTML = ca_text;

var incont_med = 0; //Gebruik van incontinentie medicijnen? If the patient has any medicatio with ATC code in: (G04BD, G04CA53) then 1, else 0.
var incont_text = "";
	if (incont_med == 0){incont_text = "nee";}
	if (incont_med == 1){incont_text = "ja";}
document.getElementById('incont_text').innerHTML = incont_text;


var education_level = "huishoudschool";
document.getElementById('education_level').innerHTML = education_level;

var coded_level= 1; //Hoogst behaalde opleiding. Get the coded level from the education_level table
// For LASA & ActiFE Ulm it was chosen to code fearfall=0 when all activities are rated as notconcerned, fearfall=1 when at least one of the activities is rated as a little/fairly concerned (and none of the other activities as >fairly concerned), fearfall=2 when at least one of the activities is rated as very concerned.
var coeff_education = 0;
	if (coded_level = 2) {coeff_education = 0.1972;}
	if (coded_level = 3) {coeff_education = 0.3687;}

var FES_kleding = "Een beetje bezorgd";
document.getElementById('FES_kleding').innerHTML = FES_kleding;

var FES_bad = "Een beetje bezorgd";
document.getElementById('FES_bad').innerHTML = FES_bad;

var FES_stoel = "Erg bezorgd";
document.getElementById('FES_stoel').innerHTML = FES_stoel;

var FES_trap = "Erg bezorgd";
document.getElementById('FES_trap').innerHTML = FES_trap;

var FES_reiken = "Een beetje bezorgd";
document.getElementById('FES_reiken').innerHTML = FES_reiken;

var FES_helling = "Een beetje bezorgd";
document.getElementById('FES_helling').innerHTML = FES_helling;

var FES_sociale = "Een beetje bezorgd";
document.getElementById('FES_sociale').innerHTML = FES_sociale;

var valangst = 0;
if (FES_kleding == "Een beetje bezorgd" || FES_bad == "Een beetje bezorgd" || FES_stoel == "Een beetje bezorgd" || FES_trap == "Een beetje bezorgd" || FES_reiken == "Een beetje bezorgd" || FES_helling == "Een beetje bezorgd" || FES_sociale == "Een beetje bezorgd"){valangst = 1;}
if (FES_kleding == "redelijk bezorgd" || FES_bad == "redelijk bezorgd" || FES_stoel == "redelijk bezorgd" || FES_trap == "redelijk bezorgd" || FES_reiken == "redelijk bezorgd" || FES_helling == "redelijk bezorgd" || FES_sociale == "redelijk bezorgd"){valangst = 1;}
if (FES_kleding == "Erg bezorgd" || FES_bad == "Erg bezorgd" || FES_stoel == "Erg bezorgd" || FES_trap == "Erg bezorgd" || FES_reiken == "Erg bezorgd" || FES_helling == "Erg bezorgd" || FES_sociale == "Erg bezorgd"){valangst = 2;}
document.getElementById('valangst').innerHTML = valangst;

var coeff_valangst = 0;
	if (valangst == 1){coeff_valangst = 0.2268;}
	if (valangst == 2){coeff_valangst = 0.2222;}

var fear_of_falls_date_measured = "2020-07-27";
document.getElementById('fear_of_falls_date_measured').innerHTML = fear_of_falls_date_measured;


var p1 = -0.2047 +
0.0778  * (GDS_score - 1.4401) / 1.9419 +
-0.1678  * (grip_kg  - 32.4838) / 10.8414 +
0.0997 * (walking_speed_m_per_s - 0.9417) / 0.2760 +
-0.0204 * BMI +
-0.0039 * systolic_bp_mmHg +
0.1419 * (funct_beperk - 1.2088) / 1.5286 +
valgeschiedenis1 * 0.4841 + valgeschiedenis2 * 0.6791 +
smoking * -0.2870 +
antiepileptica * 0.4962 +
ca_blocker * -0.1866 +
incont_med * 0.7459 +
coeff_education +
coeff_valangst;
var prediction = Math.round(100*(Math.exp(p1) / (1+ Math.exp(p1))));
document.getElementById('prediction').innerHTML = prediction + "%";

}

/*
<style>
tr.tableheader{
background-color: #ffcc99;
}
td.patdata{
background-color: #fff2e6;
}
</style>

</head>
<body onload="populate()">
<h1>Toelichting predictiemodel voor berekening valrisico</h1>
<p>Berekend valrisico: <div id = "prediction"></div></p>

<h2>Berekening</h2>
<p>Tabel: model voor berekening van de kans dat een pati&euml;nt van 65 jaar of ouder &eacute;&eacute;n of meer keer vallen binnen de komende 12 maanden:</p>
<p>Deze kans kan berekend worden door de co&euml;ffici&euml;nt waardes uit het model te combineren met de karakteristieken van de pati&euml;nt (zie tabel).  N.B.: Omdat het een voorspellingsmodel betreft, kunnen geen conclusies getrokken worden m.b.t. de causaliteit van de variabelen in het model.</p>
<table border = 1;>
<tr class="tableheader"><td>variabel</td><td>waarde</td><td>datum gemeten</td><td>coefficient</td></tr>
<tr><td>Intercept</td><td class = "patdata"></td><td class = "patdata"></td><td>-0.2047 +</td></tr>
<tr><td>Z-score depressie (GDS)</td><td class = "patdata"><div id = "GDS_score"></div></td><td class = "patdata"><div id = "GDS_date_measured"></div></td><td> 0.0778  * (GDS - 1.4401) / 1.9419 +</td></tr>
<tr><td>Z-score grijpkracht<sup>a</sup></td><td class = "patdata"><div id = "grip_kg"><div></td><td class = "patdata"><div id = "grip_date_measured"></div></td><td> -0.1678  * (kga  - 32.4838) / 10.8414 +</td></tr>
<tr><td>Z-score loopsnelheid<sup>b</sup></td><td class = "patdata"><div id = "walking_speed_m_per_s"></div></td><td class = "patdata"><div id = "walking_date_measured"></div></td><td> 0.0997 * (m/sb - 0.9417) / 0.2760 +</td></tr>
<tr><td>BMI </td><td class = "patdata"><div id = "BMI"></div></td><td class = "patdata"><div id = "BMI_date_measured"></div><div id = "height_date_measured"></div><div id = "weight_date_measured"</div></td><td> -0.0204 * kg/m2 +</td></tr>
<tr><td>Systolische bloeddruk<sup>c</sup></td><td class = "patdata"><div id = "systolic_bp_mmHg"></div></td><td class = "patdata"><div id = "bp_date_measured"></div></td><td> -0.0039 * mmHgc +</td></tr>
<tr><td>Kunt u een trap van 15 treden op- en aflopen zonder stil te moeten staan?<td class = "patdata"><div id = "functional_limit_trap"></div></td><td class = "patdata" rowspan = "5"></td><td rowspan = "5"></td></tr>
<tr><td>Kunt u zich aan- en uitkleden?<td class = "patdata"><div id = "functional_limit_kleding"></div></td><td></td></tr>
<tr><td>Kunt u gaan zitten en opstaan uit een stoel?<td class = "patdata"><div id = "functional_limit_stoel"></div></td><td></td></tr>
<tr><td>Kunt u de nagels van uw tenen knippen?<td class = "patdata"><div id = "functional_limit_nagels"></div></td><td></td></tr>
<tr><td>Kunt u buitenshuis vijf minuten aan &eacute;&eacute;n stuk lopen zonder stil te staan?<td class = "patdata"><div id = "functional_limit_lopen"></div></td><td></td></tr>
<tr><td>Z-score functionele beperkingen<sup>d</sup></td><td class = "patdata"><div id = "funct_beperk"></div></td><td class = "patdata"><div id = "functional_limit_date_measured"></div></td><td> 0.1419 * (beperkingen - 1.2088) / 1.5286 +</td></tr>
<tr><td>Valgeschiedenis: aantal valincidenten</td><td class = "patdata"><div id = "nr_falls_12m"></div></td><td class = "patdata"><div id = "nr_falls_date_measured"></div></td><td>1 val in vorige 12 maanden: 0.4841 + 2 of meer keer gevallen:  0.6791 +</td></tr>
<tr><td>Is de pati&euml;nt een roker?</td><td class = "patdata"><div id = "smoking"></div></td><td class = "patdata"><div id = "smoking_date_measured"></div></td><td> -0.2870 (als ja) +</td></tr>
<tr><td>Gebruik van anti-epileptica?</td><td class = "patdata"><div id = "antiepi_text"></div></td><td class = "patdata"></td><td>  0.4962 (als ja) +</td></tr>
<tr><td>Gebruik van calciumblokkers?</td><td class = "patdata"><div id = "ca_text"></div></td><td class = "patdata"></td><td> -0.1866 (als ja) +</td></tr>
<tr><td>Gebruik van incontinentie medicijnen? </td><td class = "patdata"><div id = "incont_text"></div></td><td class = "patdata"></td><td> 0.7459 (als ja) +</td></tr>
<tr><td>Hoogst behaalde opleiding<sup>e-i</sup></td><td class = "patdata"><div id = "education_level"></div></td><td class = "patdata"></td><td>
Basisschool; lager beroepsonderwijse; MULO, ULO, MACO; middelbaarberoepsonderwijsf; of MMS, HBS, Lyceum, Atheneum, of Gymnasium tot en met derde jaar: 0<br>
MMS, HBS, Lyceum, Atheneum, of Gymnasium geheel voltooid: 0.1972 (als ja) +<br>
Hoger beroepsonderwijsg; Universiteit of hogeschool: 0.3687 (als ja) +</td></tr>
<tr><td>FES: Het aan- of uitkleden</td><td class = "patdata"><div id = "FES_kleding"></div></td><td class = "patdata" rowspan = "7"></td><td rowspan = "7"></td></tr>
<tr><td>FES: Het nemen van een bad of douche</td><td class = "patdata"><div id = "FES_bad"></div></td><td class = "patdata"></td><td></td></tr>
<tr><td>FES: Het in of uit een stoel komen</td><td class = "patdata"><div id = "FES_stoel"></div></td><td class = "patdata"></td><td></td></tr>
<tr><td>FES: Het op- of aflopen van een trap</td><td class = "patdata"><div id = "FES_trap"></div></td><td class = "patdata"></td><td></td></tr>
<tr><td>FES: Het reiken naar iets boven uw hoofd of naar iets op de grond </td><td class = "patdata"><div id = "FES_reiken"></div></td><td class = "patdata"></td><td></td></tr>
<tr><td>FES: Het op- of aflopen van een helling</td><td class = "patdata"><div id = "FES_helling"></div></td><td class = "patdata"></td><td></td></tr>
<tr><td>FES: Het bezoeken van een sociale gelegenheid</td><td class = "patdata"><div id = "FES_sociale"></div></td><td class = "patdata"></td><td></td></tr>
<tr><td>Angst om te vallen</td><td class = "patdata"><div id = "valangst"></td><td class = "patdata"><div id = "fear_of_falls_date_measured"></div></td><td> 1: Tenminste een <q>Een beetje bezorgd</q> of <q>redelijk bezorgd</q> = 0.2268;<br>2: tenminste een <q>Erg bezorgd</q> = 0.2222</td></tr>
</table>

<p>
Voor het ontwikkelen van het model, waren de volgende regels gebruikt:
<br><sup>a</sup> Hoogst behaalde meting
<br><sup>b</sup> Deze snelheid is gebaseerd op een looptest waarin wordt gevraagd zo snel mogelijk te lopen
<br><sup>c</sup> In het geval van meerdere metingen moet het gemiddelde genomen worden
<br><sup>d</sup> Functionele beperkingen heeft de volgende items:
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
<br><sup>e</sup> lager beroepsonderwijs: LTS, LHNO, LEAO, handels(dag)school, huishoudschool, agrarische school, praktijkdiploma, middenstandsonderwijs
<br><sup>f</sup> middelbaarberoepsonderwijs: MBA, LO-akten, MTS, MEAO
<br><sup>g</sup> Hoger beroepsonderwijs:HTS, HEAO, MO-opleiding, kweekschool, sociale/pedagogische academie
<br><sup>h</sup> Helemaal niet bang: <q>Helemaal niet bezorgd</q> op alle items van de FES
<br><sup>i</sup> Een beetje bang: <q>Een beetje bezorgd</q> of <q>redelijk bezorgd</q> op een van de items van de FES
<br><sup>j</sup> Heel erg bang: <q>Erg bezorgd</q> op een van de items van de FES<br>
<br>Afkortingen: GDS; Geriatric Depression Scale (0-15), FES; Falls Efficacy Scale
</p>

<h2>Gebruik van model</h2>
<h3>Berekening</h3>
<p>Uit het model volgt een totaalscore. Ons algoritme rekent deze score om naar een kans middels de volgende formule:
<br>Probability = exp(score) / (1 + exp(score))
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
<p>Voor het maken van een selectie binnen de variabelen hebben we een backward elimination procedure toegepast. Hierbij begonnen we met een volledig model met alle mogelijke voorspellers. Vervolgens hebben we stapsgewijs de minst significante variabelen uit het model verwijderdt, totdat alle variabelen significant waren (P < 0.05).
</p>
<h2>Model validatie</h2>
<h3>Populatie</h3>
<p>Het uiteindelijke predictie model is gevalideerd in een onafhankelijke cohortstudie van poliklinische pati&euml;nten afkomstig uit de dagkliniek van de geriatrie afdeling van het UMC Utrecht. Metingen vonden plaats tussen 2012 en 2015. Het gaat om een kwetsbare groep ouderen, waarvan bij 58% sprake is van een valgeschiedenis.
</p>
<h3>Voorspellend vermogen van model</h3>
<p>Het voorspellend vermogen van een predictiemodel wordt over het algemeen bepaald aan de hand van kalibratie en discriminatie. Kalibratie heeft betrekking op in hoeverre de voorspelde kans om te vallen overeenkomen met de geobserveerde kans om te vallen. Discriminatie heeft betrekking op het vermogen van het model om onderscheid te maken tussen vallers en niet-vallers. Discriminatie wordt doorgaans gekwantificeerd met de c-statistic, die een waarde aanneemt tussen 0.50 (geen discriminatie) en 1 (perfecte discriminatie). De c-statistic van ons model was 0.69, wat in overeenstemming is met de discriminatie zoals gemeten in de populatie voor de ontwikkeling van het model.
</p>

<h3>Voorbeeld</h3>
<p>Stel we hebben de volgende pati&euml;nt:
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
<br>Score = -0.2047 +
<br>0.0778 * (1 - 1.4401) / 1.9419 +
<br>-0.1678  * (28.23 - 32.4838) / 10.8414 +
<br>0.0997 	* (0.51 - 0.9417) / 0.2760 +
<br>-0.0204 * 26.8 +
<br>-0.0039 * 128 +
<br>0.1419 	* (3 - 1.2088) / 1.5286 +
<br>0.4841 * 1 +
<br>0.6791 * 1 +
<br>-0.2870 * 0 +
<br>0.4962 * 0 +
<br>-0.1866 * 0 +
<br>0.7459 * 1 +
<br>0.1972 * 0 +
<br>0.3687 * 0 +
<br>0.2268 * 0 +
<br>0.2222 * 1 = 0.9492
<br>exp(0.9492) / (1 + exp(0.9492)) = 0.72 = 72%
</p>
<p>De pati&euml;nt heeft 72% kans om &eacute;&eacute;n keer of vaker te vallen in de komende 12 maanden.
</p>
<h2>Referenties</h2>
<ul>
<li>Denkinger, M. D., Franke, S., Rapp, K., Weinmayr, G., Duran-Tauleria, E., Nikolaus, T., & Peter, R. (2010). Accelerometer-based physical activity in a large observational cohort - Study protocol and design of the activity and function of the elderly in Ulm (ActiFE Ulm) study. BMC Geriatrics, 10. https://doi.org/10.1186/1471-2318-10-50</li>
<li>Hoogendijk, E. O., Deeg, D. J. H., Breij, S. De, Klokgieters, S. S., & Kok, A. A. L. (2019). The Longitudinal Aging Study Amsterdam?: cohort update 2019 and additional data collections. European Journal of Epidemiology, (0123456789). https://doi.org/10.1007/s10654-019-00541-2</li>
<li>Wijngaarden, V., Van Wijngaarden, J. P., Dhonukshe-Rutten, R. A., Van Schoor, N. M., Van Der Velde, N., Swart, K. M., Cpgm De Groot, L. (2011). Rationale and design of the B-PROOF study, a randomized controlled trial on the effect of supplemental intake of vitamin B12 and folic acid on fracture incidence Rationale and design of the B-PROOF study, a randomized controlled trial on the effect of sup. BMC Geriatrics, 11(December). https://doi.org/10.1186/1471-2318-11-80</li>
</ul>
*/