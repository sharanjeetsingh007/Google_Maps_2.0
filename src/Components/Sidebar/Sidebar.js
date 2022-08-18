import React from 'react'
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import NearMeIcon from '@mui/icons-material/NearMe';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import "./Sidebar.css"

function Sidebar({ latitude, longitude, changeSidebarProps, setMarker, changeDirectionRoute, changeSidebarToggle, sidebarProp, sidebarToggle }) {

    // const navigate = useNavigate();

    return (
        <div className='Sidebar'>
            <div className='sidebar__main'>
                <div className='top'>
                    <div className='icon'>
                        <IconButton
                            onClick={() => {
                                changeDirectionRoute(null)
                                changeSidebarProps('search')
                                setMarker({ lat: latitude, lng: longitude })

                            }}
                        >
                            <SearchIcon style={{ fontSize: '30px', color: sidebarProp == "search" && "black" }} />
                        </IconButton>
                    </div>
                    <div className='icon'>
                        <IconButton onClick={() => {
                            setMarker({ lat: latitude, lng: longitude })
                            changeSidebarProps('navigation')
                        }}>
                            <NearMeIcon style={{ fontSize: '30px', color: sidebarProp == "navigation" && "black" }} />
                        </IconButton>
                    </div>
                </div>
                <div className='icon'>
                    <IconButton
                        onClick={() => changeSidebarToggle(true)}
                    >
                        {sidebarToggle ? <KeyboardArrowLeftIcon style={{ fontSize: '30px' }} />
                            : <KeyboardArrowRightIcon style={{ fontSize: '30px' }} />}
                    </IconButton>
                </div>

            </div>

        </div>
    )
}

export default Sidebar