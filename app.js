var strictBounds = new google.maps.LatLngBounds(
	 new google.maps.LatLng(24.50, -84.40),
     new google.maps.LatLng(30.85, -81.30)
   );

var minZoomLevel = 7;
 
function getNormalizedCoord(coord, zoom) {
	var y = coord.y;
	var x = coord.x;
	var tileRange = 1 << zoom;
	if (y < 0 || y >= tileRange) {
		return null;
	}
	if (x < 0 || x >= tileRange) {
		return null;
	}
	return {
		x: x,
		y: y
	};
}

var locations = [
      ['<img src="img/disney.jpg" alt="disney" style="max-height: 8em;"><br><br>', 28.4179, -81.5812, "<h2> Magic Kingdom </h2>",
       "Magic Kingdom Park, commonly known as Magic Kingdom, is the first-built of the four theme parks at the Walt Disney World Resort in Bay Lake, Florida. It opened on October 1, 1971. Designed and built by WED Enterprises, its layout and attractions are similar to Disneyland Park in Anaheim, California, and is dedicated to fairy tales and Disney characters. In 2013, the park hosted 18.58 million visitors, making it the most visited theme park in the world for the fifth consecutive year.",
       "<a href='http://en.wikipedia.org/wiki/Magic_Kingdom'>Sourced from wikipedia</a>"],

      ['<img src="img/staugustine.png" alt="staugustine" style="max-height: 8em;"><br><br>', 29.8999, -81.313, "<h2> St. Augustine </h2>",
      "St. Augustine (Spanish: San Agustín) is a city in Northeast Florida and the oldest continuously occupied European-established settlement and port in the continental United States. San Agustín was founded in September 1565 by Spanish admiral Pedro Menéndez de Avilés, and subsequently served as the capital of Spanish Florida for two hundred years. It remained the capital of East Florida as the territory changed hands between the Spanish and British, and remained the capital of the Florida Territory until it was moved to Tallahassee in 1824. Since the late 19th century, its historical character has made the city a major tourist attraction. It is the headquarters for the Florida National Guard.",
      "<a href='http://en.wikipedia.org/wiki/St._Augustine,_Florida'>Sourced from wikipedia</a>"],

      ['<img src="img/olustee.jpg" alt="olustee" style="max-height: 8em;"><br><br>', 30.25, -82.313, "<h2> Battle of Olustee </h2>",
      "In February 1864 Maj. Gen. Quincy A. Gillmore, launched an expedition into Florida to secure Union enclaves, sever Rebel supply routes, and recruit black soldiers. Brig. Gen. Truman Seymour moved deep into the state, destroying and liberating, meeting little resistance. On February 20, he approached Brig. Gen. Joseph Finegan’s 5,000 Confederates entrenched near Olustee. One infantry brigade pushed out to meet Seymour’s advance units. The Union forces attacked but were repulsed. The battle raged, and as Finegan committed the last of his reserves, the Union line broke and began to retreat. Finegan did not exploit the retreat, allowing most of the fleeing Union forces to reach Jacksonville.",
      "<a href='http://www.civilwar.org/battlefields/olustee.html'>Sourced from civilwar.org</a>" ],

      ['<img src="img/belle.jpeg" alt="belleglade" style="max-height: 8em;"><br><br>', 26.948, -80.808, "<h2> Belle Glade Culture",
      "The Belle Glade culture is the oldest known human settlement in Florida. The archaeological sites date back to 1000 BCE, and lasted until 1700 BCE. These sites are at least 500 years older than any other in Florida.",
      "<a href='http://en.wikipedia.org/wiki/Belle_Glade_culture'>Sourced from wikipedia</a>"],

      ['<img src="img/rosewood.jpg" alt="rosewoodfl" style="max-height: 8em;"><br><br>', 29.2390, -82.9320, "<h2> The Rosewood Massacre </h2>",
      "The Rosewood massacre was a racially-motivated mob atrocity in Florida during January 1–7, 1923. In the violence at least six blacks and two whites were killed, and the town of Rosewood was abandoned and destroyed in what contemporary news reports characterized as a race riot. Racial disturbances were common during the early 20th century in the United States, reflecting the nation's rapid social changes. Florida had an especially high number of lynchings in the years before the massacre, including the well-publicized Perry race riot where a black man had been burned at the stake in December 1922.",
      "<a href='http://en.wikipedia.org/wiki/Rosewood_massacre'>Sourced from wikipedia</a>"],

      ['<img src="img/shipwreck.jpg" alt="shipwreck" style="max-height: 8em;"><br><br>', 27.505278, -80.299167, "<h2> Urca De Lima </h2>",
      "The Urca de Lima is a Spanish shipwreck (which sank in 1715) near Fort Pierce, Florida, United States. It was part of the 1715 Treasure Fleet itself, one of the numerous Spanish treasure fleets. It is located north of Fort Pierce Inlet, 200 yards off the shore from Jack Island Park. It became the first Florida Underwater Archaeological Preserve when it was dedicated in 1987. This was followed on May 31, 2001 with its addition to the U.S. National Register of Historic Places.",
      "<a href='http://en.wikipedia.org/wiki/Urca_de_Lima'>Sourced from wikipedia</a>"],

      ['<img src="img/shipwreckdos.jpg" alt="shipwreck" style="max-height: 8em;"><br><br>', 25.7275, -80.134444, "<h2> Halfmoon Shipwreck </h2>",
      "The Half Moon (also known as the Germania and Exen) is a racing sailboat which sank in 1930 near Miami, Florida, United States. It is located outside Bear Cut off Key Biscayne. Originally christened Germania, the racing yacht was built by Krupp-Germania-Werft in 1908 in Kiel, Germany. In 1914 the yacht visited Southampton, England, to water and was taken as a prize of war. After changing hands several times, and suffering at the hands of an especially violent storm off Virginia, the yacht became a floating restaurant and dance hall off Miami, Florida, sinking near Key Biscayne in 1930. It became the seventh Florida Underwater Archaeological Preserve when it was dedicated in 2000. This was followed on May 31, 2001 with its addition to the US National Register of Historic Places.",
      "<a href='http://en.wikipedia.org/wiki/Half_Moon_(shipwreck)'>Sourced from wikipedia</a>"],
    ];

