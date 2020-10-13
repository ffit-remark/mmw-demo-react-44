import React, {useState} from 'react';

const HintMessageSizeState = props => {

    const [hintMessageSize, setHintMessageSize] = useState(props.hintMessageSize);

    const handleMessageSizeChange = val => {
        setHintMessageSize(val);
        props.onChange(val);
    };

    return (
        <>
            <label htmlFor={`hintSize${hintMessageSize}`}>Hint Text Size</label>
            <div className="form-group" id="selectHintSize">
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input" 
                        type="radio" 
                        name="inlineRadioOptions" 
                        id="hintSize1" 
                        value="1"
                        checked={hintMessageSize === 1}
                        onChange={e => handleMessageSizeChange(parseInt(e.target.value))}
                    />
                    <label className="form-check-label" htmlFor="hintSize1">S</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input" 
                        type="radio" 
                        name="inlineRadioOptions" 
                        id="hintSize2" 
                        value="2"
                        checked={hintMessageSize === 2}
                        onChange={e => handleMessageSizeChange(parseInt(e.target.value))}
                    />
                    <label className="form-check-label" htmlFor="hintSize2">M</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input" 
                        type="radio" 
                        name="inlineRadioOptions" 
                        id="hintSize3" 
                        value="3"
                        checked={hintMessageSize === 3}
                        onChange={e => handleMessageSizeChange(parseInt(e.target.value))}
                    />
                    <label className="form-check-label" htmlFor="hintSize3">L</label>
                </div>
            </div>
        </>
    )
};

export default HintMessageSizeState;
