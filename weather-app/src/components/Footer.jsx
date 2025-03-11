export default function Footer() {
    return (
        <footer className="w-full p-4 bg-opacity-30 bg-gray-800 backdrop-blur-md text-center">
            <p className="text-sm">
                © {new Date().getFullYear()} Weatherly. Powered by{" "}
                <a
                    href="https://openweathermap.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-400"
                >
                    OpenWeather
                </a>.
            </p>
        </footer>
    );
}