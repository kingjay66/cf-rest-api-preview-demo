type SequenceScrollImage = {
    src: string;
    alt: string;
}

type SequenceScrollContent = {
    image: SequenceScrollImage;
    legal: string;
}

async function getContent(contentFragmentPath: string) {
    const req = await fetch(`https://${process.env.AEM_HOST}/adobe/cf/fragments?path=${contentFragmentPath}`, {
        cache: 'no-store',
        headers: {
            authorization: `Bearer ${process.env.AEM_TOKEN}`,
            'X-Adobe-Accept-Unsupported-API': '1'
        }
    });

    if (!req.ok) {
        // https://beta.nextjs.org/docs/routing/error-handling
        throw new Error(`"${contentFragmentPath}" not found`);
    }

    const res = await req.json();
    console.log(JSON.stringify(res, null, 4));
    const {data} = res;
    const content = data[0].elements;

    return {
        image: {
            // src: 'https://pre-www.audi.com/content/dam/e-tron-gt/scroll/Q5_Landscape001.jpg?imwidth=1024',
            src: `https://${process.env.AEM_HOST}${content.image}` ,
            alt: content.alternateText
        },
        legal: content.emissionAndConsumptionDataOptional
    } as SequenceScrollContent;
}

async function SequenceScroll({contentFragmentPath}: {contentFragmentPath: string}) {
    const {image, legal } = await getContent(contentFragmentPath);

    return (
        <div style={{
            position: 'relative',
            height: 'calc(100vh + 124px)',
            overflow: 'hidden'
        }}>
            <span style={{
                height: '100vh',
                width: '100vw'
            }}>
                <img style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    objectFit: 'cover',
                    color: 'transparent'
                }} src={image.src} alt={image.alt}/>
            </span>

            <div style={{
                backgroundColor: 'white',
                width: '100vw',
                position: 'absolute',
                zIndex: 1,
                top: '100vh',
                height: '124px',
                display: 'flex',
                alignItems: 'center',
                padding: '64px'
            }}>
                <p style={{
                    color: 'rgb(51, 51, 51)',
                    fontSize: '14px'
                }}>{legal}</p>
            </div>
        </div>
    )
}

export default SequenceScroll
