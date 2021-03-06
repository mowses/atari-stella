const NTSC_colors = [
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 74, g: 74, b: 74, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 111, g: 111, b: 111, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 142, g: 142, b: 142, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 170, g: 170, b: 170, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 192, g: 192, b: 192, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 214, g: 214, b: 214, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 236, g: 236, b: 236, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 72, g: 72, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 105, g: 105, b: 15, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 134, g: 134, b: 29, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 162, g: 162, b: 42, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 187, g: 187, b: 53, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 210, g: 210, b: 64, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 232, g: 232, b: 74, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 252, g: 252, b: 84, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 124, g: 44, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 144, g: 72, b: 17, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 162, g: 98, b: 33, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 180, g: 122, b: 48, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 195, g: 144, b: 61, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 210, g: 164, b: 74, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 223, g: 183, b: 85, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 236, g: 200, b: 96, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 144, g: 28, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 163, g: 57, b: 21, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 181, g: 83, b: 40, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 198, g: 108, b: 58, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 213, g: 130, b: 74, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 227, g: 151, b: 89, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 240, g: 170, b: 103, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 252, g: 188, b: 116, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 148, g: 0, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 167, g: 26, b: 26, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 184, g: 50, b: 50, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 200, g: 72, b: 72, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 214, g: 92, b: 92, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 228, g: 111, b: 111, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 240, g: 128, b: 128, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 252, g: 144, b: 144, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 132, g: 0, b: 100, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 151, g: 25, b: 122, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 168, g: 48, b: 143, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 184, g: 70, b: 162, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 198, g: 89, b: 179, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 212, g: 108, b: 195, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 224, g: 124, b: 210, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 236, g: 140, b: 224, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 80, g: 0, b: 132, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 104, g: 25, b: 154, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 125, g: 48, b: 173, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 146, g: 70, b: 192, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 164, g: 89, b: 208, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 181, g: 108, b: 224, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 197, g: 124, b: 238, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 212, g: 140, b: 252, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 20, g: 0, b: 144, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 51, g: 26, b: 163, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 78, g: 50, b: 181, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 104, g: 72, b: 198, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 127, g: 92, b: 213, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 149, g: 111, b: 227, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 169, g: 128, b: 240, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 188, g: 144, b: 252, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 0, g: 0, b: 148, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 24, g: 26, b: 167, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 45, g: 50, b: 184, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 66, g: 72, b: 200, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 84, g: 92, b: 214, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 101, g: 111, b: 228, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 117, g: 128, b: 240, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 132, g: 144, b: 252, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 0, g: 28, b: 136, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 24, g: 59, b: 157, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 45, g: 87, b: 176, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 66, g: 114, b: 194, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 84, g: 138, b: 210, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 101, g: 160, b: 225, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 117, g: 181, b: 239, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 132, g: 200, b: 252, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 0, g: 48, b: 100, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 24, g: 80, b: 128, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 45, g: 109, b: 152, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 66, g: 136, b: 176, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 84, g: 160, b: 197, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 101, g: 183, b: 217, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 117, g: 204, b: 235, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 132, g: 224, b: 252, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 0, g: 64, b: 48, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 24, g: 98, b: 78, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 45, g: 129, b: 105, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 66, g: 158, b: 130, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 84, g: 184, b: 153, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 101, g: 209, b: 174, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 117, g: 231, b: 194, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 132, g: 252, b: 212, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 0, g: 68, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 26, g: 102, b: 26, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 50, g: 132, b: 50, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 72, g: 160, b: 72, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 92, g: 186, b: 92, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 111, g: 210, b: 111, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 128, g: 232, b: 128, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 144, g: 252, b: 144, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 20, g: 60, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 53, g: 95, b: 24, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 82, g: 126, b: 45, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 110, g: 156, b: 66, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 135, g: 183, b: 84, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 158, g: 208, b: 101, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 180, g: 231, b: 117, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 200, g: 252, b: 132, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 48, g: 56, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 80, g: 89, b: 22, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 109, g: 118, b: 43, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 136, g: 146, b: 62, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 160, g: 171, b: 79, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 183, g: 194, b: 95, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 204, g: 216, b: 110, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 224, g: 236, b: 124, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 72, g: 44, b: 0, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 105, g: 77, b: 20, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 134, g: 106, b: 38, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 162, g: 134, b: 56, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 187, g: 159, b: 71, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 210, g: 182, b: 86, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 232, g: 204, b: 99, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255}, 
	{r: 252, g: 224, b: 112, a: 255}, 
	{r: 0, g: 0, b: 0, a: 255},
];

