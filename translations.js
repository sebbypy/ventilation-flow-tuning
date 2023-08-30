
var translationsDataBase={
	"title":
		{"EN":"Flow rate adjustment of ventilation network",
		"FR":"Réglage d'un réseau de ventilation",
		"NL":"Afstelling van ventilatie netwerk"},
	"fillinputs":
		{"EN":"Network data",
		"FR":"Données du réseau",
		"NL":"Netwerk data"},
    "initivalvaluessection":
        {"EN":"Network initialization",
		"FR":"Données d'initialisation du réseau",
		"NL":"Netwerk initialisatie"},
    "numberofvents":
		{"EN":"Number of vents",
		"FR":"Nombre de bouches",
		"NL":"Aantal ventielen"},
    "inittotalflowrate":
        {"EN":"Total flow rate for initialization (50% fan speed)",
		"FR":"Débit total pour l'initialisation (vitesse du ventilateur à 50%)",
		"NL":"Totaal debiet voor initializatie (50% ventilator capaciteit"},        
    "inittype":
        {"EN":"Network pressure losses definition",
		"FR":"Définition des pertes de pression du réseau",
		"NL":"Definitie van netwerk drukverliezen"},        
    "random_pressure_drops":
        {"EN":"Random initial flow rates",
		"FR":"Débits aléatoires",
		"NL":"Random debieten"},        
    "balanced_pressure_drops":
        {"EN":"Uniform flow rates",
		"FR":"Débits uniformes",
		"NL":"Gelijk debieten"},
    "from_user_defined_flow_rates":
        {"EN":"User defined flow rates",
		"FR":"Débits définis par l'utilisateur",
		"NL":"Debieten genefineerd door gebruiker"},    
    "initial_flow_rates":
        {"EN":"Initial flow rates",
		"FR":"Débits initiaux",
		"NL":"Initiele debieten"},    
	"targetvaluessection":
		{"EN":"Target flow rates",
		"FR":"Débits à atteindre",
		"NL":"Debieten te bereiken"},
	"targettype":
		{"EN":"Definition",
		"FR":"Définition",
		"NL":"Definitie"},
	"uniform_target":
		{"EN":"Uniform flow rates",
		"FR":"Débits uniformes",
		"NL":"Gelijk debieten"},
    "user_defined_targets":
        {"EN":"User defined flow rates",
		"FR":"Débits définis par l'utilisateur",
		"NL":"Debieten genefineerd door gebruiker"},    
    "targetvalues":{
        "EN":"Target values",
		"FR":"Valeurs à atteindre",
		"NL":"Doelwaardes"},    
	"instructions-title":
		{"EN":"Instructions",
		"FR":"Instructions",
		"NL":"Instructies"},
	"instructions-content":
		{"EN":"Set the different vents so that the flow is correct at each vent",
		"FR":"L'objectif est d'atteindre le bon débit à chaque bouche",
		"NL":"Stel de ventielen af zodat het debiet in elke tak correct is"},
	"instructions-criteria":
		{"EN":"For this example, the setting is considered as sucessfull if the error in flow rate is < 2 m³/h",
		"FR":"Pour cet exemple, le réglage est considéré comme réussi si l'erreur est < 2 m³/h pour chaque bouche.",
		"NL":"Voor die voorbeeld, de afstelling is succesvol als de fout is <2 m³/h voor elke ventiel"},
	"target":
		{"EN":"target",
		"FR":"objectif",
		"NL":"doelwaarde"},
	"targettext":
		{"EN":"m³/h in each branch",
		"FR":"m³/h dans chaque branche",
		"NL":"m³/h in elke tak"},
	"numberofoperations":
		{"EN":"Number of operations",
		"FR":"Nombre d'opérations",
		"NL":"Aantal operaties"},
    "current_flows":
    	{"EN":"Current flows",
		"FR":"Débits actuels",
		"NL":"Huidige debieten"},
    "target_flows":
        {"EN":"Targets",
        "FR":"Objectif",
        "NL":"Doel"
        }
}




function translatepage(language){
	
	var allDom = document.getElementsByTagName("*");
		for(var i =0; i < allDom.length; i++){
			var elem = allDom[i];
			var key = elem.getAttribute('lng-tag');
			if(key != null) {
				
				if (key in translationsDataBase){
					elem.innerHTML = translationsDataBase[key][language] ;
				}
			}
		}
		
}