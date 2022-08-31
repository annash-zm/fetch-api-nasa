import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {

  const textInput = useRef<TextInput>(null)

  const [submit, setSubmit] = useState<string>('')
  const [random, setRandom] = useState<string>('')

  const [get, setGet] = useState<boolean>();

  const [asteroid, setAsteroid] = useState<
    {
      nama: string,
      nasa: string,
      is_potentially_hazardous_asteroid: boolean
    }[]>([]);

  const [idAsteroid, setIdAsteroid] = useState<string>('')

  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)
  const [disableRandom, setDisableRandom] = useState<boolean>(false)

  function getAPI(id: string) {
    setSubmit('Loading ...')
    setDisableSubmit(true)
    fetch('https://api.nasa.gov/neo/rest/v1/neo/' + id + '?api_key=17rJveXoJO8spFAIOLrCIm5KvifWyFt8SKgPzUgf')
      .then(
        res => res.json()
      )
      .then(
        rr => {
          setGet(false)
          setAsteroid(prev => [...prev, {
            nama: rr.name,
            nasa: rr.nasa_jpl_url,
            is_potentially_hazardous_asteroid: rr.is_potentially_hazardous_asteroid
          }])
        }
      )
      .catch(error => {
        alert('ID that you are enter is not Valid')
        setSubmit('Submit')
        textInput.current?.clear()
      })

    //console.log(asteroid)
  }

  function randomAPI() {
    setDisableRandom(true)
    setRandom('Loading ...')
    fetch('https://api.nasa.gov/neo/rest/v1/neo/browse/?api_key=17rJveXoJO8spFAIOLrCIm5KvifWyFt8SKgPzUgf')
      .then(
        res => res.json()
      )
      .then(
        rr => {
          var rand = Math.floor(Math.random() * 20);
          setGet(false)
          setAsteroid(prev => [...prev, {
            nama: rr.near_earth_objects[rand].name,
            nasa: rr.near_earth_objects[rand].nasa_jpl_url,
            is_potentially_hazardous_asteroid: rr.near_earth_objects[rand].is_potentially_hazardous_asteroid
          }])
        }
      )
      .catch(error => alert(error))
  }

  useEffect(() => {
    setGet(true)
    setAsteroid([])
    setDisableSubmit(true)
    setDisableRandom(false)
    setSubmit('Submit')
    setRandom('Random')
  }, [])

  function input() {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        {get ?
          <>
            <View
              style={{
                borderWidth: 0.5,
                borderRadius: 10,
                padding: 8,
                width: '100%',
                marginBottom: 20
              }}>
              <TextInput 
                ref={textInput}
                placeholder='Enter Asteroid ID'
                onChangeText={function (data) {
                  if (data.length > 0) {
                    setIdAsteroid(data)
                    setDisableSubmit(false)
                  }
                  else {
                    setDisableSubmit(true)
                  }
                }}
              />
            </View>

            <View style={{
              backgroundColor: "green",
              width: '100%',
              borderRadius: 10, marginBottom:10
            }}>
              <Button
                title={submit}
                onPress={() => { getAPI(idAsteroid) }}
                color="white"
                disabled={disableSubmit}
              />
            </View>

            <View style={{
              backgroundColor: "#841584",
              width: '100%',
              borderRadius: 10
            }}>
              <Button
                title={random}
                onPress={() => { randomAPI() }}
                color="white"
                disabled = {disableRandom}
              />
            </View>
          </>
          :
          <View>
            {asteroid.map((e, i) =>
              <View key={i}>
                <View style={{ marginBottom: 20 }}>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>name </Text>
                    <Text>{e.nama}</Text>
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>nasa_jpl_url </Text>
                    <Text>{e.nasa}</Text>
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>is_potentially_hazardous_asteroid </Text>
                    <Text>{e.is_potentially_hazardous_asteroid.toString()}</Text>
                  </View>
                </View>
                <Button
                  onPress={() => { setGet(true); setDisableRandom(false); setAsteroid([]); setRandom('Random'); setSubmit('Submit') }}
                  title='Back'
                />
              </View>
            )}
          </View>
        }
      </View>
    )
  }


  return (
    input()
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30
  },
});
