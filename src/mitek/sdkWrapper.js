/**
 * This is a simple example showing how to wrap the MiSnap SDK module code
 * in a wrapper object that uses the Promise proxy object for the capture modes
 */

//import './mitekSDK.css';
import * as mitekScienceSDK from './mitek-science-sdk';


// These are hints that are recommended for displaying
// to the end user during auto capture.
const autoHints = {
	MISNAP_HEAD_OUTSIDE: 'Place Face in Oval',
	MISNAP_HEAD_SKEWED: 'Look Straight Ahead',
	MISNAP_AXIS_ANGLE: 'Hold Phone Upright',
	MISNAP_HEAD_TOO_CLOSE: 'Move Farther Away',
	MISNAP_HEAD_TOO_FAR: 'Get Closer',
	MISNAP_STAY_STILL: 'Hold Still',
	MISNAP_SUCCESS: 'Success',
	MISNAP_STOP_SMILING: 'Stop Smiling',
	MISNAP_SMILE: 'Smile!',
	MISNAP_READY_POSE: 'Hold it There',
	NO_FACE_FOUND: 'No Face Detected',
	MITEK_ERROR_GLARE: 'Reduce Glare',
    MITEK_ERROR_FOUR_CORNER: 'Fill the guide image',
	MITEK_ERROR_TOO_DARK: 'Too Dark. Use good lighting',
    MITEK_ERROR_FOCUS: 'Hold Steady',
    CV_NO_BARCODE_FOUND: 'Fill the guide image'
};


const sdkResourcePath = `${process.env.PUBLIC_URL}/mitekSDK/`;

let timerId = null;

export const sdkWrapper = {
    settings: {
        captureTimeSec: 20,
        showCancelButton: false,
        sdkOptions: {
            qualityPercent: 80,
            guidePaddingLevel: 1,
            hintMessageSize: 2,
            hintFrequencyMS: 1200,
            disableSmileDetection: false,
            videoContainerId: null,
            hintAriaLive: 2,
        }
    },

    getVersion() {
        return mitekScienceSDK.getVersion();
    },

    // Stop and clean up all active processes
    stopAuto() {
        clearTimeout(timerId);
        mitekScienceSDK.cmd('SDK_STOP');
    },

    addCancelButton() {

        var mitekDisplayContainer = document.querySelector('#mitekDisplayContainer');

        // add a button to allow the user to capture a frame
        var buttonEl = document.createElement('button');
        buttonEl.setAttribute('id', 'mitekCancelButton');
        buttonEl.setAttribute('style', 'position: absolute; right: 15px; top: 15px; z-index: 100');
        buttonEl.innerHTML = 'Cancel';
        buttonEl.onclick = e => {
          this.stopAuto();
        };
        mitekDisplayContainer.appendChild(buttonEl);
    },

    controlSelfieGuideImage(hintKey) {
        const divFace = document.body.getElementsByClassName('integrator SELFIE');
        // turn oval green if head is in guide
        if (hintKey === 'MISNAP_SMILE'
            || hintKey === 'MISNAP_STOP_SMILING'
            || hintKey === 'MISNAP_READY_POSE') {
            divFace[0].classList.add('FACE_IN_GUIDE');
        }
        else {
            divFace[0].classList.remove('FACE_IN_GUIDE');
        }
    },
    
    // Starts an auto-capture session with a promise.
    // Resolves to the FRAME_CAPTURE_RESULT handler object.
    // Rejects on SDK_ERROR, session timeout.
    startAuto(subject) {

        // frames started processing. add any viewport layout elements
        mitekScienceSDK.on('FRAME_PROCESSING_STARTED', e => {
            if(this.settings.showCancelButton)
                this.addCancelButton();
        });

        // fires every settings.options.hintFrequencyMS
        mitekScienceSDK.on('FRAME_PROCESSING_FEEDBACK', status => {

            mitekScienceSDK.cmd('SHOW_HINT', autoHints[status.key]);

            if (subject === 'SELFIE') {
                this.controlSelfieGuideImage(status.key);
            }
        });


        mitekScienceSDK.cmd('CAPTURE_AND_PROCESS_FRAME', {
            mode: 'AUTO_CAPTURE',
            documentType: subject,
            mitekSDKPath: sdkResourcePath,
            options: this.settings.sdkOptions,
        });

        return new Promise((resolve, reject) => {
            let exception = { message: 'TIMEOUT' }; // Default message is a Timeout

            // SDK error
            mitekScienceSDK.on('SDK_ERROR', err => {
                console.log('sdk FAIL', err);
                
                this.stopAuto();

                exception.message = 'SDK_ERROR';
                exception.list = err;
                reject(exception);
            });

            // camera started
            mitekScienceSDK.on('CAMERA_DISPLAY_STARTED', result => {
                
                timerId = setTimeout(() => {
                    this.stopAuto();
                    reject(exception);
                }, this.settings.captureTimeSec * 1000);

            });

            // frame captured
            mitekScienceSDK.on('FRAME_CAPTURE_RESULT', result => {
                this.stopAuto();
                resolve(result);
            });

        });
    },

    // Starts a manual-capture session with a promise.
    // Resolves to the FRAME_CAPTURE_RESULT handler object.
    // Rejects on pre-processing exceptions CORRUPT_IMAGE and IMAGE_SMALLER_THAN_MIN_SIZE.
    // Use cvCallback in client code to show 'please wait' metaphor
    startManual(subject, cvCallback) {

        mitekScienceSDK.cmd('CAPTURE_AND_PROCESS_FRAME', {
            mode: 'MANUAL_CAPTURE',
            documentType: subject,
            mitekSDKPath: sdkResourcePath,
            options: {
                qualityPercent: 80
            }
        });

        mitekScienceSDK.on('IMAGE_CAPTURED', () => {
            cvCallback(true);
        });

        return new Promise((resolve, reject) => {
            let exception = { message: 'CV_WARNING' };

            mitekScienceSDK.on('FRAME_PROCESSING_FEEDBACK', result => {
                // Only return exceptions that don't accompany a result
                // FRAME_CAPTURE_RESULT encloses the same object
                if ('CORRUPT_IMAGE' === result.key || 'IMAGE_SMALLER_THAN_MIN_SIZE' === result.key) {
                    exception.list = [ result ];
                    reject(exception);
                }
            });

            mitekScienceSDK.on('FRAME_CAPTURE_RESULT', result => {
                console.log("Manual capture result", result);
                resolve(result);
            });

            // Not sure if this ever gets called in MANUAL mode
            mitekScienceSDK.on('SDK_ERROR', err => {
                exception.message = 'SDK_ERROR';
                exception.list = err;
                reject(exception);
            });
        });
    }
}


