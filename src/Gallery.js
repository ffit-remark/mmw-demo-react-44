import React, {useState} from 'react';
import PropTypes from 'prop-types';

const Gallery = props => {

    const [showMibi, setShowMibi] = useState({
                                                'mibi-0':false,
                                                'mibi-1':false,
                                                'mibi-2':false,
                                                'mibi-3':false,
                                            });

    const toggleMibi = e => {
        const child = e.target.querySelector('div.mibi-view');
        if (child) {
            const isVisible = showMibi[e.target.id];
            child.style.display = isVisible ? 'none' : 'block';
            setShowMibi({...showMibi, [e.target.id]: !isVisible });
        }
    };

    const printMibiLabel = idx => {
        const isVisible = showMibi[`mibi-${idx}`];
        return `MiBi Data [${isVisible?'-':'+'}]`;
    };

    const imageList = props.captures.map( ( capture, index ) => {

        if ( capture.docType ) {
            return ( 
                <div key={index}>{`Capture ${index + 1}: ${capture.docType}`}
                    <br/>
                    <img src={capture.image} className="capture-img" alt="" />
                    <br/>
                    { capture.decodedStr ? <label>Barcode:<div>{capture.decodedStr}</div></label> : '' }

                    {/** Make the Mibi display toggledynamic with a click of the label */}
                    <label id={`mibi-${index}`} onClick={toggleMibi}>{printMibiLabel(index)}
                        <div className="mibi-view" style={{display: 'none'}}>
                            <pre>{JSON.stringify(capture.mibiData, null, 2)}</pre>
                        </div>
                    </label>

                    <br/>
                </div>
            );
        }

        return null;
    });

    return (
        <>
            {imageList}
        </>
    );
}

Gallery.propTypes = {
    captures: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string,
            docType: PropTypes.oneOf(['','DL_FRONT', 'DL_BACK', 'PDF417_BARCODE', 'PASSPORT', 'SELFIE']),
            mibiData: PropTypes.object,
            decodedStr: PropTypes.string,
        })
    )
};


export default Gallery;
