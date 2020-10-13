import React, {useState} from '../../node_modules/react';

const DisableSmileDetectionState = props => {

    const [disableSmileDetection, setDisableSmileDetection] = useState(props.disableSmileDetection);

    const handleSmileDetectionChange = () => {
        setDisableSmileDetection(!disableSmileDetection);
        props.onChange(!disableSmileDetection);
    };
    return (

        <div className="form-check">
            <input type="checkbox" 
                className="form-check-input" 
                id="disablelCheck" 
                defaultChecked={disableSmileDetection}
                onChange={handleSmileDetectionChange}></input>
            <label className="form-check-label" htmlFor="disablelCheck">Disable Smile Detection</label>
        </div>
    )
};

export default DisableSmileDetectionState;
