import React, {useState} from '../../node_modules/react';

const GuidePaddingLevelState = props => {

    const [guidePaddingLevel, setGuidePaddingLevel] = useState(props.guidePaddingLevel);

    const handlePaddingChange = val => {
        setGuidePaddingLevel(val);
        props.onChange(val);
    };
    return (
                
        <>
            <label htmlFor={`paddingLevel${guidePaddingLevel}`}>Guide Image Padding</label>
            <div className="form-group" id="selectPaddingLevel">
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input" 
                        type="radio" 
                        name="paddingLevelOptions" 
                        id="paddingLevel1" 
                        value="1"
                        checked={guidePaddingLevel === 1}
                        onChange={e => handlePaddingChange(parseInt(e.target.value))}
                    />
                    <label className="form-check-label" htmlFor="paddingLevel1">S</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input" 
                        type="radio" 
                        name="paddingLevelOptions" 
                        id="paddingLevel2" 
                        value="2"
                        checked={guidePaddingLevel === 2}
                        onChange={e => handlePaddingChange(parseInt(e.target.value))}
                    />
                    <label className="form-check-label" htmlFor="paddingLevel2">M</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input" 
                        type="radio" 
                        name="paddingLevelOptions" 
                        id="paddingLevel3" 
                        value="3"
                        checked={guidePaddingLevel === 3}
                        onChange={e => handlePaddingChange(parseInt(e.target.value))}
                    />
                    <label className="form-check-label" htmlFor="paddingLevel3">L</label>
                </div>
            </div>
        </>
    )
};

export default GuidePaddingLevelState;
