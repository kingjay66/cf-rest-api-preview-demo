type ParallaxTeaserLink = {
    label: string;
    href: string;
}

type ParallaxTeaserImage = {
    src: string;
    alt: string;
}

type ParallaxTeaserContent = {
    headline: string;
    description: string;
    image: ParallaxTeaserImage;
    links: Array<ParallaxTeaserLink>;
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
        headline: content.headline,
        description: content.copyText.value,
        image: {
            // src: 'https://pre-www.audi.de/content/dam/s2/angrybirds/parallax-teaser/picture01-M.jpg?imwidth=1439',
            src: `https://${process.env.AEM_HOST}${content.fieldLabel}`,
            alt: ''
        },
        links: [
            {
                href: content.cta1Url,
                label: content.cta1Label
            },
            {
                href: content.cta2Url,
                label: content.cta2Label
            }
        ],
        legal: content.emissionAndConsumptionDataOptional
    } as ParallaxTeaserContent;
}

async function ParallaxTeaser({contentFragmentPath} : {contentFragmentPath: string}) {
    const {headline, description, image, links, legal} = await getContent(contentFragmentPath);

    return (
        <div style={{
            position: 'relative',
            height: 'calc(100vh + 124px)',
            overflow: 'hidden'
        }}>
            <div style={{
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
            </div>

            <div style={{
                position: 'absolute',
                left: '64px',
                bottom: 'calc(124px + 32px)',
                zIndex: 1,
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                padding: '52px',
                maxWidth: '500px'
            }}>
                <h2 style={{
                    fontSize: '32px'
                }}>{headline}</h2>

                <p style={{
                    color: 'rgb(51, 51, 51)',
                    fontSize: '18px'
                }}>{description}</p>

                <ul style={{
                    display: 'flex',
                    gap: '16px',
                    margin: '0',
                    padding: '0',
                    listStyle: 'none'
                }}>
                    {links.map((link, index) => (
                        <li key={index}>
                            <a style={{
                                fontSize: '18px',
                                textDecoration: 'none',
                                color: 'inherit'
                            }} href={link.href}>{link.label} ></a>
                        </li>
                    ))}
                </ul>
            </div>

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
                    fontSize: '14px'
                }}>{legal}</p>
            </div>
        </div>
    )
}

export default ParallaxTeaser