$(document).ready(function() {
	function initialize() {
		var mapOptions = {
			center: new google.maps.LatLng (28.12227, -81.4612),
			zoom: minZoomLevel,
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			  panControl: false,
			  zoomControl: false,
			  mapTypeControl: false,
			  scaleControl: false,
			  streetViewControl: true,
			  overviewMapControl: false,

		};
		var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

		google.maps.event.addListener(map, 'dragend', function() {
			if (strictBounds.contains(map.getCenter())) return;

			var c = map.getCenter(),
				x = c.lng(),
				y = c.lat(),
				maxX = strictBounds.getNorthEast().lng(),
				maxY = strictBounds.getNorthEast().lat(),
				minX = strictBounds.getSouthWest().lng(),
				minY = strictBounds.getSouthWest().lat();

			if (x < minX) x = minX;
			if (x > maxX) x = maxX;
			if (y < minY) y = minY;
			if (y > maxY) y = maxY;

			map.setCenter(new google.maps.LatLng(y, x));	

			});

		var infowindow = new google.maps.InfoWindow({
		    });

		var markers = new Array();

	    for (var i = 0; i < locations.length; i++) {  
	      marker = new google.maps.Marker({
	        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	        map: map,
	      });

	      markers.push(marker);

	      google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
	          infowindow.setContent(locations[i][0]);
	          infowindow.open(map, marker);
	          $(".info-title").html(locations[i][3]);
	          $(".wikipedia-info").html(locations[i][4]);
	          $(".sourced").html(locations[i][5]);
	        }
	      })(marker, i));
	      
	      }
	    };
	initialize(); 
});
