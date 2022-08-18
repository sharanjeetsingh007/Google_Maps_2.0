import React, { useEffect, useRef, useState } from 'react'
import { GoogleMap, useLoadScript, MarkerF, InfoWindow, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import IconButton from '@mui/material/IconButton';
import NavigationIcon from '@mui/icons-material/Navigation';
import "./Navigation.css"



function Navigation({ changeDirectionRoute, directonRoute, fromRef, toRef }) {

    // const [directonRoute, setDirectonRoute] = useState(null)
    const [distance, setDistance] = useState("")
    const [duration, setDuration] = useState("")



    // console.log(fromRef.current.value, 'from')

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    // console.log(value, 'value in navigation')


    const navigation = async () => {
        if (fromRef.current.value == "" || toRef.current.value == "") {
            return;
        }
        if (value == 0) {
            try {
                const directionService = new window.google.maps.DirectionsService()
                const result = await directionService.route({
                    origin: fromRef.current.value,
                    destination: toRef.current.value,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                })
                // console.log(result, 'request directionService')
                changeDirectionRoute(result)
                setDistance(result.routes[0].legs[0].distance.text)
                setDuration(result.routes[0].legs[0].duration.text)
            } catch (err) {
                alert(err.message)
            }
        }
        if (value == 1) {
            try {
                const directionService = new window.google.maps.DirectionsService()
                const result = await directionService.route({
                    origin: fromRef.current.value,
                    destination: toRef.current.value,
                    travelMode: window.google.maps.TravelMode.TRANSIT,
                })
                // console.log(result, 'request directionService')
                changeDirectionRoute(result)
                setDistance(result.routes[0].legs[0].distance.text)
                setDuration(result.routes[0].legs[0].duration.text)
            } catch (err) {
                alert(err.message)
            }
        }
        if (value == 2) {
            try {
                const directionService = new window.google.maps.DirectionsService()
                const result = await directionService.route({
                    origin: fromRef.current.value,
                    destination: toRef.current.value,
                    travelMode: window.google.maps.TravelMode.BICYCLING,
                })
                // console.log(result, 'request directionService')
                changeDirectionRoute(result)
                setDistance(result.routes[0].legs[0].distance.text)
                setDuration(result.routes[0].legs[0].duration.text)
            } catch (err) {
                alert(err.message)
            }
        }
        if (value == 3) {
            try {
                const directionService = new window.google.maps.DirectionsService()
                const result = await directionService.route({
                    origin: fromRef.current.value,
                    destination: toRef.current.value,
                    travelMode: window.google.maps.TravelMode.WALKING,
                })
                // console.log(result, 'request directionService')
                changeDirectionRoute(result)
                setDistance(result.routes[0].legs[0].distance.text)
                setDuration(result.routes[0].legs[0].duration.text)
            } catch (err) {
                alert(err.message)
            }
        }
    }

    useEffect(() => {
        navigation()
    }, [value])

    // console.log(directonRoute, "directonRoute")
    return (
        <div className='Navigation'>
            <div className='inputs'>
                <div className='inputs__inner'>
                    <Autocomplete>
                        <input placeholder='From' type="text"
                            // onChange={e => setFrom(e.target.value)}
                            ref={fromRef}
                        />
                    </Autocomplete>
                    <Autocomplete>
                        <input placeholder='To' type="text"
                            ref={toRef}
                        />
                    </Autocomplete>
                </div>
                <div className='direction__button'>
                    <IconButton aria-label="delete"
                        onClick={navigation}
                    >
                        <NavigationIcon style={{ color: "#0976B7", fontSize: '30px' }} />
                    </IconButton>
                </div>
            </div>
            <div className='nav__transport'>
                <Tabs key={value} className='tab__custom' value={value} onChange={handleChange} aria-label="icon tabs example">
                    <Tab style={{ minWidth: '58px' }} className='tabs__custom' icon={<DriveEtaIcon style={{ fontSize: '15px' }} />} aria-label="phone" />
                    <Tab style={{ minWidth: '58px' }} icon={<DirectionsTransitIcon style={{ fontSize: '15px' }} />} aria-label="favorite" />
                    <Tab style={{ minWidth: '58px' }} icon={<DirectionsBikeIcon style={{ fontSize: '15px' }} />} aria-label="person" />
                    <Tab style={{ minWidth: '58px' }} icon={<DirectionsWalkIcon style={{ fontSize: '15px' }} />} aria-label="person" />
                </Tabs>
                <div className='details'>
                    {value == 0 ? <>
                        {!directonRoute ? <p>Search to get Navigation...</p> :
                            <div className='details __inner'>
                                <div className='details__inner__flex'>
                                    <p> Distance: </p>
                                    <p>{directonRoute?.routes[0]?.legs[0]?.distance?.text}</p>
                                </div>
                                <div className='details__inner__flex'>
                                    <p> Duration:</p><p> {directonRoute?.routes[0]?.legs[0]?.duration?.text}</p>
                                </div>
                            </div>
                        }
                    </> : value == 1 ? <>
                        {!directonRoute ? <p>Search to get Navigation...</p> :
                            <div className='details__inner'>
                                <div className='details__inner__flex'>
                                    <p> Arrival Time:</p><p> {directonRoute?.routes[0]?.legs[0]?.arrival_time?.text}</p>
                                </div>
                                <div className='details__inner__flex'>
                                    <p> Departure Time:</p> <p>{directonRoute?.routes[0]?.legs[0]?.departure_time?.text}</p>
                                </div>
                                <div className='details__inner__flex'>
                                    <p> Distance: </p><p>{directonRoute?.routes[0]?.legs[0]?.distance?.text}</p>
                                </div>
                                <div className='details__inner__flex'>
                                    <p> Duration: </p><p>{directonRoute?.routes[0]?.legs[0]?.duration?.text}</p>
                                </div>
                                <div className='details__inner__flex'>
                                    <p> Line: </p><p>{directonRoute?.routes[0]?.legs[0]?.steps[0]?.transit?.line?.name}</p>
                                </div>
                            </div>
                        }
                    </> : value == 2 ? <>
                        {!directonRoute ? <p>Search to get Navigation...</p> :
                            <div className='deta</div>ils__inner'>
                                <div className='details__inner__flex'>
                                    <p> Distance:</p><p> {directonRoute?.routes[0]?.legs[0]?.distance?.text}</p>
                                </div>
                                <div className='details__inner__flex'>
                                    <p> Duration:</p><p> {directonRoute?.routes[0]?.legs[0]?.duration?.text}</p>

                                </div>
                            </div>
                        }
                    </> : <>
                        {!directonRoute ? <p>Search to get Navigation...</p> :
                            <div className='deta</div>ils__inner'>
                                <div className='details__inner__flex'>
                                    <p> Distance:</p><p> {directonRoute?.routes[0]?.legs[0]?.distance?.text}</p>
                                </div>
                                <div className='details__inner__flex'>
                                    <p> Duration:</p><p> {directonRoute?.routes[0]?.legs[0]?.duration?.text}</p>
                                </div>
                            </div>
                        }
                    </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navigation