// Enum for the exceptions returned in the SDK_ERROR event.
// eslint-disable-next-line no-unused-vars
const sdkErrors = {
    111:{
        message: 'The video camera must support 720p resolution. Or, the app is not hosted via TLS',
        action: 'Move to a device with higher res video. Or, make sure the app is served over HTTPS'
    },
    112:{
        message: 'No video camera was found',
        action: 'Move to a device that has a video camera.'
    },
    113:{
        message: 'Camera Permission was Denied',
        action: 'Click "accept/allow" when prompted for camera permission.'
    },
    120:{
        message: 'Unable to start the camera / unknown error',
        action: 'Switch to manual capture mode.'
    },
    331:{
        message: 'An unknown command method was called',
        action: 'Check source code and correct any misspelled cmd key names.'
    },
    332:{
        message: 'Incorrect number of arguments passed to the cmd method',
        action: 'Check source code and correct any with a wrong argument count.'
    },
    333:{
        message: 'The getUserMedia method is not supported by the browser',
        action: 'Switch to manual capture mode.'
    },
    334:{
        message: 'Web Assembly is not supported by the browser',
        action: 'Switch to manual capture mode.'
    },
    335:{
        message: 'This device is not supported',
        action: 'Switch to manual capture mode.'
    },
    336:{
        message: 'This device does not support WebGL',
        action: 'Switch to manual capture mode.'
    },
    339:{
        message: 'This device does not support WebGL shader features',
        action: 'Switch to manual capture mode.'
    },
};

// This library can be used by the client code for displaying user freindly messages.
// eslint-disable-next-line no-unused-vars
const manualHints = {
	MITEK_ERROR_FOUR_CORNER: 'We can\'t find the 4 corners of your document.',
	MITEK_ERROR_TOO_DARK: 'There is not enough light on your document.',
	MITEK_ERROR_FOCUS: 'The image is too blurry.',
	MITEK_ERROR_GLARE: 'The image has glare.',
	MITEK_ERROR_MIN_PADDING: 'Move the camera further away from your document.',
	MITEK_ERROR_HORIZONTAL_FILL: 'Move the camera closer to your document.',
	MITEK_ERROR_SKEW_ANGLE: 'Document is skewed.  Hold camera directly over your document.',
	MITEK_ERROR_LOW_CONTRAST: 'Center your document on a dark background.',
	MITEK_ERROR_BUSY_BACKGROUND: 'The background is too busy.  Please use a solid background.',
	MITEK_ERROR_MRZ_MISSING: 'No MRZ found',
	CV_NO_BARCODE_FOUND: 'We were unable to detect the barcode from the back of your license.',
	IMAGE_SMALLER_THAN_MIN_SIZE: 'The image you provided is too small.',
	CORRUPT_IMAGE: 'The image you provided is unreadable.',
	MISNAP_HEAD_SKEWED: 'Look Straight Ahead',
	MISNAP_HEAD_TOO_CLOSE: 'Move Farther Away',
	MISNAP_HEAD_TOO_FAR: 'Get Closer',
	NO_FACE_FOUND: 'No Face Detected',
};
