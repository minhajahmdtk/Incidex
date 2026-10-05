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
const MapClick = ({ setLatitude, setLongitude }) => {
  useMapEvents({
    click(event) {
      setLatitude(event.latlng.lat);
      setLongitude(event.latlng.lng);
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
      const response = await axiosInstance.post("/cases/report", {
        crimeCategory,
        incidentDescription,
        incidentLocation,
        latitude,
        longitude,
      });

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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-h-screen lg:ml-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-600 transition hover:text-blue-600"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            <h1 className="text-2xl font-bold text-slate-900">
              Report Crime
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Submit a crime incident report with the required details.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit}>

              {/* Crime Category */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Crime Category
                </label>

                <select
                  value={crimeCategory}
                  onChange={(event) => {
                    setCrimeCategory(event.target.value);
                    setErrorMessage("");
                  }}
                  className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition ${
                    errorField === "category"
                      ? "border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
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
                  <p className="mt-2 text-sm text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
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
                  className={`w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition ${
                    errorField === "description"
                      ? "border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />

                <div className="mt-2 flex justify-between">
                  {errorField === "description" ? (
                    <p className="text-sm text-red-600">
                      {errorMessage}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Minimum 5 characters and maximum 500 characters.
                    </p>
                  )}

                  <span className="text-xs text-slate-500">
                    {incidentDescription.length}/500
                  </span>
                </div>
              </div>

              {/* Incident Location */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Incident Location
                </label>

                <div className="relative">

                  {/* Search Icon */}
                  <Search
                    size={18}
                    className="absolute left-3 top-3.5 z-10 text-slate-400"
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
                    className={`w-full rounded-lg border py-3 pl-10 pr-10 text-sm outline-none transition ${
                      errorField === "location"
                        ? "border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />

                  {/* Clear Button */}
                  {incidentLocation && (
                    <button
                      type="button"
                      onClick={handleClearLocation}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                    >
                      <X size={18} />
                    </button>
                  )}

                  {/* Search Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-[1000] mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
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
                          className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                        >
                          <MapPin
                            size={18}
                            className="mt-0.5 flex-shrink-0 text-blue-600"
                          />

                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {location.address_line1 ||
                                location.name ||
                                "Location"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
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
                      <div className="absolute left-0 right-0 top-full z-[1000] mt-1 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
                        <p className="text-sm text-slate-500">
                          Searching locations...
                        </p>
                      </div>
                    )}
                </div>

                {errorField === "location" && (
                  <p className="mt-2 text-sm text-red-600">
                    {errorMessage}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-500">
                  Search for a location and select a suggestion, or
                  click directly on the map.
                </p>
              </div>

              {/* Map */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select Location on Map
                </label>

                <div className="overflow-hidden rounded-xl border border-slate-200">
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
                      setLatitude={setLatitude}
                      setLongitude={setLongitude}
                    />

                    {latitude !== null &&
                      longitude !== null && (
                        <Marker
                          position={[
                            latitude,
                            longitude,
                          ]}
                        />
                      )}
                  </MapContainer>
                </div>

                {latitude !== null &&
                  longitude !== null && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <MapPin size={16} />
                      Location selected successfully.
                    </div>
                  )}
              </div>

              {/* General Error */}
              {errorMessage && errorField === "" && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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