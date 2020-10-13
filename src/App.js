/* eslint-disable */
import React, { useState } from 'react';
import Gallery from './Gallery';
import DocTypeState from './DocTypeState.js';
import CaptureModeState from './CaptureModeState';
import AutoOptionsState from './AutoOptionsState';
import SdkOptionsState from './SdkOptionsState';

import './mitek/mitekSDK.css';
import {sdkWrapper} from './mitek/sdkWrapper';

function App() {

	// ***************************************
	// BEGIN Application state declarations

    const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

	const [mode,    setMode]    = useState('AUTO_CAPTURE');
	const [subject, setSubject] = useState('SELFIE');

	// The gallery construct holds all the items (pictures) represented in the Gallery component.
	// There is one position for each of the docType subjects. Filled in the order they are captured.
	const [gallery, setGallery] = useState({
		pictures: Array(4).fill({
			docType: '',
			image: dummyImage,
			mibiData: {},
			decodedStr: '',
		})
    });
	
	// UXP properties not intrinsically handled by the SDK CAPTURE_AND_PROCESS_FRAME options.
    const [autoCaptureOptions, setAutoCaptureOptions] = useState({
        timeoutSec: sdkWrapper.settings.captureTimeSec,
        showCancel: sdkWrapper.settings.showCancelButton
	});
	
	// Initialize to default CAPTURE_AND_PROCESS_FRAME defaults (declared in wrapper)
	const [sdkOptions, setSdkOptions] = useState({
		qualityPercent: sdkWrapper.settings.sdkOptions.qualityPercent,
        guidePaddingLevel: sdkWrapper.settings.sdkOptions.guidePaddingLevel,
        hintFrequencyMS: sdkWrapper.settings.sdkOptions.hintFrequencyMS,
        hintMessageSize: sdkWrapper.settings.sdkOptions.hintMessageSize,
        disableSmileDetection: sdkWrapper.settings.sdkOptions.disableSmileDetection,
        videoContainerId: sdkWrapper.settings.sdkOptions.videoContainerId,
        hintAriaLive: sdkWrapper.settings.sdkOptions.hintAriaLive,
	});

	const [showSpinner, setShowSpinner] = useState(false);

	// END Application state declarations
	// ************************************

	/**
	 * Returns the index of the item which has its docType property matching the arg doctype.
	 * If none exists, the index of the first empty item slot is returned.
	 * @param {Array} arr The gallery array of items to search.
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
			docType: result.response.docType,
			image: result.response.imageData,
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
		sdkWrapper.settings.captureTimeSec = autoCaptureOptions.timeoutSec;
		sdkWrapper.settings.showCancelButton = autoCaptureOptions.showCancel;
		sdkWrapper.settings.sdkOptions = sdkOptions;

		if ( mode === "MANUAL_CAPTURE" ) {
            sdkWrapper.startManual(subject, setShowSpinner)
                .then( handleResult )
                .catch( handleException )
                .finally( ()=> setShowSpinner(false) );
		}
		else if (mode === "AUTO_CAPTURE") {
			sdkWrapper.startAuto(subject)
				.then( handleResult )
				.catch( handleException )
				.finally();
		}
		else { // Direct Science
            alert('Under Construction');
		}
    };


	return (
        <div className="container">
            <div className="card">
				<h3 className="card-header">MiSnap for Mobile Web SDK {sdkWrapper.getVersion()}</h3>
                <div className="card-body">
                    <DocTypeState initialDocType={subject} onChange={setSubject} />
                    <CaptureModeState initialMode={mode} onChange={setMode} />
                    <AutoOptionsState
						initialTimeout={autoCaptureOptions.timeoutSec}
						initialShowCancel={autoCaptureOptions.showCancel}
						onChange={setAutoCaptureOptions}
					/>
					<SdkOptionsState
						sdkOptions={sdkOptions}
						onChange={setSdkOptions}
					/>
                </div>
                
                <div className="card-footer">
                    <button className="btn btn-primary"
                        onClick={ startCaptureSession }
                    >Get Image</button>
                </div>
            </div>

            <div className="card">
                <h4 className="card-header">Capture Gallery</h4>
                <Gallery captures={gallery.pictures} />
            </div>

			<div
				className="loader-wrap"
				id="main-spinner"
				style={{display:showSpinner ? "block" : "none"}}
			>
				<div className="loader"></div>
			</div>

        </div>

	);
}

export default App;
