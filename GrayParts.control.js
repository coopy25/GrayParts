// Written by Nocteb
// (c) 2020
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (2);
host.defineController ("Tools", "Gray Parts", "1.0", "656bca90-4598-11ea-aaef-0800200c9a66", "Nocteb");

var NUM_TRACKS=64
var NUM_SCENES=64

var tracks = []


function createTrackCallback(slotBank, trackIndex, f)
{
    return function(index, playing)
    {
        f(slotBank, trackIndex, index, playing);
    };
}


function init ()
{
    var trackBank = host.createMainTrackBank(NUM_TRACKS,0,NUM_SCENES);
    for(var i=0; i < NUM_TRACKS; ++i)
    {
        var track = trackBank.getTrack(i);
        if(!track) {
            continue;
        }
        var slotBank = track.clipLauncherSlotBank()
        if(slotBank) {
            slotBank.addIsPlayingObserver(
                createTrackCallback(slotBank, i,
                    function(slotBank, trackIndex, index, playing)
                    {
                        if(!tracks[trackIndex]) {
                            tracks[trackIndex] = {}
                        }
                        if(!playing && tracks[trackIndex][index] == true) {
                            slotBank.getItemAt(index).color().set(0.5,0.5,0.5)
                        }
                        tracks[trackIndex][index] = playing;
                    }
                )
            );
        }
    }
}

  
