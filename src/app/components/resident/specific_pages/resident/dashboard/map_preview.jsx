import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export function MapPreview({ location }) {
  const [coords, setCoords] = useState(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // ✅ Add this in your .env.local
  });

  // Convert address string to coordinates
  useEffect(() => {
    if (!isLoaded || !location) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setCoords({ lat: lat(), lng: lng() });
      } else {
        console.error("Geocode failed:", status);
      }
    });
  }, [isLoaded, location]);

  if (!isLoaded) return <p className="text-center text-gray-500 py-8">Loading map...</p>;
  if (!coords) return <p className="text-center text-gray-500 py-8">Location not found</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={coords} zoom={15}>
      <Marker position={coords} />
    </GoogleMap>
  );
}
