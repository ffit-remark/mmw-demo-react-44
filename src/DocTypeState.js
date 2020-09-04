/**
 * This component handles selection input for the MiSnap docType parameter. 
 */

import React, {useState} from 'react';

const DocTypeState = props => {

    const [docType, setDocType] = useState(props.initialDocType);

    const handleChange = val => {

        setDocType(val);
        props.onChange(val);
    };

    return (
        <div className="form-group">
            <label htmlFor="docTypeSelect">Document Type</label>
            <select className="form-control" id="docTypeSelect" value={docType}
                onChange={e => handleChange(e.target.value)}>
                <option value="DL_FRONT">US Drivers License Front</option>
                <option value="PDF417_BARCODE">US Drivers License Back</option>
                <option value="PASSPORT">Passport</option>
                <option value="SELFIE">Selfie</option>
            </select>
        </div>
    )
};

export default DocTypeState;
