#/usr/bin/env bash

fname=$1
outname=$(basename "$fname" .mov).gif

echo Convert $fname to $outname

ffmpeg -i ${fname} -filter_complex "[0:v] fps=12,split [a][b];[a] palettegen=stats_mode=single [p];[b][p] paletteuse=new=1" ${outname}
