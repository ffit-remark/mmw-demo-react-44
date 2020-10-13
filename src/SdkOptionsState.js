/**
 * This component handles selection input for the MiSnap CAPTURE_AND_PROCESS_FRAME config options. 
 */

import React, {useState} from 'react';

import QualityPercentState from './sdkOptions/QualityPercentState';
import HintFrequencyMsState from './sdkOptions/HintFrequencyMsState';
import HintMessageSizeState from './sdkOptions/HintMessageSizeState';
import GuidePaddingLevelState from './sdkOptions/GuidePaddingLevelState';
import DisableSmileDetectionState from './sdkOptions/DisableSmileDetectionState';
import HintAriaLiveState from './sdkOptions/HintAriaLiveState';

import {Collapse} from 'react-collapse';

const SdkOptionsState = props => {

    /*const [sdkOptions, setSdkOptions] = useState({
        qualityPercent: props.qualityPercent,
        guidePaddingLevel: props.guidePaddingLevel,
        hintFrequencyMS: props.hintFrequencyMS,
        hintMessageSize: props.hintMessageSize,
        disableSmileDetection: props.disableSmileDetection,
        videoContainerId: props.videoContainerId,
        hintAriaLive: props.hintAriaLive,
    });*/
    const [sdkOptions, setSdkOptions] = useState(
        props.sdkOptions
    );

    const handleOptionsChange = newOptions => {
        setSdkOptions(newOptions);
        props.onChange(newOptions);
    };

    const [openPane, setOpenPane] = useState(false);

    return (
            <div className="card">

                <div id="sdkOptionsHeading">
                    <button className="btn btn-link"
                            onClick={ () => setOpenPane(!openPane) }
                            aria-expanded={openPane}
                            aria-controls="collapseOptions">
                        SDK Config Options
                    </button>
                </div>
                
                <Collapse isOpened={openPane} initialStyle={{height: 0, overflow: 'hidden'}}>

                    <div className="card-body" id="collapseOptions">
                        <QualityPercentState
                            qualityPercent={sdkOptions.qualityPercent}
                            onChange={val => handleOptionsChange({...sdkOptions, qualityPercent: val})}
                        />
                        <HintMessageSizeState
                            hintMessageSize={sdkOptions.hintMessageSize}
                            onChange={val => handleOptionsChange({...sdkOptions, hintMessageSize: val})}
                        />
                        <HintFrequencyMsState
                            hintFrequencyMS={sdkOptions.hintFrequencyMS}
                            onChange={val => handleOptionsChange({...sdkOptions, hintFrequencyMS: val})}
                        />
                        <GuidePaddingLevelState
                            guidePaddingLevel={sdkOptions.guidePaddingLevel}
                            onChange={val => handleOptionsChange({...sdkOptions, guidePaddingLevel: val})}
                        />
                        <HintAriaLiveState
                            hintAriaLive={sdkOptions.hintAriaLive}
                            onChange={val => handleOptionsChange({...sdkOptions, hintAriaLive: val})}
                        />
                        <DisableSmileDetectionState
                            disableSmileDetection={sdkOptions.disableSmileDetection}
                            onChange={() => handleOptionsChange({...sdkOptions, disableSmileDetection: !sdkOptions.disableSmileDetection})}
                        />
                    </div>
                </Collapse>

            </div>
    )
};

export default SdkOptionsState;
