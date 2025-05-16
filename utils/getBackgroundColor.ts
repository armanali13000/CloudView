export const getBackgroundColor = (weatherMain: string): string => {
  switch (weatherMain) {
    case 'Clear':
      return '#FFD700'; // sunny yellow
    case 'Clouds':
      return '#A9A9A9'; // gray
    case 'Rain':
    case 'Drizzle':
      return '#5F9EA0'; // blue-gray
    case 'Thunderstorm':
      return '#4B0082'; // dark purple
    case 'Snow':
      return '#E0FFFF'; // icy blue
    case 'Mist':
    case 'Fog':
      return '#D3D3D3'; // light gray
    default:
      return '#87CEEB'; // default sky blue
  }
};
