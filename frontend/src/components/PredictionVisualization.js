import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import airports from "../assets/airports.json"; // Import airport locations JSON
import "leaflet/dist/leaflet.css";
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
    const [weatherData, setWeatherData] = useState(null);

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

    const averagePrice = predictions.length > 0
    ? predictions.reduce((sum, prediction) => sum + prediction.price, 0) / predictions.length
    : 0;

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
                title: { display: true, text: "Price (INR)", font: { size: 18 } },
            },
        },
        layout: { padding: 20 },
    };

        useEffect(() => {
        if (sourceCity && destinationCity) {
            fetchWeatherData(sourceCity, destinationCity);
        }
    }, [sourceCity, destinationCity]);

    const fetchWeatherData = async (source, destination) => {
        const sourceCoords = airports[source];
        const destinationCoords = airports[destination];

        try {
            // Fetch source city weather data
            const sourceWeatherResponse = await axios.get(`http://localhost:8000/get_weather_data`, {
                params: { lat: sourceCoords.latitude, lon: sourceCoords.longitude }
            });

            // Fetch destination city weather data
            const destinationWeatherResponse = await axios.get(`http://localhost:8000/get_weather_data`, {
                params: { lat: destinationCoords.latitude, lon: destinationCoords.longitude }
            });

            // Set weather data to the state
            setWeatherData({
                source: sourceWeatherResponse,
                destination: destinationWeatherResponse,
            });

            console.log("Weather Data:", sourceWeatherResponse, destinationWeatherResponse);

        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    return (
        <div className={styles.homemain}>
            <h2 className={styles.heading}>Flight Price Predictor</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }} className={`${styles.formContainer} ${styles.formContainerLeft}`}>
                {/* Form Inputs */}
                <label className={styles.labelText}>Source City:</label>
                <select value={sourceCity} onChange={(e) => setSourceCity(e.target.value)}
                        className={styles.selectInput}>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Kolkata</option>
                    <option>Hyderabad</option>
                    <option>Chennai</option>
                </select>

                <label className={styles.labelText}>Departure Time:</label>
                <select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}
                        className={styles.selectInput}>
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
                <select value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)}
                        className={styles.selectInput}>
                    <option>Night</option>
                    <option>Morning</option>
                    <option>Early_Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Late_Night</option>
                </select>

                <label className={styles.labelText}>Destination City:</label>
                <select value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)}
                        className={styles.selectInput}>
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

            <div className={`${styles.chartContainer} ${styles.chartContainerRight}`}>
                {predictions.length > 0 && (
                    <>
                        <Bar data={chartData} options={chartOptions} height={400} key={predictions.length}/>
                        <div className={styles.averagePrice}>
                            <h3>Average Predicted Price: {averagePrice.toFixed(2)} INR</h3>
                        </div>
                    </>
                )}
            {weatherData && (
                <div className={styles.weatherContainer}>
                    <h3>Weather Data</h3>
                    <div className={styles.weatherColumns}>
                        <div>
                            <h4>Source City Weather:</h4>
                            <div className={styles.weatherItem}>
                                <p><strong>Date & Time:</strong> {weatherData.source.data.date_time}</p>
                                <p><strong>Temperature:</strong> {weatherData.source.data.temperature} K</p>
                                <p><strong>Feels Like:</strong> {weatherData.source.data.feels_like} K</p>
                                <p><strong>Min Temp:</strong> {weatherData.source.data.temp_min} K</p>
                                <p><strong>Max Temp:</strong> {weatherData.source.data.temp_max} K</p>
                                <p><strong>Humidity:</strong> {weatherData.source.data.humidity}%</p>
                                <p><strong>Weather:</strong> {weatherData.source.data.weather}</p>
                                <p><strong>Wind Speed:</strong> {weatherData.source.data.wind_speed} m/s</p>
                                <p><strong>Wind Direction:</strong> {weatherData.source.data.wind_direction}°</p>
                            </div>
                        </div>
                        <div>
                            <h4>Destination City Weather:</h4>
                            <div className={styles.weatherItem}>
                                <p><strong>Date & Time:</strong> {weatherData.destination.data.date_time}</p>
                                <p><strong>Temperature:</strong> {weatherData.destination.data.temperature} K</p>
                                <p><strong>Feels Like:</strong> {weatherData.destination.data.feels_like} K</p>
                                <p><strong>Min Temp:</strong> {weatherData.destination.data.temp_min} K</p>
                                <p><strong>Max Temp:</strong> {weatherData.destination.data.temp_max} K</p>
                                <p><strong>Humidity:</strong> {weatherData.destination.data.humidity}%</p>
                                <p><strong>Weather:</strong> {weatherData.destination.data.weather}</p>
                                <p><strong>Wind Speed:</strong> {weatherData.destination.data.wind_speed} m/s</p>
                                <p><strong>Wind Direction:</strong> {weatherData.destination.data.wind_direction}°</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default PredictionVisualization;