// copied from src/common/PaletteHandler.cxx:587
/*var ntsc_colors = [
	'000000', '000000', '4a4a4a', '000000', '6f6f6f', '000000', '8e8e8e', '000000',
	'aaaaaa', '000000', 'c0c0c0', '000000', 'd6d6d6', '000000', 'ececec', '000000',
	'484800', '000000', '69690f', '000000', '86861d', '000000', 'a2a22a', '000000',
	'bbbb35', '000000', 'd2d240', '000000', 'e8e84a', '000000', 'fcfc54', '000000',
	'7c2c00', '000000', '904811', '000000', 'a26221', '000000', 'b47a30', '000000',
	'c3903d', '000000', 'd2a44a', '000000', 'dfb755', '000000', 'ecc860', '000000',
	'901c00', '000000', 'a33915', '000000', 'b55328', '000000', 'c66c3a', '000000',
	'd5824a', '000000', 'e39759', '000000', 'f0aa67', '000000', 'fcbc74', '000000',
	'940000', '000000', 'a71a1a', '000000', 'b83232', '000000', 'c84848', '000000',
	'd65c5c', '000000', 'e46f6f', '000000', 'f08080', '000000', 'fc9090', '000000',
	'840064', '000000', '97197a', '000000', 'a8308f', '000000', 'b846a2', '000000',
	'c659b3', '000000', 'd46cc3', '000000', 'e07cd2', '000000', 'ec8ce0', '000000',
	'500084', '000000', '68199a', '000000', '7d30ad', '000000', '9246c0', '000000',
	'a459d0', '000000', 'b56ce0', '000000', 'c57cee', '000000', 'd48cfc', '000000',
	'140090', '000000', '331aa3', '000000', '4e32b5', '000000', '6848c6', '000000',
	'7f5cd5', '000000', '956fe3', '000000', 'a980f0', '000000', 'bc90fc', '000000',
	'000094', '000000', '181aa7', '000000', '2d32b8', '000000', '4248c8', '000000',
	'545cd6', '000000', '656fe4', '000000', '7580f0', '000000', '8490fc', '000000',
	'001c88', '000000', '183b9d', '000000', '2d57b0', '000000', '4272c2', '000000',
	'548ad2', '000000', '65a0e1', '000000', '75b5ef', '000000', '84c8fc', '000000',
	'003064', '000000', '185080', '000000', '2d6d98', '000000', '4288b0', '000000',
	'54a0c5', '000000', '65b7d9', '000000', '75cceb', '000000', '84e0fc', '000000',
	'004030', '000000', '18624e', '000000', '2d8169', '000000', '429e82', '000000',
	'54b899', '000000', '65d1ae', '000000', '75e7c2', '000000', '84fcd4', '000000',
	'004400', '000000', '1a661a', '000000', '328432', '000000', '48a048', '000000',
	'5cba5c', '000000', '6fd26f', '000000', '80e880', '000000', '90fc90', '000000',
	'143c00', '000000', '355f18', '000000', '527e2d', '000000', '6e9c42', '000000',
	'87b754', '000000', '9ed065', '000000', 'b4e775', '000000', 'c8fc84', '000000',
	'303800', '000000', '505916', '000000', '6d762b', '000000', '88923e', '000000',
	'a0ab4f', '000000', 'b7c25f', '000000', 'ccd86e', '000000', 'e0ec7c', '000000',
	'482c00', '000000', '694d14', '000000', '866a26', '000000', 'a28638', '000000',
	'bb9f47', '000000', 'd2b656', '000000', 'e8cc63', '000000', 'fce070', '000000',
];

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return {
        	r: (c>>16)&255,
        	g: (c>>8)&255,
        	b: c&255,
        	a: 255,
        }
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex' + hex);
}

for (var i = 0; i < ntsc_colors.length; i++) {
	ntsc_colors[i] = hexToRgbA('#' + ntsc_colors[i]);
}
console.log(JSON.stringify(ntsc_colors));*/