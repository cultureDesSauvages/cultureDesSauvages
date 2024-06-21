if (!window.GeoPickr) 
  var GeoPickr = window.GeoPickr = {};
GeoPickr.API = {};
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
  GeoPickr.API.cachedPlantList = plantList;
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
  var json = await response.json();
  return json;
};

GeoPickr.API.getMediaFromTreflePlant = async (plant) => {
  return plant.data.main_species.images;
};
GeoPickr.API.getSourcesFromTreflePlant = async (plant) => {
  return plant.data.main_species.sources;
};


GeoPickr.API.getPlantExtraDatas = async (scientificName) => {
  var response = await fetch(
    GeoPickr.API.extraDatasUrl + "/" + scientificName.split(" ").join("-")
  );
  if (response.ok) {
    return await response.json();
  }
  return {};
};

GeoPickr.API.search = async (query) => {
  const plantList = await GeoPickr.API.getPlantList();
  const results = [];
  plantList.forEach((plant) => {
    var allNames =
      plant.scientificName +
      "," +
      plant.trefleNames.join(", ") +
      plant.inpiNames.join(", ");

    allNames = allNames.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
    }
  });
  results.sort(
    (a, b) =>
      b.query.isInCommonName - a.query.isInCommonName ||
      b.query.matches - a.query.matches
  );
  return results;
};
