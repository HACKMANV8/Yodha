import React, { useState } from "react";

export default function SubsidyFinder() {
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!crop) {
      alert("Please select a crop");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/schemes?crop=${crop}&state=${state}`
      );
      const data = await response.json();
      setSchemes(data.schemes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          🌾 Government Schemes Finder
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="border rounded-xl p-3 w-full"
          >
            <option value="">Select Crop</option>
            {[
              "maize",
              "tobacco",
              "coffee",
              "barley",
              "cotton",
              "wheat",
              "jute",
              "tea",
              "pulses",
              "rice",
              "sugarcane",
              "millet",
            ].map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter State (optional)"
            className="border rounded-xl p-3 w-full"
          />

          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {schemes.length > 0 ? (
          <div className="space-y-4">
            {schemes.map((scheme, i) => (
              <div
                key={i}
                className="border p-4 rounded-xl shadow-sm bg-green-50"
              >
                <h2 className="text-xl font-semibold text-green-800">
                  {scheme.scheme_name}
                </h2>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Benefit:</strong> {scheme.benefit}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </p>
                <a
                  href={scheme.official_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Visit Official Page
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No schemes available for the selected crop.
          </p>
        )}
      </div>
    </div>
  );
}
