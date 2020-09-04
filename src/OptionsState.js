/**
 * This component handles selection input for the MiSnap capture options. 
 */

import React, {useState} from 'react';

const OptionsState = props => {

    const [timeoutSec, setTimeout] = useState(props.initialTimeout);
    const [showCancel, setShowCancel] = useState(props.initialShowCancel);

    const handleTimeoutChange = val => {
        setTimeout(parseInt(val));
        props.onChange({ timeoutSec: parseInt(val), showCancel: showCancel});
    };

    const handleShowCancelChange = () => {
        setShowCancel(!showCancel);
        props.onChange({ timeoutSec: timeoutSec, showCancel: !showCancel});
    };

    return (
        <>
        <div className="form-group">
            <label htmlFor="timeoutSelect">Capture Timeout</label>
            <select className="form-control" id="timeoutSelect" value={timeoutSec}
                onChange={e => handleTimeoutChange(e.target.value)}>
                <option value="5">5 sec</option>
                <option value="10">10 sec</option>
                <option value="20">20 sec</option>
            </select>
        </div>
        <div className="form-check">
            <input type="checkbox" 
                className="form-check-input" 
                id="showCancelCheck" 
                defaultChecked={showCancel}
                onChange={handleShowCancelChange}></input>
            <label className="form-check-label" htmlFor="showCancelCheck">Show Cancel Button</label>
        </div>
        </>
    )
};

export default OptionsState;
