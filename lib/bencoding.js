function encodeString(buffer) {

    if (typeof buffer === 'string') {
        var text = buffer;
        buffer = new Buffer(text.length);
        buffer.write(text);
    }

    var prefix = buffer.length + ':';
    var encBuffer = new Buffer(prefix.length);
    encBuffer.write(prefix);

    return Buffer.concat([encBuffer, buffer]).toString();
}

function decodeString(enc) {

    if (typeof enc !== 'string') {
        enc = enc.toString('ascii');
    }

    var length = parseInt(enc.substring(0, enc.indexOf(':')), 10);

    var start = enc.indexOf(':') + 1;

    return enc.substring(start, start + length);
}

function encodeInteger(int) {
    return 'i' + int + 'e';
}

function decodeInteger(enc) {

    if (typeof enc !== 'string') {
        throw new Error('Expected string, found ' + (typeof enc));
    }

    return parseInt(enc.substring(1, enc.indexOf('e')), 10);
}

function encodeList(array) {
    return 'l' + array.map(encode).join('') + 'e';
}

function decodeList(enc) {

    if (typeof enc === 'string') {
        enc = new Buffer(enc);
    }

    var array = [];
    var item = null;

    if (enc.toString('ascii', 0, 1) !== 'l') {
        throw new Error('Found invalid bencoded list: suspected incorrect type');
    }

    var index = 1;

    while (index < enc.length) {

        switch (enc.toString('ascii', index, index + 1)) {
            case 'e':
                return array;
                break;
            case 'i':
                item = decodeInteger(enc.toString('ascii', index));
                break;
            case 'd':
                item = decodeDictionary(enc.slice(index));
                break;
            case 'l':
                item = decodeList(enc.slice(index));
                break;
            default:
                item = decodeString(enc.slice(index));
                break;
        }

        index += encode(item).length;

        if (encode(item).length === 0) {
            throw new Error('Failed to decode list');
        }

        array.push(item);
    }

    throw new Error('Found invalid bencoded list');
}

function encodeDictionary(object) {
    var enc = 'd';
    for (var i in object) {
        if (object.hasOwnProperty(i)) {
            enc += encodeString(i + '').toString('ascii') + encode(object[i]).toString('ascii');
        }
    }
    return enc + 'e';
}

function decodeDictionary(enc) {

    var dict = {};
    var item = null;

    if (typeof enc === 'string') {
        enc = new Buffer(enc);
    }

    if (enc.toString('ascii', 0, 1) !== 'd') {
        throw new Error('Found invalid bencoded dictionary: suspected incorrect type');
    }

    var index = 1;

    var key = null;

    while (index < enc.length) {
        if (key === null) {
            if (enc.toString('ascii', index, index + 1) === 'e') {
                return dict;
            }

            key = decodeString(enc.slice(index));
            index += encodeString(key).length;

        } else {
            switch (enc.toString('ascii', index, index + 1)) {
                case 'e':
                    throw new Error('Invalid bencoded dictionary found: missing value for key');
                    break;
                case 'i':
                    item = decodeInteger(enc.toString('ascii', index));
                    break;
                case 'd':
                    item = decodeDictionary(enc.slice(index));
                    break;
                case 'l':
                    item = decodeList(enc.slice(index));
                    break;
                default:
                    item = decodeString(enc.slice(index));
                    break;
            }

            index += encode(item).length;

            if (encode(item).length === 0) {
                throw new Error('Failed to decode list');
            }

            dict[key] = item;
            key = null;
        }
    }

    throw new Error('Found invalid bencoded dictionary');
}

function encode(mixed) {
    switch (typeof mixed) {
        case 'number':
            return encodeInteger(mixed);
            break;
        case 'object':
            if (mixed.constructor === Array) {
                return encodeList(mixed);
            } else {
                return encodeDictionary(mixed);
            }
            break;
        default:
            return encodeString(mixed);
    }
}

function decode(enc) {

    var c;
    if (typeof enc === 'string') {
        c = enc.substring(0, 1);
    } else {
        c = enc.toString('ascii', 0, 1);
    }

    switch (c) {
        case 'i':
            return decodeInteger(enc);
            break;
        case 'd':
            return decodeDictionary(enc);
            break;
        case 'l':
            return decodeList(enc);
            break;
        default:
            return decodeString(enc);
    }
}

module.exports = {
    encode: encode,
    decode: decode
};
