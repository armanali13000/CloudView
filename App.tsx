import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
  Dimensions, 
} from 'react-native';
import * as Location from 'expo-location';
import fetchWeather from './utils/fetchWeather';
import { getBackgroundColor } from './utils/getBackgroundColor';

export default function App() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const API_KEY = 'ENTER YOUR API KEY';


  const handleRefresh = async () => {
  setRefreshing(true);
  await loadWeatherByLocation();
  setRefreshing(false);
  };

  // Helper to group forecasts by day
  const groupByDay = (list: any[]) => {
    const days: Record<string, any[]> = {};
    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!days[date]) days[date] = [];
      days[date].push(item);
    });

    // For each day, average the temps and get the first icon/desc
    return Object.entries(days).map(([date, entries]) => {
      const temps = entries.map((e) => e.main.temp);
      const avgTemp =
        temps.reduce((sum, val) => sum + val, 0) / temps.length;
      return {
        date,
        temp: avgTemp,
        icon: entries[0].weather[0].icon,
        description: entries[0].weather[0].description,
      };
    });
  };

 const loadWeatherByLocation = async () => {
  setLoading(true);
  setErrorMsg(null);
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setLoading(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const currentWeather = await fetchWeather(latitude, longitude);

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();

    if (!forecastData.list) {
      throw new Error(forecastData.message || 'Invalid forecast response');
    }

    const daily = groupByDay(forecastData.list);

    setWeather({ ...currentWeather, temp: currentWeather.main.temp });
    setForecast(daily);
  } catch (err) {
    console.log('Location error:', err);
    setErrorMsg('Could not load weather data.');
    setForecast([]); // Clear forecast
  } finally {
    setLoading(false);
  }
};


 const loadWeatherByCity = async () => {
  if (!searchCity.trim()) return;
  setLoading(true);
  setErrorMsg(null);
  try {
    const currentWeather = await fetchWeather(undefined, undefined, searchCity);

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();

    if (!forecastData.list) {
      throw new Error(forecastData.message || 'Invalid forecast response');
    }

    const daily = groupByDay(forecastData.list);

    setWeather({ ...currentWeather, temp: currentWeather.main.temp });
    setForecast(daily);
  } catch (err: any) {
    console.log('City error:', err);
    setErrorMsg('Failed to load weather data for the entered city.');
    setForecast([]); // Clear forecast
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadWeatherByLocation();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor(weather?.weather?.[0]?.main || '') },
      ]}
    >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer,  { minHeight: Dimensions.get('window').height }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >

     <View style={styles.header}>
      <Text style={styles.appName}>CloudView</Text>
      <Text style={styles.tagline}>Your Window to the Sky</Text>
    </View> 

    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Enter city"
        value={searchCity}
        onChangeText={setSearchCity}
        style={styles.input}
        onSubmitEditing={loadWeatherByCity}
      />
      <Button title="Search" onPress={loadWeatherByCity} />
    </View>

    {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    )}

    {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

    {!loading && !errorMsg && weather && (
      <View style={styles.weatherContainer}>
        <Text style={styles.title}>{weather?.name}</Text>
         <Text style={styles.date}>
      {new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </Text>
        <Text style={styles.temp}>{Math.round(weather?.temp)}°C</Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
          }}
          style={styles.icon}
        />
        
        <Text style={styles.description}>{weather?.weather[0].description}</Text>
      </View>
    )}

    {Array.isArray(forecast) && forecast.length > 0 && (
      <View style={styles.forecastContainer}>
        <Text style={styles.forecastTitle}>5-Day Forecast</Text>
        {forecast.map((day, index) => (
          <View key={index} style={styles.forecastDay}>
            <Text style={styles.day}>{day.date}</Text>
            <Text style={styles.temp}>{Math.round(day.temp)}°C</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${day.icon}@4x.png`,
              }}
              style={styles.icon}
            />
            <Text style={styles.description}>{day.description}</Text>
          </View>
        ))}

        <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by Arman</Text>
      </View>
      </View>
    )}
  </ScrollView>
</KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    marginTop: 80,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
    fontSize: 16,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 20,
  },
  weatherContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 48,
    marginVertical: 10,
  },
  icon: {
    width: 120,
    height: 120,
    marginVertical: 10,
  },
  description: {
    fontSize: 20,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  forecastContainer: {
    width: '100%',
    marginTop: 10,
    paddingBottom: 40,
  },
  forecastTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  forecastDay: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
  flexGrow: 1,
  justifyContent: 'flex-start',
  paddingHorizontal: 20,
  paddingBottom: 40,
  },

  header: {
  alignItems: 'center',
  marginBottom: -40,
  marginTop: 90,
},
appName: {
  fontSize: 40,
  fontWeight: 'bold',
  color: '#fff',
},
tagline: {
  fontSize: 16,
  fontStyle: 'italic',
  color: '#fff',
  marginTop: 3,
},

footer: {
  alignItems: 'center',
  marginVertical: 20,
},
footerText: {
  fontSize: 14,
  color: '#fff',
  fontStyle: 'italic',
},
date: {
  fontSize: 16,
  color: '#eeeeee',
  marginBottom: 10,
},
});

