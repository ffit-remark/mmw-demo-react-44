import React, {useState} from '../../node_modules/react';

const QualityPercentState = props => {
    const defaultVal = 80;
    const [qualityPercent, setQualityPercent] = useState(props.qualityPercent);

    const handleQualityPercentChange = val => {
        setQualityPercent(val);
        props.onChange(''===val?defaultVal:val);
    };
    return (

        <div className="form-group">
            <label htmlFor="inputQualityPercent">JPEG Quality (50-100)</label>
            <input type="text" 
                className="form-control" 
                id="inputQualityPercent" 
                value={qualityPercent}
                placeholder={defaultVal}
                onChange={e => handleQualityPercentChange(e.target.value.replace(/\D/,''))}></input>
        </div>
    )
};

export default QualityPercentState;
