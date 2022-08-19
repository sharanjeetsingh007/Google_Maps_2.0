import { Autocomplete } from "@react-google-maps/api";
import React, { useEffect, useRef, useCallback, useState } from 'react'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import "./Search.css"
import CircularProgress from '@mui/material/CircularProgress';



function Search({ SearchRef, changeLoadingSpinnerCircle, LoadingSpinnerCircle, setNearbyPlaces, panTo, changeSpinner, changeMarker, setLoadingSpinnerState, changeNearbyPlacesType, valueInput, getValue, changeSearchInput, searchInput, nearbyPlacesOnLoad, changeNearbyMarker, nearbyMarker }) {

    const [modifiedNearby, setModifiedNearby] = useState([])


    const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 44, lng: () => -80 },
            radius: 50 * 1000,
        }
    })


    useEffect(() => {
        changeSpinner(false)
        setValue("")
        changeNearbyPlacesType("")
        document.getElementById("pac-input").value = ""
        changeSearchInput("")
    }, [valueInput])

    useEffect(() => {
        const newArray = nearbyPlacesOnLoad.splice(0, 2)
        setModifiedNearby(newArray)
        changeLoadingSpinnerCircle(false)
    }, [nearbyPlacesOnLoad])



    useEffect(() => {
        function initAutocomplete() {

            if (!searchInput) {
                return;
            }

            if (searchInput == "restaurants" || searchInput == "Restaurants") {
                changeNearbyPlacesType(searchInput)
                getValue(searchInput)
                // gettingGeoLocation(searchInput)
                return;

            }
            else if (searchInput == "gyms" || searchInput == "Gyms") {
                changeNearbyPlacesType(searchInput)
                getValue(searchInput)
            }
            else if (searchInput == "university" || searchInput == "University") {
                changeNearbyPlacesType(searchInput)
                getValue(searchInput)
            }
            else {
                // console.log('runned')
                let input = document.getElementById("pac-input");
                let searchBox = new window.google.maps.places.SearchBox(input);
                searchBox.addListener("places_changed", function () {

                    gettingGeoLocation(document.getElementById("pac-input").value)
                    changeSearchInput(document.getElementById("pac-input").value);
                });
            }
        }

        initAutocomplete()
    }, [searchInput])


    useEffect(() => {
        const newArray = nearbyPlacesOnLoad.splice(1, 2)
        setModifiedNearby(newArray)
        changeLoadingSpinnerCircle(false)
    }, [nearbyPlacesOnLoad])


    const gettingGeoLocation = async (value) => {
        // console.log(value, 'valueeeee issss')

        try {
            const results = await getGeocode({ "address": value });
            // console.log(results, 'results')
            const { lat, lng } = await getLatLng(results[0]);
            // console.log(lat, lng)
            panTo({ lat, lng })
            changeMarker(lat, lng)

        }
        catch (err) {

            // console.log(err, "err in combox converting address to latlong")
        }

    }

    const handleClickNearby = (index) => {
        changeNearbyMarker(modifiedNearby[index])
        const object = {
            lat: modifiedNearby[index].lat,
            lng: modifiedNearby[index].lng
        }
        panTo(object)
    }

    return (<>
        <div className='search'>
            <Autocomplete

            >
                <input type="text" id="pac-input" placeholder="Search address"
                    ref={SearchRef}
                    value={searchInput}
                    onChange={(e) => {
                        changeSearchInput(e.target.value)
                    }}
                />
            </Autocomplete>
            <div className='nearby'>
                <p>Near by</p>

                {LoadingSpinnerCircle ? <div className='circular__loading'><CircularProgress
                    thickness={1}
                    size={30}

                    style={{ color: "black" }} /></div> : modifiedNearby.map((place, index) => {
                        return <div className='nearby__card' key={index}
                            onClick={() => {
                                handleClickNearby(index)
                                setNearbyPlaces([])
                            }}
                        >
                            <p>Name</p>
                            <p className='name'>{place?.name}</p>
                            <p>address</p>
                            <p className='address'>{place?.address}</p>
                            <p>rating</p>
                            <p>{place?.rating}</p>
                            <p>Place</p>
                            <p>{place?.types[0]}</p>
                        </div>
                    })}
            </div>
        </div>
    </>)
}

export default React.memo(Search)