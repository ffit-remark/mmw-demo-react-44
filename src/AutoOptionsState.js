/**
 * This component handles selection input for the MiSnap Auto capture display options. 
 */

import React, {useState} from 'react';
import {Collapse} from 'react-collapse';
import TimeoutState from './autoOptions/TimeoutState';
import ShowCancelState from './autoOptions/ShowCancelState';

const AutoOptionsState = props => {

    const [autoOptions, setAutoOptions] = useState({
        timeoutSec: props.initialTimeout,
        showCancel: props.initialShowCancel
    });

    const handleOptionsChange = newOptions => {
        setAutoOptions(newOptions);
        props.onChange(newOptions);
    };

    const [openPane, setOpenPane] = useState(false);

    return (
            <div className="card">

                <div id="optionsHeading">
                    <button className="btn btn-link"
                            onClick={ () => setOpenPane(!openPane) }
                            aria-expanded={openPane}
                            aria-controls="collapseOptions">
                        Auto Capture Options
                    </button>
                </div>
                
                <Collapse isOpened={openPane} initialStyle={{height: 0, overflow: 'hidden'}}>

                    <div className="card-body" id="collapseOptions">
                        <TimeoutState
                            timeoutSec={autoOptions.timeoutSec}
                            onChange={val => handleOptionsChange({...autoOptions, timeoutSec: val})}
                        />

                        <ShowCancelState
                            showCancel={autoOptions.showCancel}
                            onChange={() => handleOptionsChange({...autoOptions, showCancel: !autoOptions.showCancel})}
                        />
                    </div>
                </Collapse>

            </div>
    )
};

export default AutoOptionsState;
