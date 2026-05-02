function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                console.log("Ubicación encontrada:", lat, lng);

                return { lat, lng };
            },
            function (error) {
                console.error("Error obteniendo ubicación:", error.message);
            }
        );
    } else {
        console.log("La geolocalización no es compatible con este navegador.");
    }


}

