
var bencoding = require('../lib/bencoding.js');

describe("Bencoding", function() {
    it("encodes strings", function() {
        expect(bencoding.encode('butthole')).toEqual("8:butthole");
    });
    it("decodes strings", function() {
        expect(bencoding.decode('8:butthole')).toEqual('butthole');
    });
    it("encodes integers", function() {
        expect(bencoding.encode(1)).toEqual("i1e");
    });
    it("decodes integers", function() {
        expect(bencoding.decode('i1e')).toEqual(1);
    });
    it("encodes lists", function() {
        expect(bencoding.encode([])).toEqual('le');
        expect(bencoding.encode([23, 17, 9, 0, 2])).toEqual('li23ei17ei9ei0ei2ee');
        expect(
            bencoding.encode([40001, 'hello', 7, [1, 2, 'three'], 2, {test: 'YES'}])
        ).toEqual('li40001e5:helloi7eli1ei2e5:threeei2ed4:test3:YESee');
    });
    it("decodes lists", function() {
        expect(bencoding.decode('li23ei17ei9ei0ei2ee')).toEqual([23, 17, 9, 0, 2]);
        expect(bencoding.decode('li40001e5:helloe')).toEqual([40001, 'hello']);
        expect(bencoding.decode('li40001e5:helloi7eli1ei2e5:threeei2ed4:test3:YESee'))
            .toEqual([40001, 'hello', 7, [1, 2, 'three'], 2, {test: 'YES'}]);
        expect(bencoding.decode('le')).toEqual([]);
    });
    it("decodes dictionaries", function() {
        expect(bencoding.decode('de')).toEqual({});
        expect(bencoding.decode('d1:xi1ee')).toEqual({x:1});
        expect(bencoding.decode('d1:x1:y1:zi2ee')).toEqual({x:'y',z:2});
        expect(bencoding.decode('d1:xd1:a6:bananae4:test4:yeahe')).toEqual({x:{a:'banana'},test:'yeah'});
        expect(bencoding.decode('d1:xd1:a6:bananae4:listli1ei2ei3eee')).toEqual({x:{a:'banana'},list:[1,2,3]});
    });
    it("encodes dictionaries", function() {
        expect(bencoding.encode({})).toEqual('de');
        expect(bencoding.encode({x:1})).toEqual('d1:xi1ee');
        expect(bencoding.encode({x:'y',z:2})).toEqual('d1:x1:y1:zi2ee');
        expect(bencoding.encode({x:{a:'banana'},test:'yeah'})).toEqual('d1:xd1:a6:bananae4:test4:yeahe');
        expect(bencoding.encode({x:{a:'banana'},list:[1,2,3]})).toEqual('d1:xd1:a6:bananae4:listli1ei2ei3eee');
    });
});
