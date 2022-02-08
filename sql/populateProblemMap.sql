-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
/*
According to the internet, Lewy-bodies should get ICD-10 code G31.83
https://www.icd10data.com/ICD10CM/Codes/G00-G99/G30-G32/G31-/G31.83
Our codes are not specified to the 2nd decimal.
*/

SET CHARACTER SET 'utf8'; -- enable unicode support in older clients
INSERT INTO `problem_map`
(`amc_icd_id`,
`problem_name`,
`icd_10`,
`icd_name`)
VALUES
(3271,"hypertensie","I10","Essentiële (primaire) hypertensie"),
(3272,"hypertensie","I11.0","Hypertensieve hartziekte met (congestieve) hartdecompensatie"),
(3273,"hypertensie","I11.9","Hypertensieve hartziekte zonder (congestieve) hartdecompensatie"),
(3274,"hypertensie","I12.0","Hypertensieve nierziekte met nierinsufficiëntie"),
(3275,"hypertensie","I12.9","Hypertensieve nierziekte zonder nierinsufficiëntie"),
(3276,"hypertensie","I13.0","Hypertensieve hart- én nierziekte met (congestieve) hartdecompensatie"),
(3277,"hypertensie","I13.1","Hypertensieve hart- én nierziekte met nierinsufficiëntie"),
(3278,"hypertensie","I13.2","Hypertensieve hart- én nierziekte met (congestieve) hartdecompensatie én nierinsufficiëntie"),
(3279,"hypertensie","I13.9","Hypertensieve hart- én nierziekte, niet gespecificeerd"),
(3280,"hypertensie","I15.0","Renovasculaire hypertensie"),
(3281,"hypertensie","I15.1","Hypertensie secundair aan andere nieraandoeningen"),
(3282,"hypertensie","I15.2","Hypertensie secundair aan endocriene ziekten"),
(3283,"hypertensie","I15.8","Overige gespecificeerde vormen van secundaire hypertensie"),
(3284,"hypertensie","I15.9","Secundaire hypertensie, niet gespecificeerd"),
(3499,"hypertensie","I67.4","Hypertensieve encefalopathie"),
(3289,"myocardinfarct","I21.0","Acuut transmuraal myocardinfarct van voorwand"),
(3290,"myocardinfarct","I21.1","Acuut transmuraal myocardinfarct van onderwand"),
(3291,"myocardinfarct","I21.2","Acuut transmuraal myocardinfarct van overige gespecificeerde lokalisaties"),
(3292,"myocardinfarct","I21.3","Acuut transmuraal myocardinfarct, lokalisatie niet gespecificeerd"),
(3293,"myocardinfarct","I21.4","Acuut subendocardiaal myocardinfarct"),
(3294,"myocardinfarct","I21.9","Acuut myocardinfarct, niet gespecificeerd"),
(3295,"myocardinfarct","I22.0","Recidief myocardinfarct van voorwand"),
(3296,"myocardinfarct","I22.1","Recidief myocardinfarct van onderwand"),
(3297,"myocardinfarct","I22.8","Recidief myocardinfarct van overige gespecificeerde lokalisaties"),
(3298,"myocardinfarct","I22.9","Recidief myocardinfarct, lokalisatie niet gespecificeerd"),
(3299,"myocardinfarct","I23.0","Hemopericard als actuele complicatie na acuut myocardinfarct"),
(3300,"myocardinfarct","I23.1","Atriumseptumdefect als actuele complicatie na acuut myocardinfarct"),
(3301,"myocardinfarct","I23.2","Ventrikelseptumdefect als actuele complicatie na acuut myocardinfarct"),
(3302,"myocardinfarct","I23.3","Ruptuur van hartwand zonder hemopericard als actuele complicatie na acuut myocardinfarct"),
(3303,"myocardinfarct","I23.4","Ruptuur van chordae tendineae als actuele complicatie na acuut myocardinfarct"),
(3304,"myocardinfarct","I23.5","Ruptuur van papillaire spier als actuele complicatie na acuut myocardinfarct"),
(3305,"myocardinfarct","I23.6","Trombose van atrium, auricula en ventrikel als actuele complicaties na acuut myocardinfarct"),
(3306,"myocardinfarct","I23.8","Overige actuele complicaties na acuut myocardinfarct"),
(3307,"myocardinfarct","I24.0","Coronaire trombose niet leidend tot myocardinfarct"),
(3309,"myocardinfarct","I24.8","Overige gespecificeerde vormen van acute ischemische hartziekte"),
(3310,"myocardinfarct","I24.9","Acute ischemische hartziekte, niet gespecificeerd"),
(3313,"myocardinfarct","I25.2","Vroeger myocardinfarct"),
(3317,"myocardinfarct","I25.6","Subklinische [silent] myocardischemie"),
(3318,"myocardinfarct","I25.8","Overige gespecificeerde vormen van chronische ischemische hartziekte"),
(3319,"myocardinfarct","I25.9","Chronische ischemische hartziekte, niet gespecificeerd"),
(3624,"orthostatische-hypotensie","I95.1","Orthostatische hypotensie"),
(2245,"depressie","F20.4","Postschizofrene depressie"),
(2262,"depressie","F25.1","Schizoaffectieve stoornis, depressieve vorm"),
(2276,"depressie","F31.3","Bipolaire affectieve stoornis, huidige episode licht of matig depressief"),
(2277,"depressie","F31.4","Bipolaire affectieve stoornis, huidige episode ernstig depressief zonder psychotische symptomen"),
(2278,"depressie","F31.5","Bipolaire affectieve stoornis, huidige episode ernstig depressief met psychotische symptomen"),
(2283,"depressie","F32.0","Lichte depressieve episode"),
(2284,"depressie","F32.1","Matige depressieve episode"),
(2285,"depressie","F32.2","Ernstige depressieve episode zonder psychotische symptomen"),
(2286,"depressie","F32.3","Ernstige depressieve episode met psychotische symptomen"),
(2287,"depressie","F32.8","Overige gespecificeerde depressieve episoden"),
(2288,"depressie","F32.9","Depressieve episode, niet gespecificeerd"),
(2289,"depressie","F33.0","Recidiverende depressieve stoornis, huidige episode licht"),
(2290,"depressie","F33.1","Recidiverende depressieve stoornis, huidige episode matig ernstig"),
(2291,"depressie","F33.2","Recidiverende depressieve stoornis, huidige episode ernstig zonder psychotische symptomen"),
(2292,"depressie","F33.3","Recidiverende depressieve stoornis, huidige episode ernstig met psychotische symptomen"),
(2293,"depressie","F33.4","Recidiverende depressieve stoornis, momenteel in remissie"),
(2294,"depressie","F33.8","Overige gespecificeerde recidiverende depressieve stoornissen"),
(2295,"depressie","F33.9","Recidiverende depressieve stoornis, niet gespecificeerd"),
(2311,"depressie","F41.2","Gemengde angststoornis en depressieve stoornis"),
(2481,"depressie","F92.0","Depressieve gedragsstoornis"),
(40347,"hartfalen","I11.0","Hypertensieve hartziekte met (congestieve) hartdecompensatie"),
(40348,"hartfalen","I13.0","Hypertensieve hart- én nierziekte met (congestieve) hartdecompensatie"),
(40349,"hartfalen","I13.2","Hypertensieve hart- én nierziekte met (congestieve) hartdecompensatie én nierinsufficiëntie"),
(null,"hartfalen","I09.81","Rheumatic heart failure"),
(3434,"hartfalen","I50.0","Hartdecompensatie met stuwing"),
(3435,"hartfalen","I50.1","Linker-ventrikeldecompensatie"),
(3436,"hartfalen","I50.9","Hartdecompensatie, niet gespecificeerd"),
(2807,"autonoom-falen","G90.0","Idiopathische perifere autonome neuropathie"),
(2808,"autonoom-falen","G90.1","Familiale dysautonomie [Riley-Day]"),
(2809,"autonoom-falen","G90.2","Syndroom van Horner"),
(2811,"autonoom-falen","G90.4","Dysreflexiesyndroom van autonoom zenuwstelsel"),
(2812,"autonoom-falen","G90.5","Complex regionaal pijnsyndroom type 1 (CRPS-1)"),
(2813,"autonoom-falen","G90.6","Complex regionaal pijnsyndroom type 2 (CRPS-2)"),
(2814,"autonoom-falen","G90.7","Complex regionaal pijnsyndroom (CRPS), overig"),
(2815,"autonoom-falen","G90.8","Overige gespecificeerde aandoeningen van autonoom zenuwstelsel"),
(2816,"autonoom-falen","G90.9","Aandoening van autonoom zenuwstelsel, niet gespecificeerd"),
(2116,"parkinson","F02.3*","Dementie bij ziekte van Parkinson (G20+)"),
(2563,"parkinson","G20","Ziekte van Parkinson"),
(2565,"parkinson","G21.1","Overige vormen van secundair parkinsonisme ten gevolge van geneesmiddelengebruik"),
(2566,"parkinson","G21.2","Secundair parkinsonisme door overige uitwendige agentia"),
(2567,"parkinson","G21.3","Postencefalitisch parkinsonisme"),
(2568,"parkinson","G21.4","Vasculair parkinsonisme"),
(2569,"parkinson","G21.8","Overige gespecificeerde vormen van secundair parkinsonisme"),
(2570,"parkinson","G21.9","Secundair parkinsonisme, niet gespecificeerd"),
(2571,"parkinson","G22*","Parkinsonisme bij elders geclassificeerde ziekten"),
(2574,"parkinson","G23.2","Multipele systeem atrofie, met parkinsonisme [MSA-p]"),
(2603,"lewy-bodies-dementia","G31.8","Overige gespecificeerde degeneratieve ziekten van zenuwstelsel"),
(40350,"multiple-system-atrophy","G23.2","Multipele systeem atrofie, met parkinsonisme [MSA-p]"),
(2575,"multiple-system-atrophy","G23.3","Multipele systeem atrofie, cerebellair type [MSA-c]"),
(2810,"multiple-system-atrophy","G90.3","Multi-systeemdegeneratie"),
(2573,"progressive-supranuclear-palsy","G23.1","Progressieve supranucleaire oftalmoplegie [Steele-Richardson-Olszewski]"),
(2129,"angststoornis","F06.4","Organische angststoornis"),
(2307,"angststoornis","F40.8","Overige gespecificeerde fobische-angststoornissen"),
(2308,"angststoornis","F40.9","Fobische-angststoornis, niet gespecificeerd"),
(2309,"angststoornis","F41.0","Paniekstoornis [episodische paroxismale angst]"),
(2310,"angststoornis","F41.1","Gegeneraliseerde angststoornis"),
(40351,"angststoornis","F41.2","Gemengde angststoornis en depressieve stoornis"),
(2312,"angststoornis","F41.3","Andere gemengde angststoornissen"),
(2313,"angststoornis","F41.8","Overige gespecificeerde angststoornissen"),
(2314,"angststoornis","F41.9","Angststoornis, niet gespecificeerd"),
(2358,"angststoornis","F51.4","Pavor nocturnus [nachtelijke panische angstgevoelens]"),
(2385,"angststoornis","F60.6","Angstige [ontwijkende] persoonlijkheidsstoornis"),
(2450,"epilepsy","F80.3","Verworven afasie met epilepsie [Landau-Kleffner]"),
(2620,"epilepsy","G40.0","Lokalisatiegebonden (focale)(partiële) idiopathische epilepsie en epileptische syndromen met aanvallen van lokale oorsprong"),
(2621,"epilepsy","G40.1","Lokalisatiegebonden (focale)(partiële) symptomatische epilepsie en epileptische syndromen met eenvoudige partiële aanvallen"),
(2622,"epilepsy","G40.2","Lokalisatiegebonden (focale)(partiële) symptomatische epilepsie en epileptische syndromen met complexe partiële aanvallen"),
(2623,"epilepsy","G40.3","Gegeneraliseerde idiopathische epilepsie en epileptische syndromen"),
(2624,"epilepsy","G40.4","Overige vormen van gegeneraliseerde epilepsie en epileptische syndromen"),
(2625,"epilepsy","G40.5","Speciale epileptische syndromen"),
(2628,"epilepsy","G40.8","Overige gespecificeerde vormen van epilepsie"),
(2629,"epilepsy","G40.9","Epilepsie, niet gespecificeerd"),
(2630,"epilepsy","G41.0","Grand mal status epilepticus"),
(2631,"epilepsy","G41.1","Petit mal status epilepticus"),
(2632,"epilepsy","G41.2","Complexe partiële status epilepticus"),
(2633,"epilepsy","G41.8","Overige gespecificeerde vormen van status epilepticus"),
(2634,"epilepsy","G41.9","Status epilepticus, niet gespecificeerd"),
(2121,"delier","F05.0","Delirium, niet gesuperponeerd op dementie en aldus beschreven"),
(2122,"delier","F05.1","Delirium, gesuperponeerd op dementie"),
(2123,"delier","F05.8","Overige gespecificeerde vormen van delirium"),
(2124,"delier","F05.9","Delirium, niet gespecificeerd"),
(2103,"dementie","F00.0*","Dementie bij vroeg optredende ziekte van Alzheimer (G30.0+)"),
(2104,"dementie","F00.1*","Dementie bij laat optredende ziekte van Alzheimer (G30.1+)"),
(2105,"dementie","F00.2*","Dementie bij ziekte van Alzheimer, atypisch of gemengd type (G30.8+)"),
(2106,"dementie","F00.9*","Dementie bij ziekte van Alzheimer, niet gespecificeerd (G30.9+)"),
(2107,"dementie","F01.0","Vasculaire dementie met acuut begin"),
(2108,"dementie","F01.1","Multi-infarct dementie"),
(2109,"dementie","F01.2","Subcorticale vasculaire dementie"),
(2110,"dementie","F01.3","Gemengde corticale en subcorticale vormen van vasculaire dementie"),
(2111,"dementie","F01.8","Overige gespecificeerde vormen van vasculaire dementie"),
(2112,"dementie","F01.9","Vasculaire dementie, niet gespecificeerd"),
(2113,"dementie","F02.0*","Dementie bij ziekte van Pick (G31.0+)"),
(2114,"dementie","F02.1*","Dementie bij ziekte van Creutzfeldt-Jakob (A81.0+)"),
(2115,"dementie","F02.2*","Dementie bij ziekte van Huntington (G10+)"),
(2117,"dementie","F02.4*","Dementie bij AIDS [ziekte door Humaan Immunodeficiëntievirus, HIV] (B22.0+)"),
(2118,"dementie","F02.8*","Dementie bij overige gespecificeerde elders geclassificeerde ziekten"),
(2119,"dementie","F03","Niet gespecificeerde dementie"),
(40352,"dementie","F05.1","Delirium, gesuperponeerd op dementie"),
(2127,"schizofrenie","F06.2","Organische [schizofrenie-achtige] waanstoornis"),
(2241,"schizofrenie","F20.0","Paranoïde schizofrenie"),
(2242,"schizofrenie","F20.1","Hebefrene schizofrenie"),
(2243,"schizofrenie","F20.2","Katatone schizofrenie"),
(2244,"schizofrenie","F20.3","Ongedifferentieerde schizofrenie"),
(2246,"schizofrenie","F20.5","Schizofrene resttoestand"),
(2248,"schizofrenie","F20.8","Overige gespecificeerde vormen van schizofrenie"),
(2249,"schizofrenie","F20.9","Schizofrenie, niet gespecificeerd"),
(2255,"schizofrenie","F23.1","Acute polymorfe psychotische stoornis met symptomen van schizofrenie"),
(2256,"schizofrenie","F23.2","Acute schizofrenie-achtige psychotische stoornis"),
(2079,"hyponatremia","E87.1","Hypo-osmolaliteit en hyponatriëmie"),
(14157,"tachycardia","R00.0","Tachycardie, niet gespecificeerd"),
(3395,"arrhythmia","I44.0","Eerstegraads atrioventriculair block"),
(3396,"arrhythmia","I44.1","Tweedegraads atrioventriculair block"),
(3397,"arrhythmia","I44.2","Totaal atrioventriculair block"),
(3398,"arrhythmia","I44.3","Overig en niet gespecificeerd atrioventriculair block"),
(3399,"arrhythmia","I44.4","Linker anterior fasciculair block"),
(3400,"arrhythmia","I44.5","Linker posterior fasciculair block"),
(3401,"arrhythmia","I44.6","Overig en niet gespecificeerd fasciculair block"),
(3402,"arrhythmia","I44.7","Linker-bundeltakblock, niet gespecificeerd"),
(3403,"arrhythmia","I45.0","Rechter fasciculair block"),
(3404,"arrhythmia","I45.1","Overig en niet gespecificeerd rechter-bundeltakblock"),
(3405,"arrhythmia","I45.2","Bifasciculair block"),
(3406,"arrhythmia","I45.3","Trifasciculair block"),
(3407,"arrhythmia","I45.4","Niet-specifiek intraventriculair block"),
(3408,"arrhythmia","I45.5","Overige gespecificeerde vormen van hartblock"),
(3409,"arrhythmia","I45.6","Pre-excitatiesyndroom"),
(3410,"arrhythmia","I45.8","Overige gespecificeerde geleidingsstoornissen"),
(3411,"arrhythmia","I45.9","Geleidingsstoornis, niet gespecificeerd"),
(3415,"arrhythmia","I47.0","Re-entry ventriculaire aritmie"),
(3416,"arrhythmia","I47.1","Supraventriculaire tachycardie"),
(3417,"arrhythmia","I47.2","Ventriculaire tachycardie"),
(3418,"arrhythmia","I47.9","Paroxismale tachycardie, niet gespecificeerd"),
(3419,"arrhythmia","I48","Atriumfibrillatie en -flutter"),
(3420,"arrhythmia","I48.0","Paroxismaal atriumfibrilleren"),
(3421,"arrhythmia","I48.1","Persisterend atriumfibrilleren"),
(3422,"arrhythmia","I48.2","Chronisch atriumfibrilleren"),
(3423,"arrhythmia","I48.3","Typische atriumflutter"),
(3424,"arrhythmia","I48.4","Atypische atriumflutter"),
(3425,"arrhythmia","I48.9","Atriumfibrilleren en -flutter, niet gespecificeerd"),
(3426,"arrhythmia","I49.0","Ventrikelfibrillatie en -flutter"),
(3427,"arrhythmia","I49.1","Atriale premature depolarisatie"),
(3428,"arrhythmia","I49.2","Junctionele premature depolarisatie"),
(3429,"arrhythmia","I49.3","Ventriculaire premature depolarisatie"),
(3430,"arrhythmia","I49.4","Overige en niet gespecificeerde premature depolarisatie"),
(3431,"arrhythmia","I49.5","Sick sinus syndrome"),
(3432,"arrhythmia","I49.8","Overige gespecificeerde hartritmestoornissen"),
(3433,"arrhythmia","I49.9","Ritmestoornis, niet gespecificeerd"),
(null,"arrhythmia","T82.1","Mechanische complicatie van cardiale pacemaker"),
(null,"arrhythmia","Z95.0","Aanwezigheid van elektronische cardiale hulpmiddelen"),
(2063,"hypercalciemie","E83.5","Stoornissen van calciummetabolisme"),
(5234,"jicht","M10.00","Idiopathische jicht van multipele lokalisaties"),
(5235,"jicht","M10.01","Idiopathische jicht van schoudergebied"),
(5236,"jicht","M10.02","Idiopathische jicht, van bovenarm"),
(5237,"jicht","M10.03","Idiopathische jicht, van onderarm"),
(5238,"jicht","M10.04","Idiopathische jicht, van hand"),
(5239,"jicht","M10.05","Idiopathische jicht van bekkengebied en bovenbeen"),
(5240,"jicht","M10.06","Idiopathische jicht van onderbeen"),
(5241,"jicht","M10.07","Idiopathische jicht van enkel en voet"),
(5242,"jicht","M10.08","Idiopathische jicht; Overige gespecificeerde lokalisaties"),
(5243,"jicht","M10.09","Idiopathische jicht van lokalisatie niet gespecificeerd"),
(5244,"jicht","M10.10","Door lood geïnduceerde jicht van multipele lokalisaties"),
(5245,"jicht","M10.11","Door lood geïnduceerde jicht van schoudergebied"),
(5246,"jicht","M10.12","Door lood geïnduceerde jicht, van bovenarm"),
(5247,"jicht","M10.13","Door lood geïnduceerde jicht, van onderarm"),
(5248,"jicht","M10.14","Door lood geïnduceerde jicht, van hand"),
(5249,"jicht","M10.15","Door lood geïnduceerde jicht van bekkengebied en bovenbeen"),
(5250,"jicht","M10.16","Door lood geïnduceerde jicht van onderbeen"),
(5251,"jicht","M10.17","Door lood geïnduceerde jicht van enkel en voet"),
(5252,"jicht","M10.18","Door lood geïnduceerde jicht; Overige gespecificeerde lokalisaties"),
(5253,"jicht","M10.19","Door lood geïnduceerde jicht van lokalisatie niet gespecificeerd"),
(5254,"jicht","M10.20","Door geneesmiddel geïnduceerde jicht van multipele lokalisaties"),
(5255,"jicht","M10.21","Door geneesmiddel geïnduceerde jicht van schoudergebied"),
(5256,"jicht","M10.22","Door geneesmiddel geïnduceerde jicht, van bovenarm"),
(5257,"jicht","M10.23","Door geneesmiddel geïnduceerde jicht, van onderarm"),
(5258,"jicht","M10.24","Door geneesmiddel geïnduceerde jicht, van hand"),
(5259,"jicht","M10.25","Door geneesmiddel geïnduceerde jicht van bekkengebied en bovenbeen"),
(5260,"jicht","M10.26","Door geneesmiddel geïnduceerde jicht, van onderbeen"),
(5261,"jicht","M10.27","Door geneesmiddel geïnduceerde jicht van enkel en voet"),
(5262,"jicht","M10.28","Door geneesmiddel geïnduceerde jicht; Overige gespecificeerde lokalisaties"),
(5263,"jicht","M10.29","Door geneesmiddel geïnduceerde jicht van lokalisatie niet gespecificeerd"),
(5264,"jicht","M10.30","Jicht door verminderde nierfunctie van multipele lokalisaties"),
(5265,"jicht","M10.31","Jicht door verminderde nierfunctie, van schoudergebied"),
(5266,"jicht","M10.32","Jicht door verminderde nierfunctie, van bovenarm"),
(5267,"jicht","M10.33","Jicht door verminderde nierfunctie, van onderarm"),
(5268,"jicht","M10.34","Jicht door verminderde nierfunctie, van hand"),
(5269,"jicht","M10.35","Jicht door verminderde nierfunctie, van bekkengebied en bovenbeen"),
(5270,"jicht","M10.36","Jicht door verminderde nierfunctie, van onderbeen"),
(5271,"jicht","M10.37","Jicht door verminderde nierfunctie, van enkel en voet"),
(5272,"jicht","M10.38","Jicht door verminderde nierfunctie; Overige gespecificeerde lokalisaties"),
(5273,"jicht","M10.39","Jicht door verminderde nierfunctie van lokalisatie niet gespecificeerd"),
(5274,"jicht","M10.40","Overige secundaire jicht van multipele lokalisaties"),
(5275,"jicht","M10.41","Overige secundaire jicht van schoudergebied"),
(5276,"jicht","M10.42","Overige secundaire jicht, van bovenarm"),
(5277,"jicht","M10.43","Overige secundaire jicht, van onderarm"),
(5278,"jicht","M10.44","Overige secundaire jicht, van hand"),
(5279,"jicht","M10.45","Overige secundaire jicht van bekkengebied en bovenbeen"),
(5280,"jicht","M10.46","Overige secundaire jicht van onderbeen"),
(5281,"jicht","M10.47","Overige secundaire jicht van enkel en voet"),
(5282,"jicht","M10.48","Overige secundaire jicht; Overige gespecificeerde lokalisaties"),
(5283,"jicht","M10.49","Overige secundaire jicht van lokalisatie niet gespecificeerd"),
(5284,"jicht","M10.90","Jicht, niet gespecificeerd, van multipele lokalisaties"),
(5285,"jicht","M10.91","Jicht, niet gespecificeerd van schoudergebied"),
(5286,"jicht","M10.92","Jicht, niet gespecificeerd, van bovenarm"),
(5287,"jicht","M10.93","Jicht, niet gespecificeerd, van onderarm"),
(5288,"jicht","M10.94","Jicht, niet gespecificeerd, van hand"),
(5289,"jicht","M10.95","Jicht, niet gespecificeerd van bekkengebied en bovenbeen"),
(5290,"jicht","M10.96","Jicht, niet gespecificeerd, van onderbeen"),
(5291,"jicht","M10.97","Jicht, niet gespecificeerd, van enkel en voet"),
(5292,"jicht","M10.98","Jicht, niet gespecificeerd; Overige gespecificeerde lokalisaties"),
(5293,"jicht","M10.99","Jicht, niet gespecificeerd van lokalisatie niet gespecificeerd"),
(5454,"jicht","M14.0*","Jichtartropathie door elders geclassificeerde enzymdefecten en overige erfelijke aandoeningen"),
(40353,"atriumfibrilleren","I48.0","Paroxismaal atriumfibrilleren"),
(40354,"atriumfibrilleren","I48.1","Persisterend atriumfibrilleren"),
(40355,"atriumfibrilleren","I48.2","Chronisch atriumfibrilleren"),
(40356,"atriumfibrilleren","I48.3","Typische atriumflutter"),
(40357,"atriumfibrilleren","I48.4","Atypische atriumflutter"),
(40358,"atriumfibrilleren","I48.9","Atriumfibrilleren en -flutter, niet gespecificeerd"),
(3285,"angina-pectoris","I20.0","Instabiele angina pectoris"),
(3286,"angina-pectoris","I20.1","Angina pectoris met gedocumenteerde spasme"),
(3287,"angina-pectoris","I20.8","Overige gespecificeerde vormen van angina pectoris"),
(3288,"angina-pectoris","I20.9","Angina pectoris, niet gespecificeerd"),
(2550,"paraplegia","G11.4","Hereditaire spastische paraplegie"),
(null,"paraplegia","G80.0","Spastische quadraplegische cerebrale paralyse"),
(null,"paraplegia","G80.1","Spastische diplegische cerebrale paralyse"),
(null,"paraplegia","G80.2","Spastische hemiplegische cerebrale paralyse"),
(null,"paraplegia","G80.3","Dyskinetische cerebrale paralyse"),
(null,"paraplegia","G80.4","Atactische cerebrale paralyse"),
(null,"paraplegia","G80.8","Overige gespecificeerde vormen van cerebrale paralyse"),
(null,"paraplegia","G80.9","Cerebrale paralyse, niet gespecificeerd"),
(null,"paraplegia","G81.0","Hypotone hemiplegie"),
(null,"paraplegia","G81.1","Hypertone hemiplegie"),
(null,"paraplegia","G81.9","Hemiplegie, niet gespecificeerd"),
(2792,"paraplegia","G82.0","Hypotone paraplegie"),
(2793,"paraplegia","G82.1","Hypertone paraplegie"),
(2794,"paraplegia","G82.2","Paraplegie, niet gespecificeerd"),
(null,"paraplegia","G82.3","Hypotone tetraplegie"),
(null,"paraplegia","G82.4","Hypertone tetraplegie"),
(null,"paraplegia","G82.5","Tetraplegie, niet gespecificeerd"),
(null,"paraplegia","G83.0","Diplegia van armen"),
(null,"paraplegia","G83.1","Monoplegie van been"),
(null,"paraplegia","G83.2","Monoplegie van arm"),
(null,"paraplegia","G83.3","Monoplegie, niet gespecificeerd"),
(null,"paraplegia","G83.4","Cauda-equinasyndroom"),
(null,"paraplegia","G83.6","Facialisparalyse door centrale motorische neuronen"),
(null,"paraplegia","G83.8","Overige gespecificeerde paralytische syndromen"),
(null,"paraplegia","G83.9","Paralytisch syndroom, niet gespecificeerd"),
(null,"paraplegia","G90.0","Idiopathische perifere autonome neuropathie"),
(6862,"paraplegia","M62.30","Immobiliteitssyndroom (paraplegisch) van multipele lokalisaties"),
(6863,"paraplegia","M62.31","Immobiliteitssyndroom (paraplegisch) van schoudergebied"),
(6864,"paraplegia","M62.32","Immobiliteitssyndroom (paraplegisch) van bovenarm"),
(6865,"paraplegia","M62.33","Immobiliteitssyndroom (paraplegisch) van onderarm"),
(6866,"paraplegia","M62.34","Immobiliteitssyndroom (paraplegisch) van hand"),
(6867,"paraplegia","M62.35","Immobiliteitssyndroom (paraplegisch) van bekkengebied en bovenbeen"),
(6868,"paraplegia","M62.36","Immobiliteitssyndroom (paraplegisch) van onderbeen"),
(6869,"paraplegia","M62.37","Immobiliteitssyndroom (paraplegisch) van enkel en voet"),
(6870,"paraplegia","M62.38","Immobiliteitssyndroom (paraplegisch) van overige gespecificeerde lokalisaties"),
(6871,"paraplegia","M62.39","Immobiliteitssyndroom (paraplegisch) van lokalisatie niet gespecificeerd"),
(14629,"dwaarslaesie","S14.0","Concussie en oedeem van cervicale ruggenmerg"),
(14630,"dwaarslaesie","S14.1","Overige en niet gespecificeerde letsels van cervicale ruggenmerg"),
(14631,"dwaarslaesie","S14.2","Letsel van zenuwwortel van cervicale wervelkolom"),
(14686,"dwaarslaesie","S24.0","Concussie en oedeem van thoracale ruggenmerg"),
(14687,"dwaarslaesie","S24.1","Overige en niet gespecificeerde letsels van thoracale ruggenmerg"),
(14688,"dwaarslaesie","S24.2","Letsel van zenuwwortel van thoracale wervelkolom"),
(14772,"dwaarslaesie","S34.0","Concussie en oedeem van lumbale ruggenmerg"),
(14773,"dwaarslaesie","S34.1","Overig letsel van lumbale ruggenmerg"),
(14774,"dwaarslaesie","S34.2","Letsel van zenuwwortel van lumbale en sacrale wervelkolom"),
(15284,"dwaarslaesie","T06.0","Letsels van hersenen en hersenzenuwen met letsels van zenuwen en ruggenmerg op cervicaal niveau"),
(15285,"dwaarslaesie","T06.1","Letsels van zenuwen en ruggenmerg van overige multipele lichaamsregio\'s"),
(15297,"dwaarslaesie","T09.3","Letsel van ruggenmerg, niveau niet gespecificeerd"),
(15298,"dwaarslaesie","T09.4","Letsel van niet gespecificeerde zenuw, zenuwwortel en spinale plexus van romp"),
(15884,"dwaarslaesie","T91.3","Late gevolgen van letsel van ruggenmerg"),
(1775,"diabetes","E10.0","Type 1 diabetes mellitus; Met coma"),
(1776,"diabetes","E10.1","Type 1 diabetes mellitus; Met ketoacidose"),
(1777,"diabetes","E10.2","Type 1 diabetes mellitus; Met niercomplicaties"),
(1778,"diabetes","E10.2+","Type 1 diabetes mellitus; Met niercomplicaties"),
(1779,"diabetes","E10.3","Type 1 diabetes mellitus; Met oogcomplicaties"),
(1780,"diabetes","E10.3+","Type 1 diabetes mellitus; Met oogcomplicaties"),
(1781,"diabetes","E10.4","Type 1 diabetes mellitus; Met neurologische complicaties"),
(1782,"diabetes","E10.4+","Type 1 diabetes mellitus; Met neurologische complicaties"),
(1783,"diabetes","E10.5","Type 1 diabetes mellitus; Met complicaties van perifere circulatie"),
(1784,"diabetes","E10.6","Type 1 diabetes mellitus; Met overige gespecificeerde complicaties"),
(1785,"diabetes","E10.7","Type 1 diabetes mellitus; Met multiple complicaties"),
(1786,"diabetes","E10.8","Type 1 diabetes mellitus; Met niet gespecificeerde complicaties"),
(1787,"diabetes","E10.9","Type 1 diabetes mellitus; Zonder complicaties"),
(1788,"diabetes","E11.0","Type 2 diabetes mellitus; Met coma"),
(1789,"diabetes","E11.1","Type 2 diabetes mellitus; Met ketoacidose"),
(1790,"diabetes","E11.2","Type 2 diabetes mellitus; Met niercomplicaties"),
(1791,"diabetes","E11.2+","Type 2 diabetes mellitus; Met niercomplicaties"),
(1792,"diabetes","E11.3","Type 2 diabetes mellitus; Met oogcomplicaties"),
(1793,"diabetes","E11.3+","Type 2 diabetes mellitus; Met oogcomplicaties"),
(1794,"diabetes","E11.4","Type 2 diabetes mellitus; Met neurologische complicaties"),
(1795,"diabetes","E11.4+","Type 2 diabetes mellitus; Met neurologische complicaties"),
(1796,"diabetes","E11.5","Type 2 diabetes mellitus; Met complicaties van perifere circulatie"),
(1797,"diabetes","E11.6","Type 2 diabetes mellitus; Met overige gespecificeerde complicaties"),
(1798,"diabetes","E11.7","Type 2 diabetes mellitus; Met multiple complicaties"),
(1799,"diabetes","E11.8","Type 2 diabetes mellitus; Met niet gespecificeerde complicaties"),
(1800,"diabetes","E11.9","Type 2 diabetes mellitus; Zonder complicaties"),
(1801,"diabetes","E12.0","Diabetes mellitus verband houdend met ondervoeding; Met coma"),
(1802,"diabetes","E12.1","Diabetes mellitus verband houdend met ondervoeding; Met ketoacidose"),
(1803,"diabetes","E12.2+","Diabetes mellitus verband houdend met ondervoeding; Met niercomplicaties"),
(1804,"diabetes","E12.3+","Diabetes mellitus verband houdend met ondervoeding; Met oogcomplicaties"),
(1805,"diabetes","E12.4","Diabetes mellitus verband houdend met ondervoeding; Met neurologische complicaties"),
(1806,"diabetes","E12.4+","Diabetes mellitus verband houdend met ondervoeding; Met neurologische complicaties"),
(1807,"diabetes","E12.5","Diabetes mellitus verband houdend met ondervoeding; Met complicaties van perifere circulatie"),
(1808,"diabetes","E12.6","Diabetes mellitus verband houdend met ondervoeding; Met overige gespecificeerde complicaties"),
(1809,"diabetes","E12.7","Diabetes mellitus verband houdend met ondervoeding; Met multiple complicaties"),
(1810,"diabetes","E12.8","Diabetes mellitus verband houdend met ondervoeding; Met niet gespecificeerde complicaties"),
(1811,"diabetes","E12.9","Diabetes mellitus verband houdend met ondervoeding; Zonder complicaties"),
(1812,"diabetes","E13.0","Overige gespecificeerde vormen van diabetes mellitus; Met coma"),
(1813,"diabetes","E13.1","Overige gespecificeerde vormen van diabetes mellitus; Met ketoacidose"),
(1814,"diabetes","E13.2","Overige gespecificeerde vormen van diabetes mellitus; Met niercomplicaties"),
(1815,"diabetes","E13.2+","Overige gespecificeerde vormen van diabetes mellitus; Met niercomplicaties"),
(1816,"diabetes","E13.3","Overige gespecificeerde vormen van diabetes mellitus; Met oogcomplicaties"),
(1817,"diabetes","E13.3+","Overige gespecificeerde vormen van diabetes mellitus; Met oogcomplicaties"),
(1818,"diabetes","E13.4","Overige gespecificeerde vormen van diabetes mellitus; Met neurologische complicaties"),
(1819,"diabetes","E13.4+","Overige gespecificeerde vormen van diabetes mellitus; Met neurologische complicaties"),
(1820,"diabetes","E13.5","Overige gespecificeerde vormen van diabetes mellitus; Met complicaties van perifere circulatie"),
(1821,"diabetes","E13.6","Overige gespecificeerde vormen van diabetes mellitus; Met overige gespecificeerde complicaties"),
(1822,"diabetes","E13.7","Overige gespecificeerde vormen van diabetes mellitus; Met multiple complicaties"),
(1823,"diabetes","E13.8","Overige gespecificeerde vormen van diabetes mellitus; Met niet gespecificeerde complicaties"),
(1824,"diabetes","E13.9","Overige gespecificeerde vormen van diabetes mellitus; Zonder complicaties"),
(1825,"diabetes","E14.0","Niet gespecificeerde diabetes mellitus; Met coma"),
(1826,"diabetes","E14.1","Niet gespecificeerde diabetes mellitus; Met ketoacidose"),
(1827,"diabetes","E14.2","Niet gespecificeerde diabetes mellitus; Met niercomplicaties"),
(1828,"diabetes","E14.2+","Niet gespecificeerde diabetes mellitus; Met niercomplicaties"),
(1829,"diabetes","E14.3","Niet gespecificeerde diabetes mellitus; Met oogcomplicaties"),
(1830,"diabetes","E14.3+","Niet gespecificeerde diabetes mellitus; Met oogcomplicaties"),
(1831,"diabetes","E14.4","Niet gespecificeerde diabetes mellitus; Met neurologische complicaties"),
(1832,"diabetes","E14.4+","Niet gespecificeerde diabetes mellitus; Met neurologische complicaties"),
(1833,"diabetes","E14.5","Niet gespecificeerde diabetes mellitus; Met complicaties van perifere circulatie"),
(1834,"diabetes","E14.6","Niet gespecificeerde diabetes mellitus; Met overige gespecificeerde complicaties"),
(1835,"diabetes","E14.7","Niet gespecificeerde diabetes mellitus; Met multiple complicaties"),
(1836,"diabetes","E14.8","Niet gespecificeerde diabetes mellitus; Met niet gespecificeerde complicaties"),
(1837,"diabetes","E14.9","Niet gespecificeerde diabetes mellitus; Zonder complicaties"),
(2730,"diabetes","G59.0*","Diabetische mononeuropathie (E10-E14+ met gemeenschappelijk vierde teken .4)"),
(2749,"diabetes","G63.2*","Diabetische polyneuropathie (E10-E14+ met gemeenschappelijk vierde teken .4)"),
(2981,"diabetes","H28.0*","Diabetisch cataract (E10-E14+ met gemeenschappelijk vierde teken .3)"),
(3021,"diabetes","H36.0*","Diabetische retinopathie (E10-E14+ met gemeenschappelijk vierde teken .3)"),
(5456,"diabetes","M14.2*","Diabetische artropathie (E10-E14+ met gemeenschappelijk vierde teken .6)"),
(12403,"diabetes","N08.3*","Glomerulaire aandoeningen bij diabetes mellitus (E10-E14+ met gemeenschappelijk vierde teken .2)");
