/*
// fixes an issue with ghost clicks. borrowed the idea of using capture phase rather than bubble phase from:
//    https://developers.google.com/mobile/articles/fast_buttons?csw=1#ghost
//
// but the solution there is far from complete. It doesn't deal with focus being placed in textboxes still, and
// it doesn't prevent the ghost events from propagating down and back up through the dom. Mathquill listens for
// the mousedown and mouseup events, so when they were triggered erroneously, we should prevent them from propagating.
//
// the event handlers defined here need to be added before jquery has chance to add it's own listeners. This is
// especially important for the focus and blur events. The fact that touchtracking.js is split into two separate
// events here is unfortunate, but I think it's fine for now. There are talks of refactoring the touchtracking.js
// code anyways.
*/
define(['require'], function(require) {

    var inGhostEventMode = false;
    var startingActiveElement = null;

    function stopGhostEvent(evt) {
        if (inGhostEventMode) {
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        }
    }

    function stopAndPreventGhostEvent(evt) {
        if (inGhostEventMode) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        }
    }

    // will get overriden by touchtracking.js
    // would be better not do things this way, but we need to split touchtracking.js into
    // a part that jquery depends on and a part that depends on jquery. This little inconvenience is what
    // splices all of touchtracking back together
    var touchTrackingCallbacks = {
        isGhostEvent: function(evt) {
            return false;
        }
    };

    // don't send ghost mousedwon events; someone might be listening for them
    document.addEventListener('mousedown', function(evt) {
        startingActiveElement = document.activeElement;

        inGhostEventMode = touchTrackingCallbacks.isGhostEvent(evt);

        // stop the mousedown event
        stopGhostEvent(evt);
    }, true);

    // don't send ghost mouseup events; someone might be listening for them
    document.addEventListener('mouseup', stopGhostEvent, true);

    // prevent links from being followed on ghost clicks.
    document.addEventListener('click', function(evt) {
        stopAndPreventGhostEvent(evt);

        // put focus where it was before the start of these events. the focusin and focusout
        // events fired from this will be stopped.
        if (inGhostEventMode && document.activeElement !== startingActiveElement) {
            if (document.activeElement) document.activeElement.blur();
            if (startingActiveElement) startingActiveElement.focus();
        }

        // anything after this is not a ghost event
        inGhostEventMode = false;
    }, true);

    // we prevent focus events from firing during ghost events
    document.addEventListener('focus', stopAndPreventGhostEvent, true);
    document.addEventListener('blur', stopAndPreventGhostEvent, true);

    return touchTrackingCallbacks;
});