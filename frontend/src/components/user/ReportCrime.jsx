import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { MapPin, Send, ArrowLeft, Search, X } from "lucide-react";
import { toast } from "sonner";

import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

// Moves the map when a location is selected
const MapController = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.setView([latitude, longitude], 16);
    }
  }, [latitude, longitude, map]);

  return null;
};

// Handles clicking directly on the map
const MapClick = ({ onLocationSelect }) => {
  useMapEvents({
    click(event) {
      onLocationSelect(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
};

const ReportCrime = () => {
  const navigate = useNavigate();

  const [crimeCategory, setCrimeCategory] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Search locations
  useEffect(() => {
    if (incidentLocation.trim().length < 3) {
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const url =
          `https://api.geoapify.com/v1/geocode/autocomplete` +
          `?text=${encodeURIComponent(incidentLocation)}` +
          `&filter=countrycode:in` +
          `&limit=5` +
          `&format=json` +
          `&apiKey=${GEOAPIFY_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Location search failed");
        }

        const data = await response.json();

        if (!cancelled) {
          setSuggestions(data.results || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Location search error:", error);
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [incidentLocation]);

  // Get location name from coordinates
  const getLocationName = async (
    selectedLatitude,
    selectedLongitude
  ) => {
    try {
      const url =
        `https://api.geoapify.com/v1/geocode/reverse` +
        `?lat=${selectedLatitude}` +
        `&lon=${selectedLongitude}` +
        `&format=json` +
        `&apiKey=${GEOAPIFY_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Location lookup failed");
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0];

        const locationName =
          location.formatted ||
          location.address_line1 ||
          location.name ||
          "";

        setIncidentLocation(locationName);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  // Handle map click
  const handleMapLocationSelect = async (
    selectedLatitude,
    selectedLongitude
  ) => {
    setLatitude(selectedLatitude);
    setLongitude(selectedLongitude);

    setSuggestions([]);
    setSearching(false);
    setErrorMessage("");

    await getLocationName(
      selectedLatitude,
      selectedLongitude
    );
  };

  // Select a search result
  const handleLocationSelect = (location) => {
    const selectedLatitude = location.lat;
    const selectedLongitude = location.lon;

    const locationName =
      location.formatted ||
      location.address_line1 ||
      location.name ||
      "";

    setIncidentLocation(locationName);
    setLatitude(selectedLatitude);
    setLongitude(selectedLongitude);

    setSuggestions([]);
    setSearching(false);
    setErrorMessage("");
  };

  // Clear location
  const handleClearLocation = () => {
    setIncidentLocation("");
    setSuggestions([]);
    setLatitude(null);
    setLongitude(null);
    setSearching(false);
    setErrorMessage("");
  };

  // Find which field has the backend error
  const getErrorField = () => {
    const message = errorMessage.toLowerCase();

    if (message.includes("category")) {
      return "category";
    }

    if (message.includes("description")) {
      return "description";
    }

    if (message.includes("location")) {
      return "location";
    }

    return "";
  };

  const errorField = getErrorField();

  // Submit report
  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/cases/report",
        {
          crimeCategory,
          incidentDescription,
          incidentLocation,
          latitude,
          longitude,
        }
      );

      toast.success(response.data.message);

      setCrimeCategory("");
      setIncidentDescription("");
      setIncidentLocation("");
      setLatitude(null);
      setLongitude(null);
      setSuggestions([]);
      setSearching(false);

      navigate("/user/cases");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to report crime";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="
                mb-4
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Report Crime
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Submit a crime incident report with the required details.
            </p>
          </div>

          {/* Form Card */}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <form onSubmit={handleSubmit}>

              {/* Crime Category */}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Crime Category
                </label>

                <select
                  value={crimeCategory}
                  onChange={(event) => {
                    setCrimeCategory(event.target.value);
                    setErrorMessage("");
                  }}
                  className={`
                    w-full
                    rounded-lg
                    border
                    bg-background
                    px-4
                    py-3
                    text-sm
                    text-foreground
                    outline-none
                    transition
                    ${
                      errorField === "category"
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-border focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                    }
                  `}
                >
                  <option value="">
                    Select crime category
                  </option>

                  <option value="Theft">Theft</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Cybercrime">Cybercrime</option>
                  <option value="Assault">Assault</option>
                  <option value="Vandalism">Vandalism</option>
                  <option value="Missing Person">
                    Missing Person
                  </option>
                  <option value="Accident">Accident</option>
                  <option value="Other">Other</option>
                </select>

                {errorField === "category" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Description */}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Incident Description
                </label>

                <textarea
                  value={incidentDescription}
                  onChange={(event) => {
                    setIncidentDescription(event.target.value);
                    setErrorMessage("");
                  }}
                  rows="6"
                  placeholder="Describe what happened..."
                  className={`
                    w-full
                    resize-none
                    rounded-lg
                    border
                    bg-background
                    px-4
                    py-3
                    text-sm
                    text-foreground
                    placeholder:text-muted-foreground
                    outline-none
                    transition
                    ${
                      errorField === "description"
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-border focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                    }
                  `}
                />

                <div className="mt-2 flex justify-between">
                  {errorField === "description" ? (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errorMessage}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Minimum 5 characters and maximum 500 characters.
                    </p>
                  )}

                  <span className="text-xs text-muted-foreground">
                    {incidentDescription.length}/500
                  </span>
                </div>
              </div>

              {/* Incident Location */}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Incident Location
                </label>

                <div className="relative">

                  {/* Search Icon */}

                  <Search
                    size={18}
                    className="absolute left-3 top-3.5 z-10 text-muted-foreground"
                  />

                  {/* Location Input */}

                  <input
                    type="text"
                    value={incidentLocation}
                    onChange={(event) => {
                      setIncidentLocation(event.target.value);
                      setErrorMessage("");
                      setLatitude(null);
                      setLongitude(null);
                      setSuggestions([]);
                      setSearching(false);
                    }}
                    placeholder="Search incident location..."
                    className={`
                      w-full
                      rounded-lg
                      border
                      bg-background
                      py-3
                      pl-10
                      pr-10
                      text-sm
                      text-foreground
                      placeholder:text-muted-foreground
                      outline-none
                      transition
                      ${
                        errorField === "location"
                          ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-border focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                      }
                    `}
                  />

                  {/* Clear Button */}

                  {incidentLocation && (
                    <button
                      type="button"
                      onClick={handleClearLocation}
                      className="
                        absolute
                        right-3
                        top-3
                        text-muted-foreground
                        transition-colors
                        hover:text-foreground
                      "
                    >
                      <X size={18} />
                    </button>
                  )}

                  {/* Search Suggestions */}

                  {suggestions.length > 0 && (
                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-[1000]
                        mt-1
                        overflow-hidden
                        rounded-lg
                        border
                        border-border
                        bg-card
                        shadow-lg
                      "
                    >
                      {suggestions.map((location, index) => (
                        <button
                          key={
                            location.place_id ||
                            `${location.lat}-${location.lon}-${index}`
                          }
                          type="button"
                          onClick={() =>
                            handleLocationSelect(location)
                          }
                          className="
                            flex
                            w-full
                            items-start
                            gap-3
                            border-b
                            border-border
                            px-4
                            py-3
                            text-left
                            transition-colors
                            last:border-b-0
                            hover:bg-muted
                          "
                        >
                          <MapPin
                            size={18}
                            className="mt-0.5 flex-shrink-0 text-muted-foreground"
                          />

                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {location.address_line1 ||
                                location.name ||
                                "Location"}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {location.address_line2 ||
                                location.formatted}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Searching */}

                  {searching &&
                    incidentLocation.trim().length >= 3 && (
                      <div
                        className="
                          absolute
                          left-0
                          right-0
                          top-full
                          z-[1000]
                          mt-1
                          rounded-lg
                          border
                          border-border
                          bg-card
                          px-4
                          py-3
                          shadow-lg
                        "
                      >
                        <p className="text-sm text-muted-foreground">
                          Searching locations...
                        </p>
                      </div>
                    )}
                </div>

                {errorField === "location" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                  </p>
                )}

                <p className="mt-2 text-xs text-muted-foreground">
                  Search for a location and select a suggestion, or
                  click directly on the map.
                </p>
              </div>

              {/* Map */}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Select Location on Map
                </label>

                <div className="overflow-hidden rounded-xl border border-border">
                  <MapContainer
                    center={[8.5241, 76.9366]}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="h-80 w-full"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController
                      latitude={latitude}
                      longitude={longitude}
                    />

                    <MapClick
                      onLocationSelect={handleMapLocationSelect}
                    />

                    {latitude !== null &&
                      longitude !== null && (
                        <Marker
                          position={[
                            latitude,
                            longitude,
                          ]}
                          draggable={true}
                          eventHandlers={{
                            dragend: async (event) => {
                              const marker =
                                event.target;

                              const position =
                                marker.getLatLng();

                              await handleMapLocationSelect(
                                position.lat,
                                position.lng
                              );
                            },
                          }}
                        />
                      )}
                  </MapContainer>
                </div>

                {latitude !== null &&
                  longitude !== null && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                      <MapPin size={16} />
                      Location selected successfully.
                    </div>
                  )}
              </div>

              {/* General Error */}

              {errorMessage && errorField === "" && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/20">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#151A21]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#343A40]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:bg-[#E5E7EB]
                    dark:text-[#151A21]
                    dark:hover:bg-white
                  "
                >
                  <Send size={17} />

                  {loading
                    ? "Submitting..."
                    : "Submit Report"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportCrime;