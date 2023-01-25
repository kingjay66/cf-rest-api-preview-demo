import styles from './page.module.css'
import {lazy, Suspense} from 'react';
import { notFound } from 'next/navigation';
import SequenceScroll from '../feature-apps/SequenceScroll'

type PageParams = {
  params: {slug?: [string]}
}

async function getPageContentFragments(contentFragmentPath: string) {
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

  // return await req.json();
  const {data} = await req.json();

  const paths = data[0]?.elements;

  return paths ? Object.values(paths) : [];
}

const findFeatureApp = (requestedPath: string) => {
  return process.env.conf.featureApps.find(featureApp => featureApp.path === requestedPath)
}

async function Page({params}: PageParams) {
  let path = '';
  let featureApps = [];

  if (params?.slug?.length) {
    path = `/${params?.slug.join('/')}`;
  }

  // Retrieve single feature app for preview
  if (path.startsWith('/preview/')) {
    const featureApp = findFeatureApp(path.replace('/preview', ''));
    if (featureApp) {
      featureApps.push(featureApp);
    }
  }
  // Load page feature apps
  else {
    const pageContentFragments = await getPageContentFragments(path || process.env.conf.pagePath);

    featureApps = pageContentFragments
        .map(featureAppPath => findFeatureApp(featureAppPath))
        .filter(featureApp => featureApp !== null)
  }

  return (
    <main className={styles.main}>
      <Suspense>
        {featureApps.map((featureApp, index) => {
          const Element = lazy(() => import(`../feature-apps/${featureApp.component}/index`));
          return <Element key={index} contentFragmentPath={featureApp.path}/>
        })}
      </Suspense>
    </main>
  )
}

export default Page


export const dynamic = 'force-dynamic'
