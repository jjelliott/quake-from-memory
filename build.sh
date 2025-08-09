rm -r build
mkdir -p build/id1ver/maps
mkdir -p build/modver/maps
cp id1ver/* build/id1ver/maps/
cp modver/* build/modver/maps/
cp progs.dat build/id1ver/
cp progs.dat build/modver/
cp -r srcrdme build/id1ver/
cp -r srcrdme build/modver/
cd build/id1ver
zip -r ../id1-name-version.zip *
cd ../modver
zip -r ../mod-version.zip *
