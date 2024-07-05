 GeoPickr.events = {};

 GeoPickr.events.more = () => {
 	var moreInfosLinks = document.querySelectorAll('.moreInfoLink');
 	moreInfosLinks.forEach(link => {
 		link.addEventListener('click', event => {
 			var scName = event.target.dataset.scientificname;
 			GeoPickr.API.getPlantFromTrefle(scName).then(plant => {
 				var images = plant.data.main_species.images;
 				var div = document.createElement('div');
 				div.innerHTML = GeoPickr.tpl.plantImages(images);
     event.target.classList.toggle('hide');
 				event.target.after(div);
     GeoPickr.events.showFoto();
 			});
 			GeoPickr.API.getPlantExtraDatas(scName).then(json => {
 				console.log(json)
 			});
 			event.preventDefault();
 			return false;
 		});
 	});
 };
GeoPickr.events.showFoto = () =>  {
 var fotos = document.querySelectorAll('.thumbsWrapper img');
 fotos.forEach( foto => {
  foto.addEventListener('click', event => {
   event.target.closest( '.imgWrapper img' ).src = event.target.src;
  })
 })
};
 GeoPickr.events.addToCollection = () => {
 	document.querySelectorAll('.addToCollection').forEach(link => {
 		link.addEventListener('click', event => {
 			var target = event.target;
 			GeoPickr.collection[target.classList.contains('favorite') ? 'remove' : 'add'](target.dataset.id);
 			target.classList.toggle("favorite");
 			event.preventDefault();
 			return false;
 		});
 	});
 };
 GeoPickr.events.filterByFamily = () => {
 	document.querySelectorAll('.familyFilter').forEach(link => {
 		link.addEventListener('click', event => {
 			GeoPickr.API.filters.family = GeoPickr.API.filters.family === event.target.dataset.family ? '' : event.target.dataset.family;
 			GeoPickr.API.filters.genus = '';
 			GeoPickr.API.update();
 			event.preventDefault();
 			return false;
 		});
 	});
 };
 GeoPickr.events.filterByGenus = () => {
 	document.querySelectorAll('.genusFilter').forEach(link => {
 		link.addEventListener('click', event => {
 			GeoPickr.API.filters.genus = GeoPickr.API.filters.genus === event.target.dataset.genus ? '' : event.target.dataset.genus;
 			GeoPickr.API.update();
 			event.preventDefault();
 			return false;
 		});
 	});
 };
 GeoPickr.events.bindAll = () => {
 	GeoPickr.events.more();
 	GeoPickr.events.addToCollection();
 	GeoPickr.events.filterByFamily();
 	GeoPickr.events.filterByGenus();
  
 };
