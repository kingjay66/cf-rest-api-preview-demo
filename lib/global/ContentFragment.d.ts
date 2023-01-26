interface ContentFragment {
  title: string;
  description: string;
  model: {
    path: string;
    title: string;
  };
  metadata: { [key: string]: any };
  path: string;
  id: string;
  created: {
    at: string;
    by: string;
  };
  modified: {
    at: string;
    by: string;
  };
  status: string;
  elements: { [key: string]: any };
  references: { [key: string]: any };
  variations: { [key: string]: any };
}
