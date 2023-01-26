import styles from './page.module.css';
import { lazy, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getContentFragment, findFeatureApp } from '@/app/utils';
import conf from '@/app/conf';

type PageParams = {
  params: { slug?: [string] };
};

async function Page({ params }: PageParams) {
  let path = '';
  let featureApps = [];

  if (params?.slug?.length) {
    path = `/${params?.slug.join('/')}`;
  }

  // Retrieve all feature apps for preview
  if (path.startsWith('/page/')) {
    const contentFragmentId = path.replace('/page/', '');
    const contentFragment = await getContentFragment(contentFragmentId);

    if (!contentFragment) {
      return notFound();
    }

    featureApps = Object.keys(contentFragment.elements)
        .map((contentFragmentTitle) => {
          const modelPath = contentFragment.elements[contentFragmentTitle].model.path;
          const featureApp = findFeatureApp(modelPath);

          if (featureApp) {
            // Set content fragment id
            featureApp.contentFragmentId = contentFragment.elements[contentFragmentTitle].id;
            return featureApp;
          }

          return null;
        })
        .filter((featureApp) => featureApp !== null) as Array<FeatureApp>;
  }
  // Load single feature app
  else if (path.startsWith('/feature-app/')) {
    const contentFragmentId = path.replace('/feature-app/', '');
    // Resolve content fragment to get the model path
    const contentFragment = await getContentFragment(contentFragmentId);
    if (!contentFragment) {
      notFound();
    }

    const featureApp = findFeatureApp(contentFragment.model.path);

    if (featureApp) {
      // Set content fragment
      featureApp.contentFragment = contentFragment;
      featureApps.push(featureApp);
    }
  }
  else {
    notFound();
  }

  return (
    <main className={styles.main}>
      <Suspense>
        {featureApps.map((featureApp, index) => {
          // Render as you fetch
          // Dynamically and lazy load React Server components mapped to found feature app
          // Components without resolved content fragments will fetch content fragment data and stream UI to client
          const Element = lazy(() => import(`@/app/feature-apps/${featureApp.component}/index`));
          return <Element key={index} featureApp={featureApp} />;
        })}
      </Suspense>
    </main>
  );
}

export default Page;

export const dynamic = 'force-dynamic';
