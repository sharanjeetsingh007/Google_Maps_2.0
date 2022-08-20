import React, { useEffect, useState, useRef } from 'react'
import { GoogleMap, useLoadScript, MarkerF, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import './Maps.css'
import mapStyles from '../../mapStyles';
import usePlacesAutocomplete, { getGeocode, getlatLng } from 'use-places-autocomplete';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import Search from '../Search/Search';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet, Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import { TrendingUpTwoTone } from '@mui/icons-material';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';





const options = {
    styles: mapStyles,
    fullscreenControl: false,
    mapTypeControl: false,
    zoomControl: true,
    minZoom: 3,
    restriction: {
        latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180
        }
    },
}

const libraries = ["places"]


function Maps({ changeSidebarProps, sidebarProp }) {

    const [marker, setMarker] = useState({});
    const [nearbyMarker, setNearbyMarker] = useState({});
    const [nearbyPlaceType, setNearbyPlaceType] = useState("")
    const [nearbyPlaces, setNearbyPlaces] = useState([])
    const [nearbyPlacesOnLoad, setNearbyPlacesOnLoad] = useState([])
    const [mapState, setMapState] = useState(/** @type google.maps.GoogleMap */(null))
    const [rankDistance, setRankDistance] = useState(0)
    const [valueInput, setValueInput] = useState(false)
    const [value, setValue] = useState("")
    const [selectedMarker, setSelectedMarker] = useState({})
    const [showInfoWindow, setShowInfoWindow] = useState(false)
    const [originalMap, setOriginlMap] = useState(/** @type google.maps.GoogleMap */(null))
    const [directonRoute, setDirectonRoute] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [sidebarToggle, setSidebarToggle] = useState(true)
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [skletonLoading, setSkletionLoading] = useState(true)
    const [LoadingSpinnerState, setLoadingSpinnerState] = useState(false)
    const [LoadingSpinnerCircle, setLoadingSpinnerCircle] = useState(true)



    const SearchRef = useRef()
    const fromRef = useRef()
    const toRef = useRef()

    const changeLoadingSpinnerCircle = (value) => {
        setLoadingSpinnerCircle(value)
    }

    const changeSidebarToggle = (value) => {
        setSidebarToggle(prev => !prev)
    }
    const changeSearchInput = (value) => {
        setSearchInput(value);

    }
    const changeDirectionRoute = (value) => {
        setDirectonRoute(value)
        if (value == null) {
            fromRef.current.value = ""
            toRef.current.value = ""
        }
    }
    const changeNearbyPlacesType = (value) => {
        setNearbyPlaceType(value)
    }

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(13);
    }, [])

    const changeMarker = (lat, lng) => {
        setMarker({
            lat: lat,
            lng: lng,
            time: new Date(),
        })
    }
    const changeNearbyMarker = (value) => {
        setNearbyMarker(value)
    }
    const getValue = (value) => {
        setValue(value)

    }
    const changeSpinner = (value) => {
        setLoadingSpinnerState(value)
    }

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
        libraries: libraries
    })

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
        let PlaceNearbyService = new window.google.maps.places.PlacesService(map);
        setRankDistance(window.google.maps.places.RankBy.DISTANCE)
        setMapState(PlaceNearbyService)
        setOriginlMap(map)


        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {

                setLatitude(position.coords.latitude)
                setLongitude(position.coords.longitude)
                let request = {
                    location: { lat: position.coords.latitude, lng: position.coords.longitude },
                    rankBy: rankDistance,
                    keyword: "parks",
                    radius: 200 * 1000,
                };
                PlaceNearbyService.nearbySearch(request, async (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        await setNearbyPlacesOnLoad(results.map((result) => {
                            if (result.photos) {
                                if (result == undefined) {
                                    console.log(result, 'result in photos')

                                }
                                return {
                                    lat: result?.geometry?.location?.lat(),
                                    lng: result?.geometry?.location?.lng(),
                                    image: result?.photos[0]?.getUrl(),
                                    name: result?.name,
                                    rating: result?.rating,
                                    // isOpen: result.opening_hours.isOpen(),
                                    types: result?.types,
                                    address: result?.vicinity,
                                }
                            }
                        }))
                    }
                })
            })
        } else {
            alert("Required Location accesss for the app");

        }
    }, [])




    useEffect(() => {
        if (mapState) {
            let request = {
                location: { lat: latitude, lng: longitude },
                rankBy: rankDistance,
                keyword: "parks",
                // radius: 200 * 1000,
            };
            mapState.nearbySearch(request, async (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    await setNearbyPlacesOnLoad(results.map((result) => {
                        if (result.photos) {

                            return {
                                lat: result.geometry.location.lat(),
                                lng: result.geometry.location.lng(),
                                image: result?.photos[0]?.getUrl(),
                                name: result.name,
                                rating: result.rating,
                                // isOpen: result.opening_hours.isOpen(),
                                types: result.types,
                                address: result.vicinity,
                            }
                        }
                    }))
                }
            })
        }
    }, [sidebarProp])



    useEffect(() => {
        setMarker({ lat: latitude, lng: longitude })
    }, [latitude, longitude])

    useEffect(() => {
        let request = {
            location: { lat: latitude, lng: longitude },
            rankBy: rankDistance,
            keyword: "parks",
            // radius: 200 * 1000,
        };
        if (mapState) {
            mapState.nearbySearch(request, async (results, status) => {

                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    await setNearbyPlacesOnLoad(results.map((result) => {

                        if (result.photos && result !== undefined) {

                            return {
                                lat: result.geometry.location.lat(),
                                lng: result.geometry.location.lng(),
                                image: result?.photos[0]?.getUrl(),
                                name: result.name,
                                rating: result.rating,
                                // isOpen: result.opening_hours.isOpen(),
                                types: result.types,
                                address: result.vicinity,
                            }
                        }
                    }))
                }
            })
        }
    }, [sidebarProp])


    useEffect(() => {
        if (mapState) {
            if (value == "restaurants" || value == "Restaurants") {
                setLoadingSpinnerState(true)
                if (nearbyPlaceType == "") {
                    setNearbyPlaces([])
                    setLoadingSpinnerState(false)
                    return;
                }
                let request = {
                    location: { lat: latitude, lng: longitude },
                    rankBy: rankDistance,
                    keyword: nearbyPlaceType,
                };
                mapState.nearbySearch(request, async (results, status) => {
                    setLoadingSpinnerState(false)

                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        await setNearbyPlaces(results.map((result) => {
                            // console.log(result, 'resturants')
                            if (result.photos) {
                                panTo({ lat: result.geometry.location.lat(), lng: result.geometry.location.lng() })
                                return {
                                    lat: result.geometry.location.lat(),
                                    lng: result.geometry.location.lng(),
                                    image: result?.photos[0]?.getUrl(),
                                    name: result.name,
                                    rating: result.rating,
                                    // isOpen: result.opening_hours.isOpen(),
                                    types: result.types,
                                    address: result.vicinity,
                                }
                            }
                        }))
                    }
                })
            }
            if (value == "gyms" || value == "Gyms") {
                setLoadingSpinnerState(true)
                if (nearbyPlaceType == "") {
                    setNearbyPlaces([])
                    setLoadingSpinnerState(false)
                    return;
                }
                let request = {
                    location: { lat: latitude, lng: longitude },
                    rankBy: rankDistance,
                    keyword: nearbyPlaceType,

                };
                mapState.nearbySearch(request, async (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        await setNearbyPlaces(results.map((result) => {
                            // console.log(result, 'parkkkksssss')
                            setLoadingSpinnerState(false)

                            if (result.photos) {
                                panTo({ lat: result.geometry.location.lat(), lng: result.geometry.location.lng() })
                                return {
                                    lat: result.geometry.location.lat(),
                                    lng: result.geometry.location.lng(),
                                    image: result?.photos[0]?.getUrl(),
                                    name: result.name,
                                    rating: result.rating,
                                    // isOpen: result.opening_hours.isOpen(),
                                    types: result.types,
                                    address: result.vicinity,
                                }
                            }
                        }))
                    }
                })
            }

            if (value == "university" || value == "University") {
                setLoadingSpinnerState(true)
                if (nearbyPlaceType == "") {
                    setNearbyPlaces([])
                    setLoadingSpinnerState(false)
                    return;
                }
                let request = {
                    location: { lat: latitude, lng: longitude },
                    rankBy: rankDistance,
                    keyword: nearbyPlaceType,
                };
                mapState.nearbySearch(request, async (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        await setNearbyPlaces(results.map((result) => {
                            // console.log(result, 'parkkkksssss')
                            setLoadingSpinnerState(false)
                            if (result.photos) {
                                panTo({ lat: result.geometry.location.lat(), lng: result.geometry.location.lng() })
                                return {
                                    lat: result.geometry.location.lat(),
                                    lng: result.geometry.location.lng(),
                                    image: result?.photos[0]?.getUrl(),
                                    name: result.name,
                                    rating: result.rating,
                                    // isOpen: result.opening_hours.isOpen(),
                                    types: result.types,
                                    address: result.vicinity,
                                }
                            }
                        }))
                    }
                })
            }
        }
    }, [nearbyPlaceType])






    return (<> {!isLoaded ? <LoadingSpinner /> :

        <> {LoadingSpinnerState && <LoadingSpinner backgroundColor={"rgba(0, 0, 0, 0.2)"} />}
            <div className='map'>
                <div className='map__ui'
                    style={{ width: sidebarToggle ? "300px" : "56px" }}
                >
                    <div className='sidebar__wrapper'>
                        <Sidebar latitude={latitude} longitude={longitude} setMarker={setMarker} changeDirectionRoute={changeDirectionRoute} changeSidebarProps={changeSidebarProps} sidebarProp={sidebarProp} changeSidebarToggle={changeSidebarToggle} sidebarToggle={sidebarToggle} />
                    </div>
                    <div className='services__wrapper'
                        style={{ display: sidebarToggle ? "flex" : "none" }}
                    >
                        {sidebarProp == "search" && <Search
                            changeLoadingSpinnerCircle={changeLoadingSpinnerCircle}
                            LoadingSpinnerCircle={LoadingSpinnerCircle}
                            setLoadingSpinnerState={setLoadingSpinnerState}
                            changeSpinner={changeSpinner}
                            nearbyPlacesOnLoad={nearbyPlacesOnLoad}
                            panTo={panTo}
                            changeMarker={changeMarker}
                            changeNearbyPlacesType={changeNearbyPlacesType}
                            valueInput={valueInput}
                            getValue={getValue}
                            changeSearchInput={changeSearchInput}
                            searchInput={searchInput}
                            changeNearbyMarker={changeNearbyMarker}
                            nearbyMarker={nearbyMarker}
                            setNearbyPlaces={setNearbyPlaces}
                            SearchRef={SearchRef}
                        />}
                        {sidebarProp == "navigation" && <Navigation
                            changeDirectionRoute={changeDirectionRoute}
                            directonRoute={directonRoute}
                            fromRef={fromRef}
                            toRef={toRef}
                        />}
                    </div>
                </div>
                <div className='home__btn'>
                    <IconButton aria-label="home"
                        onClick={() => {
                            panTo({ lat: latitude, lng: longitude })
                            setMarker({ lat: latitude, lng: longitude })
                            setNearbyMarker({})
                            setValueInput(!valueInput)
                            originalMap.panTo(marker)
                            setNearbyPlaces([])
                            changeDirectionRoute(null)
                        }
                        }>
                        <HomeIcon />
                    </IconButton>
                </div>
                <GoogleMap
                    zoom={13}
                    maxZoom={13}
                    center={marker}
                    mapContainerClassName="map__container"
                    options={options}
                    onLoad={onMapLoad}
                    animation={window.google.maps.Animation.BOUNCE}
                    labelStyle={{ color: "black" }}
                >
                    {
                        !nearbyPlaces.length == 0 ? nearbyPlaces.map((location, index) => {
                            if (location) {
                                const corr = {
                                    lat: location.lat,
                                    lng: location.lng
                                }
                                return <MarkerF
                                    key={index}
                                    position={corr}
                                    onClick={() => {
                                        setSelectedMarker(location)
                                        setShowInfoWindow(true)
                                        console.log('clicked')
                                    }}
                                    icon={{
                                        url: "https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309739__480.png",
                                        scaledSize: new window.google.maps.Size(25, 40)
                                    }} />
                            }
                        }
                        )
                            : nearbyMarker.lat == undefined ? <MarkerF
                                position={marker}
                                icon={{
                                    url: "https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309739__480.png",
                                    scaledSize: new window.google.maps.Size(25, 40)
                                }}
                                onClick={() => {
                                    setSelectedMarker({})
                                    setShowInfoWindow(false)
                                    console.log('clicked')
                                }}
                            />
                                :
                                <MarkerF
                                    position={{ "lat": nearbyMarker.lat, "lng": nearbyMarker.lng }}
                                    icon={{
                                        url: "https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309739__480.png",
                                        scaledSize: new window.google.maps.Size(25, 40)
                                    }}
                                    onClick={() => {
                                        setSelectedMarker(nearbyMarker)
                                        setShowInfoWindow(true)
                                    }}
                                />
                    }
                    {showInfoWindow && (
                        <InfoWindow
                            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                            visible={showInfoWindow}
                            onCloseClick={() => {
                                setShowInfoWindow(false)
                                setSelectedMarker({})
                                setSkletionLoading(false)
                            }}
                        >
                            <div className='infowindow__main'>
                                <div className='image'>
                                    <img
                                        className={skletonLoading ? "skeleton" : undefined}
                                        style={{ display: skletonLoading ? "block" : "none" }}
                                    />
                                    <img src={selectedMarker.image}
                                        style={{ display: skletonLoading ? "none" : "block" }}
                                        onLoad={() => setSkletionLoading(false)}
                                    />
                                </div>
                                <div className='infowindow__name infowindow__item'>
                                    <p>Name</p>
                                    <p>{selectedMarker.name} </p>
                                </div>
                                <div className='infowindow__rating infowindow__item'>
                                    <p>Rating</p>
                                    {selectedMarker.rating && <Rating key={selectedMarker.rating} name="half-rating-read" defaultValue={selectedMarker.rating && selectedMarker.rating}
                                        precision={0.5}
                                        readOnly />}

                                </div>
                                <div className='infowindow__address infowindow__item'>
                                    <p>Address</p>
                                    <p>{selectedMarker.address} </p>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                    {directonRoute && <DirectionsRenderer
                        directions={directonRoute}
                        setMarker={{}}
                    />}
                </GoogleMap>
            </div>
        </>


    }
    </>
    )
}

export default Maps