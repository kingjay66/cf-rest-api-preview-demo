const conf = {
  // Mapping of feature apps model and component
  featureApps: [
    {
      model: '/conf/Live-Preview-Hackathon/settings/dam/cfm/models/feature-app-1',
      component: 'ParallaxTeaser'
    },
    {
      model: '/conf/Live-Preview-Hackathon/settings/dam/cfm/models/feature-app-2',
      component: 'SequenceScroll'
    }
  ]
} as {
  pageId: string;
  featureApps: Array<FeatureApp>;
};

export default conf;
