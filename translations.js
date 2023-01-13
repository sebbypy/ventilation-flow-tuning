
var translationsDataBase={
	"title":
		{"EN":"Flow rate adjustment of ventilation network",
		"FR":"Réglage d'un réseau de ventilation",
		"NL":"Afstelling van ventilatie netwerk"},
	"fillinputs":
		{"EN":"Network data",
		"FR":"Données du réseau",
		"NL":"Netwerk data"},
	"numberofvents":
		{"EN":"Number of vents",
		"FR":"Nombre de bouches",
		"NL":"Aantal ventielen"},
	"totalflowrate":
		{"EN":"Total ventilation flow rate",
		"FR":"Débit total de ventilation",
		"NL":"Totale ventilatiedebiet"},
	"instructions-title":
		{"EN":"Instructions",
		"FR":"Instructions",
		"NL":"Instructies"},
	"instructions-content":
		{"EN":"Set the different vents so that the flow is equal at each vent",
		"FR":"Régler les bouches pour que le débit soit identique à chaque branche",
		"NL":"Stel de ventielen af zodat het debiet is identiek voor elke tak"},
	"instructions-criteria":
		{"EN":"For this example, the setting is considered as sucessfull if the error in flow rate is < 2 m³/h",
		"FR":"Pour cet exercice, le réglage est considéré comme réussi si l'erreur est < 2 m³/h pour chaque bouche. Les curseurs peuvent être déplacés avec la souris. Pour un réglage fin, il est possible de déplacer les curseurs avec le clavier (flèches haut et bas)",
		"NL":"Voor die oefening, de afstelling is succesvol als de fout is <2 m³/h voor elke ventiel"},
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
		"NL":"Aantal operaties"}
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