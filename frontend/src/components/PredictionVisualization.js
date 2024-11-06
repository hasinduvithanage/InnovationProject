import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import styles from "../styles/Visualizer.module.css";

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

    const modelNames = ["RandomForestRegressor", "XGBRegressor", "ExtraTreesRegressor", "DecisionTreeRegressor"];

    const handleSubmit = async () => {
        try {
            const responses = await Promise.all(
                modelNames.map(model =>
                    axios.post("http://localhost:8000/predict", {
                        airline: "SpiceJet",
                        flight: "SG-8709",
                        source_city: sourceCity,
                        departure_time: departureTime,
                        stops: stops,
                        arrival_time: arrivalTime,
                        destination_city: destinationCity,
                        class: classType,
                        duration: parseFloat(duration),
                        days_left: parseInt(daysLeft),
                        model_name: model,  // Ensure model_name is sent correctly
                    })
                )
            );

            const allPredictions = responses.map((response, index) => ({
                model: modelNames[index],
                price: response.data.price,
            }));

            setPredictions(allPredictions);
            console.log("Updated Predictions:", allPredictions);
        } catch (error) {
            console.error("Error fetching predictions:", error);
        }
    };


    // Prepare data for the bar chart
    const chartData = {
        labels: predictions.map(prediction => prediction.model),
        datasets: [
            {
                label: "Predicted Flight Prices",
                data: predictions.map(prediction => prediction.price),
                backgroundColor: "rgba(75,192,192,0.6)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 16 },
                },
            },
        },
        scales: {
            x: {
                title: { display: true, text: "Models", font: { size: 18 } },
                ticks: { font: { size: 14 } },
            },
            y: {
                title: { display: true, text: "Price (in currency units)", font: { size: 18 } },
            },
        },
        layout: { padding: 20 },
    };

    return (
        <div className={styles.homemain}>
            <h2 className={styles.heading}>Flight Price Predictor</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.formContainer}>
                {/* Form Inputs */}
                <label className={styles.labelText}>Source City:</label>
                <select value={sourceCity} onChange={(e) => setSourceCity(e.target.value)} className={styles.selectInput}>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Kolkata</option>
                    <option>Hyderabad</option>
                    <option>Chennai</option>
                </select>

                <label className={styles.labelText}>Departure Time:</label>
                <select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className={styles.selectInput}>
                    <option>Evening</option>
                    <option>Early_Morning</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Night</option>
                    <option>Late_Night</option>
                </select>

                <label className={styles.labelText}>Stops:</label>
                <select value={stops} onChange={(e) => setStops(e.target.value)} className={styles.selectInput}>
                    <option>zero</option>
                    <option>one</option>
                    <option>two_or_more</option>
                </select>

                <label className={styles.labelText}>Arrival Time:</label>
                <select value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className={styles.selectInput}>
                    <option>Night</option>
                    <option>Morning</option>
                    <option>Early_Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Late_Night</option>
                </select>

                <label className={styles.labelText}>Destination City:</label>
                <select value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} className={styles.selectInput}>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Kolkata</option>
                    <option>Hyderabad</option>
                    <option>Chennai</option>
                </select>

                <label className={styles.labelText}>Class:</label>
                <select value={classType} onChange={(e) => setClassType(e.target.value)} className={styles.selectInput}>
                    <option>Economy</option>
                    <option>Business</option>
                </select>

                <label className={styles.labelText}>Duration (hours):</label>
                <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={styles.textInput}
                />

                <label className={styles.labelText}>Days Left:</label>
                <input
                    type="number"
                    min="1"
                    max="49"
                    value={daysLeft}
                    onChange={(e) => setDaysLeft(e.target.value)}
                    className={styles.textInput}
                />

                <button type="submit" className={styles.submitButton}>Get Predictions</button>
            </form>

            <div className={styles.chartContainer}>
                {predictions.length > 0 && (
                    <Bar data={chartData} options={chartOptions} height={400} key={predictions.length} />
                )}
            </div>
        </div>
    );
}

export default PredictionVisualization;
