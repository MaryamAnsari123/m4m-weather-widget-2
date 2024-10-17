
"use client";

import {useState, ChangeEvent, FormEvent } from "react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CloudIcon , MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
    temperature : number;
    description : string;
    location : string;
    unit : string;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather , setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string |null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedLocation = location.trim();
        if (trimmedLocation === "") {
            setError("please Enter a valid location.")

            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json();

            const weatherData : WeatherData = {
                temperature: data.current.temp_c ,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C",
            };

            setWeather(weatherData);
        } catch (error) {
            console.error("Error fetching weather data:" , error);

            setError("City not found. please try again");

            setWeather(null);

        } finally {
            setIsLoading(false);
        }
    };
   
    function getTemperatureMessage(temperature: number , unit: string): string {
        if (unit === "C") {
            if (temperature < 0) {
                return `It's freezing at ${temperature}°C! Bundle up!`
            }
            else if (temperature < 10) {
                return `It's quite cold at ${temperature}°C. Wear warm clothes.`
            }
            else if (temperature < 20) {
                return `The temperature is ${temperature}°C. Comfortable for a light jacket.`
            }
            else if (temperature < 30) {
                return `It's a pleasent ${temperature}°C. Enjoy the nice weather!.`
            }
            else {
                return `It's a hot at ${temperature}°C. stay hydrated!.`
            }
        }
        else {
            return `${temperature}°${unit}`;
        }
    }

    function getWeatherMessage(description: string): string {
        switch (description.toLowerCase())
        {
            case "sunny":
                return "It's a beautiful sunny day!";
                case "partly cloudy":
                    return "Expect some clouds and sunshine.";
                    case "cloudy":
                        return "It's a cloudy Today!";
                        case "overcast":
                            return "The sky is overcast.";
                            case "rain":
                                return "Don't forget your umbrella! It's raining";
                                case "thunderstorm":
                                    return "Thunderstorms are expected today. Be Careful!";
                                    case "snow":
                                        return "Bundle up! It's snowing";
                                        case "mist":
                                            return "It's a misty outside.";
                                            case "fog":
                                                return "Be careful! there's fog outside.";
                                                default:
                                                    return description;
        }
    }

    function getLocationMessage(location : string) : string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;

        return `${location} ${isNight ? "at Night" : "During the Day"}`;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-green-50">
            { /*Center the card within the screen*/ }
        
        <Card className="max-w-3xl mx-auto text-center h-70 bg-[url('/img/w1.avif')] bg-center bg-cover">
        { /*Card header with title and description*/ }

        <CardHeader>
            <CardTitle className="text-white font-mono text-3xl">Weather Widget</CardTitle>
            <CardDescription className="text-white font-bold">
            Search for the current weather conditions in your city
        </CardDescription>
        </CardHeader>
        {/* Card content including the search form and weather display */}

            <CardContent>
                {/* Form to input and submit location*/}

                <form onSubmit={handleSearch}
                className="flex items-center text-white bg-zinc-700 font-mono">
                    <Input type="text"
                    placeholder="Enter a city name"
                    value={location}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
                    
                    <Button type="submit" className="bg-blue-500 text-white text-xl font-sans"disabled={isLoading}>
                        {isLoading ? "Loading...." : "Search"}{" "}
                        {/* Show "Loading...." text while fetching data */}
                    </Button>
                </form>

                {/* Display error message if any */}

                {error && <div className="mt-4 text-red-800 bg-green-100 text-bold font-mono">{error}
                    </div>}

                    {/* Display weather data if available*/}
                    
                    {weather && (<div className="mt-4 grid gap-2 text-white font-mono">

                        {/* Display temperature message with icon */}
                        <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <ThermometerIcon className="w-6 h-6 text-white"/>
                            {
                                getTemperatureMessage(weather.temperature, weather.unit)
                            }    
                        </div>
                        </div>
                        {/* Display weather description message with icon */}

                        <div className="flex items-center gap-2">
                            <CloudIcon className="w-6 h-6 text-white" />

                            <div>
                                {getWeatherMessage(weather.description)}
                            </div>
                        </div>

                        {/* Display location message with icon */}
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="w-6 h-6 text-white" />

                            <div>
                                {getLocationMessage(weather.location)}
                            </div>
                        </div>
                        </div>
                        )}
            </CardContent>
            <div className="text-center font-mono text-base bg-white text-red-400 ">
                Made by <b>Maryam Ansari</b>
            </div>
        </Card>
        </div>
    );   
}






