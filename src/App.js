import React, {useState, useEffect} from 'react';
import './App.css';
import useFetchCountries from './hooks/useFechCountries'

function App() {

  const URL = 'http://localhost:4000/countries';
  
  const [{isLoading, isError, countries}, fetchCountries] = useFetchCountries();
  const [isEditMedals, setIsEditMedals] = useState({showForm: false, country: null});
  const [onChangeMedal, setOnChangeMedal] = useState({gold: '', silver: '', bronze: ''});
  const [didMedalUpdate, setDidMedalUpdate] = useState(false);
  
  useEffect(() => {    
    fetchCountries();
  }, [didMedalUpdate, fetchCountries]);

  function editMedals(country) {
    const { medals: [{ gold, silver, bronze }] } = country;
    setIsEditMedals({ showForm: true, country });
    setOnChangeMedal({ gold, silver, bronze });
  }

  const handleInputChange = (event, keyName) => {
    event.persist();
    setOnChangeMedal((onChangeMedal)=>{
      return {...onChangeMedal, [keyName]: event.target.value}
    });
  }

  const updateMedals = async (id, country) => {
    setDidMedalUpdate(false);
    const response = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(country)
    });
    await response.json();
    await setDidMedalUpdate(true);
    await setIsEditMedals(false);
  };

  const onSubmitMedals = ((event, {country}, newMedals) =>{
    const {gold, silver, bronze } = newMedals;

    updateMedals(country.id,{
      ...country, medals:[{
        gold: parseInt(gold),
        silver: parseInt(silver),
        bronze: parseInt(bronze)
      }]
    })
    event.preventDefault();
  }
  )

  if(isLoading) {
    return(
      <div className="App App-container">
        <p style={{color: '#fff'}}>...Cargando</p>
      </div>
    )
  }
  if(isError) {
    return(
      <div className="App App-container">
        <p style={{color: '#fff'}}>...Algo malo occurio...</p>
      </div>
    )
  }
  return (
    <div className="App">
      <section className="App-container">
        <h3>Cuadro de medallas</h3>
        <table width="800" border="1" cellPadding="1" cellSpacing="1" > 
          <tbody>
            <tr>              
              <th></th>
              <th></th>
              <th>Oro<br/></th>
              <th>Plata<br/></th>
              <th>Bronce<br/></th>
              <th>Total  <br/></th>
            </tr>
          </tbody>
           
              {
                countries.map(country =>{
                  const  {medals: [{gold, silver, bronze}]} = country
                  return (
                     <tbody key={country.id}>
                        <tr>              
                          <th>{country.flag}</th>
                          <th 
                          onClick={() => editMedals(country)}
                          className="edit-medals"
                          >
                            {country.name}
                          </th>
                          <th>{gold}<br/></th>
                          <th>{silver}<br/></th>
                          <th>{bronze}<br/></th>
                          <th>{silver+bronze+gold}<br/></th>
                        </tr>
                    </tbody>
                  )
                  }
                )  
              }
           
        </table>
        <div className="medal-form-container">
              {
                isEditMedals.showForm &&
                <>
                  
                    <div className="country-selected-wrapper">
                      <span>{isEditMedals.country.flag}</span>
                      <p>{isEditMedals.country.name}</p>
                    </div>
                  <form onSubmit={(event) => onSubmitMedals(event, isEditMedals, onChangeMedal)} className="medal-form">
                    <div className="update-container">
                      <label htmlFor="">Oro:</label>
                      <input type="text" 
                        className="medal-input" 
                        value={onChangeMedal.gold}
                        onChange={(event) => handleInputChange(event, 'gold')}
                      />
                    </div>
                    <div className="update-container">
                      <label htmlFor="">Silver:</label>
                      <input type="text" 
                        className="medal-input" 
                        value={onChangeMedal.silver}
                        onChange={(evento) => handleInputChange(evento, 'silver')}
                      />
                    </div>
                    <div className="update-container">
                      <label htmlFor="">Bronze:</label>
                      <input type="text" 
                        className="medal-input"
                        value={onChangeMedal.bronze}
                        onChange={(event) => handleInputChange(event, 'bronze')}
                       />
                    </div>
                  <div className="update-container">
                    <button className="update-btn">Actualizar</button>
                  </div>
                  <div className="update-container">
                    <button className="cancel-btn"
                    value={onChangeMedal.bronze}
                    onChange={() => setIsEditMedals(false)}
                    >Cancelar</button>
                  </div>
                  </form>
                </>
                }
         </div>
      </section>
    </div>
  );
}

export default App;
