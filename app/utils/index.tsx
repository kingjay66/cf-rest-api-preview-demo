import conf from '@/app/conf';

async function getContentFragment(contentFragmentId: string) {
    const req = await fetch(`https://${process.env.AEM_HOST}/adobe/cf/fragments/${contentFragmentId}`, {
        cache: 'no-store',
        headers: {
            authorization: `Bearer ${process.env.AEM_TOKEN}`,
            // Tells the API you accept as user to use the WIP CF REST API with potential future breaking changes
            'X-Adobe-Accept-Unsupported-API': '1'
        }
    });

    if (!req.ok) {
        console.warn(req.statusText);
        return;
    }

    const {data: contentFragment}: {data: ContentFragment} = await req.json();

    // Resolve references
    const references = Object.keys(contentFragment.references);
    Object.keys(contentFragment.elements).forEach((element) => {
        if (references.includes(element)) {
            contentFragment.elements[element] = contentFragment.references[element];
        }
    });

    console.log(JSON.stringify(contentFragment, null, 4));
    return contentFragment;
}

async function getFeatureAppContentFragment(featureApp: FeatureApp) {
    if (featureApp.contentFragment) {
        return featureApp.contentFragment;
    }

    if (!featureApp.contentFragmentId) {
        console.warn(`Feature app "${featureApp.model}" missing CF id`);
        return null;
    }

    const contentFragment = await getContentFragment(featureApp.contentFragmentId);
    if (!contentFragment) {
        console.warn(`Feature app "${featureApp.model}" with CF id "${featureApp.contentFragmentId}" not found`);
        return null;
    }

    return contentFragment;
}

function findFeatureApp(modelPath: string) {
    return conf.featureApps.find(featureApp => featureApp.model === modelPath);
}

async function getBase64Image(image: {path: string, mimeType: string}) {
    const {path, mimeType} = image;

    const req = await fetch(`https://${process.env.AEM_HOST}${path}`, {
        cache: 'no-store',
        headers: {
            authorization: `Bearer ${process.env.AEM_TOKEN}`
        }
    });

    if (!req.ok) {
        console.warn(req.statusText);
        return '';
    }

    const arrayBuffer = await req.arrayBuffer();

    const base64 = base64ArrayBuffer(arrayBuffer);

    return `data:${mimeType};base64,${base64}`;
}

// Source: https://gist.github.com/jonleighton/958841
function base64ArrayBuffer(arrayBuffer: ArrayBuffer) {
    var base64    = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes         = new Uint8Array(arrayBuffer)
    var byteLength    = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength    = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}

export {getContentFragment, getFeatureAppContentFragment, findFeatureApp, getBase64Image}
