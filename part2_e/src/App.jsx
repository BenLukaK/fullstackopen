import { useState, useEffect } from 'react'
import cntryServices from './services/countries'

const SearchInput = (props) => {
  return (
    <div>
      find countries <input value={props.value} onChange={props.onChangeHandler}/>
    </div>
  )
}

const DisplayController = ({filteredCountries, name}) => {
  const countryNum = filteredCountries.length

  if (countryNum > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (1 < countryNum && countryNum <= 10 ) {
    return <ResultsList filteredCountries={filteredCountries} />
  } else if (countryNum === 1) {
    return <CountryDetail singleCountry={filteredCountries[0]} />
  } else if (name !== "" && countryNum === 0) {
    return <p>No matches found</p>
  } else {
    return null
  }
}

const ResultsList = ({filteredCountries}) => {
  return (
    <ul>
      {filteredCountries.map(country => {
        return <li key={country.cca3}>{country.name.common}</li>
      })}
    </ul>
  )
}

const CountryDetail = ({singleCountry}) => {
  return (
    <div>
      <h1>{singleCountry.name.common}</h1>
      <div>Capital {singleCountry.capital.join(', ')}</div>
      <div>Area {singleCountry.area}</div>
      <h1>Languages</h1>
      <ul>
        {Object.entries(singleCountry.languages).map(([code, name]) => {
          return <li key={code}>{name}</li>
        })}
      </ul>
      <img src={singleCountry.flags.png} alt={singleCountry.flags.alt} />
    </div>

  )
}
 
const App = () => {
  const [name, setName] = useState('')
  const [allCountries, setAllCountries] = useState([])

  const onNameChange = (e) => {
    setName(e.target.value)
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
      <DisplayController filteredCountries={filteredCountries} name={name} />
    </div>
  )
}

export default App
