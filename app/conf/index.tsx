const conf = {
    // Default loaded example page by CF id
    pageId: 'd6ca53d5-c11b-4d66-a270-fd43c9aee899',
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
    pageId: string,
    featureApps: Array<FeatureApp>
};

export default conf;
