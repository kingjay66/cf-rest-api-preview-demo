import { getBase64Image, getFeatureAppContentFragment } from '@/app/utils';

type SequenceScrollImage = {
  src: string;
  alt: string;
};

type SequenceScrollContent = {
  image: SequenceScrollImage;
  legal: string;
};

async function getContent(contentFragment: ContentFragment) {
  const { elements } = contentFragment;

  return {
    image: {
      src: await getBase64Image(elements.image),
      alt: elements.alternateText
    },
    legal: elements.emissionAndConsumptionDataOptional
  } as SequenceScrollContent;
}

async function SequenceScroll({ featureApp }: { featureApp: FeatureApp }) {
  const contentFragment = await getFeatureAppContentFragment(featureApp);
  if (!contentFragment) {
    return null;
  }

  const { image, legal } = await getContent(contentFragment);

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh + 124px)',
        overflow: 'hidden'
      }}>
      <span
        style={{
          height: '100vh',
          width: '100vw'
        }}>
        <img
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            objectFit: 'cover',
            color: 'transparent'
          }}
          src={image.src}
          alt={image.alt}
        />
      </span>

      <div
        style={{
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
        <p
          style={{
            color: 'rgb(51, 51, 51)',
            fontSize: '14px'
          }}>
          {legal}
        </p>
      </div>
    </div>
  );
}

export default SequenceScroll;
