GeoPickr.API.DOM = {};
GeoPickr.API.initFilters = () => {
	GeoPickr.API.DOM.familyFilter = document.getElementById('familyFilter');
	GeoPickr.API.DOM.genusFilter = document.getElementById('genusFilter');
	GeoPickr.API.DOM.results = document.getElementById('results');
	GeoPickr.API.DOM.familyFilter.addEventListener('click', event => {
		GeoPickr.API.filters.family = '';
		GeoPickr.API.update();
		event.preventDefault();
		return false;
	})
	GeoPickr.API.DOM.genusFilter.addEventListener('click', event => {
		GeoPickr.API.filters.genus = '';
		GeoPickr.API.update();
		event.preventDefault();
		return false;
	})
}
