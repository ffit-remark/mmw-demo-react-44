import React, {useState} from '../../node_modules/react';

const ShowCancelState = props => {

    const [showCancel, setShowCancel] = useState(props.showCancel);

    const handleShowCancelChange = () => {
        setShowCancel(!showCancel);
        props.onChange(!showCancel);
    };
    return (

        <div className="form-check">
            <input type="checkbox" 
                className="form-check-input" 
                id="showCancelCheck" 
                defaultChecked={showCancel}
                onChange={handleShowCancelChange}></input>
            <label className="form-check-label" htmlFor="showCancelCheck">Show Cancel Button</label>
        </div>
    )
};

export default ShowCancelState;
