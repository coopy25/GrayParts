// Written by Nocteb
// (c) 2020
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (2);
host.defineController ("Tools", "Gray Parts", "1.1", "656bca90-4598-11ea-aaef-0800200c9a66", "Nocteb");


// This constants define the controllers area of action (set to something big for now)
var NUM_TRACKS=256
var NUM_SCENES=256

// this array tracks each clips playing state. The array contains a dict for each track. 
// The dictionary contains the clip index and it's playing state
var tracks = []

// Helper function to store the track index and the slot bank with the function
// see https://stackoverflow.com/questions/13813463/how-to-avoid-access-mutable-variable-from-closure
function createTrackCallback(transport, slotBank, trackIndex, f)
{
    return function(index, playing)
    {
        f(transport, slotBank, trackIndex, index, playing);
    };
}

// The controllers init function
function init ()
{
    // create a track and scene info to work with change the constants above as required
    var trackBank = host.createMainTrackBank(NUM_TRACKS,0,NUM_SCENES);
    var transport = host.createTransport();
    transport.isPlaying().addValueObserver(function(playing) {
        if(!playing) {
            tracks = [];
        }
    });
    for(var i=0; i < NUM_TRACKS; ++i)
    {
        var track = trackBank.getTrack(i);
        if(!track) {
            continue;
        }
        // add an observer to each tracks clipLauncherSlotBank
        var slotBank = track.clipLauncherSlotBank()
        if(slotBank) {
            slotBank.addIsPlayingObserver(
                // call the function wrapper above 
                createTrackCallback(transport, slotBank, i,
                    // the function that gets executed when a clips playing state changes
                    function(transport, slotBank, trackIndex, index, playing)
                    {
                        if(!transport.isPlaying().get()) {
                            tracks = [];
                            return;
                        }
                        // extend the array tracking playing state
                        if(!tracks[trackIndex]) {
                            tracks[trackIndex] = {}
                        }
                        // if a clip is not playing and was playing before
                        if(!playing && tracks[trackIndex][index] == true) {
                            // set the color
                            slotBank.getItemAt(index).color().set(0.5,0.5,0.5)
                        }
                        // record the clips playing state
                        tracks[trackIndex][index] = playing;
                    }
                )
            );
        }
    }
}

  
