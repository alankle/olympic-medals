import {useState,useCallback} from 'react'

const URL = 'http://localhost:4000/countries';

const useFetchCountries = () => {

    const [countries, setCountries] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    
    const fetchCountries = useCallback(async () => {
        try{
        const response = await fetch(URL);
        const countries = await response.json();
        const sortCountries =  await countries.sort((a,b) => {
            return b.medals[0].gold - a.medals[0].gold
        })
        setCountries(sortCountries);
        setIsLoading(false);

        console.log(sortCountries);
        }catch(e){
        setIsError(true);
        }
    }, []);
    return [{isLoading, isError, countries}, fetchCountries]
}
    
export default useFetchCountries;