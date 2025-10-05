import { useState } from 'react'

const API_URL = 'http://localhost:3000'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    mathScore: 85,
    scienceScore: 90,
    projectScore: 80,
    gender: 'Female',
    socioeconomicIndex: 0.7
  })

  const testMLService = async () => {
    setLoading(true)
    setError(null)
    try {
      // Test direct ML service first
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          math_score: formData.mathScore,
          science_score: formData.scienceScore,
          project_score: formData.projectScore,
          gender: formData.gender,
          socioeconomic_index: formData.socioeconomicIndex
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPrediction(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-indigo-900 mb-4">
              Allumino
            </h1>
            <p className="text-xl text-gray-700">
              STEM Talent Detection Platform
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Hackathon MVP - Full Stack Demo
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Test ML Prediction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Math Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.mathScore}
                  onChange={(e) => setFormData({...formData, mathScore: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Science Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.scienceScore}
                  onChange={(e) => setFormData({...formData, scienceScore: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.projectScore}
                  onChange={(e) => setFormData({...formData, projectScore: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Socioeconomic Index (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.socioeconomicIndex}
                  onChange={(e) => setFormData({...formData, socioeconomicIndex: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={testMLService}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Predict STEM Potential'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
              <strong>Error:</strong> {error}
            </div>
          )}

          {prediction && (
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Prediction Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Prediction</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {prediction.prediction}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-green-900">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Score</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {prediction.score}
                  </p>
                </div>
              </div>

              {prediction.recommendations && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Recommendations
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-700">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 text-center text-sm text-gray-600">
            <p>Backend: http://localhost:3000 | ML Service: http://localhost:5001</p>
            <p className="mt-2">Full-stack STEM talent detection with ML predictions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
