import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "../styles/Visualizer.css";

function PredictionVisualization() {
    const [sourceCity, setSourceCity] = useState("Delhi");
    const [departureTime, setDepartureTime] = useState("Evening");
    const [stops, setStops] = useState("zero");
    const [arrivalTime, setArrivalTime] = useState("Night");
    const [destinationCity, setDestinationCity] = useState("Mumbai");
    const [classType, setClassType] = useState("Economy");
    const [duration, setDuration] = useState(2.5);
    const [daysLeft, setDaysLeft] = useState(10);
    const [predictions, setPredictions] = useState([]);

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8000/predict_airline_prices", {
                airline: "SpiceJet", // Default airline, but it is ignored in batch prediction
                flight: "SG-8709",
                source_city: sourceCity,
                departure_time: departureTime,
                stops: stops,
                arrival_time: arrivalTime,
                destination_city: destinationCity,
                class: classType,
                duration: parseFloat(duration),
                days_left: parseInt(daysLeft),
            });

            setPredictions(response.data.airline_prices);
        } catch (error) {
            console.error("Error fetching predictions:", error);
        }
    };

    // Prepare data for the bar chart
    const chartData = {
        labels: predictions.map(prediction => Object.keys(prediction)[0]),
        datasets: [
            {
                label: "Predicted Flight Prices",
                data: predictions.map(prediction => Object.values(prediction)[0]),
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="App">
            <h1>Flight Price Predictor</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <label>Source City:</label>
                <select value={sourceCity} onChange={(e) => setSourceCity(e.target.value)}>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Kolkata</option>
                    <option>Hyderabad</option>
                    <option>Chennai</option>
                </select>

                <label>Departure Time:</label>
                <select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}>
                    <option>Evening</option>
                    <option>Early_Morning</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Night</option>
                    <option>Late_Night</option>
                </select>

                <label>Stops:</label>
                <select value={stops} onChange={(e) => setStops(e.target.value)}>
                    <option>zero</option>
                    <option>one</option>
                    <option>two_or_more</option>
                </select>

                <label>Arrival Time:</label>
                <select value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)}>
                    <option>Night</option>
                    <option>Morning</option>
                    <option>Early_Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Late_Night</option>
                </select>

                <label>Destination City:</label>
                <select value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)}>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Kolkata</option>
                    <option>Hyderabad</option>
                    <option>Chennai</option>
                </select>

                <label>Class:</label>
                <select value={classType} onChange={(e) => setClassType(e.target.value)}>
                    <option>Economy</option>
                    <option>Business</option>
                </select>

                <label>Duration (hours):</label>
                <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />

                <label>Days Left:</label>
                <input
                    type="number"
                    min="1"
                    max="49"
                    value={daysLeft}
                    onChange={(e) => setDaysLeft(e.target.value)}
                />

                <button type="submit">Get Predictions</button>
            </form>

            <div className="chart-container">
                {predictions.length > 0 && (
                    <Bar data={chartData} />
                )}
            </div>
        </div>
    );
}

export default PredictionVisualization;
