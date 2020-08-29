import './mitekSDK.css';
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
	MITEK_ERROR_FOUR_CORNER: 'Document Not Found',
	MITEK_ERROR_TOO_DARK: 'Too Dark. Use good lighting',
	MITEK_ERROR_FOCUS: 'Hold Steady'
};


// eslint-disable-next-line no-unused-vars
const cvExceptions = {
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


const mitekApiPath = `${process.env.PUBLIC_URL}/mitekSDK/`;
const captureTimeSec = 20;

let timerId = null;
let hintervalId = null;

export const sdkWrapper = {
    settings: {
         mitekApiPath: mitekApiPath,
         captureTimeSec: captureTimeSec
    },
    
    // Stop and clean up all active processes
    stopAuto() {
        clearTimeout(timerId);
        clearInterval(hintervalId);
        mitekScienceSDK.cmd('HIDE_HINT');
        mitekScienceSDK.cmd('SDK_STOP');
    },

    // Starts an auto-capture session with a promise.
    // Resolves to the FRAME_CAPTURE_RESULT handler object.
    // Rejects on SDK_ERROR, session timeout.
    startAuto(subject) {
        let recentHint = 'Fill the guide image';

        // frames started processing
        mitekScienceSDK.on('FRAME_PROCESSING_STARTED', e => {

        });

        mitekScienceSDK.on('FRAME_PROCESSING_FEEDBACK', status => {

            recentHint = autoHints[status.key];

            if (subject === 'SELFIE') {
                let divFace = document.body.getElementsByClassName('integrator SELFIE');
                // turn oval green if head is in guide
                if (status.key === 'MISNAP_SMILE'
                    || status.key === 'MISNAP_STOP_SMILING'
                    || status.key === 'MISNAP_READY_POSE') {
                    divFace[0].classList.add('FACE_IN_GUIDE');
                }
                else {
                    divFace[0].classList.remove('FACE_IN_GUIDE');
                }
            }
        });


        mitekScienceSDK.cmd('CAPTURE_AND_PROCESS_FRAME', {
            mode: 'AUTO_CAPTURE',
            documentType: subject,
            mitekSDKPath: mitekApiPath,
            options: {
                qualityPercent: 80,
            }
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

                hintervalId = setInterval(() => {
                    if (recentHint != null || recentHint !== undefined) {
                        mitekScienceSDK.cmd('SHOW_HINT', recentHint);
                    }
                }, 500);
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
            mitekSDKPath: mitekApiPath,
            options: {
                qualityPercent: 80
            }
        });

        mitekScienceSDK.on('FRAME_PROCESSING_STARTED', e => {
            cvCallback();
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
