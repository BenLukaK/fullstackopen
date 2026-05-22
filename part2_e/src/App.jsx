import { useState, useEffect } from 'react'
import cntryServices from './services/countries'
import weathServices from './services/weather'

const SearchInput = (props) => {
  return (
    <div>
      find countries <input value={props.value} onChange={props.onChangeHandler}/>
    </div>
  )
}

const DisplayCountry = ({filteredCountries, name, showHandler}) => {
  const countryNum = filteredCountries.length

  if (countryNum > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (1 < countryNum && countryNum <= 10 ) {
    return <ResultsList filteredCountries={filteredCountries} showHandler={showHandler}/>
  } else if (countryNum === 1) {
    return <CountryDetail singleCountry={filteredCountries[0]} />
  } else if (name !== "" && countryNum === 0) {
    return <p>No matches found</p>
  } else {
    return null
  }
}

const ResultsList = ({filteredCountries, showHandler}) => {
  return (
    <>
      {filteredCountries.map(country => 
        <div key={country.cca3}>
          {country.name.common} <ShowButton showHandler={() => showHandler(country)}/>
        </div>)}
    </>
  )
}

const CountryDetail = ({singleCountry}) => {
  const capitalName = singleCountry.capital ? singleCountry.capital.join(', ') : "N/A"

  const capitalPosition = singleCountry?.capitalInfo?.latlng
  const [lat, lon] = capitalPosition || []

  if (lat && lon) {
    weathServices
      .getCity(lat, lon)
      .then(weatherData => console.log(weatherData))
  }

  return (
    <div>
      <h1>{singleCountry.name.common}</h1>
      <div>Capital  {capitalName}</div>
      <div>Area {singleCountry.area}</div>
      <h1>Languages</h1>
      <ul>
        {Object.entries(singleCountry.languages).map(([code, name]) => {
          return <li key={code}>{name}</li>
        })}
      </ul>
      <img src={singleCountry.flags.png} alt={singleCountry.flags.alt} />
      <h1>Weather in {capitalName}</h1>
      <div>{lat} {lon}</div>
    </div>

  )
}

const ShowButton = ({showHandler}) => {
  return (
    <button onClick={showHandler}>Show</button>
  )
}

const DisplayCaptitalWeather = () => {

}

const App = () => {
  const [name, setName] = useState('')
  const [allCountries, setAllCountries] = useState([])

  const onNameChange = (e) => {
    setName(e.target.value)
  }

  const showHandler = (country) => {
    setName(country.name.common)
  }

  useEffect(() => {
    cntryServices
      .getAll()
      .then(countries => {
        setAllCountries(countries)
      })
  }, [])

  const filteredCountries = name === "" ? [] : allCountries.filter(country => country.name.common.toLowerCase().includes(name.toLowerCase()))

  return (
    <div>
      <SearchInput value={name} onChangeHandler={onNameChange} />
      <DisplayCountry filteredCountries={filteredCountries} name={name} showHandler={showHandler}/>
    </div>
  )
}

export default App
