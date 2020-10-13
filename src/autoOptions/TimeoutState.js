import React, {useState} from '../../node_modules/react';

const TimeoutState = props => {

    const [timeoutSec, setTimeout] = useState(props.timeoutSec);

    const handleTimeoutChange = val => {
        setTimeout(val);
        props.onChange(val);
    };
    return (

        <div className="form-group">
            <label htmlFor="timeoutSelect">Capture Timeout</label>
            <select className="form-control" id="timeoutSelect" value={timeoutSec}
                onChange={e => handleTimeoutChange(parseInt(e.target.value))}>
                <option value="5">5 sec</option>
                <option value="10">10 sec</option>
                <option value="20">20 sec</option>
            </select>
        </div>
    )
};

export default TimeoutState;
