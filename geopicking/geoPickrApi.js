if (!window.GeoPickr) 
  var GeoPickr = window.GeoPickr = {};
GeoPickr.API = {};
GeoPickr.utils = {};

//clean l'
GeoPickr.utils.cleanNames = (names) => {
  return names.map((name) => {
    // clean apostrophes
    name = name.replace(/’/gi, "'")
    .replace(/l ' |l '|l' |L ' |L '|L' /gi, "l'")
    .replace(/d ' |d '|d' |D ' |D '|D' /gi, "d'");

    // removing l' from debut
    if (name.toLowerCase().startsWith("l'")) {
      name = name.substr("2");
    }
    return name.trim();
  });
};

GeoPickr.utils.getUniqueNames = (names) => {
  const cleanedNames = GeoPickr.utils.cleanNames(names);
  const groups = Object.groupBy( cleanedNames, name => 
    name.toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")   
  )
  return Object.keys(groups).map( group => groups[group][0] );
};

GeoPickr.API.filters = {
  query : '',
  family : '',
  genus : ''
};

GeoPickr.API.cachedPlantList = null;
GeoPickr.API.cachedTreePlantList = null;
GeoPickr.API.extraDatasUrl = "https://api.npoint.io/ac30d377e95cdfc261a5";
GeoPickr.API.plantListDataUrl = "https://api.npoint.io/20a8c64a83f4da0a737d";
GeoPickr.API.treePlantListDataUrl =
  "https://api.npoint.io/53ceb4df7a9c8078de7e";
GeoPickr.API.plantSearchInpnUrl =
  "https://taxref.mnhn.fr/api/taxa/fuzzyMatch?term=";
GeoPickr.API.proxy = "https://api-geopickr.vercel.app/?apiUrl=";
GeoPickr.API.trefleAPI = "https://trefle.io/api/v1/";
GeoPickr.API.trefleToken = "token=WY4938eNStvfSd3tTTUxQNQvoOVBhuaR4RPGbm61R8A";

GeoPickr.API.getPlantList = async () => {
  if (GeoPickr.API.cachedPlantList) return GeoPickr.API.cachedPlantList;
  var response = await fetch(GeoPickr.API.plantListDataUrl);
  var plantList = await response.json();
  plantList = plantList.map( plant =>{
    var names = [plant.commonName, ...plant.inpiNames, ...plant.trefleNames ];
    plant.names = GeoPickr.utils.getUniqueNames( names );
    plant.searchNames = plant.names.join(', ').toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    return plant;
  })
  GeoPickr.API.cachedPlantList = plantList;
  console.log( 'getPlantList raw', plantList );
  return plantList;
};

GeoPickr.API.getTreePlantList = async () => {
  var response = await fetch(GeoPickr.API.treePlantListDataUrl);
  if (GeoPickr.API.cachedTreePlantList) return GeoPickr.API.cachedTreePlantList;
  var response = await fetch(GeoPickr.API.treePlantListDataUrl);
  var plantList = await response.json();
  GeoPickr.API.cachedTreePlantList = plantList;
  return plantList;
};

GeoPickr.API.getPlantFromInpn = async (scientificName) => {
  var response = await fetch(
    GeoPickr.API.plantSearchInpnUrl + scientificName.split(" ").join("%20")
  );
  var result = await response.json();
  // allium%20ursinum
  return result._embedded ? result._embedded.taxa[0] : {};
};

GeoPickr.API.getWebPageFromInpn = async (scientificName) => {
  var response = await fetch(
    GeoPickr.API.plantSearchInpnUrl + scientificName.split(" ").join("%20")
  );
  var result = await response.json();
  // allium%20ursinum
  return result._embedded
    ? result._embedded.taxa[0]._links.inpnWebpage.href
    : {};
};

GeoPickr.API.getPlantFromTrefle = async (scientificName) => {
  var species = scientificName.toLowerCase().split(" ").join("-");
  var response = await fetch(
    GeoPickr.API.proxy +
      GeoPickr.API.trefleAPI +
      "plants" +
      "/" +
      species +
      "/?" +
      GeoPickr.API.trefleToken 
  );
  return await response.json();
};

GeoPickr.API.getMediaFromTreflePlant = (plant) => {
  return plant.data.main_species.images;
};
GeoPickr.API.getSourcesFromTreflePlant = (plant) => {
  return plant.data.main_species.sources;
};


GeoPickr.API.getPlantExtraDatas = async (scientificName) => {
  var response = await fetch(
    GeoPickr.API.extraDatasUrl + "/" + scientificName.split(" ").join("-")
  );
  return response.ok ? await response.json() : {};
};

GeoPickr.API.search = async (query) => {
  GeoPickr.API.filters.query = query;
  var plantList = await GeoPickr.API.getPlantList();
  var results = [];

  // filterByFamily
  if( GeoPickr.API.filters.family )
    results = plantList.filter( plant => GeoPickr.API.filters.family.toLowerCase() === plant.family.toLowerCase() );

  console.log( 'results after family filter', results );
  
    // filterByFamily
  if( GeoPickr.API.filters.genus )
    results = plantList.filter( plant => GeoPickr.API.filters.genus.toLowerCase() === plant.genus.toLowerCase() );

  console.log( 'results after genus filter', results );
  if( !results.length ){
    results = plantList;
    console.log( 'no filters', results );
  }
  else{
    console.log( 'filters', results );
  }
  results.forEach((plant) => {
    /*
    var allNames =
      plant.scientificName +
      "," +
      plant.trefleNames.join(", ") +
      plant.inpiNames.join(", ");

    allNames = allNames.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    */
    /*allNames = plant.searchNames;
    query = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    var commonName = plant.commonName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    var matches = allNames.match(new RegExp(query, "gi"));
    var commonNameMatch = commonName.match(new RegExp(query, "gi")) || [];
    if (matches) {
      plant.query = {
        matches: matches.length,
        isInCommonName: commonNameMatch.length
      };
      results.push(plant);
    }*/
  });
  /*
  results.sort(
    (a, b) =>
      b.query.isInCommonName - a.query.isInCommonName ||
      b.query.matches - a.query.matches
  );
  */
  return results;
};
