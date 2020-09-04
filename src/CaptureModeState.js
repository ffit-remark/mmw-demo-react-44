/**
 * This component handles selection input for the MiSnap mode parameter. 
 */

import React, {useState} from 'react';

const CaptureModeState = props => {

    const [captureMode, setMode] = useState(props.initialMode);

    const handleChange = val => {
        setMode(val);
        props.onChange(val);
    };

    return (
        <div className="form-group">
            <div className="form-check">
                <input className="form-check-input"
                    id="autoMode"
                    type="radio"
                    name="capture-mode"
                    value="AUTO_CAPTURE"
                    checked={captureMode === "AUTO_CAPTURE"}
                    onChange={res => handleChange(res.target.value)}
                />
                <label className="form-check-label" htmlFor="autoMode">Auto</label>
            </div>
            <div className="form-check">
                <input className="form-check-input"
                    id="manualMode"
                    type="radio"
                    name="capture-mode"
                    value="MANUAL_CAPTURE"
                    checked={captureMode === "MANUAL_CAPTURE"}
                    onChange={res => handleChange(res.target.value)}
                />
                <label className="form-check-label" htmlFor="manualMode">Manual</label>
            </div>
            <div className="form-check">
                <input className="form-check-input"
                    id="directMode"
                    type="radio"
                    name="capture-mode"
                    value="DIRECT"
                    checked={captureMode === "DIRECT"}
                    onChange={res => handleChange(res.target.value)}
                />
                <label className="form-check-label" htmlFor="directMode">Direct Science</label>
            </div>

        </div>
    )
};

export default CaptureModeState;