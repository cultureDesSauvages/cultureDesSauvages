/*
{
  commonName: "Jujubier de Maurice",
  family: "Rhamnaceae",
  genus: "Ziziphus",
  imgUrl: "https://bs.plantnet.org/image/o/f89091fef9329b0b8a143acd6ab5926948f09043",
  names: ["Jujubier de Maurice", "Jujubier", "Cicourlier", "Dattier de Chine", "Guindanlier", "jujubier commun"],
  scientificName: "Ziziphus jujuba",
  searchNames: "jujubier de maurice, jujubier, cicourlier, dattier de chine, guindanlier, jujubier commun",
  trefleId: 113259
}

*/
if (!window.GeoPickr) var GeoPickr = window.GeoPickr = {};
GeoPickr.API = {};
GeoPickr.utils = {};
//clean l'
GeoPickr.utils.cleanNames = (names) => {
    return names.map((name) => GeoPickr.utils.cleanName(name));
};
GeoPickr.utils.cleanName = (name) => {
    name = name.replace(/’/gi, "'").replace(/l ' |l '|l' |L ' |L '|L' /gi, "l'").replace(/d ' |d '|d' |D ' |D '|D' /gi, "d'");
    // removing l' from debut
    if (name.toLowerCase().startsWith("l'")) {
        name = name.substr("2");
    }
    if (name.toLowerCase().startsWith('\"')) {
        name = name.substr("2");
    }
  
    return name.trim();
};
GeoPickr.utils.getUniqueNames = (names) => {
    const cleanedNames = GeoPickr.utils.cleanNames(names);
    const groups = Object.groupBy(cleanedNames, name => name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))
    return Object.keys(groups).map(group => groups[group][0]);
};
GeoPickr.utils.normalizeString = (string) => {
    return string.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
};
GeoPickr.API.filters = {
    query: '',
    family: '',
    genus: ''
};
GeoPickr.API.cachedPlantList = null;
GeoPickr.API.cachedTreePlantList = null;
GeoPickr.API.extraDatasUrl = "https://api.npoint.io/ac30d377e95cdfc261a5";
GeoPickr.API.plantListDataUrl = "https://api.npoint.io/20a8c64a83f4da0a737d";
GeoPickr.API.treePlantListDataUrl = "https://api.npoint.io/53ceb4df7a9c8078de7e";
GeoPickr.API.plantSearchInpnUrl = "https://taxref.mnhn.fr/api/taxa/fuzzyMatch?term=";
GeoPickr.API.proxy = "https://api-geopickr.vercel.app/?apiUrl=";
GeoPickr.API.trefleAPI = "https://trefle.io/api/v1/";
GeoPickr.API.trefleToken = "token=WY4938eNStvfSd3tTTUxQNQvoOVBhuaR4RPGbm61R8A";
GeoPickr.API.getPlantList = async () => {
    if (GeoPickr.API.cachedPlantList) return GeoPickr.API.cachedPlantList;
    var response = await fetch(GeoPickr.API.plantListDataUrl);
    var plantList = await response.json();
    plantList = plantList.map(plant => {
        var names = [plant.commonName, ...plant.inpiNames, ...plant.trefleNames];
        plant.names = GeoPickr.utils.getUniqueNames(names);
        plant.searchNames = plant.names.join(', ').toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
        plant.commonName = GeoPickr.utils.cleanName(plant.commonName);
        delete plant.inpiNames;
        delete plant.trefleNames;
        return plant;
    })
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
    var response = await fetch(GeoPickr.API.plantSearchInpnUrl + scientificName.split(" ").join("%20"));
    var result = await response.json();
    // allium%20ursinum
    return result._embedded ? result._embedded.taxa[0] : {};
};
GeoPickr.API.getWebPageFromInpn = async (scientificName) => {
    var response = await fetch(GeoPickr.API.plantSearchInpnUrl + scientificName.split(" ").join("%20"));
    var result = await response.json();
    // allium%20ursinum
    return result._embedded ? result._embedded.taxa[0]._links.inpnWebpage.href : {};
};
GeoPickr.API.getPlantFromTrefle = async (scientificName) => {
    var species = scientificName.toLowerCase().split(" ").join("-");
    var response = await fetch(GeoPickr.API.proxy + GeoPickr.API.trefleAPI + "plants" + "/" + species + "/?" + GeoPickr.API.trefleToken);
    return await response.json();
};
GeoPickr.API.getMediaFromTreflePlant = (plant) => {
    return plant.data.main_species.images;
};
GeoPickr.API.getSourcesFromTreflePlant = (plant) => {
    return plant.data.main_species.sources;
};
GeoPickr.API.getPlantExtraDatas = async (scientificName) => {
    var response = await fetch(GeoPickr.API.extraDatasUrl + "/" + scientificName.split(" ").join("-"));
    return response.ok ? await response.json() : {};
};
GeoPickr.API.search = async (query) => {
    GeoPickr.API.filters.query = query;
    var normalizeQuery = GeoPickr.utils.normalizeString(query);
    var regExp = new RegExp(normalizeQuery, 'gi')
    var plantList = await GeoPickr.API.getPlantList();
    var results = [];
    // filterByFamily
    if (GeoPickr.API.filters.family) results = plantList.filter(plant => GeoPickr.API.filters.family.toLowerCase() === plant.family.toLowerCase());
    // filterByFamily
    if (GeoPickr.API.filters.genus) results = plantList.filter(plant => GeoPickr.API.filters.genus.toLowerCase() === plant.genus.toLowerCase());
    if (!results.length) results = plantList;
    results = results.filter(plant => {
        var matches = plant.searchNames.match(regExp);
        if (matches === null) {
            return false
        }
        plant.matches = matches.length;
        return matches.length !== 0;
    });
    results = results.sort((a, b) => {
        return b.commonName.localeCompare(a.commonName, 'fr', {
            sensitivity: 'base'
        });
    });
    results = results.sort(
        (a, b) => {
            var indexOf = GeoPickr.utils.normalizeString(a.commonName).indexOf(normalizeQuery);
            if (indexOf === -1) {
                return 30;
            }
            if (indexOf === 0) {
                return -5;
            }
            return 0;
        });
    return results;
};
    GeoPickr.collection = {};
    GeoPickr.collection.ids = [];
    GeoPickr.collection.add = (id) => {
        var filter = GeoPickr.collection.ids.filter(plant => {
            return plant.id === id;
        });
        if (filter.length === 0) {
            GeoPickr.collection.ids.push({
                id: id
            });
        }
        return true;
    };
    GeoPickr.collection.remove = (id) => {
        var index = null;
        var filter = GeoPickr.collection.ids.filter((plant, i) => {
            if (plant.id === id) {
                index = i;
            }
            return plant.id === id;
        });
        if (filter.length !== 0 && index !== null) {
            GeoPickr.collection.ids.splice(index, 1);
            return true;
        }
        return false;
    };
    GeoPickr.collection.getAll = () => {
        return GeoPickr.collection.ids;
    };
    GeoPickr.collection.getById = (id) => {
        var plant = GeoPickr.collection.ids.filter(plant => plant.id === id);
        if (plant.length) {
            return plant[0];
        }
        return [];
    };
    GeoPickr.collection.addPosition = (id, position) => {
        var newPlant = GeoPickr.collection.getById(id);
        if (!newPlant.length) {
            GeoPickr.collection.add(id);
        }
        GeoPickr.collection.ids.forEach((plant, index, ids) => {
            if (plant.id === id) {
                if (ids[index].positions) {
                    ids[index].positions.push(position)
                } else {
                    ids[index].positions = [position];
                }
            }
        })
        return true;
    }
    GeoPickr.collection.removePosition = (id, positionToDelete) => {
        var index = null;
        var isDeleted = false;
        var plant = GeoPickr.collection.getById(id);
        if (plant.positions) {
            plant.positions.forEach((position, i, positions) => {
                if (JSON.stringify(position) === JSON.stringify(positionToDelete)) {
                    positions.splice(i, 1);
                    isDeleted = true;
                };
            });
            return isDeleted;
        }
    }
