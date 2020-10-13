import React, {useState} from 'react';

const HintAriaLiveState = props => {

    const [hintAriaLive, setHintAriaLive] = useState(props.hintAriaLive);

    const handleHintAriaChange = val => {
        setHintAriaLive(val);
        props.onChange(val);
    };

    return (

        <div className="form-group">
            <label htmlFor="paddingSelect">Aria Hint Reader</label>
            <select className="form-control" id="paddingSelect" value={hintAriaLive}
                onChange={e => handleHintAriaChange(parseInt(e.target.value))}>
                <option value="0">Off</option>
                <option value="1">Polite</option>
                <option value="2">Assertive</option>
            </select>
        </div>
    )
};

export default HintAriaLiveState;
