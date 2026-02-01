let mapApi = mapToken;
maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,

    center: listing.geometry.coordinates,
    zoom: 9
});



const marker = new maptilersdk.Marker({
    color: "#fe424d", // Airbnb Red (instead of default blue)
    draggable: false
}) // Optional: change color to red
    .setLngLat(listing.geometry.coordinates) // Listing coordinates
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                // The HTML inside the box
                `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
            )
    )
    .addTo(map);
const markerDiv = marker.getElement();

markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
markerDiv.addEventListener('mouseleave', () => marker.togglePopup());