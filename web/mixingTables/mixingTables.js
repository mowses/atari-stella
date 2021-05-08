// this is a mix of files from:
// src/emucore/tia/Audio.cxx
// 6502.ts/src/machine/stella/tia/PCMAudio.ts:48
const R_MAX = 30;
const R = 1;
const VOL_MAX = 30;
const mixingTable = new Float32Array(VOL_MAX + 1);

function mixingTableEntry(v)
{
    return v / VOL_MAX * (R_MAX + R * VOL_MAX) / (R_MAX + R * v);
}

for (var vol = 0; vol <= VOL_MAX; vol++) mixingTable[vol] = mixingTableEntry(vol);