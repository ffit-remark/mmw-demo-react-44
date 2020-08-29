/* eslint-disable */
import React, { useState } from 'react';
import Gallery from './Gallery';
import DocTypeState from './DocTypeState.js';
import logo from './logo.svg';
import './App.css';
import {sdkWrapper} from './mitek/sdkWrapper';


function App() {
    const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

	const [mode,    setMode]    = useState('AUTO_CAPTURE');
	const [subject, setSubject] = useState('SELFIE');

	const [gallery, setGallery] = useState({
		pictures: Array(4).fill({
			image: dummyImage,
			docType: '',
			mibiData: {},
			decodedStr: '',
		})
	});

	const showViewportMods = isVisible => {
		console.log(`Viewport Mods are ${isVisible?'':'not'} visible`);
	};

    const isSpinnerDisplayed = (bool = true) => {
        console.log(bool ? 'spinner spinning' : 'no spinner');
	};

	/**
	 * Returns the index of the item which has its docType property matching the arg doctype.
	 * If none exists, the index of the first empty item slot is returned.
	 * @param {Array} arr The array of items to search.
	 * @param {string} doctype The value in the item.docType property to filter for.
	 */
	const getDocTypeIdx = ( arr, doctype ) => {
		let idx = arr.findIndex(item => doctype === item.docType);
		return idx >= 0 ? idx : arr.findIndex(item => '' === item.docType);
	};
	
	/**
	 * Catalogs the capture session results into a new or existing gallery.pictures array item.
	 * @param {object} result The output object from the SDK's FRAME_CAPTURE_RESULT event.
	 */
	const handleResult = result => {

		const picturesMut = [...gallery.pictures];

		picturesMut[getDocTypeIdx(picturesMut, subject)] = {
			image: result.response.imageData,
			docType: result.response.docType,
			mibiData: result.response.mibiData,
			decodedStr: result.response.code,
		};
		console.log('picturesMut', picturesMut);
		setGallery({ pictures: picturesMut });
	};


    const handleException = excpt => {
        console.log(excpt);
    };

	/**
	 * Invokes the SDK Wrapper to start a Manual, Auto or Direct capture.
	 */
	const startCaptureSession = () => {
		if ( mode === "MANUAL_CAPTURE" ) {
            sdkWrapper.startManual(subject, isSpinnerDisplayed)
                .then( handleResult )
                .catch( handleException )
                .finally( ()=> isSpinnerDisplayed(false) );
		}
		else if (mode === "AUTO_CAPTURE") {
            showViewportMods(true);

			sdkWrapper.startAuto(subject)
				.then( handleResult )
				.catch( handleException )
				.finally( ()=> showViewportMods(false) );
		}
		else { // Direct Science
            alert('Under Construction');
		}
    };


	return (
        <div className="container">
            <div className="card">
                <h3 className="card-header">MiSnap for Mobile Web SDK 4.4</h3>
                <div className="card-body">
                    <div className="form-check">
                        <input className="form-check-input"
                            id="autoMode"
                            type="radio"
                            name="capture-mode"
                            value="AUTO_CAPTURE"
                            checked={mode === "AUTO_CAPTURE"}
                            onChange={res => setMode(res.target.value)}
                        />
                        <label className="form-check-label" htmlFor="autoMode">Auto</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input"
                            id="manualMode"
                            type="radio"
                            name="capture-mode"
                            value="MANUAL_CAPTURE"
                            checked={mode === "MANUAL_CAPTURE"}
                            onChange={res => setMode(res.target.value)}
                        />
                        <label className="form-check-label" htmlFor="manualMode">Manual</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input"
                            id="directMode"
                            type="radio"
                            name="capture-mode"
                            value="DIRECT"
                            checked={mode === "DIRECT"}
                            onChange={res => setMode(res.target.value)}
                        />
                        <label className="form-check-label" htmlFor="directMode">Direct Science</label>
                    </div>
                    <br />
                    <DocTypeState initialDocType={subject} onChange={setSubject} />
                </div>

                <div className="card-footer">
                    <button className="btn btn-primary"
                        onClick={ startCaptureSession }
                    >Push iT!</button>
                </div>
            </div>

            <div className="card">
                <h4 className="card-header">Capture Gallery</h4>
                <Gallery captures={gallery.pictures} />
            </div>
        </div>

	);
}

export default App;
