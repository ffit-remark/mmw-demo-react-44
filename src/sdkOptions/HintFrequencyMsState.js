import React, {useState} from '../../node_modules/react';

const HintFrequencyMsState = props => {
    const defaultVal = 1200;
    const [hintFrequencyMS, setHintFrequencyMS] = useState(props.hintFrequencyMS);

    const handleFrequencyChange = val => {
        setHintFrequencyMS(val);
        props.onChange(''===val?defaultVal:val);
    };
    return (

        <div className="form-group">
            <label htmlFor="inputHintFrequency">Hint Interval (msec)</label>
            <input type="text" 
                className="form-control" 
                id="inputHintFrequency" 
                value={hintFrequencyMS}
                placeholder={defaultVal}
                onChange={e => handleFrequencyChange(e.target.value.replace(/\D/,''))}></input>
        </div>
    )
};

export default HintFrequencyMsState;
